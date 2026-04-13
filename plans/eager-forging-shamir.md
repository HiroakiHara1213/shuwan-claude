# AIエージェントダッシュボード - 実装プラン

## Context
先ほど作成した5つのAIエージェント社員（CMO, コミュニケーションプランナー, リサーチャー, CSO, CTO）を管理・可視化するWebダッシュボードを新規作成する。Claude Code Preview機能で動作確認できるdev serverも併せて構築する。

## 技術スタック
- **Vite + React + TypeScript** — 軽量で高速な開発環境
- **Tailwind CSS** — ユーティリティファーストのスタイリング
- **ポート**: 5173（Viteデフォルト）

## プロジェクト構成

```
C:/Users/hara/ai-agent-dashboard/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css            （Tailwind directives）
│   ├── data/
│   │   └── agents.ts        （5エージェントのデータ定義）
│   └── components/
│       ├── Dashboard.tsx     （メインダッシュボード）
│       ├── AgentCard.tsx     （エージェントカード）
│       ├── AgentDetail.tsx   （エージェント詳細パネル）
│       ├── OrgChart.tsx      （組織図・連携図）
│       └── Header.tsx        （ヘッダー）
```

## ダッシュボード機能

### 1. ヘッダー
- タイトル「AI Agent Team Dashboard」
- チームステータスサマリー（5名のエージェント）

### 2. エージェントカード（5枚）
各カードに表示：
- 役職名（CMO, コミュニケーションプランナー等）
- アイコン（絵文字ベース）
- 主要責務（箇条書き3-4項目）
- 連携先エージェント（バッジ表示）
- 参照データフォルダ（context/配下のパス）

### 3. 組織図・連携図
- CMOを中心にした5エージェントの連携関係をビジュアル表示
- CSS Gridベースのシンプルなレイアウト

### 4. エージェント詳細パネル
- カードクリックで詳細表示
- 思考フレームワーク、出力形式などの詳細情報

## 作業手順

1. プロジェクト初期化（Vite + React + TS）
2. Tailwind CSS セットアップ
3. エージェントデータ定義（`agents.ts`）
4. コンポーネント実装（Header → AgentCard → OrgChart → AgentDetail → Dashboard）
5. `.claude/launch.json` にdev server設定を保存
6. `preview_start` でサーバー起動・動作確認

## launch.json 設定

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "ai-agent-dashboard",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 5173
    }
  ]
}
```

## 検証方法
- `preview_start` でdev server起動
- `preview_screenshot` でダッシュボード表示を確認
- 5つのエージェントカードが正しく表示されること
- カードクリックで詳細が表示されること
