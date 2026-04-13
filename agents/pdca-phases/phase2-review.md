# フェーズ2: 各エージェントによるレビュー（3エージェント並列実行）

フェーズ0でResearcherが収集・更新した最新データを含め、フェーズ1で読み込んだ全情報を基に、以下の3エージェントを**並列**で起動し、それぞれの担当領域をレビューさせる。

> **注意**: @researcher のデータ収集・分析はフェーズ0で完了済み。フェーズ2では起動しない。

## @communication-planner（コミュニケーション施策レビュー）
```
以下のファイルをレビューし、今月の施策進捗を評価してください：
- context/communication/integrated-plan.md — 統合コミュプラン
- context/communication/crm-plan.md — CRM施策
- context/communication/media-sns.md — メディア・SNS施策

今月の施策で予定通りのものと遅延しているものを洗い出してください。
KPI達成度を確認し、未達の施策には改善案を追記してください。
```

## @cso（営業レビュー）
```
以下のファイルをレビューし、営業活動の進捗を評価してください：
- context/sales/customer-insights.md — 顧客インサイト
- context/sales/sales-tactics.md — 営業戦術
- context/sales/pipeline.md — 商談パイプライン

新規取引先の進捗、パイプライン状況、今月の営業KPI達成度を確認してください。
酒販店アプローチリスト（context/memos/酒販店アプローチリスト（郵送込み）.xlsx）も参照。
パイプライン確認後、context/reviews/review-sales.md に営業活動サマリーを追記してください。
```

## @cto（技術・プロンプトレビュー）
```
以下のファイルをレビューし、改善点を洗い出してください：
- context/tech/prompts.md — プロンプト集
- context/tech/claude-code-tips.md — Claude Code活用Tips
- context/tech/tech-improvements.md — 技術改善タスク一覧

エージェントの動作品質、プロンプトの改善点、自動化できる作業を特定してください。
tech-improvements.md の優先度リストを更新し、実装済み項目を「実装済み」に移動してください。
```
