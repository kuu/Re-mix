var db = require('config').db,
    DataAdapter = require('rendr/server/data_adapter'),
    _ = require('underscore'),
    debug = require('debug')('rendr:MongodbAdapter'),
    util = require('util'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    TRACK_DIR = './public/assets/media/tracks',
    MIX_DIR = './public/assets/media/projects';

module.exports.initDB = initDB;
module.exports.MongodbAdapter = MongodbAdapter;
module.exports.get = get;
module.exports.add = add;
module.exports.addTrackToProject = addTrackToProject;
module.exports.fork = fork;
module.exports.removeTrackFromProject = removeTrackFromProject;
module.exports.query = query;

//
// Initialize DB connection.
//
function initDB() {
  var uri = 'mongodb://'
    + (db.user && db.password ? db.user + ':' + db.password + '@' : '')
    + db.host + (db.port ? ':' + db.port : '')
    + '/' + db.name;

  mongoose.connect(uri, db.options);

  var connection = mongoose.connection;

  connection.once('open', function () {
    console.log('Connected to ' + uri);
  });

  connection.on('error', console.error.bind(console, 'Connection Error:'));

  connection.on('disconnected', function () {
    mongoose.connect(uri, db.options);
    console.log('Reconnected to ' + uri);
  });
}

function MongodbAdapter(options) {
  DataAdapter.call(this, options);

  if (!options.mapper) {
    throw 'mapper must be defined';
  }

  this.mapper = options.mapper;

  /**
   * Default options.
   */
  _.defaults(this.options, {
    userAgent: 'Rendr MongodbAdapter; Node.js'
  });
}

util.inherits(MongodbAdapter, DataAdapter);


/**
 * `request`
 *
 * This is method that Rendr calls to ask for data.
 *
 * `req`: Actual request object from Express/Connect.
 * `api`: Object describing API call; properties including 'path', 'query', etc.
 *        Passed to `url.format()`.
 * `options`: (optional) Options.
 * `callback`: Callback.
 */
MongodbAdapter.prototype.request = function(req, api, options, callback) {
  /**
   * Allow for either 3 or 4 arguments; `options` is optional.
   */
  if (arguments.length === 3) {
    callback = options;
    options = {};
  }

  this.mapper(api.path, options, function (err, f, model, criteria) {
    if (err) {
      return callback(err);
    }

    /**
     * Request timing.
     */
    var start = new Date().getTime();

    f(model, criteria, function (err, body) {
      debug('Query %s %s %sms', model.modelName, criteria, new Date().getTime() - start);

      // prepare response object
      var response = {
        statusCode: err ? 500 : 200
      };

      callback(err, response, body);
    });
  });
};

//
// Find one document matching criteria.
//
function get(Model, criteria, callback) {
  Model.findOne(criteria).exec(function(err, body) {
    callback(err, body);
  });
}

function add(Model, criteria, callback) {
  var doc = new Model(criteria);
  doc.save(function (err) {
    callback(err);
  });
}

function addTrackToProject(Model, criteria, callback) {
  Model.findOne({owner: criteria.owner, id: criteria.id})
  .exec(function(err, doc) {
    var tracks;
    if (!err) {
      tracks = doc.tracks;
      tracks.push(criteria.track);

      // Update db
      doc.save(function (err) {
        if (!err) {
          remix(criteria.owner, criteria.id, tracks, callback);
        }
      });
    }
  });
}

function removeTrackFromProject(Project, criteria, callback) {
  Project.findOne({id: criteria.id, owner: criteria.owner}).exec(function(err, doc) {
    var tracks = doc.tracks;
    tracks.splice(criteria.track, 1);
    doc.save(function (err) {
      if (!err) {
        remix(criteria.owner, criteria.id, tracks, callback);
      }
    });
  });
}

function remix(owner, id, tracks, callback) {
  var track, path, pathList = [], spawn, sox;

  for (var i = 0, il = tracks.length; i < il; i++) {
    track = tracks[i].id;
    path = TRACK_DIR + '/' + track.substring(0, 4) + '/' + track.substring(4, 6) + '/' + track + '.wav';
    pathList.push(path);
  }
  pathList.unshift('-m');
  pathList.push(MIX_DIR + '/' + owner + '/' + id + '.mp3');

  spawn = require('child_process').spawn;
  sox = spawn('sox', pathList);
  console.log('Executing SoX with args: ' + pathList);
  sox.on('close', function(err) {
    console.log('child process exited with code ' + err);
    callback(0);
  });
}

function fork(Project, criteria, callback) {
  Project.findOne({id: criteria.originId, owner: criteria.originOwner}).exec(function(err, body) {
    if (err) {
      callback(err);
    } else {
      var originId = criteria.originId;
      var originOwner = criteria.originOwner;
      var newId = criteria.originId + '-from-' + criteria.originOwner;
      var newOwner = criteria.forkedBy;
      var doc = new Project({
        id: newId,
        name: body.name,
        type: body.type,
        owner: newOwner,
        organization: null,
        origin: {user: originOwner, proj: originId},
        description : body.description += ('(the project forked from ' + originOwner + '.)'),
        tags: body.tags,
        forks: [],
        starred: [],
        tracks: body.tracks,
        contributors: body.contributors
      });
      doc.save(function (err) {
        var prefix = './public/assets/';
        var srcDir = '/projects/' + originOwner + '/';
        var dstDir = '/projects/' + newOwner + '/';
        var srcImage = prefix + 'images' + srcDir + originId + '-l.png';
        var srcMedia = prefix + 'media' + srcDir + originId + '.mp3';
        var dstImageDir = prefix + 'images' + dstDir;
        var dstImageFile = dstImageDir + newId + '-l.png';
        var dstMediaDir = prefix + 'media' + dstDir;
        var dstMediaFile = dstMediaDir + newId + '.mp3';

        if (fs.existsSync(srcImage)) {
          if (!fs.existsSync(dstImageDir)) {
            fs.mkdirSync(dstImageDir);
          }
          fs.writeFileSync(dstImageFile, fs.readFileSync(srcImage));
        }
        if (fs.existsSync(srcMedia)) {
          if (!fs.existsSync(dstMediaDir)) {
            fs.mkdirSync(dstMediaDir);
          }
          fs.writeFileSync(dstMediaFile, fs.readFileSync(srcMedia));
        }
        callback(err);
      });
    }
  });
}
//
// Query documents by criteria.
// Query all documents if criteria is empty.
//
function query(Model, criteria, callback) {
  Model.find(criteria).exec(function(err, body) {
    callback(err, body);
  });
}
