---
name: shuwan-daily-pdca
description: SHUWAN日次PDCA: 全5エージェントがインプット読み込み→レビュー→妥当性判断→再考→アウトプットを自動実行
---

SHUWANプロジェクトの日次PDCAを実行してください。

以下の手順で全エージェントを起動し、インプット読み込み→レビュー→妥当性判断→再考→アウトプットの5フェーズを実行します。

## 手順

### Step 0-A: Gmail・Slack 重要情報スキャン（Step 0より先に実行・オーケストレーター直接実行）

> **オーケストレーターが直接実行**（サブエージェント不要）。Step 0のResearcher起動より先に行い、収集した情報をnotes.mdに記録してから全エージェントが読み込めるようにする。

#### Gmail スキャン（MCP: gmail_search_messages）

> **重要**: 現在のGmail MCP接続は `hiroaki_hara@shuwan.jp` のみ。
> 議事録・打ち合わせメモは **`hara@thinqlo.co.jp`** に届く。
> hara@thinqlo.co.jp Gmail MCPは**4/2 OAuth2認証完了・settings.local.json設定済み（disabled:false）**。Claude Code再起動後から `gmail_thinqlo_search` / `gmail_thinqlo_read` で自動取得可能。
> 再起動が済んでいない場合は、ユーザーに手動で `notes.md` への追記を依頼すること。

以下のクエリを順番に実行し、重要メールを `gmail_read_message` で取得：

```
# 1. 議事録・打ち合わせメモ（※shuwan.jpアカウント側のみ取得可）
q: "SHUWAN 打ち合わせ OR 議事録 OR ミーティング after:昨日"

# 2. 本日以降のスケジュール招待
q: "招待 SHUWAN after:昨日"

# 3. 外販・BtoB注文書・発注
q: "(ブラックス OR エルスタイル OR GiftX OR GIFTFUL OR TANP OR K-キャビン) (注文 OR 発注 OR 明細) after:月初1日"

# 4. 輸出・海外商談
q: "いまでや OR imadeya SHUWAN after:昨日"

# 5. 新規問い合わせ
q: "法人購入 OR 取り扱い OR お見積り SHUWAN after:昨日"
```

取得した重要メールは `~/.claude/context/memos/notes.md` に以下の形式で追記：
```
## YYYY-MM-DD Gmail重要メール（当日受信分）
### [件名]（送信元・日時）
- 内容要約（3行以内）
- 次アクション（担当・期限）
```

#### Slack スキャン（MCP: slack）

```
slack_search_public_and_private: "SHUWAN" （過去24時間）
slack_search_public_and_private: "しゅわん 注文 OR 発注" （過去24時間）
```

重要な投稿は notes.md に追記。

> **完了条件**: notes.mdのGmailセクションが更新されていること。Step 0-Aが完了してからStep 0に進む。

---

### Step 0: データ収集・分析（2エージェント並列実行）

**@researcher と @web-analyst を同時に起動する。両方完了後にStep 1に進む。**

#### @researcher（外部リサーチ専任）
以下を収集し `context/market/market-trends.md` `context/market/competitors.md` `context/market/reviews-wom.md` を更新：
- 市場・競合・口コミ・SNS動向（WebSearch中心）
- Amazon酒器カテゴリ全体分析（売れ筋・口コミ・KW・広告）
- Amazon当月売上（セラーセントラル手動確認またはWebFetch）
- BtoB当月受注（Gmail注文書・Slack「オーダーまとめ」集計）
- 詳細: `agents/pdca-phases/phase0-researcher.md` 参照

#### @web-analyst（自社内データ専任）
以下をMCPで取得し `context/market/lp-analysis.md` `context/reviews/review-web-analytics.md` を更新：
- **Shopify**: 当月売上・CVRファネル・商品別パフォーマンス（`shopify_orders_summary` `shopify_funnel`）
- **GA4**: 流入元・ページ別PV・CVR・ランディングページ分析
- **PMAX検索語句**: Google Sheets MCPで検索語句・ROAS取得
- **Clarity**: ヒートマップ・スクロール深度・デッドクリック
- 詳細: `agents/pdca-phases/phase0-web-analyst.md` 参照

> **重要**: ResearcherとWeb Analystは**並列実行**（互いに依存しない）。両方のTaskOutputを受け取ってからStep 1に進むこと。

### Step 1: インプット読み込み（全エージェント共通）
以下を読み込み現状把握：
- `~/.claude/context/memos/` フォルダ内の**全ファイル**（Globで一覧取得してからReadで全読み込み）
  - shuwan-master-input.md、notes.md（**Step 0-AのGmail情報含む**）、shuwan-sales-summary.md
  - SHUWAN_月次KPI活動計画_v3 (18).xlsx、酒器の市場規模.xlsx
  - 酒販店アタックリスト（３２店）.xlsx、酒販店アプローチリスト（郵送込み）.xlsx
  - 【共有】SHUWAN合宿(3月14日).pptx、修正版_SHUWAN_A4チラシ.pdf
  - `レベシェア実績/` サブフォルダ内の最新Excel
- `~/.claude/context/strategy/annual-plan.md`
- `~/.claude/context/strategy/kpi-targets.md`
- `~/.claude/context/strategy/monthly-kpi-tracking.md`（月次KPI目標・実績・着地見込・GAP分析）
- **Researcher分析情報（Step 0で収集・更新済み）:**
  - `~/.claude/context/market/market-trends.md`
  - `~/.claude/context/market/competitors.md`
  - `~/.claude/context/market/reviews-wom.md`
- **Web Analyst分析情報（Step 0で収集・更新済み）:**
  - `~/.claude/context/market/lp-analysis.md`
  - `~/.claude/context/reviews/review-web-analytics.md`

### Step 2: 3エージェント並列レビュー
@communication-planner — コミュ施策の進捗評価、context/communication/*.md を更新
@cso — 営業活動の進捗評価、context/sales/*.md を更新
@cto — 技術・プロンプトの改善点洗い出し、context/tech/*.md を更新
> **注意**: @researcher/@web-analystのデータ収集はStep 0で完了済み。Step 2では起動しない。
> **注意**: 各エージェント起動プロンプトには必ず「TodoWriteツールは使用しないこと」を明記すること。

### Step 3: CMO統括レビュー（KPI連動型）
@cmo — 全エージェントの結果を統合し、以下を実行：
- 月次KPI目標 vs 実績 vs 着地見込のGAP分析（monthly-kpi-tracking.md更新）
- GAP要因分析（流入/CVR/パイプライン/単価の分解）
- チャンス・課題の優先順位付け（Researcher分析 + 各エージェント知見）
- 月次活動計画との照合→活動修正提案
- 広告戦略修正（PMAX検索語句・リスティング・Amazon広告）
- 年間着地予測・四半期マイルストーン進捗

### Step 4: 修正 + 定義見直し
- CMOの判断に基づき、該当エージェントがファイルを修正（日付付き追記）
- **@cto（毎日必須）**: agents/*.md・SKILL.md・FILE_MAPの整合性を確認し、ズレがあれば即時修正

### Step 5: アウトプット（KPI連動型レポート）
- output/daily-review-YYYY-MM-DD.md にKPI連動型日次レポートを生成：
  1. 当月KPI進捗・着地見込テーブル（チャネル別: 目標/実績/見込/GAP/判定）
  2. GAP要因分析（未達・超過の要因特定）
  3. チャンス・課題（優先度順テーブル）
  4. 活動修正提案（月次活動計画との照合）
  5. 要対応事項
- monthly-kpi-tracking.md の「着地見込・GAP分析」セクションを更新
- output/changelog.md に変更ログを追記
- **必ずBashで以下を実行してExcelを再生成する（省略不可）:**
  ```
  node C:/Users/hara/.claude/output/create_excels.js
  ```
- ユーザーにKPI連動型レポートを報告

daily-pdcaエージェント（~/.claude/agents/daily-pdca.md）の詳細手順に従って実行してください。

## Todo管理ルール（重要）

### 基本原則
- **TodoWriteはオーケストレーター（親セッション）のみが呼ぶこと**
- **サブエージェント（CSO・CTO・Comm Planner・Researcher・CMO）はTodoWriteを呼ばない**
- サブエージェントが独自にTodoWriteを呼ぶと、ダッシュボード上で別エントリとして表示され、0/4のまま残り続けるバグが発生する

### オーケストレーターの実行手順
1. **エージェント起動前**: `TodoWrite`でそのエージェントのタスクを`in_progress`に設定
2. **TaskOutput受信後**: 即座に`TodoWrite`でそのエージェントのタスクを`completed`に設定
3. 複数エージェントを並列起動した場合も、各TaskOutput受信のたびに即時更新する

### サブエージェントへの指示
サブエージェントを起動するプロンプトには必ず以下を含めること：
```
**重要**: TodoWriteツールは使用しないこと。進捗管理は親セッションが行う。
```