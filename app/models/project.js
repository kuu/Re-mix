var Base = require('./base');

module.exports = Base.extend({
  url: '/projects/:user/:project',
  idAttribute: 'name'
});
module.exports.id = 'Project';
