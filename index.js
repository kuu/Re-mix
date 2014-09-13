var express = require('express'),
    rendr = require('rendr'),
    config = require('config'),
    app = express(),
    fs = require('fs'),
    mw = require('./server/middleware'),
    mongo = require('./data/mongodb_adapter'),
    dbMapper = require('./data/db_mapper'),
    TRACK_DIR = './public/assets/media/tracks';

require('date-utils');

/**
 * Initialize Express middleware stack.
 */
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());

/**
 * The `cookieParser` middleware is required for sessions.
 */
app.use(express.cookieParser());

/**
 * Add session support. This will populate `req.session`.
 */
app.use(express.session({
  secret: config.session.secret,

  /**
   * In production apps, you should probably use something like Redis or Memcached
   * to store sessions. Look at the `connect-redis` or `connect-memcached` modules.
   */
  store: null
}));

/**
 * For more control over the fetching of data, we pass our own
 * `dataAdapter` object to the call to `rendr.createServer()`.
 */
var dbAdapter = new mongo.MongodbAdapter({ mapper: dbMapper });

/**
 * Initialize our Rendr server.
 */
var server = rendr.createServer({
  dataAdapter: dbAdapter,
  appData: config.appData
});

/**
  * To mount Rendr, which owns its own Express instance for better encapsulation,
  * simply add `server` as a middleware onto your Express app.
  * This will add all of the routes defined in your `app/routes.js`.
  * If you want to mount your Rendr app onto a path, you can do something like:
  *
  *     app.use('/my_cool_app', server);
  */
app.use(server);

server.configure(function(rendrExpressApp) {

  /**
   * Allow the Rendr app to access session data on client and server.
   * Check out the source in the file `./server/middleware/initSession.js`.
   */
  rendrExpressApp.use(mw.initSession());

  /**
   * Increment a counter in the session on every page hit.
   */
  rendrExpressApp.use(mw.incrementCounter());

  rendrExpressApp.use(function (req, res, next) {
    next();
  });
});

/**
 * Start the Express server.
 */
function start(){
  var port = process.env.PORT || config.server.port;
  var server = app.listen(port);
  console.log("server pid %s listening on port %s in %s mode",
    process.pid,
    port,
    app.get('env')
  );
  return server;
}


/**
 * Only start server if this script is executed, not if it's require()'d.
 * This makes it easier to run integration tests on ephemeral ports.
 */
if (require.main === module) {

  mongo.initDB();

  var http = start(),
      io = require('socket.io')(http);

  io.on('connection', function (socket) {
    var params, buffer;

    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('params', function (msg) {
      params = msg.data;
      console.log('\tparams:', params);
    });

    socket.on('start', function () {
      console.log('\tstart');
      buffer = new Buffer(0);
    });

    socket.on('record', function (msg) {
      var buf = msg.data;
      buffer = Buffer.concat([buffer, buf]);
      //console.log(buffer.length);
    });

    socket.on('flush', function (msg) {

      console.log("Received 'flush' message");

      var wavFile = Buffer.concat([createWaveHeader(params.config.sampleRate, buffer.length), buffer]);
          date = new Date(),
          yyyy = date.toFormat("YYYY"),
          mm = date.toFormat("MM"),
          dt = date.toFormat("YYYYMMDDHH24MISS"),
          userDir = TRACK_DIR + '/' + params.user.owner,
          userYearDir = userDir + '/' + yyyy,
          userMonthDir = userYearDir + '/' + mm,
          dirCheckList = [userDir, userYearDir, userMonthDir],
          fileName = dt + '.wav',
          filePath = userMonthDir + '/' + fileName;

      // Make sure that the directory exists.
      for (var i = 0, il = dirCheckList.length; i < il; i++) {
        var dir = dirCheckList[i];

        if (!fs.existsSync(dir)) {
          console.log('\tmkdir', dir);
          fs.mkdirSync(dir);
        }
      }

      console.log('\twriting: ', filePath);

      // Saving data as a file.
      fs.writeFile(filePath, wavFile, null, function (err) {
        if (err) {
          console.error('An error occured in writing buffer');
        } else {
          console.log("The file was saved as ", fileName);

          var id  = params.user.id,
              owner = params.user.owner,
              label = params.user.label;

          // Add a track to the project.
          var trackInProject = {
            id: id,
            type: 'audio',
            owner: owner,
            label: label,
            enabled: true
          };

          var track = {
            id: dt,
            owner: owner,
            type: 'audio',
            original_proj: { owner: owner, proj: id },
            reference: []
          };

          // Insert track
          dbAdapter.request(null, { path: '/tracks/add' }, track, function (err) {
            if (!err) {
              dbAdapter.request(null, { path: '/projects/addTrack/' + owner + '/' + id }, trackInProject, function (err) {
                io.emit('server', {message: 'updateList'});
              });
            }
          });

          buffer.length = 0;
        }
      });
    });
  });
}

// Dummy login (everybody can log in.)
app.post('/login', function (req, res) {
  req.updateSession('user', req.param('username'));
  res.redirect('/');
});

app.post('/fork', function (req, res) {
  var originOwner = req.param('originOwner');
  var originId = req.param('originId');
  var forkedBy = req.param('forkedBy');
  var param = {
    originOwner: originOwner,
    originId: originId,
    forkedBy: forkedBy
  };
  dbAdapter.request(req, {path: '/fork'},  param, function (err) {
    if (!err) {
      res.redirect('/projects/' + forkedBy + '/' + originId + '-from-' + originOwner);
    }
  });
});

app.post('/removeTrackFromProject', function (req, res) {
  var owner = req.param('owner');
  var id = req.param('id');
  var track = req.param('track');
  var param = {
    owner: owner,
    id: id,
    track: track
  };
  dbAdapter.request(req, {path: '/removeTrackFromProject'},  param, function (err) {
    if (!err) {
      res.redirect('/projects/' + owner + '/' + id);
    }
  });
});

function createWaveHeader(sampleRate, bufferLength){
  var header = new Buffer(44);

  /* RIFF identifier */
  header.write('RIFF', 0);
  /* file length */
  header.writeUInt32LE(32 + bufferLength, 4);
  /* RIFF type */
  header.write('WAVE', 8);
  /* format chunk identifier */
  header.write('fmt ', 12);
  /* format chunk length */
  header.writeUInt32LE(16, 16);
  /* sample format (raw) */
  header.writeUInt16LE(1, 20);
  /* channel count */
  header.writeUInt16LE(1, 22);
  /* sample rate */
  header.writeUInt32LE(sampleRate, 24);
  /* byte rate (sample rate * block align) */
  header.writeUInt32LE(sampleRate * 4, 28);
  /* block align (channel count * bytes per sample) */
  header.writeUInt16LE(4, 32);
  /* bits per sample */
  header.writeUInt16LE(16, 34);
  /* data chunk identifier */
  header.write('data', 36);
  /* data chunk length */
  header.writeUInt32LE(bufferLength, 40);

  return header;
}

exports.app = app;
