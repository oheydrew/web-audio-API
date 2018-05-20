var audioContext;
const pitchSlider = document.getElementById("pitchSlider"); 
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
  console.log(`Audio Load Request for: ${url}`)
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer'; // 'arraybuffer' is a binary data type, ie audio files
  request.send(); // Send off the request

  // Console logging the response
  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      console.log(`Completed XMLHttpRequest with Response ${this.readyState}, with Status ${this.status} ${this.statusText}`)
      console.log(`Response: ${this.response}`)
    }
  }

  // Decode asynchronously
  request.onload = function() {
    // decodeAudioData takes a: ([file to decode], [completed callback], [error callback]) 
    audioContext.decodeAudioData(request.response, onDecodeSuccess, onDecodeError);

    function onDecodeError(error) {
      console.log(`Decode Error: ${error}`)
    }
    function onDecodeSuccess(buffer) {
        keyStrokeBuffer = buffer;
        console.log(`Decode Success: Buffer Loaded`)
    }
  }
}

function playSound(buffer) {
  // creates a sound source
  console.log('playSound called')
  var source = audioContext.createBufferSource(); 
  // tell the source which sound to play
  source.buffer = buffer;                    
  // connect the source to the context's destination (the speakers)
  source.connect(audioContext.destination);    
  source.detune.value = pitchSlider.value  
  source.start(0);                           // play the source now
}