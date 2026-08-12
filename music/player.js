const lyrics = [
  { start: 0, end: 2, text: "Coco in the shop" },
  { start: 2, end: 4, text: "Taiyaki hot" },
  { start: 4, end: 6, text: "Don't touch that..." },
  { start: 6, end: 7, text: "Too late." },
  { start: 7, end: 11, text: "Burnt my hat, but I'm still alright", translation: "帽子烧焦了，但我照样没事" },
  { start: 11, end: 15, text: "Gold chain swingin' under kitchen lights", translation: "金链子在厨房灯下面晃" },
  { start: 15, end: 19, text: "Smell like toast everywhere I go", translation: "走到哪儿都有一股烤面包味" },
  { start: 19, end: 24, text: 'Boss said, "Coco..." I said, "Yeah, I know."', translation: "老板说：“Coco……” 我说：“我知道。”" },
  { start: 24, end: 28, text: "Burnt my hat, now I wear it proud", translation: "帽子烧焦了，我反而越戴越骄傲" },
  { start: 28, end: 32, text: "Little bit brown from the smoke around", translation: "烟熏一圈，连毛都变棕了" },
  { start: 32, end: 36, text: "Made one mistake, ain't the end of the show", translation: "小问题，演出还没结束" },
  { start: 36, end: 40, text: "Give me two taiyaki, then I'm good to go", translation: "再给我两个鲷鱼烧，我就满血复活" },
  { start: 40, end: 42, text: "（音乐间奏）" },
  { start: 42, end: 46, text: "First time I came, just wanted a snack", translation: "第一次来，我只是想吃点东西" },
  { start: 46, end: 50, text: "Took one bite, had to double right back", translation: "咬了一口，立刻又折回来了" },
  { start: 50, end: 54, text: 'Looked at Panpan, "Yo, you hiring or not?"', translation: "我问潘潘：“哥，你这还招人不？”" },
  { start: 54, end: 58, text: "Next thing I know, I'm working the shop", translation: "回过神来，我已经在店里上班了" },
  { start: 58, end: 62, text: "Apron on, fish hat on my head", translation: "围裙一系，鲷鱼烧头套一戴" },
  { start: 62, end: 66, text: "Ten minutes later, smelled something bad", translation: "十分钟后，我闻到哪里不太对" },
  { start: 66, end: 70, text: 'Everybody yelling, "Coco! Coco!"', translation: "大家都在喊：“Coco！Coco！”" },
  { start: 70, end: 74, text: "Turned around...", translation: "我回头一看……" },
  { start: 74, end: 77, text: "Man, that hat look good though.", translation: "诶，这帽子焦了以后还挺帅。" },
  { start: 77, end: 81, text: "Burnt my hat, but I'm still alright" },
  { start: 81, end: 85, text: "Gold chain swingin' under kitchen lights" },
  { start: 85, end: 89, text: "Smell like toast everywhere I go" },
  { start: 89, end: 92, text: 'Boss said, "Coco..."' },
  { start: 92, end: 94, text: 'I said, "Yeah, I know."' },
  { start: 94, end: 98, text: "Everybody got a clean fish hat", translation: "大家的鲷鱼烧头套都干干净净" },
  { start: 98, end: 102, text: "Mine got flavor, you can't buy that", translation: "我的有味道，这可是买不到的" },
  { start: 102, end: 106, text: "Call it burnt, I call it custom made", translation: "你说烧焦，我说私人定制" },
  { start: 106, end: 110, text: "One of one, baby, special grade", translation: "全球一件，特别版本" },
  { start: 110, end: 114, text: "Put the tongs in the fridge last night", translation: "昨晚我把夹子塞进冰箱" },
  { start: 114, end: 118, text: "Milk by the register, thought that's right", translation: "牛奶放收银台，我当时还觉得挺合理" },
  { start: 118, end: 122, text: 'Panpan asked, "Where the red beans at?"', translation: "潘潘问：“红豆馅去哪了？”" },
  { start: 122, end: 126, text: "I froze... We don't talk about that.", translation: "我愣住了……这件事就别提了。" },
  { start: 126, end: 130, text: "Clock out late, gold on my neck", translation: "晚上下班，脖子上还挂着金链" },
  { start: 130, end: 134, text: "Still got smoke on my silhouette", translation: "身上还带着一点烟熏味" },
  { start: 134, end: 138, text: 'Boss said, "Coco, watch the stove."', translation: "老板说：“Coco，看着点炉子。”" },
  { start: 138, end: 141, text: 'I said, "Got it."', translation: "我说：“知道了。”" },
  { start: 141, end: 143, text: "...Probably.", translation: "……应该吧。" },
];

const shell = document.getElementById("playerShell");
const audio = document.getElementById("audio");
const playToggle = document.getElementById("playToggle");
const seekBar = document.getElementById("seekBar");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
const homeTrigger = document.getElementById("homeTrigger");
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
  .map((line, index) => `
    <p data-index="${index}">
      <span class="line-text">${escapeHtml(line.text)}</span>
      ${line.translation ? `<span class="line-translation">${escapeHtml(line.translation)}</span>` : ""}
    </p>
  `)
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

  renderPreviewLine(homePrev, prevLine);
  renderPreviewLine(homeActive, activeLine);
  renderPreviewLine(homeNext, nextLine);

  lyricNodes.forEach((node, nodeIndex) => {
    node.classList.toggle("is-active", nodeIndex === activeIndex);
  });

  centerActiveLyric();
}

function renderPreviewLine(target, line) {
  if (!line) {
    target.replaceChildren();
    return;
  }

  const text = document.createElement("span");
  text.className = "line-text";
  text.textContent = line.text;
  target.replaceChildren(text);

  if (line.translation) {
    const translation = document.createElement("span");
    translation.className = "line-translation";
    translation.textContent = line.translation;
    target.append(translation);
  }
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
    setPlayState();
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

homeTrigger.addEventListener("click", openLyricsView);

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
setPlayState();
startPlayback();
