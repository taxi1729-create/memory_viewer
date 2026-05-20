/**
 * feed.js - 縦スワイプフィード制御
 * ============================================================
 * スワイプ検知 → スライド遷移 → MediaPlayer呼び出し
 * スワイプ感度・遷移速度は config.js で調整できます。
 * ============================================================
 */

const Feed = (() => {
  let container;       // .feed-container
  let slides = [];     // スライド要素の配列
  let currentIndex = 0;
  let startY = 0;
  let isDragging = false;

  /**
   * フィードを初期化する
   * @param {HTMLElement} containerEl
   * @param {Array} mediaList - { id, type, src, location, date }[]
   */
  function init(containerEl, mediaList) {
    container = containerEl;
    slides = [];
    container.innerHTML = "";
    currentIndex = 0;

    // スライドを生成
    mediaList.forEach((media) => {
      let slide;
      if (media.type === "video") {
        slide = window.MediaPlayer.createVideoSlide(media);
      } else {
        slide = window.MediaPlayer.createPhotoSlide(media);
      }
      _appendHeartButton(slide, media.id);
      container.appendChild(slide);
      slides.push(slide);
    });

    // 最初のスライドを表示
    _goTo(0, false);

    // タッチ操作をバインド
    _bindTouch();

    // マウスホイール（PC確認用）
    _bindWheel();
  }

  /** ハートボタンをスライドに追加 */
  function _appendHeartButton(slide, mediaId) {
    const btn = document.createElement("button");
    btn.className = "heart-btn";
    btn.setAttribute("aria-label", "ハート");
    btn.innerHTML = "♡";

    const hearted = window.Storage.isHearted(mediaId);
    if (hearted) _setHeartActive(btn, true);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isNowOn = window.Storage.toggleHeart(mediaId);
      _setHeartActive(btn, isNowOn);
      _animateHeart(btn);
    });

    slide.appendChild(btn);
  }

  function _setHeartActive(btn, on) {
    btn.innerHTML = on ? "♥" : "♡";
    btn.classList.toggle("heart-btn--active", on);
  }

  function _animateHeart(btn) {
    const { HEART_ANIM_DURATION } = window.CONFIG;
    btn.style.transition = `transform ${HEART_ANIM_DURATION}ms ease`;
    btn.style.transform = "scale(1.35)";
    setTimeout(() => { btn.style.transform = "scale(1)"; }, HEART_ANIM_DURATION);
  }

  /** 指定インデックスへ移動 */
  function _goTo(index, animate = true) {
    if (index < 0 || index >= slides.length) return;

    const prev = slides[currentIndex];
    const next = slides[index];

    if (animate) {
      const { TRANSITION_DURATION, TRANSITION_EASING } = window.CONFIG;
      container.style.transition = `transform ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`;
    } else {
      container.style.transition = "none";
    }

    container.style.transform = `translateY(-${index * 100}dvh)`;

    if (prev && prev !== next) window.MediaPlayer.onSlideLeave(prev);
    currentIndex = index;
    window.MediaPlayer.onSlideEnter(next);
  }

  /** タッチ操作バインド */
  function _bindTouch() {
    container.parentElement.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    container.parentElement.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startY - e.changedTouches[0].clientY;
      const { SWIPE_THRESHOLD } = window.CONFIG;

      if (diff > SWIPE_THRESHOLD) {
        _goTo(currentIndex + 1); // 上スワイプ → 次へ
      } else if (diff < -SWIPE_THRESHOLD) {
        _goTo(currentIndex - 1); // 下スワイプ → 前へ
      }
    }, { passive: true });
  }

  /** マウスホイール（PC確認用） */
  function _bindWheel() {
    let wheelTimer;
    container.parentElement.addEventListener("wheel", (e) => {
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        if (e.deltaY > 0) {
          _goTo(currentIndex + 1);
        } else {
          _goTo(currentIndex - 1);
        }
      }, 80);
    }, { passive: true });
  }

  return { init };
})();

window.Feed = Feed;
