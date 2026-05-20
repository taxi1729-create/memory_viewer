/**
 * app.js - アプリ初期化・ルーティング
 * ============================================================
 * DOM読み込み後に呼ばれ、アルバムデータを取得してFeedを起動します。
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  // ----- サンプルデータ（初回起動時のデフォルト） -----
  const SAMPLE_MEDIA = [
    {
      id: "sample_001",
      type: "photo",
      src: "assets/sample/sample1.jpg",
      location: "Tokyo, Japan",
      date: "2026.05.18",
    },
    {
      id: "sample_002",
      type: "photo",
      src: "assets/sample/sample2.jpg",
      location: "Kyoto, Japan",
      date: "2025.11.03",
    },
    {
      id: "sample_003",
      type: "video",
      src: "assets/sample/sample3.mp4",
      location: "Nara, Japan",
      date: "2025.11.04",
    },
  ];

  // ----- アルバム取得 -----
  const albums = Storage.getAlbums();
  let mediaList;

  if (albums.length === 0) {
    // 初回：サンプルデータを使用
    mediaList = SAMPLE_MEDIA;
  } else {
    // 保存済みアルバムの最初のアルバムを表示
    mediaList = albums[0].media || SAMPLE_MEDIA;
  }

  // ----- フィード初期化 -----
  const feedContainer = document.getElementById("feed-container");
  Feed.init(feedContainer, mediaList);

  // ----- メニューボタン -----
  const menuBtn = document.getElementById("menu-btn");
  const settingsPanel = document.getElementById("settings-panel");

  menuBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("settings-panel--open");
  });

  // ----- 設定パネル：エクスポート -----
  document.getElementById("btn-export").addEventListener("click", () => {
    Storage.exportData();
  });

  // ----- 設定パネル：インポート -----
  const importInput = document.getElementById("import-input");
  document.getElementById("btn-import").addEventListener("click", () => {
    importInput.click();
  });
  importInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = Storage.importData(ev.target.result);
      alert(ok ? "インポートしました。ページを再読み込みしてください。" : "インポートに失敗しました。");
    };
    reader.readAsText(file);
  });

});
