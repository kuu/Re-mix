var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'projects_show_view',

  getTemplateData: function() {
    var attrs = this.model.attributes,
        you = this.app.get('session').user,
        data, loggedIn, self, youForked,
        forks = attrs.forks;

    data = BaseView.prototype.getTemplateData.call(this);
    loggedIn = data.loggedIn = (you !== void 0);
    if (loggedIn) {
      data.you = you;
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
    }
    return data;
  },

  events: {
    'click .cover-art' : 'onPlayButtonClick',
    'click #add-new-track' : 'onAddNewTrack'
  },

  initialize: function () {
    this.audio = null;
  },

  onPlayButtonClick: function () {
    var tPlayButton = document.getElementById('play');
    var tPauseButton = document.getElementById('pause');
    var tAttrs = this.model.attributes;
    var tAudioElem = this.audio, tUrl;

    if (tPlayButton.classList.contains('none')) {
      // Pause
      if (tAudioElem) {
        tAudioElem.pause();
      }
      tPlayButton.classList.remove('none');
      tPauseButton.classList.add('none');
    } else {
      // Play
      if (tAudioElem) {
        tAudioElem.play();
        tPlayButton.classList.add('none');
        tPauseButton.classList.remove('none');
      } else {
        tUrl = '/assets/media/projects/' + tAttrs.owner + '/' + tAttrs.id + '.mp3';
        tAudioElem = this.audio = new Audio(tUrl);

        tAudioElem.addEventListener('canplay', function () {
          tAudioElem.play();
          tPlayButton.classList.add('none');
          tPauseButton.classList.remove('none');
        }, false);

        tAudioElem.addEventListener('ended', function () {
          tPlayButton.classList.remove('none');
          tPauseButton.classList.add('none');
        }, false);

        tAudioElem.addEventListener('error', function () {
          tPlayButton.classList.remove('none');
          tPauseButton.classList.add('none');
        }, false);
      }
    }
  }

});
module.exports.id = 'projects/show';
