(function () {
  const candidates = [
    {
      title: "Where Did U Go",
      artist: "G.E.M.",
      src: "music/portfolio-track.mp3"
    },
    {
      title: "Portfolio Track",
      artist: "Local audio",
      src: "music/portfolio-track.m4a"
    },
    {
      title: "Portfolio Track",
      artist: "Local audio",
      src: "music/portfolio-track.wav"
    },
    {
      title: "Portfolio Track",
      artist: "Local audio",
      src: "music/track.mp3"
    },
    {
      title: "Portfolio Track",
      artist: "Local audio",
      src: "music/song.mp3"
    }
  ];

  const button = document.querySelector(".sound-toggle");
  const label = button?.querySelector(".sound-label");
  const panel = document.querySelector(".music-panel");
  const trackName = document.querySelector(".music-track-name");
  const status = document.querySelector(".music-status");
  const gate = document.querySelector(".audio-gate");
  const gateButton = document.querySelector(".audio-gate__button");
  const audio = document.querySelector("#portfolio-audio");

  if (!button || !label || !panel || !gate || !gateButton || !audio) return;

  let active = false;
  let selected = null;
  let loadingIndex = 0;
  let hasResolvedSource = false;

  window.__portfolioSound = {
    get state() {
      if (!selected) return "missing-local-audio";
      return active ? "playing" : "paused";
    },
    get track() {
      return selected;
    },
    candidates
  };

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function updateUi(mode) {
    const isOn = mode === "on";
    const isBlocked = mode === "blocked";
    button.classList.toggle("is-on", isOn);
    button.classList.toggle("is-blocked", isBlocked);
    button.setAttribute("aria-pressed", String(isOn));

    if (!selected) {
      label.textContent = "等待音乐";
      return;
    }

    label.textContent = isOn ? "音乐播放中" : "播放音乐";
  }

  function openPanel() {
    panel.classList.add("is-open");
  }

  function hideGate() {
    gate.classList.add("is-hidden");
    gate.setAttribute("aria-hidden", "true");
  }

  function showGate() {
    if (selected) {
      gate.classList.remove("is-hidden");
      gate.removeAttribute("aria-hidden");
    }
  }

  function setTrack(track) {
    selected = track;
    if (trackName) trackName.textContent = track.title;
    audio.src = track.src;
    audio.volume = 0.74;
    hasResolvedSource = true;
    setStatus("已连接本地音乐。若浏览器阻止自动播放，请点击进入按钮继续。");
  }

  async function playAudio() {
    if (!selected) {
      openPanel();
      setStatus("未检测到本地音乐文件。请把歌曲放到 music/portfolio-track.mp3 后刷新页面。");
      updateUi("blocked");
      return;
    }

    try {
      await audio.play();
      active = true;
      hideGate();
      openPanel();
      updateUi("on");
    } catch {
      active = false;
      showGate();
      updateUi("blocked");
      setStatus("浏览器阻止了有声自动播放。点击「进入并播放」即可继续。");
    }
  }

  function pauseAudio() {
    audio.pause();
    active = false;
    updateUi("blocked");
    setStatus("音乐已暂停。");
  }

  function tryAutoplay() {
    window.setTimeout(playAudio, 520);
  }

  function loadNextCandidate() {
    if (loadingIndex >= candidates.length) {
      selected = null;
      hasResolvedSource = false;
      hideGate();
      openPanel();
      updateUi("blocked");
      setStatus("未找到本地歌曲。请把歌曲命名为 portfolio-track.mp3，并放进 music 文件夹。");
      return;
    }

    const candidate = candidates[loadingIndex];
    loadingIndex += 1;
    audio.src = candidate.src;
    audio.load();
  }

  audio.addEventListener("canplay", () => {
    if (hasResolvedSource) return;
    setTrack(candidates[Math.max(0, loadingIndex - 1)]);
    tryAutoplay();
  });

  audio.addEventListener("error", () => {
    if (hasResolvedSource) return;
    loadNextCandidate();
  });

  audio.addEventListener("play", () => {
    active = true;
    hideGate();
    updateUi("on");
  });

  audio.addEventListener("pause", () => {
    if (!audio.ended) {
      active = false;
      updateUi("blocked");
    }
  });

  button.addEventListener("click", () => {
    if (active) {
      pauseAudio();
      return;
    }
    playAudio();
  });

  gateButton.addEventListener("click", playAudio);

  document.addEventListener("pointerdown", () => {
    if (!active && selected && !gate.classList.contains("is-hidden")) {
      playAudio();
    }
  }, { once: true });

  updateUi("blocked");
  loadNextCandidate();
}());
