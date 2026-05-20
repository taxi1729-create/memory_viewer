# メモリビュアー

> 思い出を静かに味わうWebビューア。GitHub Pagesで公開し、iOSのSafariからスマホ操作可能。

---

## セットアップ

### 1. title_logo.jpg を配置

```
memory-viewer/
└── title_logo.jpg   ← ここに配置（index.htmlと同じ階層）
```

### 2. サンプル画像・動画を配置（動作確認用）

```
memory-viewer/
└── assets/
    └── sample/
        ├── sample1.jpg
        ├── sample2.jpg
        └── sample3.mp4
```

### 3. GitHub Pagesで公開

1. GitHubでリポジトリを作成（`memory-viewer`）
2. このフォルダを `git push`
3. Settings → Pages → Source を **main / (root)** に設定
4. 数分後に `https://あなたのユーザー名.github.io/memory-viewer/` で公開

---

## 微調整箇所

| 調整したいもの | ファイル | 変数名 |
|----------------|----------|--------|
| スワイプ感度 | `js/config.js` | `SWIPE_THRESHOLD` |
| フィード遷移速度 | `js/config.js` | `TRANSITION_DURATION` |
| Ken Burns強度 | `js/config.js` | `KB_SCALE`, `KB_TRANSLATE_X` |
| 一時停止アイコン表示時間 | `js/config.js` | `ICON_DISPLAY_DURATION` |
| 色・フォント | `css/style.css` | `:root` CSS変数 |
| Gemini APIキー | `js/config.js` | `API_CONFIG.GEMINI_API_KEY` |

---

## データ保存について

データはブラウザの **LocalStorage** に保存されます。

- **PCを買い替えた場合**：設定パネル → 「データをエクスポート」でJSONを保存し、新しいPCで「インポート」してください。
- LocalStorageキー名は `js/config.js` の `STORAGE_KEYS` で管理しています。

---

## 将来的な目標

このWebアプリはiOSネイティブアプリ（SwiftUI）開発前の  
**UX検証・仕様確定ステップ**として機能します。
