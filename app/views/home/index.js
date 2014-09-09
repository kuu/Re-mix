var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'home_index_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    var loggedIn = (this.app.get('session').user !== void 0);
    data.loggedIn = loggedIn;
    if (loggedIn) {
      data.projects = this.options.projects;
    }
    return data;
  }
});
module.exports.id = 'home/index';
