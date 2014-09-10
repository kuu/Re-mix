var Base = require('./base');

module.exports = Base.extend({
  url: function() {
    if (this.params.by != null) {
      // fork
      return '/projects/:owner/:id/:by';
    } else {
      return '/projects/:owner/:id';
    }
  },
  idAttribute: 'id'
});
module.exports.id = 'Project';
