var UserModel = require('./user_dao'),
    ProjectModel = require('./project_dao'),
    TrackModel = require('./track_dao'),
    get = require('./mongodb_adapter').get,
    fork = require('./mongodb_adapter').fork,
    add = require('./mongodb_adapter').add,
    addTrackToProject = require('./mongodb_adapter').addTrackToProject,
    removeTrackFromProject = require('./mongodb_adapter').removeTrackFromProject,
    query = require('./mongodb_adapter').query;

// map path to db query, model, & criteria
module.exports = function (path, options, callback) {
  var err,
      a = path.split('/');

  switch (a[1]) {
    case 'projectList':
      callback(err, query, ProjectModel, {});
      return;

    case 'users':
      if (a.length === 2) {
        callback(err, query, UserModel, {});
        return;
      }
      else if (a.length === 3) {
        callback(err, get, UserModel, { 'id': a[2] });
        return;
      }
      else if (a.length === 4 && a[3] === 'projects') {
        callback(err, query, ProjectModel, { 'owner': a[2] });
        return;
      }
      break;

    case 'projects':
      if (a.length === 4) {
        callback(err, get, ProjectModel, { 'owner': a[2], 'id': a[3] });
        return;
      } else if (a.length === 5) {
        if (a[2] === 'addTrack') {
          callback(err, addTrackToProject, ProjectModel, { 'owner': a[3], 'id': a[4], 'track': options});
          return;
        }
      }
      break;

    case 'tracks':
      if (a.length === 3) {
        if (a[2] === 'add') {
          callback(err, add, TrackModel, options);
          return;
        } else {
          callback(err, get, TrackModel, { 'owner.login': a[2], 'name': a[3] });
          return;
        }
      }
      break;

    case 'fork':
      if (a.length === 2) {
        callback(err, fork, ProjectModel, options);
        return;
      }
      break;

    case 'removeTrackFromProject':
      if (a.length === 2) {
        callback(err, removeTrackFromProject, ProjectModel, options);
        return;
      }
      break;
  }
  err = new Error('Cannot map ' + path + ' to db query');
  err.status = 500;
  err.body = path;
  callback(err);
};
