# メモリビュアー 仕様書
> GitHub Pages で公開するWebアプリ。iOSのSafariでスマホ操作可能にすることで、最終的なiOSネイティブアプリ開発の「設計・UX検証ステップ」として機能する。

---

## 0. プロジェクト概要

| 項目 | 内容 |
|------|------|
| タイトル | メモリビュアー |
| ロゴ | `title_logo.jpg`（index.htmlと同階層に配置） |
| 公開手段 | GitHub Pages（`gh-pages`ブランチ or `main`の`/docs`フォルダ） |
| 動作環境 | iOS Safari / Android Chrome / PC ブラウザ |
| データ保存先 | ブラウザのLocalStorage（詳細は §5 参照） |
| APIキー | Google AI (Gemini) を使用する場合のみ設定（§6 参照） |

---

## 1. ディレクトリ構成

```
memory-viewer/                ← リポジトリルート
├── index.html                ← メインエントリ
├── title_logo.jpg            ← ロゴ画像（自前で配置）
├── css/
│   └── style.css             ← 全スタイル
├── js/
│   ├── app.js                ← アプリ初期化・ルーティング
│   ├── feed.js               ← 縦スワイプフィード制御
│   ├── mediaPlayer.js        ← 動画・写真の再生制御
│   ├── kenBurns.js           ← Ken Burnsアニメーション
│   ├── storage.js            ← LocalStorage 読み書きラッパー
│   └── config.js             ← ★微調整箇所をまとめたファイル
├── assets/
│   └── sample/               ← サンプルメディア（動作確認用）
│       ├── sample1.jpg
│       ├── sample2.jpg
│       └── sample3.mp4
└── README.md
```

---

## 2. 画面構成・UIレイアウト

### 2-1. フィード画面（メイン）

```
┌──────────────────────────────┐  ← 全画面（100dvh）
│                              │
│    [フルスクリーン動画/写真]    │
│                              │
│  ┌─────────────────────────┐ │
│  │ Tokyo, Japan            │ │  ← 左下：撮影場所
│  │ 2026.05.18              │ │  ← 左下：撮影日
│  └─────────────────────────┘ │
│  ────────[seekbar]────────  ♡ │  ← 下部：シークバー、右下：ハート
└──────────────────────────────┘
```

### 2-2. 設定・アルバム選択画面

- 右上のメニューアイコンからアクセス
- アルバムリストを表示（LocalStorageに保存されたメディアパス一覧）
- アルバム追加ボタン

---

## 3. 機能仕様

### 3-1. 縦スワイプUI

| 項目 | 仕様 |
|------|------|
| 遷移方式 | CSS `transform: translateY` + touch event |
| スワイプ検知 | touchstart / touchend の差分 ≥ 50px |
| アニメーション | `transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| 自動送り | **なし** |
| ループ | 現在コンテンツをループ再生 |
| ★微調整箇所 | `config.js` → `SWIPE_THRESHOLD`、`TRANSITION_DURATION` |

### 3-2. 動画再生

| 項目 | 仕様 |
|------|------|
| 自動再生 | あり（muted必須 / iOS制約） |
| ループ | `loop` 属性付与 |
| タップ | 再生↔停止トグル |
| アイコン表示 | 一時停止時：▐▐、再開時：▶ を中央に0.8秒表示 |
| 対応形式 | mp4 / mov / webm |
| ★微調整箇所 | `config.js` → `ICON_DISPLAY_DURATION` |

### 3-3. 写真アニメーション（Ken Burns）

| 項目 | 仕様 |
|------|------|
| 効果 | ゆっくりズーム + 微横移動（パララックス感） |
| 強度 | 控えめ（scale 1.0 → 1.08、translateX ±1%） |
| 時間 | 8秒でワンサイクル |
| ★微調整箇所 | `config.js` → `KB_SCALE`、`KB_TRANSLATE_X`、`KB_DURATION` |

### 3-4. ハートボタン

| 項目 | 仕様 |
|------|------|
| 位置 | 右下（シークバーの右端） |
| 状態 | ON / OFF トグル |
| アニメーション | scale 1.0 → 1.3 → 1.0（0.3秒、控えめ） |
| 保存 | LocalStorageにメディアIDをキーとして保存 |
| ★微調整箇所 | `config.js` → `HEART_ANIM_DURATION` |

### 3-5. シークバー（動画のみ）

| 項目 | 仕様 |
|------|------|
| 位置 | 画面下部（ハートの左） |
| デザイン | 高さ2px、細いミニマル線 |
| 操作 | ドラッグでシーク |
| 写真時 | 非表示 |

### 3-6. 撮影情報表示

| 項目 | 仕様 |
|------|------|
| 位置 | 左下 |
| 内容 | 撮影場所（都市名, 国名） / 撮影日（YYYY.MM.DD） |
| データ取得 | EXIFデータ（jpeg-exif.js ライブラリ使用）or メタデータ手動入力 |
| ★微調整箇所 | `config.js` → `SHOW_LOCATION`、`SHOW_DATE` |

---

## 4. デザイン仕様

| 要素 | 値 |
|------|-----|
| 背景 | `#000000` |
| 文字色 | `#FFFFFF` / 不透明度 0.75〜0.9 |
| フォント | `'Hiragino Kaku Gothic ProN', 'Helvetica Neue', sans-serif` |
| アニメーション速度 | 全体的にゆっくり（0.3〜0.8秒） |
| UIオーバーレイ | `backdrop-filter: blur(8px)` + 半透明黒 |
| ★微調整箇所 | `css/style.css` の `:root` CSS変数ブロック |

### CSS変数（微調整の入口）

```css
/* css/style.css 冒頭の :root ブロック ★ここを編集 */
:root {
  --color-bg: #000;
  --color-text: rgba(255,255,255,0.85);
  --color-text-sub: rgba(255,255,255,0.55);
  --color-heart-active: #ff6b8a;
  --color-seekbar: rgba(255,255,255,0.6);
  --color-seekbar-progress: #ffffff;
  --font-main: 'Hiragino Kaku Gothic ProN', 'Helvetica Neue', sans-serif;
  --transition-feed: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --overlay-blur: blur(8px);
}
```

---

## 5. LocalStorageデータ設計

> ⚠️ **PCを新しく購入した場合の注意**
> LocalStorageはブラウザに紐づいているため、PCを変えると引き継げません。
> `設定画面 → エクスポート` ボタンでJSONファイルとして書き出すことができます。
> 新しいPCでは `設定画面 → インポート` でJSONを読み込んでください。

### キー一覧

| LocalStorageキー | 型 | 内容 |
|------------------|----|------|
| `mv_albums` | JSON配列 | 登録アルバム情報（名前・サムネ・メディアリスト） |
| `mv_hearts` | JSON配列 | ハートをつけたメディアIDの一覧 |
| `mv_config` | JSONオブジェクト | ユーザー設定（アルバム選択状態等） |

### mv_albums のスキーマ例

```json
[
  {
    "id": "album_001",
    "name": "2025年 京都旅行",
    "media": [
      {
        "id": "media_001",
        "type": "photo",
        "src": "assets/sample/sample1.jpg",
        "location": "Kyoto, Japan",
        "date": "2025.11.03"
      },
      {
        "id": "media_002",
        "type": "video",
        "src": "assets/sample/sample3.mp4",
        "location": "Nara, Japan",
        "date": "2025.11.04"
      }
    ]
  }
]
```

> **ローカルパスについて**
> GitHub Pages上では、メディアファイルはリポジトリ内の `assets/sample/` に置くか、
> 外部URL（Google DriveのDirect Link等）を指定してください。
> ローカルPCのファイルパス（例：`/Users/you/Pictures/...`）は**ブラウザのセキュリティ制限で読み込めません**。

---

## 6. Google AI (Gemini) API設定

> ※ 現バージョンではAPIは未使用。将来的に「撮影場所の自動推定」等に使用する想定。
> 使用する場合は以下を設定してください。

```javascript
// js/config.js 内の ★API設定ブロック
const API_CONFIG = {
  // ★ Google AI Studio から取得したAPIキーをここに記入
  GEMINI_API_KEY: "YOUR_GOOGLE_AI_API_KEY_HERE",
  GEMINI_MODEL: "gemini-1.5-flash",
  // 機能のON/OFF
  USE_AI_LOCATION: false, // trueにすると写真から場所を自動推定
};
```

---

## 7. GitHub Pages 公開手順

```bash
# 1. リポジトリ作成（GitHub上でNew Repository）
#    リポジトリ名: memory-viewer

# 2. ローカルにクローン
git clone https://github.com/あなたのユーザー名/memory-viewer.git
cd memory-viewer

# 3. ファイルを配置（本仕様書のディレクトリ構成通り）
#    title_logo.jpg を index.html と同階層に配置

# 4. コミット & プッシュ
git add .
git commit -m "Initial commit"
git push origin main

# 5. GitHub Settings → Pages → Source を "main / root" に設定

# 6. 数分後に以下のURLでアクセス可能になる
#    https://あなたのユーザー名.github.io/memory-viewer/
```

---

## 8. 微調整箇所まとめ（クイックリファレンス）

| 調整したいもの | ファイル | 変数/プロパティ |
|----------------|----------|----------------|
| スワイプ感度 | `js/config.js` | `SWIPE_THRESHOLD` |
| フィード遷移速度 | `js/config.js` | `TRANSITION_DURATION` |
| Ken Burns強度 | `js/config.js` | `KB_SCALE`, `KB_TRANSLATE_X` |
| Ken Burns速度 | `js/config.js` | `KB_DURATION` |
| 一時停止アイコン表示時間 | `js/config.js` | `ICON_DISPLAY_DURATION` |
| ハートアニメ速度 | `js/config.js` | `HEART_ANIM_DURATION` |
| 文字色・背景色 | `css/style.css` | `:root` CSS変数 |
| フォント | `css/style.css` | `--font-main` |
| Gemini APIキー | `js/config.js` | `API_CONFIG.GEMINI_API_KEY` |
| 撮影情報の表示ON/OFF | `js/config.js` | `SHOW_LOCATION`, `SHOW_DATE` |

---

*以上。スクリプトは `index.html` / `css/style.css` / `js/*.js` として別途出力します。*
