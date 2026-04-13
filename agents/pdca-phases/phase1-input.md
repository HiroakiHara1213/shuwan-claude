# フェーズ1: インプット読み込み（全エージェント共通）

以下のファイルを読み込み、現状を把握する。

## メモ・マスターデータ（`context/memos/` 全ファイル）
Globで一覧取得してからReadで全読み込み：
1. `shuwan-master-input.md` — 全情報マスター
2. `notes.md` — ユーザーのメモ・最新の考え
3. `shuwan-sales-summary.md` — 販売実績
4. `SHUWAN_月次KPI活動計画_v3 (18).xlsx` — 月次KPI計画
5. `酒器の市場規模.xlsx` — 市場規模データ
6. `酒販店アタックリスト（３２店）.xlsx` — 酒販店リスト
7. `酒販店アプローチリスト（郵送込み）.xlsx` — 郵送アプローチ管理
8. `【共有】SHUWAN合宿(3月14日).pptx` — 合宿資料
9. `修正版_SHUWAN_A4チラシ.pdf` — チラシ最新版
10. `レベシェア実績/` サブフォルダ内の最新Excelファイル（新規ファイルがあれば `shuwan-sales-summary.md` に反映）

## 戦略ファイル（共通）
- `context/strategy/annual-plan.md` — 年間計画
- `context/strategy/kpi-targets.md` — KPI目標
- `context/strategy/monthly-kpi-tracking.md` — 月次KPI目標・実績・着地見込・GAP分析

## Researcher分析情報（フェーズ0-C: 外部特化）
- `context/market/market-trends.md` — 市場トレンド・BtoB売上実績・Amazonセラーセントラル
- `context/market/competitors.md` — 競合動向・ランキング変動・新商品
- `context/market/reviews-wom.md` — 口コミ・レビュー・SNS動向

## Web Analyst分析情報（フェーズ0-B: 内部データ特化・Researcherと並列実行）
- `context/market/lp-analysis.md` — Shopify売上・CVRファネル・GA4・PMAX・Clarity分析
- `context/reviews/review-web-analytics.md` — Web Analyst統合サマリー（CMOへの提言含む）

> **注意**: `context/memos/` に新しいファイルが追加された場合、Globで自動検出されるため手順変更不要。

## Notion読み込み（MCP: notion）

> **2026-04-10追加**: Notion MCPは接続済み。データベース「日次PDCAログ」にPDCAレコードが蓄積される。

Notionデータベース（ID: `33df339e-9adb-81a9-86d6-cfaa611c3ddf`）から前日のレコードと未完了タスクを取得する。

1. `API-query-data-source` でデータベースをクエリ：
   - フィルタ: 直近3日間のレコード（日付降順）
   - 未完了ステータスのレコードを優先取得
2. 取得した情報を以下に活用：
   - 前日のCheck結果（KPI進捗・チャンス/課題・要対応事項）を今日のPlanに反映
   - 「未完了」ステータスのレコードから未着手タスクを引き継ぎ
   - 過去の活動修正提案が実行されたか確認
3. 前日のレコードが存在しない場合は「Notionログなし（初回 or 未実行）」と記録して続行

## Gmail読み込み（MCP: gmail）

> **2026-04-02更新**: `hara@thinqlo.co.jp` 用Gmail MCPは接続済み（OAuth2完了）。
> Claude Code再起動後にツール名 `gmail_thinqlo_search` / `gmail_thinqlo_read` で利用可能。
> 議事録・打ち合わせメモは `hara@thinqlo.co.jp` で受信するため、両アカウントを並列で検索すること。

1. `gmail_search_messages` で以下のクエリを実行：
   - `"SHUWAN"` — SHUWAN関連の全メール
   - `"酒器"` — 酒器関連の問い合わせ・商談メール
   - `"レベシェア OR レヴェニューシェア"` — 売上報告メール
   - `"酒販店 OR 料飲店"` — BtoB営業関連メール
   検索範囲: 前回実行日以降（初回は過去7日間）

2. 重要なメールの内容を `gmail_read_message` で取得し、以下に分類・保存：
   - 売上・実績報告 → `context/memos/notes.md` に追記
   - 営業関連（商談・見積・発注） → `context/sales/customer-insights.md` に追記
   - マーケ関連（メディア・PR・広告） → `context/communication/integrated-plan.md` に追記
   - 市場情報（業界ニュース・競合情報） → `context/market/market-trends.md` に追記

## Slack読み込み（MCP: slack）
1. `slack_search_public` で以下のクエリを実行：
   - `"SHUWAN"` — SHUWAN関連の全投稿
   - `"酒器 売上"` — 売上・実績に関する投稿
   - `"酒販店 OR 料飲店 OR 営業"` — 営業関連の投稿
   検索範囲: 前回実行日以降（初回は過去7日間）

2. 関連するスレッドを `slack_read_thread` で詳細取得し、以下に分類・保存：
   - 売上・KPI関連 → `context/memos/notes.md` に追記
   - 営業報告・顧客フィードバック → `context/sales/customer-insights.md` に追記
   - マーケ施策・キャンペーン議論 → `context/communication/integrated-plan.md` に追記
   - 技術・EC関連 → `context/tech/claude-code-tips.md` に追記

3. 保存時のルール：
   - 日付・投稿者・チャンネル名を明記
   - 既存データは上書きせず「## YYYY-MM-DD Slack/Gmail取り込み」セクションとして追記
   - 個人情報や機密情報は要約のみ記録し、原文は保存しない
