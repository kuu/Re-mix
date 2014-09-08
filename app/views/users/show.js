var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'users_show_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.projects = this.options.projects;
    data.loggedIn = (this.app.get('session').user !== void 0);
    data.self = (this.app.get('session').user === this.model.id);
    return data;
  }
});
module.exports.id = 'users/show';
