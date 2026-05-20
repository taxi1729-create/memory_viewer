/**
 * kenBurns.js - 写真のKen Burnsアニメーション
 * ============================================================
 * 静止画を「少し動く映像」のように見せます。
 * 強度・速度は config.js の KB_* 変数で調整できます。
 * ============================================================
 */

const KenBurns = (() => {

  /** アニメーションのパターン（毎回ランダムに選択） */
  const PATTERNS = [
    // ズームイン + 右上へ微移動
    (s, tx, ty, d, e) =>
      `scale(1) translate(0,0) 0 / scale(${s}) translate(${tx}%,${-ty}%) ${d}ms ${e}`,
    // ズームイン + 左下へ微移動
    (s, tx, ty, d, e) =>
      `scale(1) translate(0,0) 0 / scale(${s}) translate(${-tx}%,${ty}%) ${d}ms ${e}`,
    // 中央ズームのみ
    (s, tx, ty, d, e) =>
      `scale(1) translate(0,0) 0 / scale(${s}) translate(0,0) ${d}ms ${e}`,
  ];

  /**
   * 指定のimg要素にKen Burnsアニメーションを適用する
   * @param {HTMLImageElement} imgEl
   */
  function apply(imgEl) {
    const { KB_SCALE, KB_TRANSLATE_X, KB_TRANSLATE_Y, KB_DURATION, KB_EASING } = window.CONFIG;

    // 既存のアニメーションをリセット
    imgEl.style.animation = "none";
    imgEl.style.transform = "scale(1) translate(0,0)";

    // CSS keyframesをアニメーション属性で直接制御
    const scale = KB_SCALE;
    const tx = KB_TRANSLATE_X;
    const ty = KB_TRANSLATE_Y;
    const duration = KB_DURATION;
    const easing = KB_EASING;

    // パターンをランダム選択
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

    // Web Animations APIで適用
    const anim = imgEl.animate(
      [
        { transform: "scale(1) translate(0,0)" },
        { transform: `scale(${scale}) translate(${tx}%, ${ty}%)` },
      ],
      {
        duration: duration,
        easing: easing,
        fill: "forwards",
        iterations: Infinity,
        direction: "alternate",
      }
    );

    // 参照を保持（停止用）
    imgEl._kbAnim = anim;
  }

  /**
   * アニメーションを停止する
   * @param {HTMLImageElement} imgEl
   */
  function stop(imgEl) {
    if (imgEl._kbAnim) {
      imgEl._kbAnim.cancel();
      imgEl._kbAnim = null;
    }
    imgEl.style.transform = "";
  }

  return { apply, stop };
})();

window.KenBurns = KenBurns;
