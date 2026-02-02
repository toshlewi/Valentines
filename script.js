const $ = (sel) => document.querySelector(sel);

const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const celebration = $("#celebration");
const question = $("#question");
const tinyMsg = $("#tinyMsg");
const playBtn = $("#playBtn");
const danceVideo = $("#danceVideo");
const burst = $("#burst");
const floaties = $("#floaties");
const roses = $("#roses");

const FLOATY_IMAGES = [
  "images/cool.jpeg",
  "images/dancing.jpeg",
  "images/last.jpeg",
];

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

// Make the "No" button dodge the pointer.
function moveNoButton(){
  const container = $("#choices");
  if (!container || !noBtn) return;

  // Switch to absolute positioning inside the container after first dodge.
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }

  const containerRect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Keep it within the container; add a little padding.
  const pad = 6;
  const maxX = containerRect.width - btnRect.width - pad;
  const maxY = 64; // keep it near the choice row

  const x = Math.random() * clamp(maxX, 0, maxX);
  const y = Math.random() * clamp(maxY, 0, maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${pad + x}px`;
  noBtn.style.top = `${y}px`;
}

function interceptNo(e){
  e.preventDefault();
  e.stopPropagation();
  moveNoButton();
  if (tinyMsg) tinyMsg.textContent = "Nope. Try again.";
}

// For mouse and touch
["mouseenter", "mousemove", "pointerdown", "touchstart", "click"].forEach((evt) => {
  noBtn?.addEventListener(evt, interceptNo, { passive: false });
});

function showCelebration(){
  celebration.hidden = false;
  celebration.scrollIntoView({ behavior: "smooth", block: "start" });

  // Subtle: keep question visible but de-emphasized
  question.style.opacity = "0";
  question.style.pointerEvents = "none";
  question.style.height = "0";
  question.style.overflow = "hidden";

  // Autoplay should work since it's muted.
  danceVideo.muted = true;
  const playAttempt = danceVideo.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {
      // If blocked, user can press play.
    });
  }

  startFloaties();
  roseShower();
}

function showBurstThenCelebration(){
  if (!burst) {
    showCelebration();
    return;
  }

  burst.hidden = false;
  // Prevent interaction during burst.
  document.body.style.overflow = "hidden";

  window.setTimeout(() => {
    burst.hidden = true;
    document.body.style.overflow = "";
    showCelebration();
  }, 2000);
}

function startFloaties(){
  if (!floaties) return;
  floaties.innerHTML = "";

  const count = 6;
  for (let i = 0; i < count; i++){
    const img = document.createElement("img");
    img.className = "floaty";
    img.src = FLOATY_IMAGES[i % FLOATY_IMAGES.length];
    img.alt = "";

    const top = 8 + Math.random() * 72;
    const dur = 18 + Math.random() * 10;
    const delay = Math.random() * 6;
    const size = 86 + Math.random() * 48;

    img.style.top = `${top}%`;
    img.style.setProperty("--dur", `${dur}s`);
    img.style.animationDelay = `-${delay}s`;
    img.style.width = `${Math.round(size)}px`;
    img.style.height = `${Math.round(size * 1.25)}px`;

    floaties.appendChild(img);
  }
}

function roseShower(){
  if (!roses) return;
  roses.hidden = false;
  roses.innerHTML = "";

  const amount = 26;
  for (let i = 0; i < amount; i++){
    const r = document.createElement("span");
    r.className = "rose";
    r.textContent = "\uD83C\uDF39";
    r.style.left = `${Math.random() * 100}%`;
    r.style.fontSize = `${26 + Math.random() * 22}px`;
    r.style.setProperty("--rd", `${1.6 + Math.random() * 1.2}s`);
    r.style.animationDelay = `${Math.random() * 0.5}s`;
    roses.appendChild(r);
  }

  window.setTimeout(() => {
    roses.hidden = true;
    roses.innerHTML = "";
  }, 2200);
}

yesBtn?.addEventListener("click", () => {
  showBurstThenCelebration();
});

playBtn?.addEventListener("click", async () => {
  try{
    // Keep muted per request.
    danceVideo.muted = true;
    await danceVideo.play();
  }catch{
    // Some browsers require user interaction; this button is the interaction.
  }
});

// On iOS, enabling inline playback sometimes needs a touch.
danceVideo?.addEventListener("click", async () => {
  try{
    danceVideo.muted = true;
    await danceVideo.play();
  }catch{}
});

// Place the No button initially next to Yes; only start dodging after first hover.
// (Keeps layout pretty.)
noBtn?.addEventListener("mouseenter", () => {
  moveNoButton();
}, { once: true });
