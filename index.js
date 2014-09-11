var express = require('express'),
    rendr = require('rendr'),
    config = require('config'),
    app = express(),
    mw = require('./server/middleware'),
    mongo = require('./data/mongodb_adapter'),
    dbMapper = require('./data/db_mapper');

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
  app.listen(port);
  console.log("server pid %s listening on port %s in %s mode",
    process.pid,
    port,
    app.get('env')
  );
}


/**
 * Only start server if this script is executed, not if it's require()'d.
 * This makes it easier to run integration tests on ephemeral ports.
 */
if (require.main === module) {
  mongo.initDB();
  start();
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

exports.app = app;
