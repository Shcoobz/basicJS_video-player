const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const speed = document.querySelector('.player-speed');
const fullscreenBtn = document.querySelector('.fullscreen');

const ZERO_VOLUME = 0;
const MIDDLE_VOLUME = 0.5;
const MAX_VOLUME = 1;
const VOLUME_LOW_THRESHOLD = 0.1;
const VOLUME_HIGH_THRESHOLD = 0.9;

// Play & Pause ----------------------------------- //
function showPauseIcon() {
  playBtn.classList.replace('fa-play', 'fa-pause');
  playBtn.setAttribute('title', 'Pause');
}

function showPlayIcon() {
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
}

function showReplayIcon() {
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Replay');
}

function togglePlay() {
  if (video.paused) {
    video.play();
    showPauseIcon();
  } else {
    video.pause();
    showPlayIcon();
  }
}

// On Video End, show play button icon
video.addEventListener('ended', showReplayIcon);

// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  seconds = seconds > 9 ? seconds : `0${seconds}`;

  return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${displayTime(video.currentTime)} / `;
  duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
  const clickOnProgressBar = e.offsetX;
  const totalWidthProgressRange = progressRange.offsetWidth;
  const newTime = clickOnProgressBar / totalWidthProgressRange;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = MIDDLE_VOLUME;

// Volume Bar
function changeVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  // Rounding volume up or down

  if (volume < VOLUME_LOW_THRESHOLD) {
    volume = ZERO_VOLUME;
  }

  if (volume > VOLUME_HIGH_THRESHOLD) {
    volume = MAX_VOLUME;
  }

  volumeBar.style.width = `${volume * 100}%`;
  video.volume = volume;

  // Change icon depending on volume
  volumeIcon.className = '';
  if (volume > MIDDLE_VOLUME) {
    volumeIcon.classList.add('fas', 'fa-volume-up');
  } else if (volume <= MIDDLE_VOLUME && volume > ZERO_VOLUME) {
    volumeIcon.classList.add('fas', 'fa-volume-down');
  } else if (volume === ZERO_VOLUME) {
    volumeIcon.classList.add('fas', 'fa-volume-off');
  }

  lastVolume = volume;
}

// Mute/Unmute
function toggleMute() {
  volumeIcon.className = '';

  if (video.volume) {
    lastVolume = video.volume;
    video.volume = ZERO_VOLUME;
    volumeBar.style.width = ZERO_VOLUME;
    volumeIcon.classList.add('fas', 'fa-volume-mute');
    volumeIcon.setAttribute('title', 'Unmute');
  } else {
    video.volume = lastVolume;
    volumeBar.style.width = `${lastVolume * 100}%`;

    if (lastVolume > MIDDLE_VOLUME) {
      volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (lastVolume <= MIDDLE_VOLUME && lastVolume > ZERO_VOLUME) {
      volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (lastVolume === ZERO_VOLUME) {
      volumeIcon.classList.add('fas', 'fa-volume-off');
    }

    volumeIcon.setAttribute('title', 'Mute');
  }
}

// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //

// Open Fullscreen
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullscreen) {
    // Firefox
    elem.mozRequestFullscreen();
  } else if (webkitRequestFullscreen) {
    // Chrome, Safari, Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    // IE, Edge
    elem.msRequestFullscreen();
  }
  video.classList.add('video-fullscreen');
}

// Close Fullscreen
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullscreen) {
    // Firefox
    document.mozCancelFullscreen();
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    // IE, Edge
    document.msExitFullscreen();
  }
  video.classList.remove('video-fullscreen');
}

let fullscreen = false;

// Toggle Fullscreen
function toggleFullscreen() {
  if (!fullscreen) {
    openFullscreen(player);
  } else {
    closeFullscreen();
  }
  fullscreen = !fullscreen;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);
