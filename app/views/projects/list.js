var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'projects_list_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.build = this.options.build.toJSON();
    return data;
  }
});
module.exports.id = 'projects/list';
