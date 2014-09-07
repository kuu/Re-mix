var Base = require('./base');

module.exports = Base.extend({
  url: '/projects/:owner/:id',
  idAttribute: 'id'
});
module.exports.id = 'Project';
