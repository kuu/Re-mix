var BaseView = require('./base');

module.exports = BaseView.extend({
  className: 'project_tracks_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this),
        tracks = data.tracks, track, id,
        yyyy, mm;

    for (var i = 0, il = tracks.length; i < il; i++) {
      track = tracks[i];
      id = track.id;
      yyyy = id.substring(0, 4);
      mm = id.substring(4, 6);
      track.url = '/assets/media/tracks/' + track.owner + '/' + yyyy + '/' + mm + '/' + id + '.' + track.type;
    }
    return data;
  },

  events: {
    'click button' : 'onPlayButtonClick'
  },

  initialize: function () {
    this.audioList = {};
    this.STATE_STOPPED = 0;
    this.STATE_PLAYING = 1;
    this.STATE_PAUSED = 2;
  },

  onPlayButtonClick: function (e) {
    function toggleAudio(pButton, pAudio) {
      if (pAudio.state === tSelf.STATE_PLAYING) {
        pAudio.elem.pause();
        pButton.textContent = 'Play';
        pAudio.state = tSelf.STATE_PAUSED;
      } else {
        pAudio.elem.play();
        pButton.textContent = 'Pause';
        pAudio.state = tSelf.STATE_PLAYING;
      }
    }
    var tButton = e.target, tUrl = tButton.dataset.url;
    var tAudio = this.audioList[tUrl], tAudioElem;
    var tSelf = this;

    if (tAudio) {
      toggleAudio(tButton, tAudio);
    } else {
      tAudioElem = new Audio(tUrl);
      tAudio = this.audioList[tUrl] = {
        state: this.STATE_STOPPED,
        elem: tAudioElem
      };
      tAudioElem.addEventListener('canplay', function () {
        toggleAudio(tButton, tAudio);
        tAudio.state = tSelf.STATE_PLAYING;
      }, false);

      tAudioElem.addEventListener('ended', function () {
        tButton.textContent = 'Play';
        tAudio.state = tSelf.STATE_STOPPED;
      }, false);

      tAudioElem.addEventListener('error', function () {
        tButton.textContent = 'Play';
        tAudio.state = tSelf.STATE_STOPPED;
      }, false);
    }
  }
});
module.exports.id = 'project_tracks_view';
