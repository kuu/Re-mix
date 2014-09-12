var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'projects_show_record',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.self = data.record = true;
    return data;
  },

  initialize: function () {
    this.audioContext = null;
    this.recorder = null;
    this.recorderGain = null;
    this.inputStream = null;
  },

  events: {
    'click #record' : 'onRecord',
    'click #stop' : 'onStop'
  },

  postRender: function () {
    if (!this.audioContext) {
      this.initAudio();
    }
  },

  initAudio: function () {
    var tSelf = this;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    // Init Web Audio
    try {
      this.audioContext = new AudioContext();
      console.log('Audio context set up.');
    } catch (e) {
      throw new Error('No web audio support in this browser!');
    }

    // Init microphone input
    var microphones = document.getElementById('microphones');
    MediaStreamTrack.getSources(function(sources) {
      var source, item;
      for (var i = 0, il = sources.length; i < il; i++) {
        source = sources[i];
        if (source.kind === 'audio') {
          item = document.createElement('option');
          item.value = source.id;
          item.innerHTML = source.id + '';
          microphones.appendChild(item);
        }
      }
    });

    microphones.addEventListener('change', function (elem) {
      var constraints = {}, id = elem.target.selectedOptions[0].value;
      if (id === 'default') {
        return;
      }
      constraints.audio = {
        optional: [{ sourceId: id}]
      };
      navigator.getUserMedia(constraints, function (stream) {
          tSelf.initRecorder(stream);
        }, function(e) {
          throw new Error('No live audio input: ' + e);
      });
    }, false);
  },

  initRecorder: function (stream) {
    var ctx = this.audioContext,
        recorder = this.recorder,
        recorderGain = this.recorderGain,
        monitorGain = this.monitorGain,
        inputStream = this.inputStream,
        mediaStreamSource = ctx.createMediaStreamSource(stream),
        recordingVolume = document.getElementById('recordingVolume'),
        monitorVolume = document.getElementById('monitorVolume'),
        recordButton = document.getElementsByClassName('record-button')[0],
        attrs = this.model.attributes,
        router = this.app.router;

    // Build volume knob
    recordingVolume.addEventListener('change', function () {
      if (recorderGain) {
        recorderGain.gain.value = recordingVolume.value / 100;
      }
    }, false); 

    monitorVolume.addEventListener('change', function () {
      if (monitorGain) {
        monitorGain.gain.value = monitorVolume.value / 100;
      }
    }, false); 
        
    // Build audio graph
    if (!recorderGain) {
      recorderGain = this.recorderGain = ctx.createGain();
      recorderGain.gain.value = 0.5;
      recordingVolume.value = 50;
    }

    if (!monitorGain) {
      monitorGain = ctx.createGain();
      monitorGain.connect(ctx.destination);
      monitorGain.gain.value = 0.5;
      monitorVolume.value = 50;
    }

    if (inputStream) {
      inputStream.disconnect();
    }
    inputStream = this.inputStream = this.convertToMono(mediaStreamSource);
    inputStream.connect(recorderGain);

    if (recorder) {
      recorder.disconnect();
    }

    inputStream.connect(monitorGain);

    recorder = this.recorder = new Recorder(
      recorderGain,
      { owner: attrs.owner, id: attrs.id },
      function (obj) {
        // Update the view.
        console.log(obj);
        router.navigate('/record/' + attrs.owner + '/' + attrs.id, {trigger: true});
    });

    recordButton.disabled = false;

    console.log('Recorder set up.');
  },

  convertToMono: function (input) {
    // make sure the source is mono - some sources will be left-side only
    var ctx = this.audioContext;
    var splitter = ctx.createChannelSplitter(2);
    var merger = ctx.createChannelMerger(2);

    input.connect(splitter);
    splitter.connect(merger, 0, 0);
    splitter.connect(merger, 0, 1);
    return merger;
  },

  onRecord: function () {
    var tRecordButton = document.getElementById('record'),
        tStopButton = document.getElementById('stop'),
        tRecorder = this.recorder;

    if (tRecorder) {
      tRecorder.record();
    }
    tRecordButton.classList.add('none');
    tStopButton.classList.remove('none');
    console.log('Recording...');
  },

  onStop: function () {
    var tRecordButton = document.getElementById('record'),
        tStopButton = document.getElementById('stop'),
        tRecorder = this.recorder;

    if (tRecorder) {
      tRecorder.stop();
      tRecorder.save();
    }
    tRecordButton.classList.remove('none');
    tStopButton.classList.add('none');
  },

});
module.exports.id = 'projects/record';
