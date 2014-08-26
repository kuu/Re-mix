var Base = require('./base');

module.exports = Base.extend({
  url: '/projects/:owner/:name',
  idAttribute: 'name'
});
module.exports.id = 'Project';
