module.exports = {
  index: function(params, callback) {
    var user = this.app.get('session').user;
    var spec;

    if (user === void 0) {
      // Logged out
      callback();
    } else {
      // Logged in
      spec = {
        model: {model: 'User', params: {id: user}},
        projects: {collection: 'Projects', params: {user: user}}
      };
      this.app.fetch(spec, function(err, result) {
        callback(err, result);
      });
    }
  }
};
