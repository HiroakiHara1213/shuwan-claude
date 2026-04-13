---
name: feedback_todowrite_orchestrator
description: TodoWriteはオーケストレーター（親セッション）のみが呼ぶルール。サブエージェントがTodoWriteを呼ぶとダッシュボードにゾンビタスクが残るバグが発生する。
type: feedback
---

TodoWriteはオーケストレーター（親セッション）のみが呼ぶこと。サブエージェント（CSO・CTO・Comm Planner・Researcher・CMO）はTodoWriteを使用しない。

**Why:** サブエージェントが独自にTodoWriteを呼ぶと、親セッションのTodoリストとは別エントリとして登録され、ダッシュボードに0/4のまま完了しないゾンビタスクが残り続けるバグが発生した（2026-03-31確認）。

**How to apply:**
- サブエージェントを起動するプロンプトには必ず「TodoWriteツールは使用しないこと」を明記する
- エージェント.mdのfrontmatter `tools:` にTodoWriteを含めない
- エージェント.mdを新規作成・編集する際は§6整合性チェックでTodoWrite非使用を確認する
- オーケストレーターはTaskOutput受信後に即時TodoWriteでステータスを更新する
