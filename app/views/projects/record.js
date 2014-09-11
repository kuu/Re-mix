var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'projects_show_record',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.self = data.record = true;
    return data;
  },

  events: {
    'click #record' : 'onRecord',
    'click #stop' : 'onStop'
  },

  onRecord: function () {
    var tRecordButton = document.getElementById('record');
    var tStopButton = document.getElementById('stop');
    tRecordButton.classList.add('none');
    tStopButton.classList.remove('none');
  },

  onStop: function () {
    var tRecordButton = document.getElementById('record');
    var tStopButton = document.getElementById('stop');
    tRecordButton.classList.remove('none');
    tStopButton.classList.add('none');
  },

  initialize: function () {
    this.audio = null;
  },

});
module.exports.id = 'projects/record';
