# SHUWAN AI経営システム

## プロジェクト概要
SHUWANブランドの経営を6つのAIエージェントで支援する日次PDCAシステム。

## エージェント構成
| エージェント | 役割 | 定義ファイル |
|---|---|---|
| CMO | マーケ責任者・KPI管理・全体戦略 | `agents/cmo.md` |
| Communication Planner | コミュニケーション施策・CRM・広告 | `agents/communication-planner.md` |
| Researcher | 市場・競合・口コミ調査（外部特化） | `agents/researcher.md` |
| Web Analyst | 自社内データ専任（GA4・Shopify・PMAX・Clarity）※Researcherと並列実行 | `agents/web-analyst.md` |
| CSO | 営業・商談・顧客対応 | `agents/cso.md` |
| CTO | 技術・ツール開発・自動化 | `agents/cto.md` |

## 共通ルール
全エージェントは `agents/_common-rules.md` に従うこと。

## ディレクトリ構造
```
~/.claude/
├── agents/                  # エージェント定義
│   ├── _common-rules.md     # 全エージェント共通ルール
│   ├── daily-pdca.md        # 日次PDCAオーケストレーター（概要）
│   ├── pdca-phases/         # PDCAフェーズ別プロンプト
│   │   ├── phase0-researcher.md
│   │   ├── phase0-web-analyst.md
│   │   ├── phase1-input.md
│   │   ├── phase2-review.md
│   │   ├── phase3-cmo.md
│   │   ├── phase4-revision.md
│   │   └── phase5-output.md
│   ├── cmo.md / cso.md / cto.md / researcher.md / web-analyst.md / communication-planner.md
├── context/                 # ナレッジ・インプットデータ
│   ├── memos/               # マスターインプット・メモ（全員参照）
│   ├── market/              # 市場・競合・口コミ（Researcher管轄）
│   ├── strategy/            # ブランド戦略・KPI・年間計画（CMO管轄）
│   ├── communication/       # 統合プラン・CRM・SNS（Communication Planner管轄）
│   ├── sales/               # 顧客インサイト・営業施策（CSO管轄）
│   ├── tech/                # プロンプト・Claude Code活用（CTO管轄）
│   ├── reviews/             # 各エージェントのレビュー結果（フェーズ2出力）
│   └── archive/             # 30日以上前の古いデータ
├── commands/                # スラッシュコマンド（/pdca等）
├── output/                  # 日次レビュー・Excel・変更ログ
├── scheduled-tasks/         # スケジュールタスク
└── plugins/                 # プラグイン
```

## 日次PDCA実行方法
`/pdca` コマンドまたは `agents/daily-pdca.md` を実行。
フェーズ別の詳細プロンプトは `agents/pdca-phases/` を参照。

## 重要ルール
- 施策提案時は必ず「顧客の買いたい・買い続けたい気持ち」への貢献を明示
- データがない場合は推測せず「情報不足」と明示
- 既存データは上書きせず日付付きで追記
- 30日以上前のデータは `context/archive/` へ移動（§9 アーカイブルール参照）
- 変更時は整合性チェック5項目を必ず実施（_common-rules.md §6）
