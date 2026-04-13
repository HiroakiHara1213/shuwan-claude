# フェーズ0-B: Web Analystによる自社内データ分析（Researcherと並列実行）

Researcherが外部リサーチ（市場・競合・口コミ）を行う間、**Web Analystが並列で自社内データを分析する**。
収集結果は `context/market/lp-analysis.md` と `context/reviews/review-web-analytics.md` に格納され、フェーズ3でCMOが統合分析する。

---

## 実行条件

- **Researcherと並列起動**（依存関係なし）
- フェーズ0-A（Gmail/Slackスキャン）が完了していること
- 両エージェントの完了後にフェーズ1に進む

---

## MCP接続状況（すべて即時利用可能）

| MCP | 接続状況 | 主要ツール |
|-----|---------|----------|
| Shopify MCP | **[即時]** 接続済み | `shopify_orders_summary` `shopify_funnel` `shopify_product_performance` |
| GA4 MCP | **[即時]** 接続済み | `ga4_shopify_funnel` `ga4_traffic_sources` `ga4_top_pages` |
| Clarity MCP | **[即時]** 接続済み | `query-analytics-dashboard` `list-session-recordings`（2026-04-13動作確認済み） |
| Google Sheets | **[即時]** 接続済み | `sheets_read`（PMAX: `1Qw41z2YXJSbTRSj0ohIFBHw9SQdrFmIzi24KyTVSuxU`） |
| Amazon SP-API | **[即時]** 接続済み | `amazon_get_orders` `amazon_get_finance_summary`（2026-04-02設定済み）|
| Klaviyo | [未接続] | 手動確認: klaviyo.com/dashboard |

> **GA4 MCPパラメータ注意（2026-04-13確認）**: 日付引数は `startDate` / `endDate`（キャメルケース）を使用すること。`start_date` / `end_date`（スネークケース）では `INVALID_ARGUMENT` エラーが発生する。
> **Clarity MCP注意**: `query-analytics-dashboard` を使用。`query`パラメータに自然言語で分析内容を指定。

---

## @web-analyst への指示

以下の順でデータを取得・分析し、`context/market/lp-analysis.md` と `context/reviews/review-web-analytics.md` を更新してください。

### 取得1: Shopify 当月売上・CVRファネル（思想①の核心データ）

```
shopify_orders_summary(startDate:"月初1日", endDate:"昨日")
shopify_funnel(startDate:"7daysAgo", endDate:"yesterday")
shopify_product_performance(startDate:"monthStart", endDate:"yesterday")
```

着地見込計算:
- 当月日数に対して本日時点の経過率を計算
- 現ペース × 月末までの残日数 = 着地見込

### 取得2: GA4 流入・ファネル分析（思想②の核心データ）

```
ga4_traffic_sources(site:"shopify", startDate:"7daysAgo", endDate:"yesterday")
ga4_shopify_funnel(startDate:"7daysAgo", endDate:"yesterday")
ga4_top_pages(site:"shopify", startDate:"7daysAgo", endDate:"yesterday")
ga4_shopify_landing_pages(startDate:"7daysAgo", endDate:"yesterday")
```

### 取得3: PMAX検索語句・広告ROAS

```
sheets_read(spreadsheetId:"1Qw41z2YXJSbTRSj0ohIFBHw9SQdrFmIzi24KyTVSuxU", range:"A:J", limit:200)
sheets_read(spreadsheetId:"1JPNyYahysu5ROH6VejqeaamdAaR5u-ILYtXVEUIuCaY", range:"A:Z", limit:200)
```

### 取得4: Clarity ヒートマップ・行動データ

Clarity MCPで以下を取得:
- プロジェクト: tjrp4kwzyu
- スクロール深度・クリックヒートマップ・デッドクリック
- 前回データ（スクロール44.66%）からの変化に注目

### 出力

1. `context/market/lp-analysis.md` に `## 【YYYY-MM-DD Web Analyst分析】` で追記
2. `context/reviews/review-web-analytics.md` に統合サマリー追記
   - 思想①: Shopify当月着地見込
   - 思想②: CVR・流入の示唆
   - CMOへの提言（内部データが示す最優先改善箇所 + Researcherデータとの照合仮説）

---

## レビュー完了条件

| 状態 | 判断 |
|------|------|
| Shopify・GA4・Sheets取得済み + lp-analysis.md更新済み | 完了 |
| MCP接続エラーが発生した場合 | エラー内容を記録し、可能な範囲で完了 |
| Amazon・Klaviyoが未取得でも | 完了（[未接続]と明記すれば可） |

> **重要**: フェーズ0-BとResearcherフェーズ0-C（外部特化）が**両方完了**した後に、フェーズ1に進むこと。

## タイムアウト防止ルール（2026-04-10 CTO追加）

- **各MCPは1回の呼び出しで完了**とする。エラー・タイムアウトが発生した場合は「未取得」と記録して即座に次ステップへ進む
- **合計実行時間が20分を超えた場合**は強制完了とみなし、取得済みデータのみで分析・出力を行う
- Sheetsデータが取得できなかった場合でも他データで分析を完了させること（PMAX欠損は「データ未更新のため欠損」と明記）
- **ファイル書き込みは Bash `cat >>` を優先する**（Edit/Writeが権限エラーの場合の代替手段）
