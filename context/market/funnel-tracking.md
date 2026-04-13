# SHUWANコンバージョンファネル トラッキングテーブル

> フロー: 広告費 → 経路 → LP流入数 → 商品ページ流入数 → カート遷移数 → 購入人数 → 購入碗数

---

## 測定方法マッピング（各指標のデータ取得元）

| 指標 | 取得元 | ツール/クエリ |
|-----|-------|-------------|
| 広告費（PMAX） | Google Ads | KPI管理表シート（手動入力）|
| 広告費（Meta） | Meta Ads Manager | 手動入力（今後API連携検討）|
| 経路別セッション | GA4 | `ga4_traffic_sources(startDate, endDate)` |
| LP別流入数 | GA4 | `ga4_shopify_landing_pages(startDate, endDate)` |
| 商品ページ流入数 | GA4 | landingPagePlusQueryString で `/products/shuwan` `/products/shuwan-glass` |
| カート遷移数 | GA4 | `ga4_shopify_funnel` の add_to_cart ステップ |
| 購入人数・碗数 | Shopify | `shopify_orders_summary` `shopify_product_performance` |

---

## 週次ファネルテーブル（毎週月曜更新）

### 2026-04-07〜04-13（最新）

| 経路 | 広告費 | LP流入数 | SHUWANプロ流入 | グラス流入 | その他流入 | カート遷移 | 購入人数 | 購入碗数 |
|-----|-------|---------|-------------|---------|---------|---------|---------|---------|
| オーガニック（google） | - | TOP含む | 305 sessions / CVR56% | 181 sessions / CVR74% | - | - | 209 | - |
| PMAX（google/cpc） | 要確認 | 商品LP直接 | variant付き355 / CVR5.6% | variant付き328 / CVR4.9% | 陶胎漆器246 / CVR8.9% | - | 319 | - |
| Meta（facebook+meta paid） | 要確認 | グラスLP主 | 3CV（facebook/paid混入）| 16CV（meta/paid）| 紙袋LP誤爆あり | - | 19 | - |
| Instagram Shopping | - | 商品LP直接 | - | 25 sessions / CVR64% | - | - | 16 | - |
| Direct | - | TOP/各LP | - | - | - | - | 102 | - |

**合計（4/1-4/13）**: 購入60件 / ¥621,730 / AOV¥10,362

---

## GA4クエリ（Web Analystが毎日実行）

### 1. 経路別セッション（ファネル左列）
```
ga4_traffic_sources(
  property_id: "452176286",
  startDate: "YYYY-MM-DD",  # 月初
  endDate: "YYYY-MM-DD"     # 昨日
)
```
→ sessionSource/sessionMedium別: sessions, conversions, bounceRate

### 2. 商品ページ流入数（ファネル中央列）
```
ga4_shopify_landing_pages(
  property_id: "452176286",
  startDate: "YYYY-MM-DD",
  endDate: "YYYY-MM-DD"
)
```
→ `/products/shuwan`（プロ）、`/products/shuwan-glass`（グラス）、その他のsessions/CV

### 3. カート遷移数（ファネル右列）
```
ga4_shopify_funnel(
  property_id: "452176286",
  startDate: "YYYY-MM-DD",
  endDate: "YYYY-MM-DD"
)
```
→ view_item → add_to_cart → begin_checkout → purchase の各ステップ

### 4. 購入人数・碗数（最終列）
```
shopify_orders_summary(startDate: "月初", endDate: "昨日")
shopify_product_performance(startDate: "月初", endDate: "昨日")
```
→ 注文数、商品別売上数量、AOV

---

## クロスページ遷移（↕矢印部分）の測定

図の「SHUWANプロ ↕ グラス」の双方向矢印は **クロスセル・商品間回遊** を示します。

### 測定方法
GA4の `ga4_top_pages` で各商品ページのprevious_page_path / next_page_pathを確認。
または Clarityのセッション録画で実際の回遊を確認。

### 現状値（GA4 landingPage分析より）
- `/products/shuwan` から `/products/shuwan-glass` への回遊: 測定中
- 両商品ページのCVRが高い（プロ56%、グラス74%）→ クロスセル設計が効いている可能性

---

## Meta広告ファネル詳細（2026-04-13確認）

| UTM | sessions | LP（メイン）| カート | CV | CVR | 課題 |
|-----|---------|-----------|-------|-----|-----|-----|
| facebook/paid | 784 | 紙袋LP混入 | - | 3 | 0.38% | **LP修正必須** campaign_id=120242203226440031 |
| meta/paid | 221 | グラスLP | - | 16 | 7.2% | 許容範囲 |
| IGShopping/Social | 25 | グラス商品 | - | 16 | 64% | 最強・拡大すべき |

---

## 週次チェックリスト（毎週月曜・Web Analyst担当）

- [ ] GA4 `ga4_traffic_sources` で経路別セッション取得
- [ ] GA4 `ga4_shopify_landing_pages` で商品ページ流入取得
- [ ] Shopify `shopify_product_performance` で購入碗数取得
- [ ] Meta広告費をKPI管理表から取得
- [ ] PMAX広告費をKPI管理表から取得
- [ ] 上記テーブルに数値を入力して前週比変化を確認
- [ ] CVR低下・直帰率上昇があれば即Clarityでデッドクリック確認

---

*作成: 2026-04-13 | 担当: Web Analyst / CTO*
