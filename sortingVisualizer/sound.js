var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function noteNormalize(note) {
  return 1000*(note/SIZE)+200;
}
let worked = false;


function playNote(frequency, duration, gainValue=0.1) {
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain(); // Create a gain node

  oscillator.type = 'sine'; // Set oscillator type to sine wave
  oscillator.connect(gainNode); // Connect oscillator to gain node
  gainNode.connect(audioCtx.destination); // Connect gain node to audio destination
  
  oscillator.frequency.value = frequency; // value in hertz
  gainNode.gain.value = gainValue; // Set the gain value to make the note quieter
  oscillator.start();
  

  setTimeout(function() {
    oscillator.stop();
  }, duration);
}
function playFinal(gainValue=0.2,duration=1500) {
  var oscillator2 = audioCtx.createOscillator();
  var gainNode2 = audioCtx.createGain();
  oscillator2.type = 'sine';
  oscillator2.frequency.value = noteNormalize(0);
  oscillator2.connect(gainNode2);
  gainNode2.connect(audioCtx.destination);
  gainNode2.gain.value = gainValue;
  var currentTime = audioCtx.currentTime;
  var endTime = currentTime + duration/1000;
  oscillator2.frequency.setValueAtTime(noteNormalize(0), currentTime);
oscillator2.frequency.exponentialRampToValueAtTime(noteNormalize(SIZE), endTime);

  oscillator2.start();

  setTimeout(
    function() {
      oscillator2.stop();
    }, duration);
}
