/**
 * storage.js - LocalStorage 読み書きラッパー
 * ============================================================
 * データの保存・読み込みをここに集約しています。
 * キー名は config.js の STORAGE_KEYS で管理しています。
 *
 * ★ PCを新しく買った場合:
 *   - exportData() でJSONファイルを書き出す
 *   - 新しいPCで importData(json) でJSONを読み込む
 * ============================================================
 */

const Storage = (() => {
  const K = () => window.CONFIG.STORAGE_KEYS;

  /* --- 基本 get/set ---------------------------------------- */
  function get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("[Storage] get error:", key, e);
      return null;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("[Storage] set error:", key, e);
    }
  }

  /* --- アルバム -------------------------------------------- */
  function getAlbums() {
    return get(K().ALBUMS) || [];
  }

  function saveAlbums(albums) {
    set(K().ALBUMS, albums);
  }

  /* --- ハート -------------------------------------------- */
  function getHearts() {
    return get(K().HEARTS) || [];
  }

  function toggleHeart(mediaId) {
    const hearts = getHearts();
    const idx = hearts.indexOf(mediaId);
    if (idx >= 0) {
      hearts.splice(idx, 1);
    } else {
      hearts.push(mediaId);
    }
    set(K().HEARTS, hearts);
    return idx < 0; // true = ハートON
  }

  function isHearted(mediaId) {
    return getHearts().includes(mediaId);
  }

  /* --- ユーザー設定 ---------------------------------------- */
  function getUserConfig() {
    return get(K().CONFIG) || {};
  }

  function saveUserConfig(cfg) {
    set(K().CONFIG, { ...getUserConfig(), ...cfg });
  }

  /* --- エクスポート / インポート --------------------------- */
  function exportData() {
    const data = {
      mv_albums: getAlbums(),
      mv_hearts: getHearts(),
      mv_config: getUserConfig(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "memory-viewer-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.mv_albums) set(K().ALBUMS, data.mv_albums);
      if (data.mv_hearts) set(K().HEARTS, data.mv_hearts);
      if (data.mv_config) set(K().CONFIG, data.mv_config);
      return true;
    } catch (e) {
      console.error("[Storage] import error:", e);
      return false;
    }
  }

  return {
    getAlbums, saveAlbums,
    getHearts, toggleHeart, isHearted,
    getUserConfig, saveUserConfig,
    exportData, importData,
  };
})();

window.Storage = Storage;
