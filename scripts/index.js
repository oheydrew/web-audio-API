// If a red CORS error appears, the file you've chosen isn't hosted somewhere 
// that allows CORS for this server. My tip is to use a dropbox link: Google 
// drive won't work. Dropbox does, at least at this stage.
var loadingWarning = document.getElementById("loadingWarning")
loadingWarning.innerText = 'Loading...'
loadingWarning.className = 'loading'

// Anyway, that out of the way, let's begin setting up our variables
var audioContext;
const pitchSlider = document.getElementById("pitchSlider")
window.addEventListener('load', initAudioContext, false)

// Creates an AudioContext object - this plays and manipulates our audio (just hard coding it to a var @ the top, for now)
function initAudioContext() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    console.log("audioContext Loaded")
  } catch(error) {
    loadingWarning.innerText = 'Web Audio API not supported by browser ⓧ'
    loadingWarning.className = 'warning'
  }
}

// Store the buffered audio in a var, to pass to the AudioContext later
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
    if (this.readyState == 4 && this.status == 0) {
      loadingWarning.innerText = 'Error: CORS required. Try a dropbox link!'
      loadingWarning.className = 'warning'
      console.log('Error: Cross Origin Resource Sharing (CORS) required. Try a dropbox link')
    } else if (this.readyState == 4) {
      console.log(`Completed XMLHttpRequest: Response ${this.readyState} (${this.status} ${this.statusText})`)
      console.log(`Response: ${this.response}`)
      loadingWarning.innerText = 'Audio file Buffered ✔'
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
  console.log('playSound() called')
  var source = audioContext.createBufferSource(); 
  // tell the source which sound to play
  source.buffer = buffer;                    
  // connect the source to the context's destination (the speakers)
  source.connect(audioContext.destination);    
  source.detune.value = pitchSlider.value  
  source.start(0);                           // play the source now
}


// Silly typewriter sounds in the following textbox
const sillyText = document.getElementById("input-sillyText")

sillyText.addEventListener('keydown', function(event){
  playSound(keyStrokeBuffer)
})