var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function noteNormalize(note) {
  return 1000*(note/SIZE)+200;
}
let worked = false;
function playNote(frequency, duration, gainValue=0.1) {
  console.log(frequency+" | "+duration);
  // create Oscillator node
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain(); // Create a gain node

  oscillator.type = 'sine'; // Set oscillator type to sine wave
  oscillator.frequency.value = frequency; // value in hertz
  oscillator.connect(gainNode); // Connect oscillator to gain node
  gainNode.connect(audioCtx.destination); // Connect gain node to audio destination
  gainNode.gain.value = gainValue; // Set the gain value to make the note quieter

  oscillator.start();

  setTimeout(
    function() {
      oscillator.stop();
    }, duration);
}
