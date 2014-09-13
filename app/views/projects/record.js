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
    this.recording = false;
    this.recorderGain = null;
    this.inputStream = null;
  },

  events: {
    'click .record-button' : 'onRecord',
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
        analyser = this.analyser,
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

    if (!analyser) {
      analyser = this.analyser = ctx.createAnalyser();
      recorderGain.connect(analyser);
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
        router.navigate('/projects/' + attrs.owner + '/' + attrs.id, {trigger: true});
    });

    recordButton.disabled = false;

    console.log('Recorder set up.');
  },

  drawWave: function (waveData) {
    var ctx = this.waveCanvasContext,
        h = ctx.canvas.height,
        w = ctx.canvas.width,
        posY = h / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle='#f66';
    ctx.lineWidth = 7;

    for (var i = 0; i < w ; i++) {
      /* convert uint8(0-255) to -128 - +127*/
      var amp = waveData[i] - 128;
      if (i === 0) {
        ctx.moveTo(i*2, posY + amp);
      } else {
        ctx.lineTo(i*2, posY + amp);
      }
    }
    ctx.stroke();
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
        tRecorder = this.recorder,
        tIsRecording = this.recording,
        tCanvasContext = this.waveCanvasContext,
        tSelf = this;

    if (tIsRecording) {
      // Stop
      if (tRecorder) {
        tRecorder.stop();
        tRecorder.save();
      }
      tRecordButton.classList.remove('none');
      tStopButton.classList.add('none');
      this.recording = false;
      console.log('Stopped.');
    } else {

      if (!tCanvasContext) {
        this.waveCanvasContext = document.getElementById('waveCanvas').getContext('2d');
      }

      if (tRecorder) {
        tRecorder.record();
      }
      tRecordButton.classList.add('none');
      tStopButton.classList.remove('none');
      this.recording = true;

      (function loop() {

        if (!tSelf.recording) {
          return;
        }

        var analyser = tSelf.analyser,
            waveData = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteTimeDomainData(waveData);
        tSelf.drawWave(waveData);
        requestAnimationFrame(loop);
      }());

      console.log('Recording...');
    }
  },

});
module.exports.id = 'projects/record';
