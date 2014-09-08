var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'projects_show_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.loggedIn = (this.app.get('session').user !== void 0);
    data.self = (this.app.get('session').user === this.model.attributes.owner);
    return data;
  }
});
module.exports.id = 'projects/show';
