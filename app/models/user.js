var Base = require('./base');

module.exports = Base.extend({
  url: '/users/:id',
  idAttribute: 'id'
});
module.exports.id = 'User';
