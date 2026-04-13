# GA4 Shopify設置ガイド

## 現状
- GA4プロパティ「Shopify商品サイト」(ID: 452176286) は作成済み
- **GA4アカウント: `matsukubo@shuwan.jp`**（hara@thinqlo.co.jpではない！）
- **問題**: `shop.shuwan.jp` にトラッキングコードが未設置 → データゼロ

## サービスアカウント
`shuwan-ga4-reader@fleet-tensor-491503-m3.iam.gserviceaccount.com`

---

## Step 1: GA4 測定IDを確認する

1. https://analytics.google.com にアクセス
2. プロパティ「Shopify商品サイト」(ID: 452176286) を選択
3. **管理 → データストリーム → ウェブストリーム** をクリック
4. `G-XXXXXXXXXX` 形式の**測定ID**をコピー

---

## Step 2: ShopifyにGA4を設置する（2つの方法）

### 方法A: Shopify管理画面から直接設置（推奨・5分）

1. `shop.shuwan.jp` の Shopify管理画面にログイン
2. **オンラインストア → テーマ → コードを編集**
3. `theme.liquid` の `</head>` 直前に以下を貼り付け：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

※ `G-XXXXXXXXXX` を Step 1 で確認した実際の測定IDに置き換える

### 方法B: Shopify Google & YouTube チャンネル経由（推奨・コマース計測も自動）

1. Shopify管理画面 → **アプリ → アプリストア**
2. 「Google & YouTube」を検索してインストール
3. Googleアカウントと連携 → GA4プロパティを選択
4. **購入・カート追加・チェックアウト開始** が自動でGA4イベントとして計測される

**方法Bの方がeコマース計測も自動設定されるため強く推奨**

---

## Step 3: 設置確認（設置後48時間以内）

```
GA4 リアルタイム → 概要 → 自分でshop.shuwan.jpにアクセスしてユーザー数が増えるか確認
```

設置確認後、MCP経由で計測開始：
```
ga4_realtime(site: "shopify", metrics: ["activeUsers"])
→ 0以外が返れば設置成功
```

---

## Google Sheets API有効化（**最初に必須**）

GCPプロジェクト `fleet-tensor-491503-m3` でSheets APIが未有効です。

**→ 以下URLにアクセスして「有効にする」をクリック（1分）:**
```
https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=402728113138
```

有効化後、`claude` を再起動するだけで `sheets_read` ツールが使えるようになります。

---

## PMAX検索語句シート（Google Ads）

**スプレッドシートID**: `1Qw41z2YXJSbTRSj0ohIFBHw9SQdrFmIzi24KyTVSuxU`
**URL**: https://docs.google.com/spreadsheets/d/1Qw41z2YXJSbTRSj0ohIFBHw9SQdrFmIzi24KyTVSuxU/

### サービスアカウントに閲覧権限を付与する手順

1. 上記URLでスプレッドシートを開く
2. 右上「共有」ボタンをクリック
3. メールアドレス欄に以下を入力：
   ```
   shuwan-ga4-reader@fleet-tensor-491503-m3.iam.gserviceaccount.com
   ```
4. 権限: **閲覧者** を選択 → 「送信」

### KPI管理表シート

**スプレッドシートID**: `1JPNyYahysu5ROH6VejqeaamdAaR5u-ILYtXVEUIuCaY`
**URL**: https://docs.google.com/spreadsheets/d/1JPNyYahysu5ROH6VejqeaamdAaR5u-ILYtXVEUIuCaY/

→ 同様に `shuwan-ga4-reader@...` を閲覧者として追加

---

## 設置完了後にPDCAで取得できるデータ

| データ | ツール | 内容 |
|--------|--------|------|
| Shopify PV | `ga4_top_pages(site:"shopify")` | ページ別閲覧数 |
| 流入元 | `ga4_traffic_sources(site:"shopify")` | Google/SNS/直接等 |
| CVR | `ga4_shopify_funnel` | TOP→商品→カート→購入の遷移率 |
| PMAX検索語句 | `sheets_read(spreadsheetId:"1Qw41z2...")` | 広告の検索語句・クリック・CV |
| KPI管理表 | `sheets_read(spreadsheetId:"1JPNy...")` | 月次KPI目標・実績 |

---

## ステータス

- [x] GA4測定ID確認（analytics.google.comで確認）→ プロパティ452176286 @ matsukubo@shuwan.jp
- [x] Shopify連携 → **完了済み**（2026-03-30確認。Sessions:7, Events:127, リアルタイム2人確認）
- [ ] PMAX検索語句シートにサービスアカウントを共有
- [ ] KPI管理表シートにサービスアカウントを共有
- [x] リアルタイムデータ確認 → **動作確認OK**（3/30）
