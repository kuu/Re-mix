var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'projects_show_view',

  getTemplateData: function() {
    var attrs = this.model.attributes,
        you = this.app.get('session').user,
        data, self, youForked, forks = attrs.forks;

    data = BaseView.prototype.getTemplateData.call(this);
    data.loggedIn = (you !== void 0);
    self = data.self = (you === attrs.owner);
    if (!self) {
      for (var i = 0, il = forks.length; i < il; i++) {
        if (forks[i] === you) {
          youForked = true;
          break;
        }
      }
      data.youForked = youForked;
    }
    return data;
  }
});
module.exports.id = 'projects/show';
