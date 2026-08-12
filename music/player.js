const lyrics = [
  { start: 0, end: 2, text: "Coco in the shop" },
  { start: 2, end: 4, text: "Taiyaki hot" },
  { start: 4, end: 6, text: "Don't touch that..." },
  { start: 6, end: 7, text: "Too late." },
  { start: 7, end: 11, text: "Burnt my hat, but I'm still alright" },
  { start: 11, end: 15, text: "Gold chain swingin' under kitchen lights" },
  { start: 15, end: 19, text: "Smell like toast everywhere I go" },
  { start: 19, end: 22, text: 'Boss said, "Coco..."' },
  { start: 22, end: 24, text: 'I said, "Yeah, I know."' },
  { start: 24, end: 28, text: "Burnt my hat, now I wear it proud" },
  { start: 28, end: 32, text: "Little bit brown from the smoke around" },
  { start: 32, end: 36, text: "Made one mistake, ain't the end of the show" },
  { start: 36, end: 40, text: "Give me two taiyaki, then I'm good to go" },
  { start: 40, end: 42, text: "（音乐间奏）" },
  { start: 42, end: 46, text: "First time I came, just wanted a snack" },
  { start: 46, end: 50, text: "Took one bite, had to double right back" },
  { start: 50, end: 54, text: 'Looked at Panpan, "Yo, you hiring or not?"' },
  { start: 54, end: 58, text: "Next thing I know, I'm working the shop" },
  { start: 58, end: 62, text: "Apron on, fish hat on my head" },
  { start: 62, end: 66, text: "Ten minutes later, smelled something bad" },
  { start: 66, end: 70, text: 'Everybody yelling, "Coco! Coco!"' },
  { start: 70, end: 74, text: "Turned around..." },
  { start: 74, end: 77, text: "Man, that hat look good though." },
  { start: 77, end: 81, text: "Burnt my hat, but I'm still alright" },
  { start: 81, end: 85, text: "Gold chain swingin' under kitchen lights" },
  { start: 85, end: 89, text: "Smell like toast everywhere I go" },
  { start: 89, end: 92, text: 'Boss said, "Coco..."' },
  { start: 92, end: 94, text: 'I said, "Yeah, I know."' },
  { start: 94, end: 98, text: "Everybody got a clean fish hat" },
  { start: 98, end: 102, text: "Mine got flavor, you can't buy that" },
  { start: 102, end: 106, text: "Call it burnt, I call it custom made" },
  { start: 106, end: 110, text: "One of one, baby, special grade" },
  { start: 110, end: 114, text: "Put the tongs in the fridge last night" },
  { start: 114, end: 118, text: "Milk by the register, thought that's right" },
  { start: 118, end: 122, text: 'Panpan asked, "Where the red beans at?"' },
  { start: 122, end: 126, text: "I froze... We don't talk about that." },
  { start: 126, end: 130, text: "Clock out late, gold on my neck" },
  { start: 130, end: 134, text: "Still got smoke on my silhouette" },
  { start: 134, end: 138, text: 'Boss said, "Coco, watch the stove."' },
  { start: 138, end: 141, text: 'I said, "Got it."' },
  { start: 141, end: 143, text: "...Probably." },
];

const shell = document.getElementById("playerShell");
const audio = document.getElementById("audio");
const playToggle = document.getElementById("playToggle");
const seekBar = document.getElementById("seekBar");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
const lyricsPreview = document.getElementById("lyricsPreview");
const homeView = document.querySelector(".home-view");
const lyricsStage = document.getElementById("lyricsStage");
const lyricsList = document.getElementById("lyricsList");
const homePrev = document.getElementById("homePrev");
const homeActive = document.getElementById("homeActive");
const homeNext = document.getElementById("homeNext");

let activeIndex = 0;
let userSeeking = false;
let lyricsAutoResumeAt = 0;
let lyricsAutoResumeTimer;
let isProgrammaticLyricsScroll = false;
let lyricsPointerStart;

const LYRICS_AUTO_RESUME_DELAY = 3200;

lyricsList.innerHTML = lyrics
  .map((line, index) => `<p data-index="${index}">${escapeHtml(line.text)}</p>`)
  .join("");

const lyricNodes = [...lyricsList.querySelectorAll("p")];

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char]));
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function getActiveIndex(time) {
  const exactIndex = lyrics.findIndex((line) => time >= line.start && time < line.end);

  if (exactIndex !== -1) {
    return exactIndex;
  }

  for (let index = lyrics.length - 1; index >= 0; index -= 1) {
    if (time >= lyrics[index].start) {
      return index;
    }
  }

  return 0;
}

function centerActiveLyric({ force = false, smooth = true } = {}) {
  const activeNode = lyricNodes[activeIndex];
  if (!activeNode || (!force && Date.now() < lyricsAutoResumeAt)) {
    return;
  }

  isProgrammaticLyricsScroll = true;
  activeNode.scrollIntoView({
    block: "center",
    behavior: smooth ? "smooth" : "auto",
  });
  window.setTimeout(() => {
    isProgrammaticLyricsScroll = false;
  }, 600);
}

function scheduleLyricsAutoResume() {
  lyricsAutoResumeAt = Date.now() + LYRICS_AUTO_RESUME_DELAY;
  window.clearTimeout(lyricsAutoResumeTimer);
  lyricsAutoResumeTimer = window.setTimeout(() => {
    centerActiveLyric({ force: true });
  }, LYRICS_AUTO_RESUME_DELAY);
}

function openLyricsView() {
  shell.classList.add("is-expanded");
  lyricsAutoResumeAt = 0;
  window.requestAnimationFrame(() => {
    centerActiveLyric({ force: true, smooth: false });
  });
  startPlayback();
}

function closeLyricsView() {
  shell.classList.remove("is-expanded");
  startPlayback();
}

function updateLyrics(index) {
  activeIndex = Math.max(0, Math.min(index, lyrics.length - 1));
  const activeLine = lyrics[activeIndex];
  const prevLine = lyrics[activeIndex - 1];
  const nextLine = lyrics[activeIndex + 1];

  homePrev.textContent = prevLine?.text || "";
  homeActive.textContent = activeLine.text;
  homeNext.textContent = nextLine?.text || "";

  lyricNodes.forEach((node, nodeIndex) => {
    node.classList.toggle("is-active", nodeIndex === activeIndex);
  });

  centerActiveLyric();
}

function updateProgress() {
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  durationLabel.textContent = formatTime(audio.duration);

  if (!userSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
    seekBar.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
  }

  const nextIndex = getActiveIndex(audio.currentTime);
  if (nextIndex !== activeIndex) {
    updateLyrics(nextIndex);
  }
}

function setPlayState() {
  const isPlaying = !audio.paused;
  playToggle.classList.toggle("is-playing", isPlaying);
  playToggle.setAttribute("aria-label", isPlaying ? "暂停" : "播放");
}

async function startPlayback() {
  try {
    await audio.play();
  } catch {
    setPlayState();
  }
}

playToggle.addEventListener("click", () => {
  if (audio.paused) {
    startPlayback();
  } else {
    audio.pause();
  }
});

homeView.addEventListener("click", openLyricsView);

lyricsStage.addEventListener("click", () => {
  if (lyricsPointerStart?.moved) {
    return;
  }
  closeLyricsView();
});

lyricsStage.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    closeLyricsView();
  }
});

lyricsStage.addEventListener("pointerdown", (event) => {
  lyricsPointerStart = {
    x: event.clientX,
    y: event.clientY,
    moved: false,
  };
});

lyricsStage.addEventListener("pointermove", (event) => {
  if (!lyricsPointerStart) {
    return;
  }

  const distance = Math.hypot(event.clientX - lyricsPointerStart.x, event.clientY - lyricsPointerStart.y);
  if (distance > 8) {
    lyricsPointerStart.moved = true;
  }
});

lyricsStage.addEventListener("scroll", () => {
  if (!isProgrammaticLyricsScroll) {
    scheduleLyricsAutoResume();
  }
});

seekBar.addEventListener("input", () => {
  userSeeking = true;
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    const nextTime = (Number(seekBar.value) / 1000) * audio.duration;
    currentTimeLabel.textContent = formatTime(nextTime);
    updateLyrics(getActiveIndex(nextTime));
  }
});

seekBar.addEventListener("change", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(seekBar.value) / 1000) * audio.duration;
  }
  userSeeking = false;
  startPlayback();
});

audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", setPlayState);
audio.addEventListener("pause", setPlayState);
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  updateLyrics(0);
  setPlayState();
});

document.addEventListener("visibilitychange", setPlayState);
document.addEventListener("pointerdown", startPlayback, { once: true });
window.addEventListener("resize", () => centerActiveLyric({ force: true, smooth: false }));

updateLyrics(0);
startPlayback();
