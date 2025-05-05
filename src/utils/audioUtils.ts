
// Audio utilities for meditation sounds

// Audio paths
const AUDIO_PATHS = {
  bellEnd: '/sounds/meditation-bell.mp3',
  inhale: '/sounds/inhale-sound.mp3',
  exhale: '/sounds/exhale-sound.mp3',
  ambientMusic: '/sounds/ambient-meditation.mp3',
};

// Audio instances
let ambientPlayer: HTMLAudioElement | null = null;

export const playBellSound = () => {
  const bell = new Audio(AUDIO_PATHS.bellEnd);
  bell.volume = 0.7;
  bell.play();
};

export const playBreathSound = (phase: 'inhale' | 'exhale' | 'hold' | 'rest') => {
  if (phase === 'inhale') {
    const inhaleSound = new Audio(AUDIO_PATHS.inhale);
    inhaleSound.volume = 0.5;
    inhaleSound.play();
  } else if (phase === 'exhale') {
    const exhaleSound = new Audio(AUDIO_PATHS.exhale);
    exhaleSound.volume = 0.5;
    exhaleSound.play();
  }
};

export const toggleAmbientMusic = (play: boolean) => {
  if (play) {
    if (!ambientPlayer) {
      ambientPlayer = new Audio(AUDIO_PATHS.ambientMusic);
      ambientPlayer.loop = true;
      ambientPlayer.volume = 0.3;
    }
    ambientPlayer.play();
  } else if (ambientPlayer) {
    ambientPlayer.pause();
  }
};

export const stopAllSounds = () => {
  if (ambientPlayer) {
    ambientPlayer.pause();
    ambientPlayer.currentTime = 0;
  }
};
