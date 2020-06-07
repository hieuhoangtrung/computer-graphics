import coinAudioFile from './sounds/coin.wav';
import powerDownAudioFile from './sounds/power-down.wav';
import powerUpAudioFile from './sounds/power-up.wav';
import { globalObject } from './scene';

function loadSounds() {
  globalObject.coinAudio = new Audio(coinAudioFile);
  globalObject.powerdownAudio = new Audio(powerDownAudioFile);
  globalObject.powerupAudio = new Audio(powerUpAudioFile);
}

export { loadSounds };
