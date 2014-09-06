var Project = require('../models/project')
  , Base = require('./base');

module.exports = Base.extend({
  model: Project,
  url: function() {
    if (this.params.user != null) {
      return '/users/:user/projects';
    } else {
      return '/projectList';
    }
  }
});
module.exports.id = 'Projects';
