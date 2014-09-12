var socket;

importScripts('/socket.io/socket.io.js');

this.onmessage = function (e) {
  var command = e.data.command;
  if (command === 'init') {
    init(e.data.params);
  } else if (command === 'start') {
    start();
  } else if (command === 'record') {
    record(e.data.buffer);
  } else if (command === 'save') {
    save();
  } else if (command === 'disconnect') {
    disconnect();
  }
};

function init(params) {
  var tSelf = this;

  socket = io();
  socket.emit('params', {
    data: params
  });
  socket.on('server', function (message) {
    tSelf.postMessage(message);
  });
}

function start() {
  socket.emit('start', {});
}

function record(inputBuffer) {
  // Float32 (-1.0 <-> +1.0) -> Int16 (-0x8000 <-> +0x7FFF)
  var sampleNum = inputBuffer.length;
  var buffer = new ArrayBuffer(sampleNum * 2);
  var view = new DataView(buffer);
  for (var i = 0, il = sampleNum, offset = 0; i < il; i++, offset += 2){
    var s = Math.max(-1, Math.min(1, inputBuffer[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  socket.emit('record', {
    data: buffer
  });
}

function save() {
  socket.emit('flush', {});
}

function disconnect() {
  socket.disconnect();
}
