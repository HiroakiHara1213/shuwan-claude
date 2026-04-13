# Amazon SP-API MCP セットアップガイド

## 概要

Amazon Selling Partner API（SP-API）経由でセラーセントラルのデータを取得する。
PDCAシステムのWeb Analystエージェントが自動的に利用する。

## 取得できるデータ

| ツール | データ |
|--------|--------|
| `amazon_get_kpi_summary` | 注文数・売上・碗数・日次トレンド（PDCA用） |
| `amazon_get_orders` | 注文一覧・ステータス・金額 |
| `amazon_get_order_items` | 注文明細・SKU・数量 |
| `amazon_get_inventory` | FBA在庫・補充アラート |
| `amazon_get_finance_summary` | 売上・Amazon手数料・入金情報 |
| `amazon_get_seller_metrics` | アカウントヘルス・マーケットプレイス参加状況 |

---

## ステップ1: SP-API開発者登録

1. セラーセントラルにログイン
2. **アプリとサービス → アプリ開発** を開く
3. 「開発者プロフィールの追加または変更」をクリック
4. 開発者プロフィールを入力：
   - 名前: SHUWAN Analytics
   - 目的: 自社売上・在庫データの自動分析
   - データ使用目的: 内部BI・経営管理ツール
5. 承認を待つ（通常1〜3営業日）

---

## ステップ2: SP-APIアプリ登録（LWA認証情報取得）

1. セラーセントラル → **アプリとサービス → アプリ開発**
2. 「新しいアプリの追加」クリック
3. アプリ情報を入力：
   - アプリ名: SHUWAN Analytics
   - OAuth redirect URI: `https://localhost` （自社ツールなので仮でOK）
4. 作成後に「資格情報の表示」で以下をメモ：
   - **LWAクライアントID** (amzn1.application-oa2-client.xxxxxxx)
   - **LWAクライアントシークレット**

---

## ステップ3: リフレッシュトークンの取得

1. セラーセントラル → **アプリとサービス → アプリ開発**
2. 作成したアプリの「承認」をクリック
3. 承認フロー完了後に表示される **リフレッシュトークン** をコピー

   または、以下のURLにブラウザでアクセス（クライアントIDを差し替え）:
   ```
   https://sellercentral.amazon.co.jp/apps/authorize/consent?application_id=amzn1.sp.solution.xxxxxxx&state=random_state&version=beta
   ```

---

## ステップ4: セラーIDとマーケットプレイスIDの確認

| 項目 | 確認場所 | 日本の値 |
|------|---------|---------|
| **セラーID** | セラーセントラル右上 → アカウント情報 → 販売者トークン | 例: A1XXXXXXXXX |
| **マーケットプレイスID** | 日本は固定値 | `A1VC38T7YXB528` |

---

## ステップ5: settings.local.json に認証情報を設定

`~/.claude/settings.local.json` の `amazon-sp` セクションを以下のように更新：

```json
"amazon-sp": {
  "command": "node",
  "args": ["C:\\Users\\hara\\.claude\\mcp-servers\\amazon-sp-mcp\\index.js"],
  "disabled": false,
  "env": {
    "LWA_CLIENT_ID": "amzn1.application-oa2-client.xxxxxxxxxxxxxxxx",
    "LWA_CLIENT_SECRET": "your_client_secret_here",
    "LWA_REFRESH_TOKEN": "Atzr|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "AMAZON_SELLER_ID": "AXXXXXXXXXXXXX",
    "AMAZON_MARKETPLACE_ID": "A1VC38T7YXB528"
  }
}
```

**変更点:** `"disabled": true` → `"disabled": false`

---

## ステップ6: Claude Code再起動・動作確認

```bash
# Claude Code再起動後、以下のコマンドで確認
amazon_get_kpi_summary(days: 7)
```

正常なレスポンス例:
```json
{
  "period": "過去7日間",
  "kpi": {
    "total_revenue_jpy": 45000,
    "total_orders": 12,
    "total_bowls": 18,
    "avg_order_value_jpy": 3750
  }
}
```

---

## トラブルシューティング

| エラー | 原因 | 対処 |
|--------|------|------|
| `HTTP 403` | リフレッシュトークン不正 | ステップ3をやり直す |
| `HTTP 401` | LWA資格情報不正 | CLIENT_ID / SECRET を再確認 |
| `HTTP 429` | レート制限 | Orders API: 1req/分。時間を置いて再試行 |
| `invalid_grant` | トークン期限切れ | リフレッシュトークンを再生成 |

---

## SP-API権限（必要なアクセス権限）

- `Selling Partner Insights` - 注文・財務データ
- `Reports` - レポートAPI（月次集計）
- `Inventory` - FBA在庫管理

開発者プロフィール審査時にこれらを申請すること。
