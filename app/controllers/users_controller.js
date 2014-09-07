module.exports = {
  index: function(params, callback) {
    var spec = {
      collection: {collection: 'Users', params: params}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, result);
    });
  },

  show: function(params, callback) {
    var spec = {
      model: {model: 'User', params: params},
      projects: {collection: 'Projects', params: {user: params.id}}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, result);
    });
  }
};
