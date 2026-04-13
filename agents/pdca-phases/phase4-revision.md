# フェーズ4: 再考・修正

CMOの判断結果に基づき、修正が必要なファイルがあれば該当エージェントに修正指示を出す。

## 修正担当

| 修正内容 | 担当エージェント | 対象ファイル |
|---|---|---|
| KPI目標の修正 | @cmo | kpi-targets.md |
| コミュ施策の修正 | @communication-planner | 該当ファイル |
| 営業戦術の修正 | @cso | sales-tactics.md |
| 技術改善 | @cto | prompts.md / claude-code-tips.md / tech-improvements.md |

## エージェント定義・整合性の見直し（毎日必須）
@cto が以下を確認・修正：
- `~/.claude/agents/*.md` の各エージェントTodoWriteラベルと `~/ai-agent-dashboard/vite.config.ts` のFILE_MAPラベルが一致しているか
- `~/.claude/agents/*.md` の読み込みファイルリストに追加・変更があれば反映
- `~/.claude/scheduled-tasks/shuwan-daily-pdca/SKILL.md` の手順が最新の運用と一致しているか
- ズレがあれば即時修正し、変更内容をフェーズ5のchangelog.mdに記録する

## 修正ルール
- 既存データは上書きせず、日付付きで追記
- 変更理由を必ず記載
- 変更前の数値も残す
