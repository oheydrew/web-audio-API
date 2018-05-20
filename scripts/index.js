var audioContext;
window.addEventListener('load', initAudioContext, false);

// Initializes an Audio Context object
function initAudioContext() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    console.log("audioContext Loaded")
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

// Load a sound into the AudioContext
var keyStrokeBuffer = null;
loadAudio('/keypress.wav')

function loadAudio(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  console.log(request.response)

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      keyStrokeBuffer = buffer;
      console.log(`Buffer Loaded: ${url}`)
    }, onError);
  }
  
  request.onreadystatechange = function() {
    // if (this.readyState == 4 && this.status == 200) {
      console.log(`Completed XMLHttpRequest with Response ${this.readyState}, with Status ${this.status} ${this.statusText}`)
      console.log(`Response: ${this.response}`)
  }

  request.send();
  }
  
function playSound(buffer) {
  // creates a sound source
  var source = context.createBufferSource(); 
  // tell the source which sound to play
  source.buffer = buffer;                    
  // connect the source to the context's destination (the speakers)
  source.connect(context.destination);       
  source.start(0);                           // play the source now
}