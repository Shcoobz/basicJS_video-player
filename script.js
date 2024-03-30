const selectors = {
  player: document.querySelector('.player'),
  video: document.querySelector('video'),
  progressRange: document.querySelector('.progress-range'),
  progressBar: document.querySelector('.progress-bar'),
  playBtn: document.getElementById('play-btn'),
  volumeIcon: document.getElementById('volume-icon'),
  volumeRange: document.querySelector('.volume-range'),
  volumeBar: document.querySelector('.volume-bar'),
  currentTime: document.querySelector('.time-elapsed'),
  duration: document.querySelector('.time-duration'),
  speed: document.querySelector('.player-speed'),
  fullscreenBtn: document.querySelector('.fullscreen'),
};

const VOLUME_LEVELS = {
  ZERO: 0,
  LOW: 0.1,
  MIDDLE: 0.5,
  HIGH: 0.9,
  MAX: 1,
};

const SECONDS_PER_MINUTE = 60;
const PERCENT_MAX = 100;

let lastVolume = VOLUME_LEVELS.MIDDLE;
let fullscreen = false;

/**
 * Utility function to toggle between play and pause icons.
 * @param {string} icon - The current icon class (play or pause).
 * @param {string} action - The action class to switch to (play or pause).
 * @param {string} title - The title to be set for the button (Play, Pause, or Replay).
 */
const toggleIcon = (icon, action, title) => {
  selectors.playBtn.classList.replace(`fa-${icon}`, `fa-${action}`);
  selectors.playBtn.setAttribute('title', title);
};

/**
 * Converts time in seconds to a formatted string "MM:SS".
 * @param {number} time - The time in seconds.
 * @returns {string} - The formatted time string.
 */
function displayTime(time) {
  const minutes = Math.floor(time / SECONDS_PER_MINUTE);
  const seconds = Math.floor(time % SECONDS_PER_MINUTE)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/**
 * Updates the video playback progress bar and time display.
 */
function updateProgress() {
  const progress = (selectors.video.currentTime / selectors.video.duration) * PERCENT_MAX;

  selectors.progressBar.style.width = `${progress}%`;
  selectors.currentTime.textContent = `${displayTime(selectors.video.currentTime)} / `;
  selectors.duration.textContent = displayTime(selectors.video.duration);
}

/**
 * Toggles play or pause status of the video and updates the play button icon accordingly.
 */
function onPlayToggle() {
  if (selectors.video.paused) {
    selectors.video.play();
    toggleIcon('play', 'pause', 'Pause');
  } else {
    selectors.video.pause();
    toggleIcon('pause', 'play', 'Play');
  }
}

/**
 * Updates the play button to show the replay icon when the video ends.
 */
function onVideoEnd() {
  toggleIcon('pause', 'play', 'Replay');
}

/**
 * Seeks the video to the position clicked on the progress bar.
 * @param {MouseEvent} e - The click event on the progress bar.
 */
function onProgressClick(e) {
  const newTime =
    (e.offsetX / selectors.progressRange.offsetWidth) * selectors.video.duration;

  selectors.video.currentTime = newTime;

  updateProgress();
}

/**
 * Updates the volume icon based on the current volume level.
 * @param {number} volume - The current volume level of the video.
 */
function updateVolumeIcon(volume) {
  selectors.volumeIcon.className = ''; // Reset class name

  if (volume > VOLUME_LEVELS.MIDDLE) {
    selectors.volumeIcon.classList.add('fas', 'fa-volume-up');
    selectors.volumeIcon.setAttribute('title', 'Mute');
  } else if (volume < VOLUME_LEVELS.MIDDLE && volume > VOLUME_LEVELS.ZERO) {
    selectors.volumeIcon.classList.add('fas', 'fa-volume-down');
    selectors.volumeIcon.setAttribute('title', 'Mute');
  } else if (volume === VOLUME_LEVELS.ZERO) {
    selectors.volumeIcon.classList.add('fas', 'fa-volume-mute');
    selectors.volumeIcon.setAttribute('title', 'Unmute');
  }
}

/**
 * Handles changes to the video volume via the volume range input.
 * @param {MouseEvent} e - The event associated with the volume change.
 */
function onVolumeChange(e) {
  let volume = e.offsetX / selectors.volumeRange.offsetWidth;

  volume = Math.min(Math.max(volume, VOLUME_LEVELS.ZERO), VOLUME_LEVELS.MAX);

  selectors.video.volume = volume;
  selectors.volumeBar.style.width = `${volume * PERCENT_MAX}%`;

  updateVolumeIcon(volume);
}

/**
 * Toggles the video's mute status and updates the UI accordingly.
 */
const onToggleMute = () => {
  const isMuted = selectors.video.volume === VOLUME_LEVELS.ZERO;

  if (isMuted) {
    selectors.video.volume = lastVolume;
    selectors.volumeBar.style.width = `${lastVolume * PERCENT_MAX}%`;
  } else {
    lastVolume = selectors.video.volume;
    selectors.video.volume = VOLUME_LEVELS.ZERO;
    selectors.volumeBar.style.width = '0%';
  }

  updateVolumeIcon(selectors.video.volume);
};

/**
 * Changes the video playback speed based on the selected speed option.
 */
function onSpeedChange() {
  selectors.video.playbackRate = selectors.speed.value;
}

/**
 * Enters or exits fullscreen mode for the video player.
 * @param {Element} elem - The element to display in fullscreen mode.
 */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullscreen) {
    /* Firefox */
    elem.mozRequestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
  selectors.video.classList.add('video-fullscreen');
}

/**
 * Exits fullscreen mode.
 */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullscreen) {
    /* Firefox */
    document.mozCancelFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari, Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
  selectors.video.classList.remove('video-fullscreen');
}

/**
 * Toggles the fullscreen state of the video player.
 */
function onFullscreenToggle() {
  fullscreen = !fullscreen;

  !fullscreen ? openFullscreen(selectors.player) : closeFullscreen();
}

// Event listeners
selectors.playBtn.addEventListener('click', onPlayToggle);
selectors.video.addEventListener('click', onPlayToggle);
selectors.video.addEventListener('ended', onVideoEnd);
selectors.video.addEventListener('timeupdate', updateProgress);
selectors.video.addEventListener('canplay', updateProgress);
selectors.progressRange.addEventListener('click', onProgressClick);
selectors.volumeRange.addEventListener('click', onVolumeChange);
selectors.volumeIcon.addEventListener('click', onToggleMute);
selectors.speed.addEventListener('change', onSpeedChange);
selectors.fullscreenBtn.addEventListener('click', onFullscreenToggle);
