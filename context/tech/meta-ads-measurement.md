# Meta広告 測定・分析フレームワーク

> 作成: 2026-04-13 | 広告開始: 2026-04-13〜

---

## 1. Meta広告パフォーマンス（GA4実測値 4/1-4/13）

### チャネル別CVR（GA4 source/medium）

| source / medium | sessions | CV | CVR | 直帰率 | 状態 |
|----------------|---------|-----|-----|-------|-----|
| facebook / paid | 784 | 3 | **0.38%** | **94.5%** | × 即修正要 |
| meta / paid | 221 | 16 | **7.2%** | 71% | △ 許容範囲 |
| ig / social（有機） | 138(4/1-13)| 1 | 0.7% | 52% | △ |
| IGShopping / Social | 25 | 16 | **64%** | 44% | ◎ 最高 |

**facebook/paidが深刻な理由（ランディングページ分析で特定）:**
- `/products/bag-size-1?...fbclid=...campaign_id=120242203226440031` → **紙袋にランディングしているMeta広告がある**
- 紙袋は¥330の付属品。これを本命商品と勘違いしてクリックさせている設定ミス
- 即修正: ランディングページを `/products/shuwan` または `/products/shuwan-glass` に変更

### 参考：高CVRチャネル（ベンチマーク）

| source / medium | sessions | CV | CVR | 備考 |
|----------------|---------|-----|-----|-----|
| google / cpc (PMAX) | 2,583 | 319 | 12.3% | 目標CVRの基準 |
| google / organic | 1,094 | 209 | 19.1% | オーガニック検索 |
| bing / organic | 38 | 12 | 31.6% | 高意図層 |
| prtimes.jp / referral | 77 | 15 | 19.5% | PR TIMES（4/8陶胎漆器） |
| IGShopping / Social | 25 | 16 | 64% | Instagram Shopping最強 |

---

## 2. Meta広告リフト効果の測定体制

### ベースライン（Meta広告開始前: 3/30-4/12）

| チャネル | Clarityセッション/日（平均） | GA4 CVR |
|---------|------|------|
| Social | 1〜3件/日 | - |
| Organic Search | 797 / 14日 = 57/日 | 19.1% |
| Direct | 1080 / 14日 = 77/日 | 14.5% |
| Instagram organic (ig/social) | 約10件/日 | 低 |

### 測定すべきリフト指標（週次追跡）

#### A. 直接効果（Meta広告から）
- `facebook/paid` + `meta/paid` + `IGShopping/Social` のセッション・CV・ROAS
- ランディングページ別CVR（Shopifyランディングページ分析）
- 目標CVR: ≥5%（現在の facebook/paid 0.38% は紙袋LP修正後に改善見込み）

#### B. オーガニック検索へのリフト効果
- Googleサジェスト「SHUWAN」「しゅわん グラス」の検索ボリューム変化（週次）
- `google/organic` セッション数の前週比（週次比較）
- 指標: Organic sessions 57/日 → 目標70/日以上でリフト確認

#### C. Instagramフォロワーへの影響
- フォロワー数推移（週次スクリーンショット or Meta Business Manager）
- `ig/social` セッション数の推移（GA4）
- プロフィールアクセス数（Meta Insights）
- 現況: ig/social 4/7-4/13で57セッション・CV=0（広告実施前は低水準）

#### D. 問い合わせへのリフト効果
- `/contact` ページセッション数の推移（GA4 landingPage）
- Shopifyお問い合わせフォーム送信数
- Gmail法人問い合わせ数（BtoB）
- 現況: 4/12 福田浩子様（lotte.net）の法人問い合わせは広告効果の可能性

---

## 3. UTM設定確認・推奨（即修正事項）

### 現状のUTMマッピング（GA4実測）

| GA4表示 | 意味 | 状態 |
|--------|------|-----|
| facebook / paid | Facebook広告（旧UTM命名）| UTM修正推奨 |
| meta / paid | Meta広告（新UTM命名）| 正常 |
| ig / social | Instagram有機 / 一部広告混入 | 要確認 |
| IGShopping / Social | Instagram Shopping | 正常・優先強化 |

### 推奨UTM設定（Meta Ads Manager）

```
キャンペーン: utm_campaign=meta_spring2026
ソース: utm_source=meta
メディウム: utm_medium=paid
コンテンツ: utm_content=shuwan_main（商品別に分ける）
```
→ `facebook/paid`（旧設定）が混在しているため、全広告セットのUTMを `meta/paid` に統一する

---

## 4. 週次レビュー指標テーブル（毎週月曜取得）

| 指標 | ベースライン（4/1-13） | 今週 | 変化 |
|-----|---------------------|-----|-----|
| Meta paid sessions | 1,005/13日=77/日 | - | - |
| Meta paid CVR | 1.9%（紙袋LP除外後）| - | - |
| Meta paid ROAS | 要算出 | - | - |
| instagram organic sessions | 10.6/日 | - | - |
| Google organic sessions | 84/日 | - | - |
| Direct sessions | 54/日 | - | - |
| 問い合わせ件数（週）| 2〜3件 | - | - |
| Instagramフォロワー | 1,055（4/2確認）| - | - |
| PR TIMES referral | 77/13日=5.9/日 | - | - |

---

## 5. 最優先アクション（本日中）

1. **Meta広告のランディングページ修正**: 紙袋（bag-size-1）→ `/products/shuwan` または `/products/shuwan-glass`（深田氏）
   - campaign_id: 120242203226440031
   - ad_id: 120242224191280031
   
2. **UTM統一**: `facebook/paid` → `meta/paid` に統一設定（深田氏）

3. **Instagram Shopping強化**: CVR 64%のIGShoppingへの商品登録確認・拡充（Comm）

4. **リフト指標のベースライン記録**: 今週のInstagramフォロワー数・Organic sessions数をスクリーンショットで記録

---

## 6. Amazon A+コンテンツについて

### A+コンテンツとは
Amazonセラーセントラルの「コンテンツ管理」から設定できる、商品詳細ページの**拡張コンテンツ機能**。

通常の商品説明（テキストのみ）の代わりに以下を設定できる：
- **比較モジュール**: 他商品との比較表（例: SHUWANプロフェッショナル vs しゅわんグラス vs 廣田硝子INT-3）
- **画像＋テキストモジュール**: 特長・使用シーン・素材説明を画像付きで解説
- **ブランドストーリー**: ブランドの背景・哲学を伝えるストーリーセクション
- **レビュー引用**: 高評価レビューのビジュアル化（正確にはA+には直接入れられないがEBC内で画像化）

### 「A+コンテンツ未整備」の意味
現在のSHUWAN Amazon商品ページは、通常のテキスト説明文のみが設定されており、上記ビジュアルコンテンツが未設定の状態。これにより：
- 廣田硝子INT-3（マイベスト1位）など競合がA+で訴求力を持つ中、SHUWANのCVRが下がる
- 「日本酒専用設計×科学的根拠」という差別化ポイントが画像で伝わらない
- レビュー数が少ない（評価が蓄積されていない）と相まってコンバージョン機会を逃している

### A+コンテンツ整備の優先アクション
- セラーセントラル → コンテンツ管理 → A+コンテンツ作成
- 推奨モジュール構成:
  1. ヘッダー画像（SHUWAN使用シーン・ブランドビジュアル）
  2. 4特長セクション（科学的根拠・抹茶碗フォルム・日本酒専用・プロ採用実績）
  3. 商品比較表（プロフェッショナル vs しゅわんグラス vs 陶胎漆器）
  4. ブランドストーリー（酒蔵採用実績・受賞歴・dancyu掲載）
- 担当: 深田氏（画像制作） + 松窪さん（コピー） / 期限: 4月末

---

*更新: 2026-04-13 | 担当: CTO/CMO*
