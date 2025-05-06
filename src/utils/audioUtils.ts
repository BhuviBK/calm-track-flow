
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
let breathSounds: {[key: string]: HTMLAudioElement} = {};

// Preload audio files to prevent loading delay
export const preloadAudio = () => {
  // Preload ambient music
  if (!ambientPlayer) {
    ambientPlayer = new Audio(AUDIO_PATHS.ambientMusic);
    ambientPlayer.loop = true;
    ambientPlayer.volume = 0.3;
    ambientPlayer.preload = 'auto';
  }
  
  // Preload breath sounds
  if (!breathSounds.inhale) {
    breathSounds.inhale = new Audio(AUDIO_PATHS.inhale);
    breathSounds.inhale.volume = 0.5;
    breathSounds.inhale.preload = 'auto';
  }
  
  if (!breathSounds.exhale) {
    breathSounds.exhale = new Audio(AUDIO_PATHS.exhale);
    breathSounds.exhale.volume = 0.5;
    breathSounds.exhale.preload = 'auto';
  }
  
  // Preload bell sound
  if (!breathSounds.bell) {
    breathSounds.bell = new Audio(AUDIO_PATHS.bellEnd);
    breathSounds.bell.volume = 0.7;
    breathSounds.bell.preload = 'auto';
  }
};

export const playBellSound = () => {
  if (!breathSounds.bell) {
    const bell = new Audio(AUDIO_PATHS.bellEnd);
    bell.volume = 0.7;
    bell.play().catch(e => console.warn("Could not play bell sound:", e));
  } else {
    breathSounds.bell.currentTime = 0;
    breathSounds.bell.play().catch(e => console.warn("Could not play bell sound:", e));
  }
};

export const playBreathSound = (phase: 'inhale' | 'exhale' | 'hold' | 'rest') => {
  if (phase === 'inhale') {
    if (!breathSounds.inhale) {
      const inhaleSound = new Audio(AUDIO_PATHS.inhale);
      inhaleSound.volume = 0.5;
      inhaleSound.play().catch(e => console.warn("Could not play inhale sound:", e));
    } else {
      breathSounds.inhale.currentTime = 0;
      breathSounds.inhale.play().catch(e => console.warn("Could not play inhale sound:", e));
    }
  } else if (phase === 'exhale') {
    if (!breathSounds.exhale) {
      const exhaleSound = new Audio(AUDIO_PATHS.exhale);
      exhaleSound.volume = 0.5;
      exhaleSound.play().catch(e => console.warn("Could not play exhale sound:", e));
    } else {
      breathSounds.exhale.currentTime = 0;
      breathSounds.exhale.play().catch(e => console.warn("Could not play exhale sound:", e));
    }
  }
};

export const toggleAmbientMusic = (play: boolean) => {
  // Create player if not exists
  if (!ambientPlayer) {
    ambientPlayer = new Audio(AUDIO_PATHS.ambientMusic);
    ambientPlayer.loop = true;
    ambientPlayer.volume = 0.3;
  }
  
  if (play) {
    // Use promise to handle autoplay restrictions and add debug logs
    console.log("Attempting to play ambient music");
    const playPromise = ambientPlayer.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Ambient music playing successfully");
        })
        .catch(error => {
          console.warn("Playback prevented due to autoplay restrictions:", error);
          // We might need to implement a user interaction to trigger playback
          // This is handled by having buttons in UI
        });
    }
  } else if (ambientPlayer) {
    console.log("Pausing ambient music");
    ambientPlayer.pause();
  }
};

export const stopAllSounds = () => {
  console.log("Stopping all sounds");
  if (ambientPlayer) {
    ambientPlayer.pause();
    ambientPlayer.currentTime = 0;
  }
  
  // Stop any breath sounds
  Object.values(breathSounds).forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });
};

// Initialize audio
preloadAudio();
