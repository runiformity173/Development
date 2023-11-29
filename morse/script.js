const morseCodeMap = {'A': '.-','B': '-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',',':'--..--','?':'..--..',' ':' '};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const dotDuration = 300; // Adjust as needed
const dashDuration = dotDuration*3; // Adjust as needed
const spaceDuration = dotDuration; // Adjust as needed

function createOscillator() {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.connect(audioContext.destination);
  return oscillator;
}

// function playLetter(letter) {
//   function playSignal(signal) {
//     return new Promise(resolve => {
//       const oscillator = createOscillator();
//       oscillator.onended = resolve;
    
//       oscillator.frequency.setValueAtTime(0, audioContext.currentTime);
//       if (signal === '.') {
//         oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
//         oscillator.frequency.setValueAtTime(0, audioContext.currentTime + dotDuration / 1000);
//       } else if (signal === '-') {
//         oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
//         oscillator.frequency.setValueAtTime(0, audioContext.currentTime + dashDuration / 1000);
//       } else if (signal === ' ') {
//         setTimeout(resolve, spaceDuration);
//         return;
//       }

//       oscillator.start();
//       oscillator.stop(audioContext.currentTime + (dashDuration) / 1000);
//     });
//   }

//   async function playMorseCode(morseCode) {
//     for (const signal of morseCode) {
//       await playSignal(signal);
//       await new Promise(resolve => setTimeout(resolve, dotDuration)); // Add a slight gap between signals
//     }
//   }

//   letter = letter.toUpperCase();
//   if (morseCodeMap.hasOwnProperty(letter)) {
//     const morseCode = morseCodeMap[letter];
//     playMorseCode(morseCode);
//   }
// }
function playLetters(inputString) {
  console.time("timer");
  function playSignal(signal) {
    return new Promise(resolve => {
      const oscillator = createOscillator();
      oscillator.onended = resolve;
      let t = 0;
      oscillator.frequency.setValueAtTime(0, audioContext.currentTime);
      if (signal === '.') {
        t = dotDuration / 1000;
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(0, audioContext.currentTime + dotDuration / 1000);
      } else if (signal === '-') {
        t = dashDuration / 1000;
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(0, audioContext.currentTime + dashDuration / 1000);
      } else if (signal === ' ') {
        setTimeout(resolve, spaceDuration);
        return;
      }

      oscillator.start();
      oscillator.stop(audioContext.currentTime + t);
    });
  }

  async function playMorseCode(morseCode) {
    for (const signal of morseCode) {
      await playSignal(signal);
      await new Promise(resolve => setTimeout(resolve, 10)); // Add a slight gap between signals
    }
  }
  async function playNextLetter(index) {
    if (index < inputString.length) {
      const letter = inputString[index];
      document.getElementById("output").innerHTML = morseCodeMap[letter];
      
      if (letter === ' ') {
        await new Promise(resolve => setTimeout(resolve, spaceDuration));
      await playNextLetter(index + 1);
      } else if (morseCodeMap.hasOwnProperty(letter)) {
        await playMorseCode(morseCodeMap[letter]);
      document.getElementById("output").innerHTML = "";
        
        await new Promise(resolve => setTimeout(resolve, dashDuration)); // Add a slight gap after each letter
        await playNextLetter(index + 1);
      }
    }
  }
  
  playNextLetter(0);
  console.timeEnd("timer");
  
}
let letters = "";
function start() {
  letters = "";
  for (var i = 0;i<8;i++) {
    letters += ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",".",",","?"][Math.floor(Math.random()*29)]
  }
  playLetters(letters);
}