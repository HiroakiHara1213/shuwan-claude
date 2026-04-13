# フェーズ0: Researcherによるデータ収集・分析（最初に単独実行）

全エージェントがインプットを読み込む**前に**、@researcher を単独で起動し、最新の市場・競合・口コミ・LP分析データを収集・分析させる。
収集結果は `context/market/*.md` に格納され、フェーズ1で全エージェントが読み込む。

---

## MCP接続状況と取得可否の凡例

- **[即時]** ... MCP接続済みで即取得可能
- **[手動]** ... MCPが未接続のため手動確認が必要（Amazon Seller Central / Klaviyo）

> **注意（2026-04-01更新）**: GA4・Shopify・Clarity・Google SheetsはすべてMCP接続済みのため、これらは**Web Analystエージェント（phase0-web-analyst.md）が担当**。Researcherは外部リサーチ（市場・競合・口コミ）に専念すること。

**レビュー完了条件（重要）:**
1. **[即時]** タグのソースを全て収集・記録すること
2. **[設定待]** および **[手動]** で取得できなかった項目は「未接続：[理由]」と明記すること
3. **MCP未接続を理由にレビュー自体を止めない。** 取得可能な範囲で完了し、不足箇所を明示すれば「レビュー：市場データ」は完了とする

---

## @researcher（データ収集・分析）

以下のファイルを最新情報で更新してください：
- context/market/market-trends.md — 日本酒市場・酒器市場の最新トレンド
- context/market/competitors.md — 競合動向の変化
- context/market/reviews-wom.md — SHUWAN関連の口コミ・レビュー
- context/market/lp-analysis.md — LP分析・ヒートマップ・滞在時間・エンゲージメント

WebSearchで最新情報を収集し、変化があれば日付付きで追記してください。
変化がなければ「YYYY-MM-DD: 前回調査から大きな変化なし」と記録。

---

## チェック対象ソース（分類付き）

### 日本酒メディア

1. **[即時]** SAKETIMES（https://jp.sake-times.com/） — 日本酒専門WEBメディア
2. **[即時]** たのしいお酒.jp（https://tanoshiiosake.jp/） — 酒類総合メディア
3. **[即時]** 日本酒造組合中央会（https://www.japansake.or.jp/） — 業界団体公式
4. **[即時]** Makuake新着（site:makuake.com 酒器） — クラウドファンディング競合動向
5. **[即時]** PR TIMES（site:prtimes.jp 日本酒 酒器） — プレスリリース

### ECモール・販売サイト

6. **[即時]** Amazon（site:amazon.co.jp 酒器 ぐい呑み） — 売れ筋・新着・レビュー
7. **[即時]** 楽天市場（site:rakuten.co.jp 酒器 ランキング） — デイリーランキング動向
8. **[即時]** Yahoo!ショッピング（site:shopping.yahoo.co.jp 酒器） — 競合出店状況
9. **[即時]** Makuake酒器カテゴリ（site:makuake.com 酒器 グラス） — CF競合プロジェクト

### メーカー通販・酒器専門サイト

10. **[即時]** 田島硝子（tajima-glass.com） — 江戸切子・富士山グラス新商品・価格動向
11. **[即時]** 廣田硝子（hirota-glass.co.jp） — 究極の日本酒グラス等・新商品
12. **[即時]** 能作（nousaku.co.jp） — 錫製酒器・コラボ情報
13. **[即時]** 木本硝子（kimotoglass.tokyo） — 日本酒用グラス・コラボ商品
14. **[即時]** RIEDEL日本公式（riedel.com/ja-jp） — 大吟醸グラス等・日本酒カテゴリ
15. **[即時]** 酒器プロスト（site:prost.co.jp 酒器） — 酒器専門店の品揃え・売れ筋
16. **[即時]** うつわのある暮らし（site:utsuwa-store.jp 酒器） — 作家モノ酒器トレンド
17. **[即時]** iichi/Creema（site:iichi.com OR site:creema.jp 酒器） — ハンドメイド酒器・作家参入

### SNS・動画プラットフォーム

18. **[即時]** Instagram — 「#酒器」「#日本酒グラス」「#SHUWAN」「#ぐい呑み」の投稿トレンド・UGC（WebSearchで代替）
19. **[即時]** Facebook — 「酒器」「日本酒 グラス」関連グループ・ページの反応（WebSearchで代替）
20. **[即時]** TikTok — 「#酒器」「#日本酒」「#japanesesake」のバズ動画・若年層トレンド（WebSearchで代替）
21. **[即時]** X (Twitter) — 「酒器」「日本酒グラス」「SHUWAN」のリアルタイム口コミ（WebSearchで代替）
22. **[即時]** YouTube — 「酒器 レビュー」「日本酒 グラス おすすめ」のレビュー・比較動画（WebSearchで代替）

特に注目すべきポイント：
- SHUWAN自体への言及・タグ付け
- 競合商品のUGC・レビュー動画
- 酒器関連のバズコンテンツ（購買意欲に影響する投稿）
- インフルエンサーの酒器紹介

### 自社EC・Amazon SHUWANレビュー

40. **[手動]** Shopify商品レビュー — 自社EC（shop.shuwan.jp）の商品レビュー・星評価・レビュー本文・投稿日
    - 未接続：Shopify Admin API アクセストークン未取得
    - 手動確認先: https://admin.shopify.com → 商品 → レビューアプリ
41. **[即時]** Amazon SHUWAN商品ページ — WebSearch/WebFetch（site:amazon.co.jp SHUWAN 酒器）でSHUWAN販売ページのカスタマーレビュー・評価・レビュー件数推移

特に注目すべきポイント：
- 新着レビューの内容（ポジティブ/ネガティブの傾向）
- 星評価の変動（平均評価の推移）
- 具体的な不満点・改善要望（商品改善・LP改善のヒント）
- 購入者の利用シーン・ギフト利用率（マーケ訴求ポイントの発見）
- Amazon vs 自社ECのレビュー傾向の違い

### Amazonセラーセントラル SHUWAN売上・CVR分析

42. **[手動]** セラーセントラル ビジネスレポート — ASIN別セッション数・ページビュー・ユニットセッション率（CVR）・注文商品点数・注文商品売上額・日付別売上トレンド・前週比・前月比
    - 未接続：Amazon SP-API 開発者登録・審査が必要（工数大）
    - 手動確認先: https://sellercentral.amazon.co.jp → レポート → ビジネスレポート
43. **[手動]** セラーセントラル 広告レポート — Amazon広告キャンペーンの広告費・インプレッション・クリック数・ACOS・ROAS・検索語レポート
    - 未接続：同上
44. **[手動]** セラーセントラル レビュー管理 — SHUWAN商品の新着レビュー・星評価推移・レビュー本文
    - 未接続：同上（Amazon公開ページはWebSearchで代替可能）

特に注目すべきポイント：
- CVR（ユニットセッション率）の変動
- セッション数の増減
- おすすめ出品の割合（Buy Box取得率）
- 広告ACOS/ROASの変化
- 新着レビューの内容・星評価

### Amazon酒器カテゴリ全体分析

45. **[即時]** Amazon酒器カテゴリ売れ筋ランキング — 上位商品・価格帯・レビュー数・評価（WebFetch or WebSearch）
46. **[即時]** Amazon酒器カテゴリ口コミ分析 — 売れ筋上位商品のレビュー傾向（WebFetch）
47. **[即時]** Amazon酒器カテゴリ キーワード分析 — サジェスト・関連キーワードの変化（WebSearch）
48. **[即時]** Amazon酒器カテゴリ 広告・スポンサー分析 — スポンサープロダクト広告の出稿状況（WebFetch）

### 自社EC Google広告（PMAX・リスティング）投資効果分析

49. **[即時]** Google広告管理画面（ads.google.com） — WebFetchでキャンペーン別パフォーマンス確認（費用・クリック・CTR・CPC・CV・CPA・ROAS）
50. **[即時]** PMAX検索語句レポート（Google Sheets MCP）: ← 2026-03-30接続完了
    ```
    sheets_read(
      spreadsheetId: "1Qw41z2YXJSbTRSj0ohIFBHw9SQdrFmIzi24KyTVSuxU",
      range: "A:J",
      limit: 200
    )
    ```
    取得項目: 検索語句・マッチタイプ・クリック数・表示回数・CTR・CPC・コスト・CV・CVR・CPA
    ※ シート名は「検索語句レポート」（日本語シート名はrange指定不要）
    - 接続済み（2026-03-30）: shuwan-ga4-reader@fleet-tensor-491503-m3.iam.gserviceaccount.com
51. **[即時]** マーケティングKPI管理表（Google Sheets MCP）: ← 2026-03-30接続完了
    ```
    sheets_read(
      spreadsheetId: "1JPNyYahysu5ROH6VejqeaamdAaR5u-ILYtXVEUIuCaY",
      range: "A:Z",
      limit: 200
    )
    ```
    - 接続済み（2026-03-30）: shuwan-ga4-reader@fleet-tensor-491503-m3.iam.gserviceaccount.com

### 検索ボリューム・キーワードトレンド

23. **[即時]** Googleトレンド — 「酒器」「日本酒 グラス」「ぐい呑み」の検索ボリューム推移（WebFetch: https://trends.google.co.jp）
24. **[即時]** Ubersuggest — 「酒器」「日本酒グラス」の月間検索数・競合度（WebFetch: https://app.neilpatel.com/ja/ubersuggest）
25. **[即時]** ラッコキーワード — 「酒器」「日本酒 グラス」のサジェストKW・共起語（WebFetch: https://related-keywords.com）
26. **[即時]** Amazon検索トレンド — 「酒器」のサジェスト変化・購買意図KW（WebFetch）
27. **[即時]** 楽天検索キーワードランキング — 酒器関連の人気検索ワード変動（WebSearch）

### 自社アクセス解析 GA4

**⚠️ GA4-Shopify連携 2026-03-30完了確認済み（Sessions:7/Events:127/リアルタイム2人）**
- プロパティID: 452176286（matsukubo@shuwan.jpアカウント）
- 4/1以降から本格的なデータ蓄積・分析が可能

#### SHUWAN統合サイト (プロパティID: 512073550)

28. **[設定待]** ga4_top_pages（7daysAgo〜yesterday）— GA4 MCP未接続時はChrome MCP経由で取得
29. **[設定待]** ga4_traffic_sources（7daysAgo〜yesterday）— GA4 MCP未接続時はChrome MCP経由で取得
30. **[設定待]** ga4_user_demographics（7daysAgo〜yesterday, device）— GA4 MCP未接続時はChrome MCP経由で取得
31. **[設定待]** ga4_report（前週比）— GA4 MCP未接続時はChrome MCP経由で取得

#### Shopify商品サイト (プロパティID: 452176286) — 以下4項目を毎日必須で取得

**[設定待]** GA4 MCP接続済みの場合:
```
ga4_top_pages(site:"shopify", startDate:"7daysAgo", endDate:"yesterday")
ga4_traffic_sources(site:"shopify", startDate:"7daysAgo", endDate:"yesterday")
ga4_shopify_funnel(startDate:"7daysAgo", endDate:"yesterday")
ga4_report(
  site:"shopify",
  metrics:["transactions","purchaseRevenue","sessionConversionRate"],
  startDate:"monthStart",
  endDate:"yesterday"
)
```

**[即時] GA4 MCP未接続時（現状）— Chrome MCPによるブラウザ操作で取得:**

```
手順1: Chrome MCPでブラウザを起動し、以下URLにアクセス
       https://analytics.google.com/analytics/web/?authuser=1#/p452176286/reports/intelligenthome
       ※ matsukubo@shuwan.jpアカウント（authuser=1）でログイン済みであること

手順2: プロパティ「Shopify商品サイト」(452176286) のホーム画面から以下KPIを読み取る
       - セッション数（過去7日）
       - ユーザー数（過去7日）
       - エンゲージメント率
       - コンバージョン数・CVR（設定済みの場合）

手順3: ページ別レポートへ移動して確認
       https://analytics.google.com/analytics/web/?authuser=1#/p452176286/reports/explorer?params=_u..nav%3Dmaui&ruid=explorer&r=all-pages-and-screens&collectionId=business-objectives
       - TOP（shop.shuwan.jp/）のPV・ユニークユーザー数
       - 商品ページ（/products/*）のPV・ユニークユーザー数・平均滞在時間
       - カートページ（/cart）のPV・直帰率

手順4: 流入元レポートへ移動して確認
       https://analytics.google.com/analytics/web/?authuser=1#/p452176286/reports/acquisition-overview
       - Google（organic/paid）からのセッション数・CV率
       - SNS（Instagram/Twitter/TikTok等）からのセッション数
       - 直接流入（direct）のセッション数

手順5: 取得した値をlp-analysis.mdおよびmonthly-kpi-tracking.mdに手動記録
```

**⚠️ Chrome MCPもセッションが切れている場合:**
1. Chrome MCPで https://accounts.google.com にアクセスしmatsukubo@shuwan.jpでログイン
2. ログイン後に上記手順1のURLへ再アクセス
3. それでも取得できない場合: 「未接続：GA4 MCP未設定・Chrome MCP認証切れ」と記録してスキップ

### 当月チャネル別売上実績（毎日必須・着地見込算出の基礎データ）

52. **[Web Analyst担当]** Shopify MCPサーバー — 当月売上・CVRファネル（`phase0-web-analyst.md` 参照）
    - 接続済み: 7089d1-4e.myshopify.com（2026-04-01確認）
    - Researcherはこのデータを取得しない。Web Analystが担当
53. **[手動]** Amazonセラーセントラル ビジネスレポート — 当月ASIN別データ
    - 未接続：Amazon SP-API 開発者登録・審査が必要
    - 手動確認先: https://sellercentral.amazon.co.jp → レポート → ビジネスレポート
54. **[即時]** Google広告管理画面 — 当月キャンペーン実績（WebFetch: https://ads.google.com）
55. **[即時]** Slack「オーダーまとめ」チャンネル（毎日必須・酒販店/料飲店の受注集計）
56. **[即時]** Gmail MCP 外販注文書（毎日必須・外販チャネルの確定実績取得） ← 2026-03-30追加

### Gmail MCPによる外販・料飲店データ収集（毎日必須）

**背景**: 2026-03-30のPDCAでGmail注文書がブラックス138碗（¥249,710）の一次ソースとして有効であることが確認済み。外販チャネルはSlackではなくGmailが確定ソース。

#### Gmail検索クエリ（外販企業別）

**ブラックス（外販）**
```
gmail_search: "from:*@* subject:注文 OR subject:発注 OR subject:ORDER ブラックス"
または
gmail_search: "ブラックス しゅわん OR SHUWAN 注文 after:YYYY/MM/01"
```

**エルスタイル（外販）**
```
gmail_search: "エルスタイル しゅわん OR SHUWAN 注文 after:YYYY/MM/01"
または
gmail_search: "from:*elstyle* OR *el-style* 注文 after:YYYY/MM/01"
```

**GiftX/GIFTFUL（外販）**
```
gmail_search: "GIFTFUL OR GiftX しゅわん OR SHUWAN 注文 after:YYYY/MM/01"
または
gmail_search: "from:*giftful* OR *giftx* 注文 after:YYYY/MM/01"
```

**K-キャビン（外販）**
```
gmail_search: "K-キャビン OR Kキャビン しゅわん OR SHUWAN 注文 after:YYYY/MM/01"
```

**料飲店（注文書ベース）**
```
gmail_search: "料飲店 OR 飲食 OR レストラン しゅわん OR SHUWAN 注文 after:YYYY/MM/01"
```

#### 抽出・集計手順

**Step 1: Gmail検索実行**
上記クエリで当月（YYYY/MM/01〜本日）のメールを検索。

**Step 2: 注文書から碗数・金額を抽出**
- 商品名（SHUWANプロフェッショナル / しゅわんグラス）
- 碗数（数量）
- 単価・合計金額（税抜）
- 発注日・発送予定日

**Step 3: btob-orders.mdに追記**
`~/.claude/context/sales/btob-orders.md` に以下形式で日付付き追記:
```
## YYYY-MM-DD Gmail外販集計（外販チャネル確定実績）

### 外販
| 企業名 | 商品 | 碗数 | 単価 | 金額(税抜) | 発注日 |
|--------|------|------|------|----------|-------|
| ブラックス | しゅわんグラス | XX碗 | ¥X,XXX | ¥XXX,XXX | MM/DD |
| ... | | | | | |
**外販 小計（Gmail確定）: XXX碗 / ¥XXX,XXX**
```

**Step 4: 酒蔵メールは別管理**
花の香酒造・田中六五・松緑酒造からのメールは `context/sales/sake-breweries.md` に記録すること（レベシェア対象外のため、KPI着地見込には**含めない**）。

> **重要**: 外販チャネルのKPI実績値 = Gmail外販集計の確定碗数を使用する。
> Slackの「オーダーまとめ」は酒販店・料飲店の補助集計として活用する（外販はGmail一次ソースを優先）。

#### Slack「オーダーまとめ」チャンネル集計手順

**Step 1: チャンネル検索**
```
slack_search_channels キーワード: "オーダーまとめ"
```
チャンネルIDを取得する。

**Step 2: 当月メッセージ一括読み込み**
```
slack_read_channel チャンネルID: [取得したID]  limit: 200
```
当月（YYYY年MM月）のメッセージをすべて読み込む。

**Step 3: 碗数集計**
読み込んだメッセージから以下を抽出・集計：
- 店舗名 × 碗数（数値+「碗」で記載されているものを拾う）
- 業態別（酒販店 / 料飲店 / 外販）に分類して集計
  - 酒販店: 酒販店・地酒屋・酒屋などの店舗
  - 料飲店: 飲食店・レストラン・バー・居酒屋など
  - 外販: エルスタイル等の卸・外販パートナー
- 当月累計碗数を業態別・合計で算出

**Step 4: context/sales/btob-orders.md を更新**
```
~/.claude/context/sales/btob-orders.md
```
以下の形式で日付付き追記：
```
## YYYY-MM-DD 当月受注集計（Slackオーダーまとめより）

### 酒販店
| 店舗名 | 当月碗数 |
|--------|---------|
| ...    | XX碗    |
**酒販店 小計: XXX碗**

### 料飲店
| 店舗名 | 当月碗数 |
|--------|---------|
| ...    | XX碗    |
**料飲店 小計: XXX碗**

### 外販
| パートナー名 | 当月碗数 |
|------------|---------|
| ...        | XX碗    |
**外販 小計: XXX碗**

**BtoB合計: XXX碗**（酒販店XXX + 料飲店XXX + 外販XXX）
```

> **重要**: このSlack集計値をKPI着地見込の実績値として使用すること。
> - 酒販店チャネル実績 = Slack集計の酒販店小計
> - 料飲店チャネル実績 = Slack集計の料飲店小計
> - 外販チャネル実績  = Slack集計の外販小計
> Slack集計なしに「情報不足」として推計することを禁止する。

### Shopify商品サイト ファネル分析

32. **[設定待]** `ga4_shopify_funnel(startDate:"7daysAgo", endDate:"yesterday")` — ページファネル遷移率・ボトルネック
33. **[設定待]** `ga4_shopify_landing_pages(startDate:"7daysAgo", endDate:"yesterday")` — ランディングページ別CV率
34. **[設定待]** `ga4_shopify_product_performance(startDate:"7daysAgo", endDate:"yesterday")` — 商品別PV・滞在時間
35. **[設定待]** `ga4_traffic_sources(site:"shopify", startDate:"7daysAgo", endDate:"yesterday")` — 流入元別セッション・CV率

**[即時] GA4 MCP未接続時（現状）:** Chrome MCPで下記URLにアクセスしブラウザ読み取りで代替。
- ファネル: https://analytics.google.com/analytics/web/?authuser=1#/p452176286/reports/explorer
- GA4データがゼロの場合: `context/tech/ga4-shopify-setup.md` を参照

### LP分析

37. **[設定待]** ga4_report（ページ別エンゲージメント） — 平均滞在時間・エンゲージメント率・直帰率
38. **[設定待]** ga4_report（スクロール深度） — スクロールイベント数・完了率
39. **[Web Analyst担当]** Microsoft Clarity MCP — ヒートマップ・セッション録画・デッドクリック（プロジェクトID: tjrp4kwzyu）
    - 接続済み: @microsoft/clarity-mcp-server（APIトークン設定済み 2026-04-01確認）
    - Researcherはこのデータを取得しない。Web Analystが担当

---

## レビュー完了の判断基準（まとめ）

| 状態 | 判断 |
|------|------|
| [即時]ソースを全て収集済み | レビュー完了 |
| [設定待][手動]ソースが取得できず「未接続：〇〇」と明記済み | レビュー完了 |
| [即時]ソースの収集が途中 | レビュー未完了（継続） |
| MCP未接続を理由に収集を一切行っていない | レビュー未完了（禁止） |

> **重要**: フェーズ0が完了し `context/market/*.md` が更新された後に、フェーズ1に進むこと。
