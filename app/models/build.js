var Base = require('./base');

module.exports = Base.extend({
  url: '/projects/:owner/:name',
  api: 'travis-ci'
});
module.exports.id = 'Build';
