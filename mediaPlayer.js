/**
 * mediaPlayer.js - メディア再生制御
 * ============================================================
 * 動画（video要素）と写真（img要素）の表示・制御を担当します。
 * ============================================================
 */

const MediaPlayer = (() => {

  /**
   * 動画要素を作成して返す
   * @param {Object} mediaData - { src, location, date, id }
   * @returns {HTMLElement} スライド要素
   */
  function createVideoSlide(mediaData) {
    const slide = document.createElement("div");
    slide.className = "slide slide--video";
    slide.dataset.mediaId = mediaData.id;

    const video = document.createElement("video");
    video.src = mediaData.src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;           // iOS自動再生に必須
    video.playsInline = true;     // iOS全画面回避
    video.preload = "metadata";

    // ★ タップで再生/停止
    const iconEl = document.createElement("div");
    iconEl.className = "play-icon";
    iconEl.textContent = "▶";

    video.addEventListener("click", () => _togglePlay(video, iconEl));

    // シークバー
    const seekWrap = document.createElement("div");
    seekWrap.className = "seekbar-wrap";
    const seekTrack = document.createElement("div");
    seekTrack.className = "seekbar-track";
    const seekProgress = document.createElement("div");
    seekProgress.className = "seekbar-progress";
    seekTrack.appendChild(seekProgress);
    seekWrap.appendChild(seekTrack);

    // シークバー更新
    video.addEventListener("timeupdate", () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      seekProgress.style.width = pct + "%";
    });

    // シークバードラッグ
    _bindSeekDrag(seekTrack, video);

    slide.appendChild(video);
    slide.appendChild(iconEl);
    slide.appendChild(seekWrap);
    _appendMeta(slide, mediaData);

    return slide;
  }

  /**
   * 写真要素を作成して返す
   * @param {Object} mediaData - { src, location, date, id }
   * @returns {HTMLElement} スライド要素
   */
  function createPhotoSlide(mediaData) {
    const slide = document.createElement("div");
    slide.className = "slide slide--photo";
    slide.dataset.mediaId = mediaData.id;

    const img = document.createElement("img");
    img.src = mediaData.src;
    img.alt = mediaData.date || "";
    img.draggable = false;

    // Ken Burnsはフィードがスライドを表示したタイミングで適用（feed.js から呼ぶ）
    slide.appendChild(img);
    _appendMeta(slide, mediaData);

    return slide;
  }

  /** 再生/停止トグル */
  function _togglePlay(video, iconEl) {
    const { ICON_DISPLAY_DURATION } = window.CONFIG;
    if (video.paused) {
      video.play();
      _showIcon(iconEl, "▶", ICON_DISPLAY_DURATION);
    } else {
      video.pause();
      _showIcon(iconEl, "⏸", ICON_DISPLAY_DURATION);
    }
  }

  /** アイコンを一時表示 */
  function _showIcon(iconEl, symbol, duration) {
    iconEl.textContent = symbol;
    iconEl.classList.add("play-icon--visible");
    clearTimeout(iconEl._timer);
    iconEl._timer = setTimeout(() => {
      iconEl.classList.remove("play-icon--visible");
    }, duration);
  }

  /** シークバーのドラッグ操作 */
  function _bindSeekDrag(trackEl, video) {
    const seek = (e) => {
      const rect = trackEl.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      if (video.duration) {
        video.currentTime = pct * video.duration;
      }
    };

    trackEl.addEventListener("mousedown", (e) => {
      seek(e);
      const onMove = (ev) => seek(ev);
      const onUp   = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

    trackEl.addEventListener("touchstart", seek, { passive: true });
    trackEl.addEventListener("touchmove",  seek, { passive: true });
  }

  /** 撮影場所・日付のメタ情報 */
  function _appendMeta(slide, mediaData) {
    const { SHOW_LOCATION, SHOW_DATE } = window.CONFIG;
    if (!SHOW_LOCATION && !SHOW_DATE) return;

    const meta = document.createElement("div");
    meta.className = "slide-meta";

    if (SHOW_LOCATION && mediaData.location) {
      const loc = document.createElement("p");
      loc.className = "slide-meta__location";
      loc.textContent = mediaData.location;
      meta.appendChild(loc);
    }
    if (SHOW_DATE && mediaData.date) {
      const date = document.createElement("p");
      date.className = "slide-meta__date";
      date.textContent = mediaData.date;
      meta.appendChild(date);
    }
    slide.appendChild(meta);
  }

  /**
   * スライドが画面に表示されたときに呼ぶ
   * 動画→autoplay、写真→Ken Burns開始
   */
  function onSlideEnter(slideEl) {
    const video = slideEl.querySelector("video");
    const img   = slideEl.querySelector("img");
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {}); // iOS Safari は例外を無視
    }
    if (img) {
      window.KenBurns.apply(img);
    }
  }

  /**
   * スライドが画面から外れたときに呼ぶ
   */
  function onSlideLeave(slideEl) {
    const video = slideEl.querySelector("video");
    const img   = slideEl.querySelector("img");
    if (video) video.pause();
    if (img)   window.KenBurns.stop(img);
  }

  return { createVideoSlide, createPhotoSlide, onSlideEnter, onSlideLeave };
})();

window.MediaPlayer = MediaPlayer;
