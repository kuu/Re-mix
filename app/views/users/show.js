var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'users_show_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.projects = this.options.projects;
    return data;
  }
});
module.exports.id = 'users/show';
