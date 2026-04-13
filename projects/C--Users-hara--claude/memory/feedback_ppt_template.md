---
name: PPT出力は必ず雛形を使用
description: PPTXを生成する際は必ずユーザー指定の雛形デザイン（白背景・Calibri・下部カラーバー・LAYOUT_WIDE）を使うこと
type: feedback
---

PPTを出力する際は、必ず `C:\Users\hara\OneDrive\デスクトップ\雛形.pptx` のデザインを使うこと。

**Why:** ユーザーがブランド統一のため指定。初回は黒背景のSHUWANサイト風で作ったが、雛形は白背景だった。雛形を無視してデザインを勝手に決めてはいけない。

**How to apply:** PptxGenJSで生成する場合は以下のスタイルを適用する：
- 背景: 白（FFFFFF）
- フォント: Calibri（全体）
- スライドサイズ: LAYOUT_WIDE（13.33 × 7.5インチ）
- テキスト色: ダーク（222222 / 333333）
- 下部カラーバー: ピンク(CD2ECB) → 紫(E75EE2) → 赤(E44054) → オレンジ(F65445) → オレンジ(F6A623) → イエロー(F9CB28) のグラデーション
- テンプレートファイル: `C:\Users\hara\OneDrive\デスクトップ\雛形.pptx`
- 参考実装: `shuwan_competitor_v2.js` の `addBottomBars()` と `addHeader()` ヘルパー関数
