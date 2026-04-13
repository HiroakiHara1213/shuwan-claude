---
name: Notion PDCA連携
description: SHUWANのNotion MCP接続情報・データベースID・PDCAログ構成
type: reference
---

## Notion MCP接続情報
- ワークスペース: HARAHIROAKIさんのスペース
- インテグレーション名: SHUWAN
- MCP設定: `~/.claude/.mcp.json` の `notion` エントリ

## データベース
| 名前 | ID | 用途 |
|---|---|---|
| 日次PDCAログ | `33df339e-9adb-81a9-86d6-cfaa611c3ddf` | 日次PDCA結果の蓄積 |

親ページ: SHUWAN PDCA (`33df339e-9adb-802e-9c1a-c02881837835`)

## データベースプロパティ
| プロパティ | 型 | 用途 |
|---|---|---|
| 名前 | Title | `YYYY-MM-DD 日次レビュー` |
| 日付 | Date | 実行日 |
| フェーズ | Select | Plan / Check / Act |
| ステータス | Select | 完了 / 未完了 / 保留 |
| KPI進捗 | Rich Text | 着地見込・GAP要約 |
| チャンス・課題 | Rich Text | 優先度付き |
| 活動修正 | Rich Text | 追加/強化/中止 |
| 要対応事項 | Rich Text | ユーザー判断待ち |

## PDCA連携箇所
- `phase1-input.md`: 前日のCheckレコード・未完了タスクをNotionから取得
- `phase3-cmo.md`: 過去7日分を横断検索して傾向分析（3-0）
- `phase5-output.md`: 日次レビュー結果をNotionに書き込み（ステップ4）
