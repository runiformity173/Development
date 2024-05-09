var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function noteNormalize(note) {
  return note*2;
}
let worked = false;
function playNote(frequency, duration, gainValue=0.2) {
  if (!worked) {worked = true;alert("cool");}
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
      // playMelody();
    }, duration);
}

function playMelody() {
  if (notes.length > 0) {
    note = notes.pop();
    playNote(note[0], 1000 * 256 / (note[1] * tempo));
  }
}


let notes = [
  [659, 4],
  [659, 4],
  [659, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4],
  [0, 4],
  [987, 4],
  [987, 4],
  [987, 4],
  [1046, 8],
  [0, 16],
  [783, 16],
  [622, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4]
];

notes.reverse();
tempo = 100;
