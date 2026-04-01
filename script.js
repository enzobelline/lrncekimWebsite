// Resume password modal
function openResumeModal() {
  document.getElementById("resume-modal").classList.add("open");
  document.getElementById("resume-password").value = "";
  document.getElementById("resume-error").textContent = "";
  setTimeout(() => document.getElementById("resume-password").focus(), 100);
}

function closeResumeModal(e) {
  if (!e || e.target === document.getElementById("resume-modal")) {
    document.getElementById("resume-modal").classList.remove("open");
  }
}

async function hashPassword(pw) {
  const encoded = new TextEncoder().encode(pw);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function checkResumePassword() {
  const pw = document.getElementById("resume-password").value;
  const hash = await hashPassword(pw);
  if (hash === "cb142cf3c2c10090eee5c5192533e3ac4ced22e6690fa98ead8017447a9d4db3") {
    document.getElementById("resume-modal").classList.remove("open");
    window.open("./assets/LAURENCE_KIM_SOFTWARE_RESUME_ONEPAGE_AI.docx.pdf");
  } else {
    document.getElementById("resume-error").textContent = "Incorrect password";
  }
}

// Dark mode
function toggleDarkMode() {
  const html = document.documentElement;
  if (html.getAttribute("data-theme") === "dark") {
    html.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

// Detect system preference or saved preference
(function() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

// Custom cursor (desktop only)
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
  cursorDot.style.display = "none";
  cursorRing.style.display = "none";
  document.documentElement.style.cursor = "auto";
} else {
  document.addEventListener("mousemove", (e) => {
    cursorDot.style.left = e.clientX - 4 + "px";
    cursorDot.style.top = e.clientY - 4 + "px";
    cursorRing.style.left = e.clientX - 16 + "px";
    cursorRing.style.top = e.clientY - 16 + "px";
  });

  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "0.5";
  });

  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });

  document.querySelectorAll("a, button, .icon, .btn, .music-btn, .hamburger-icon, input, .dark-mode-toggle").forEach(el => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
  });
}

// Scroll animations
const fadeElements = document.querySelectorAll(".fade-in");
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

function copyEmail() {
  navigator.clipboard.writeText("lkimcareer@gmail.com");
  const tooltip = document.getElementById("copied-tooltip");
  tooltip.classList.add("show");
  setTimeout(() => tooltip.classList.remove("show"), 1500);
}

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

// Autoplay toggle — set to false to disable, true to enable
const AUTOPLAY_ENABLED = false;

if (AUTOPLAY_ENABLED) {
  function autoplayOnInteract() {
    audio.play().then(() => {
      playBtn.innerHTML = "&#9646;&#9646;";
      showGif(true);
    }).catch(() => {});
    document.removeEventListener("click", autoplayOnInteract);
    document.removeEventListener("keydown", autoplayOnInteract);
  }
  document.addEventListener("click", autoplayOnInteract);
  document.addEventListener("keydown", autoplayOnInteract);
}

let hasPlayedOnce = false;
let gifTimeout = null;
const gifPlaying = document.getElementById("player-gif-playing");
const gifPaused = document.getElementById("player-gif-paused");

function showGif(playing) {
  if (!hasPlayedOnce) return;
  clearTimeout(gifTimeout);

  const active = playing ? gifPlaying : gifPaused;
  const inactive = playing ? gifPaused : gifPlaying;

  inactive.style.display = "none";
  inactive.classList.remove("fade-out");

  active.style.display = "block";
  active.classList.remove("fade-out");

  gifTimeout = setTimeout(() => {
    active.classList.add("fade-out");
    setTimeout(() => {
      active.style.display = "none";
      active.classList.remove("fade-out");
    }, 500);
  }, 5000);
}

function togglePlay() {
  const vibeHint = document.getElementById("vibe-hint");
  if (vibeHint) vibeHint.style.display = "none";

  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = "&#9646;&#9646;";
    playBtn.classList.add("playing");
    hasPlayedOnce = true;
    showGif(true);
  } else {
    audio.pause();
    playBtn.innerHTML = "&#9654;";
    playBtn.classList.remove("playing");
    showGif(false);
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
  playBtn.classList.remove("playing");
  progressBar.style.width = "0%";
  musicTime.textContent = "0:00";
  showGif(false);
});

function seek(e) {
  const bar = document.getElementById("music-progress");
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}
