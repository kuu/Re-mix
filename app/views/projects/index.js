var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'projects_index_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.loggedIn = (this.app.get('session').user !== void 0);
    return data;
  }
});
module.exports.id = 'projects/index';
