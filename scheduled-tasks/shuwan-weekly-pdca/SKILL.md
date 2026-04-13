---
name: shuwan-weekly-pdca
description: SHUWAN週次PDCA: 毎週金曜9時に日次PDCAを週次レンジで実行し週次レビューレポートを出力
---

SHUWANプロジェクトの週次PDCAを実行してください。

まず ~/.claude/agents/weekly-pdca.md を読み込み、その詳細手順に従って全6フェーズを実行してください。

概要:
- 日次PDCAと同じ6フェーズ構成を「過去7日間の週次レンジ」で実行
- Step 0-A: Gmail・Slackスキャン（過去7日間）→ notes.md に追記
- Step 0: @researcher と @web-analyst を並列起動（過去7日間のデータ収集）
- Step 1: インプット読み込み（全エージェント共通）
- Step 2: @communication-planner / @cso / @cto の3エージェント並列レビュー（週次視点）
- Step 3: @cmo が統括レビュー（週次KPI連動・来週の重点アクションTOP3特定）
- Step 4: CMO判断に基づく修正 + @cto による整合性チェック
- Step 5: output/weekly-review-YYYY-MM-DD.md 生成、Excel再生成、Notion書き込み、ユーザー報告

重要ルール:
- TodoWriteはオーケストレーター（親セッション）のみが使用すること
- サブエージェント起動時は「TodoWriteツールは使用しないこと」を必ず明記
- データがない場合は推測せず「情報不足」と明示
- 既存データは上書きせず日付付きで追記