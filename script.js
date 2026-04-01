function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Music Player
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const progressBar = document.getElementById("music-progress-bar");
const musicTime = document.getElementById("music-time");


// Set default volume and start position
audio.volume = 0.2;
audio.addEventListener("loadedmetadata", () => {
  audio.currentTime = 5;
}, { once: true });

// Autoplay on first user click or keypress (browsers require these for audio)
function autoplayOnInteract() {
  audio.play().then(() => {
    playBtn.innerHTML = "&#9646;&#9646;";
  }).catch(() => {});
  document.removeEventListener("click", autoplayOnInteract);
  document.removeEventListener("keydown", autoplayOnInteract);
}

document.addEventListener("click", autoplayOnInteract);
document.addEventListener("keydown", autoplayOnInteract);

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = "&#9646;&#9646;";
  } else {
    audio.pause();
    playBtn.innerHTML = "&#9654;";
  }
}

function setVolume(val) {
  audio.volume = val / 100;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = pct + "%";
    musicTime.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("ended", () => {
  playBtn.innerHTML = "&#9654;";
  progressBar.style.width = "0%";
  musicTime.textContent = "0:00";
});

function seek(e) {
  const bar = document.getElementById("music-progress");
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}
