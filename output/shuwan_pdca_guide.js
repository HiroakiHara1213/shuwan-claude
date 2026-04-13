const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "SHUWAN Daily PDCA 自動化のしくみ";
pres.author = "SHUWAN Project";

const C = {
  bg:      "FFFFFF",
  text:    "333333",
  heading: "222222",
  sub:     "666666",
  accent1: "CD2ECB",
  accent2: "E75EE2",
  accent3: "E44054",
  accent4: "F65445",
  accent5: "F6A623",
  accent6: "F9CB28",
  blue:    "4472C4",
  green:   "70AD47",
  teal:    "0891B2",
  gray_bg: "F2F2F2",
  gray_ln: "D9D9D9",
  white:   "FFFFFF",
  dark_bg: "1E1E2E",
};

function addBottomBars(slide) {
  const colors = [C.accent1, C.accent2, C.accent3, C.accent4, C.accent5, C.accent6,
                  C.accent4, C.accent3, C.accent2, C.accent1, C.accent2];
  const barW = 13.33 / colors.length;
  colors.forEach((c, i) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: i * barW, y: 7.35, w: barW + 0.01, h: 0.15,
      fill: { color: c }, line: { color: c }
    });
  });
}

function addHeader(slide, title, subtitle) {
  slide.addText("SHUWAN", {
    x: 0.5, y: 0.2, w: 3, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.sub,
    charSpacing: 5, margin: 0
  });
  slide.addText(title, {
    x: 0.5, y: 0.5, w: 11, h: 0.6,
    fontSize: 26, fontFace: "Calibri", color: C.heading,
    bold: true, margin: 0
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 1.1, w: 11, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.sub,
      margin: 0, italic: true
    });
  }
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 1.5, w: 12.3, h: 0,
    line: { color: C.gray_ln, width: 1 }
  });
}

const mkShadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 });

// ═══════════════════════════════════════════════
// Slide 1 — タイトル
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.dark_bg };
  // グラデーションバー（上部装飾）
  const colors = [C.accent1, C.accent2, C.accent3, C.accent4, C.accent5, C.accent6];
  const barW = 13.33 / colors.length;
  colors.forEach((c, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: i * barW, y: 0, w: barW + 0.01, h: 0.08,
      fill: { color: c }, line: { color: c }
    });
  });
  // 下部カラーバー
  colors.forEach((c, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: i * barW, y: 7.35, w: barW + 0.01, h: 0.15,
      fill: { color: c }, line: { color: c }
    });
  });

  s.addText("SHUWAN", {
    x: 0.8, y: 1.8, w: 8, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.accent6,
    charSpacing: 8, margin: 0
  });
  s.addText("Daily PDCA 自動化のしくみ", {
    x: 0.8, y: 2.3, w: 11, h: 1.0,
    fontSize: 38, fontFace: "Calibri", color: "FFFFFF",
    bold: true, margin: 0
  });
  s.addText("着地見込 → 示唆 → チャンス・課題 → 活動修正を一気通貫で回す", {
    x: 0.8, y: 3.4, w: 11, h: 0.5,
    fontSize: 17, fontFace: "Calibri", color: "AAAACC",
    margin: 0
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 4.2, w: 4, h: 0,
    line: { color: C.accent5, width: 2 }
  });
  s.addText("社内共有資料  |  2026年3月", {
    x: 0.8, y: 4.5, w: 6, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: "888899",
    margin: 0
  });
}

// ═══════════════════════════════════════════════
// Slide 2 — 背景・課題
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "背景と課題", "なぜ日次PDCAの自動化が必要なのか？");
  addBottomBars(s);

  // 左カラム: SHUWANとは
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 5.8, h: 2.5,
    fill: { color: "F8F8FC" }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 0.08, h: 2.5,
    fill: { color: C.accent2 }
  });
  s.addText("SHUWANとは", {
    x: 0.9, y: 1.8, w: 5, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "日本酒専用設計の酒器ブランド", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: '「この形が、日本酒を変える。」', options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "年間売上目標: 1億円（2026/2〜2027/1）", options: { bullet: true, breakLine: true, fontSize: 13, bold: true } },
    { text: "14ヶ月累計実績: 1,223万円（4,657碗）", options: { bullet: true, fontSize: 13 } },
  ], { x: 0.9, y: 2.3, w: 5, h: 1.6, fontFace: "Calibri", color: C.text, paraSpaceAfter: 6, margin: 0 });

  // 右カラム: 課題
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.7, w: 5.8, h: 2.5,
    fill: { color: "FFF5F5" }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.7, w: 0.08, h: 2.5,
    fill: { color: C.accent3 }
  });
  s.addText("少人数チームの課題", {
    x: 7.2, y: 1.8, w: 5, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "毎日の市場・競合調査に時間がかかる", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "55の情報源を手動でチェックするのは不可能", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "施策レビュー・KPI管理が属人化しがち", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "データの蓄積・一貫性の維持が困難", options: { bullet: true, fontSize: 13 } },
  ], { x: 7.2, y: 2.3, w: 5, h: 1.6, fontFace: "Calibri", color: C.text, paraSpaceAfter: 6, margin: 0 });

  // 下部: 数字ハイライト
  const stats = [
    { num: "1億円", label: "年間売上目標" },
    { num: "55", label: "日次チェック情報源" },
    { num: "5", label: "AIエージェント" },
    { num: "6", label: "PDCAフェーズ" },
  ];
  stats.forEach((st, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 4.6, w: 2.85, h: 1.5,
      fill: { color: C.white }, shadow: mkShadow()
    });
    s.addText(st.num, {
      x: x, y: 4.7, w: 2.85, h: 0.7,
      fontSize: 32, fontFace: "Calibri", color: C.accent2, bold: true, align: "center", margin: 0
    });
    s.addText(st.label, {
      x: x, y: 5.4, w: 2.85, h: 0.4,
      fontSize: 12, fontFace: "Calibri", color: C.sub, align: "center", margin: 0
    });
  });
}

// ═══════════════════════════════════════════════
// Slide 3 — このPDCAの思想（一気通貫サイクル）
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "このDaily PDCAの思想", "KPI目標から活動修正・戦略見直しまで、一気通貫で早く回す");
  addBottomBars(s);

  // 中央の4ステップフロー
  const steps = [
    {
      num: "\u2460", title: "着地見込",
      desc: "日々の活動や売上データから\n当月のチャネル別着地見込を\n自動算出する",
      sub: "Shopify売上・Amazon売上・Google広告実績\nBtoB受注・パイプライン確度加重",
      color: C.accent3,
    },
    {
      num: "\u2461", title: "示唆の抽出",
      desc: "市場・競合・顧客の声・\n広告流入・遷移・CVから\nどんな示唆が得られるか",
      sub: "55情報源のデータ + GA4ファネル\n検索トレンド + 口コミ + 広告ROAS",
      color: C.accent2,
    },
    {
      num: "\u2462", title: "チャンス・課題",
      desc: "示唆から、どんなチャンスや\n課題が生まれているかを\n影響度で優先順位付け",
      sub: "未達要因の分解（流入/CVR/単価/PL不足）\n超過要因の成功パターン特定",
      color: C.accent5,
    },
    {
      num: "\u2463", title: "活動修正・戦略見直し",
      desc: "それを元に活動をどう修正し\n戦略の上流を見直す\n必要があるかを提案",
      sub: "月次活動計画との照合→追加/強化/中止\n広告戦略修正・チャネル配分見直し",
      color: C.accent1,
    },
  ];

  steps.forEach((st, i) => {
    const x = 0.3 + i * 3.2;
    // カード
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.75, w: 2.95, h: 4.8,
      fill: { color: C.white }, shadow: mkShadow()
    });
    // 上部アクセント
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.75, w: 2.95, h: 0.07,
      fill: { color: st.color }
    });
    // 番号 + タイトル
    s.addText(st.num, {
      x: x + 0.15, y: 1.9, w: 0.5, h: 0.5,
      fontSize: 28, fontFace: "Calibri", color: st.color, bold: true, margin: 0
    });
    s.addText(st.title, {
      x: x + 0.6, y: 1.95, w: 2.1, h: 0.4,
      fontSize: 16, fontFace: "Calibri", color: C.heading, bold: true, margin: 0, valign: "middle"
    });
    // 区切り線
    s.addShape(pres.shapes.LINE, {
      x: x + 0.15, y: 2.5, w: 2.65, h: 0,
      line: { color: st.color, width: 1.5 }
    });
    // 説明
    s.addText(st.desc, {
      x: x + 0.15, y: 2.65, w: 2.65, h: 1.5,
      fontSize: 12, fontFace: "Calibri", color: C.text, margin: 0
    });
    // 具体例
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.1, y: 4.3, w: 2.75, h: 1.1,
      fill: { color: "F5F5F5" }
    });
    s.addText(st.sub, {
      x: x + 0.2, y: 4.35, w: 2.55, h: 1.0,
      fontSize: 8.5, fontFace: "Calibri", color: C.sub, margin: 0
    });
    // 矢印
    if (i < steps.length - 1) {
      s.addText("\u25B6", {
        x: x + 2.95, y: 3.0, w: 0.25, h: 0.5,
        fontSize: 16, color: C.gray_ln, align: "center", valign: "middle", margin: 0
      });
    }
  });

  // 下部メッセージ
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 6.7, w: 12.3, h: 0.5,
    fill: { color: "F0F0FF" }
  });
  s.addText("この ①→②→③→④ のサイクルを、AIエージェントチームが毎日自動で高速に回す = Daily PDCA", {
    x: 0.8, y: 6.72, w: 11.7, h: 0.45,
    fontSize: 13, fontFace: "Calibri", color: C.heading, bold: true, align: "center", margin: 0
  });
}

// ═══════════════════════════════════════════════
// Slide 4 — Claude Codeとは
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Claude Codeとは？", "AIが自律的にタスクを実行する新しいツール");
  addBottomBars(s);

  // 左: Claude説明
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 6.0, h: 4.8,
    fill: { color: "F5F5FF" }, shadow: mkShadow()
  });
  s.addText("Claudeとは", {
    x: 0.9, y: 1.85, w: 5, h: 0.4,
    fontSize: 18, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText("Anthropic社が開発したAIアシスタント。ChatGPTと同様に会話形式で使えますが、より長い文脈を理解し、複雑な分析・文書作成が得意です。", {
    x: 0.9, y: 2.3, w: 5.2, h: 0.7,
    fontSize: 12, fontFace: "Calibri", color: C.text, margin: 0
  });

  s.addText("Claude Code（CLI版）とは", {
    x: 0.9, y: 3.1, w: 5, h: 0.4,
    fontSize: 18, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "コマンドライン（ターミナル）でClaudeを操作するツール", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "ファイルの読み書き・Web検索・データ分析を自動実行", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "複数の「AIエージェント」を定義して並列実行が可能", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "Gmail / Slack / GA4 など外部ツールとも連携可能", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "スケジュール実行で毎日自動的にタスクを回せる", options: { bullet: true, fontSize: 12 } },
  ], { x: 0.9, y: 3.5, w: 5.2, h: 2.5, fontFace: "Calibri", color: C.text, paraSpaceAfter: 6, margin: 0 });

  // 右: 比較
  s.addText("従来のやり方 vs Claude Code", {
    x: 7.0, y: 1.85, w: 5.5, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });

  // 従来
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 2.35, w: 5.5, h: 1.8,
    fill: { color: "FFF0F0" }, shadow: mkShadow()
  });
  s.addText("従来: 手作業", {
    x: 7.3, y: 2.45, w: 5, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.accent3, bold: true, margin: 0
  });
  s.addText([
    { text: "毎朝ブラウザで競合サイトを巡回", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "Excelに手動でデータ入力", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "レポートを毎回ゼロから作成", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "担当者不在で情報が途絶える", options: { bullet: true, fontSize: 11 } },
  ], { x: 7.3, y: 2.85, w: 4.8, h: 1.2, fontFace: "Calibri", color: C.text, paraSpaceAfter: 3, margin: 0 });

  // Claude Code
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 4.35, w: 5.5, h: 2.2,
    fill: { color: "F0FFF0" }, shadow: mkShadow()
  });
  s.addText("Claude Code: 自動化", {
    x: 7.3, y: 4.45, w: 5, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.green, bold: true, margin: 0
  });
  s.addText([
    { text: "55情報源を毎日自動スキャン", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "データ収集→分析→レポート生成まで一気通貫", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "5つのAIエージェントが並列で作業", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "365日休まず稼働、データを蓄積", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "人間は意思決定に集中できる", options: { bullet: true, fontSize: 11 } },
  ], { x: 7.3, y: 4.85, w: 4.8, h: 1.5, fontFace: "Calibri", color: C.text, paraSpaceAfter: 3, margin: 0 });
}

// ═══════════════════════════════════════════════
// Slide 4 — AIエージェントチーム体制
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "AIエージェントチーム体制", "5つのAIエージェントがバーチャル組織として稼働");
  addBottomBars(s);

  const agents = [
    { name: "CMO", color: C.accent1, role: "全体戦略・KPI管理", desc: "ブランド戦略の策定、KPI進捗の監視、全エージェントの統括判断を担当。年間1億円目標の達成を統括する司令塔。" },
    { name: "Comm\nPlanner", color: C.accent2, role: "広告・SNS・CRM", desc: "コミュニケーション施策の立案・評価。広告運用、SNS戦略、CRM施策、メディアプランを策定・管理。" },
    { name: "Researcher", color: C.accent3, role: "市場調査・競合分析", desc: "55情報源から毎日データを収集。市場トレンド、競合動向、口コミ・レビュー、アクセス解析、広告効果を分析。" },
    { name: "CSO", color: C.accent4, role: "営業戦術・BtoB", desc: "酒販店・料飲店への営業戦略、商談パイプライン管理、顧客インサイトの把握と提案への反映。" },
    { name: "CTO", color: C.accent5, role: "技術改善・自動化", desc: "プロンプト最適化、エージェント動作品質の監視、技術改善タスクの優先度管理、自動化推進。" },
  ];

  agents.forEach((ag, i) => {
    const x = 0.5 + i * 2.5;
    // カード背景
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.7, w: 2.3, h: 4.6,
      fill: { color: C.white }, shadow: mkShadow()
    });
    // 上部アクセント
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.7, w: 2.3, h: 0.08,
      fill: { color: ag.color }
    });
    // アイコン円
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.65, y: 1.95, w: 1.0, h: 1.0,
      fill: { color: ag.color, transparency: 15 }
    });
    s.addText(ag.name, {
      x: x + 0.65, y: 2.1, w: 1.0, h: 0.7,
      fontSize: ag.name.includes("\n") ? 10 : 12, fontFace: "Calibri", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    // 役割
    s.addText(ag.role, {
      x: x + 0.1, y: 3.15, w: 2.1, h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: ag.color, bold: true,
      align: "center", margin: 0
    });
    // 説明
    s.addText(ag.desc, {
      x: x + 0.15, y: 3.6, w: 2.0, h: 2.5,
      fontSize: 10, fontFace: "Calibri", color: C.text,
      margin: 0, valign: "top"
    });
  });

  // 下部注釈
  s.addText("各エージェントは agents/*.md ファイルで役割・ツール・読み込みデータを定義。共通ルール（_common-rules.md）で品質基準を統一。", {
    x: 0.5, y: 6.5, w: 12, h: 0.4,
    fontSize: 10, fontFace: "Calibri", color: C.sub, italic: true, margin: 0
  });
}

// ═══════════════════════════════════════════════
// Slide 5 — Daily PDCAの6フェーズ全体像
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Daily PDCA ― 6フェーズ全体像", "毎日自動実行される6つのフェーズ");
  addBottomBars(s);

  const phases = [
    { phase: "Phase 0", title: "データ収集", desc: "Researcher\n55情報源+当月売上\nを自動収集", color: C.accent3, y: 1.9 },
    { phase: "Phase 1", title: "インプット\n読み込み", desc: "全エージェント\n販売実績・KPI\nメール・Slack", color: C.blue, y: 1.9 },
    { phase: "Phase 2", title: "並列レビュー", desc: "3エージェント\nComm / CSO /\nCTO が並列実行", color: C.accent2, y: 1.9 },
    { phase: "Phase 3", title: "CMO統括\n判断", desc: "月次KPI着地見込\nGAP要因分析\n活動修正提案", color: C.accent1, y: 1.9 },
    { phase: "Phase 4", title: "修正・再考", desc: "必要箇所を\n日付付き追記で\n修正", color: C.accent5, y: 1.9 },
    { phase: "Phase 5", title: "アウトプット\n生成", desc: "KPI連動型\n日次レポート\nExcel 5種", color: C.green, y: 1.9 },
  ];

  phases.forEach((ph, i) => {
    const x = 0.3 + i * 2.12;
    // フェーズ番号バッジ
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: ph.y, w: 1.95, h: 0.4,
      fill: { color: ph.color }
    });
    s.addText(ph.phase, {
      x: x, y: ph.y, w: 1.95, h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    // タイトル
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: ph.y + 0.4, w: 1.95, h: 1.2,
      fill: { color: C.white }, shadow: mkShadow(),
      line: { color: ph.color, width: 1 }
    });
    s.addText(ph.title, {
      x: x + 0.05, y: ph.y + 0.45, w: 1.85, h: 1.1,
      fontSize: 12, fontFace: "Calibri", color: C.heading, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    // 説明
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: ph.y + 1.7, w: 1.95, h: 1.3,
      fill: { color: "F8F8F8" }
    });
    s.addText(ph.desc, {
      x: x + 0.05, y: ph.y + 1.75, w: 1.85, h: 1.2,
      fontSize: 10, fontFace: "Calibri", color: C.text,
      align: "center", valign: "middle", margin: 0
    });
    // 矢印
    if (i < phases.length - 1) {
      s.addText("\u25B6", {
        x: x + 1.95, y: ph.y + 0.7, w: 0.17, h: 0.5,
        fontSize: 12, color: C.sub, align: "center", valign: "middle", margin: 0
      });
    }
  });

  // 下部フロー説明
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.2, w: 12.3, h: 1.8,
    fill: { color: "F5F5FF" }, shadow: mkShadow()
  });
  s.addText("実行の流れ", {
    x: 0.8, y: 5.3, w: 3, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "Phase 0 → Phase 1 は順次実行（Researcherの収集結果を他エージェントが利用するため）", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "Phase 2 は3エージェントが並列実行（Communication Planner / CSO / CTO）で時間短縮", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "Phase 3 でCMOが月次KPI着地見込・GAP要因分析 → Phase 4 で活動修正 → Phase 5 でKPI連動型レポート", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "完了後、チャネル別KPI進捗・着地見込・GAP要因・活動修正提案をユーザーに自動報告", options: { bullet: true, fontSize: 11 } },
  ], { x: 0.8, y: 5.7, w: 11.5, h: 1.2, fontFace: "Calibri", color: C.text, paraSpaceAfter: 4, margin: 0 });
}

// ═══════════════════════════════════════════════
// Slide 6 — Phase 0: Researcherの55情報源
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Phase 0: Researcherの自動データ収集", "毎日55の情報源から最新データを自動収集・分析");
  addBottomBars(s);

  // 全12カテゴリを6列×2段で配置
  const allSources = [
    // 上段6カテゴリ
    { cat: "日本酒メディア", count: "4", items: "SAKETIMES\nたのしいお酒.jp\n日本酒造組合中央会\nPR TIMES", color: C.accent1 },
    { cat: "ECモール", count: "4", items: "Amazon 売れ筋\n楽天市場\nYahoo!ショッピング\nMakuake酒器", color: C.accent2 },
    { cat: "メーカーサイト", count: "8", items: "田島硝子 / 廣田硝子\n能作 / 木本硝子\nRIEDEL / プロスト\nうつわ / iichi/Creema", color: C.accent3 },
    { cat: "SNS・動画", count: "5", items: "Instagram / Facebook\nTikTok / X\nYouTube", color: C.accent4 },
    { cat: "自社レビュー", count: "2", items: "Shopify商品レビュー\nAmazonレビュー", color: C.accent5 },
    { cat: "セラーセントラル", count: "3", items: "ビジネスレポート\n広告レポート\nレビュー管理", color: C.blue },
    // 下段6カテゴリ
    { cat: "検索トレンド", count: "5", items: "Googleトレンド\nUbersuggest\nラッコキーワード\nAmazon / 楽天検索", color: C.teal },
    { cat: "GA4解析", count: "3", items: "SHUWAN統合版\nShopifyサイト\nShopifyQL API", color: C.green },
    { cat: "LP分析", count: "2", items: "Microsoft Clarity\nGA4エンゲージメント", color: "5C6BC0" },
    { cat: "Amazon酒器\nカテゴリ分析", count: "4", items: "売れ筋ランキング\n口コミ分析\nキーワード分析\n広告スポンサー分析", color: C.accent3 },
    { cat: "Google広告\n投資効果", count: "3", items: "PMAX/リスティング\n検索語句レポート\nKPI管理表(MER)", color: C.accent4 },
    { cat: "当月売上実績\n(着地見込用)", count: "4", items: "Shopify当月売上\nAmazon当月売上\nGoogle広告当月実績\nBtoB当月受注", color: C.accent3 },
  ];

  allSources.forEach((src, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const x = 0.3 + col * 2.12;
    const y = 1.7 + row * 2.85;
    const cardW = 1.95;
    const cardH = 2.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: cardW, h: cardH,
      fill: { color: C.white }, shadow: mkShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: cardW, h: 0.06,
      fill: { color: src.color }
    });
    s.addText(src.count, {
      x: x, y: y + 0.1, w: 0.55, h: 0.4,
      fontSize: 20, fontFace: "Calibri", color: src.color, bold: true, align: "center", margin: 0
    });
    s.addText(src.cat, {
      x: x + 0.5, y: y + 0.12, w: 1.35, h: 0.4,
      fontSize: 9, fontFace: "Calibri", color: C.heading, bold: true, margin: 0, valign: "middle"
    });
    s.addShape(pres.shapes.LINE, {
      x: x + 0.15, y: y + 0.58, w: cardW - 0.3, h: 0,
      line: { color: C.gray_ln, width: 0.5 }
    });
    s.addText(src.items, {
      x: x + 0.1, y: y + 0.65, w: cardW - 0.2, h: cardH - 0.8,
      fontSize: 8, fontFace: "Calibri", color: C.text, margin: 0
    });
  });
}

// ═══════════════════════════════════════════════
// Slide 7 — Phase 2-3: 並列レビューとCMO統括
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Phase 2-3: 並列レビューとCMO統括判断", "3エージェントが並列でレビューし、CMOが統合判断");
  addBottomBars(s);

  // Phase 2 エリア
  s.addText("Phase 2: 並列レビュー", {
    x: 0.5, y: 1.7, w: 4, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.accent2, bold: true, margin: 0
  });
  s.addText("3エージェントが同時に各担当領域をレビュー（時間効率の最大化）", {
    x: 0.5, y: 2.1, w: 7.5, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: C.sub, margin: 0
  });

  const reviewAgents = [
    { name: "Communication\nPlanner", color: C.accent2, items: "統合コミュプラン\nCRM施策\nメディア・SNS施策\n\n施策進捗の評価\nKPI未達施策の改善案" },
    { name: "CSO", color: C.accent4, items: "顧客インサイト\n営業戦術\n商談パイプライン\n\n営業KPI達成度\n酒販店アプローチ進捗" },
    { name: "CTO", color: C.accent5, items: "プロンプト集\nClaude Code活用Tips\n技術改善タスク\n\nエージェント品質\n自動化対象の特定" },
  ];

  reviewAgents.forEach((ag, i) => {
    const x = 0.5 + i * 2.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 2.55, w: 2.5, h: 3.5,
      fill: { color: C.white }, shadow: mkShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 2.55, w: 2.5, h: 0.07,
      fill: { color: ag.color }
    });
    s.addText(ag.name, {
      x: x + 0.1, y: 2.7, w: 2.3, h: 0.5,
      fontSize: 13, fontFace: "Calibri", color: ag.color, bold: true, align: "center", margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: x + 0.3, y: 3.25, w: 1.9, h: 0,
      line: { color: C.gray_ln, width: 0.5 }
    });
    s.addText(ag.items, {
      x: x + 0.15, y: 3.35, w: 2.2, h: 2.5,
      fontSize: 10, fontFace: "Calibri", color: C.text, margin: 0
    });
  });

  // 矢印
  s.addText("\u25B6", {
    x: 8.3, y: 3.8, w: 0.5, h: 0.5,
    fontSize: 24, color: C.sub, align: "center", valign: "middle", margin: 0
  });

  // Phase 3 CMO
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.9, y: 1.7, w: 4.0, h: 5.2,
    fill: { color: "FFF5F9" }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.9, y: 1.7, w: 4.0, h: 0.07,
    fill: { color: C.accent1 }
  });
  s.addText("Phase 3: CMO統括判断（KPI連動型）", {
    x: 9.1, y: 1.9, w: 3.6, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.accent1, bold: true, margin: 0
  });
  s.addText("月次KPI目標vs実績vs着地見込\nのGAP分析を中心に統括:", {
    x: 9.1, y: 2.35, w: 3.6, h: 0.5,
    fontSize: 10, fontFace: "Calibri", color: C.text, margin: 0
  });

  const judgments = [
    "月次KPI着地見込・GAP分析\nチャネル別 目標/実績/見込/GAP/判定",
    "GAP要因分析\n流入不足? CVR低下? パイプライン不足?",
    "チャンス・課題の優先順位付け\nResearcher分析+各エージェント知見を統合",
    "活動修正提案\n月次活動計画との照合→追加/強化/中止",
    "広告戦略修正\nPMAX検索語句・リスティング・Amazon広告",
    "年間着地予測\n四半期マイルストーン進捗・チャネル配分見直し",
  ];

  judgments.forEach((j, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 9.1, y: 3.0 + i * 0.62, w: 3.5, h: 0.55,
      fill: { color: C.white }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 9.1, y: 3.0 + i * 0.62, w: 0.06, h: 0.55,
      fill: { color: C.accent1 }
    });
    s.addText(j, {
      x: 9.3, y: 3.0 + i * 0.62, w: 3.2, h: 0.55,
      fontSize: 8, fontFace: "Calibri", color: C.text, margin: 0, valign: "middle"
    });
  });
}

// ═══════════════════════════════════════════════
// Slide 8 — アウトプット例
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "アウトプット（KPI連動型レポート）", "毎日自動生成されるKPI連動型の日次レポート");
  addBottomBars(s);

  // 左: KPI連動型日次レビュー
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 5.8, h: 3.5,
    fill: { color: "F8F8FC" }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 0.08, h: 3.5,
    fill: { color: C.accent2 }
  });
  s.addText("KPI連動型 日次レビューレポート", {
    x: 0.9, y: 1.8, w: 5, h: 0.4,
    fontSize: 15, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText("output/daily-review-YYYY-MM-DD.md", {
    x: 0.9, y: 2.2, w: 5, h: 0.25,
    fontSize: 9, fontFace: "Calibri", color: C.sub, italic: true, margin: 0
  });
  s.addText([
    { text: "当月KPI進捗・着地見込テーブル（チャネル別: 目標/実績/見込/GAP/判定）", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "GAP要因分析（未達・超過の要因特定: 流入/CVR/単価/パイプライン）", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "チャンス・課題（優先度順テーブル: 影響度大/中/小）", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "活動修正提案（月次活動計画との照合→追加/強化/中止）", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "広告戦略修正（PMAX検索語句・リスティング・Amazon広告）", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "要対応事項（人間の判断が必要な項目）", options: { bullet: true, fontSize: 10 } },
  ], { x: 0.9, y: 2.6, w: 5, h: 2.2, fontFace: "Calibri", color: C.text, paraSpaceAfter: 4, margin: 0 });

  // 右上: Excelレポート
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.7, w: 5.8, h: 2.0,
    fill: { color: "F0FFF0" }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.7, w: 0.08, h: 2.0,
    fill: { color: C.green }
  });
  s.addText("Excelレポート自動生成（6種）", {
    x: 7.2, y: 1.8, w: 5, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "月次KPI進捗・GAP分析.xlsx（9シート構成）", options: { bullet: true, breakLine: true, fontSize: 10, bold: true, color: C.accent1 } },
    { text: "  CH別個数/売上/レベシェア/着地見込/要因分解/チャンス課題/活動修正/BtoB/前年実績", options: { breakLine: true, fontSize: 8, color: C.sub } },
    { text: "KPI年間計画 / 市場競合分析 / メディアプラン / 営業計画 / 技術支援（各エージェント別）", options: { bullet: true, fontSize: 10 } },
  ], { x: 7.2, y: 2.2, w: 5, h: 1.3, fontFace: "Calibri", color: C.text, paraSpaceAfter: 2, margin: 0 });

  // 右下: 月次KPIトラッキング
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 3.9, w: 5.8, h: 1.3,
    fill: { color: "FFF5F9" }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 3.9, w: 0.08, h: 1.3,
    fill: { color: C.accent1 }
  });
  s.addText("月次KPIトラッキング（自動更新）", {
    x: 7.2, y: 4.0, w: 5, h: 0.35,
    fontSize: 13, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "チャネル別 個数/売上/レベシェア 目標vs実績", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "着地見込・GAP分析を毎日自動更新", options: { bullet: true, breakLine: true, fontSize: 10 } },
    { text: "判定: ◎120%↑ / ○100-119% / △80-99% / ×80%↓", options: { bullet: true, fontSize: 10 } },
  ], { x: 7.2, y: 4.4, w: 5, h: 0.7, fontFace: "Calibri", color: C.text, paraSpaceAfter: 2, margin: 0 });

  // 下部: データ蓄積の仕組み
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.5, w: 12.3, h: 1.5,
    fill: { color: C.gray_bg }, shadow: mkShadow()
  });
  s.addText("データ蓄積の仕組み", {
    x: 0.8, y: 5.6, w: 4, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "既存データは上書きせず、日付付きで追記 → 変化の履歴が自動的に蓄積される", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "context/ フォルダに戦略・市場・コミュニケーション・営業・技術の5領域で構造化保存", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "過去データを参照して「前月比」「前週比」の変化を自動検出", options: { bullet: true, fontSize: 11 } },
  ], { x: 0.8, y: 6.0, w: 11.5, h: 0.9, fontFace: "Calibri", color: C.text, paraSpaceAfter: 4, margin: 0 });
}

// ═══════════════════════════════════════════════
// Slide 9 — 連携ツール
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "外部ツール連携", "MCPサーバーで様々なツールとシームレスに接続");
  addBottomBars(s);

  s.addText("MCP（Model Context Protocol）とは？", {
    x: 0.5, y: 1.7, w: 12, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText("Claude Codeが外部サービスのデータを直接読み書きできる仕組み。APIキーの設定だけで、Claudeがツールを「使える」ようになります。", {
    x: 0.5, y: 2.1, w: 12, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.text, margin: 0
  });

  const tools = [
    { name: "Gmail", desc: "SHUWAN関連メールの\n自動読み込み・分類\n（売上報告・商談・PR）", color: C.accent3 },
    { name: "Slack", desc: "チャンネルの投稿を\n自動検索・取り込み\n（営業報告・議論）", color: C.accent2 },
    { name: "GA4", desc: "アクセス解析データ\nPV・流入元・CVR・\nデバイス別分析", color: C.blue },
    { name: "Shopify", desc: "EC売上・注文データ\nファネル分析\n商品別パフォーマンス", color: C.green },
    { name: "Clarity", desc: "ヒートマップ\nセッション録画\nUI/UX改善ポイント", color: "5C6BC0" },
    { name: "Google\nAds", desc: "PMAX・リスティング\n投資効果・ROAS\n検索語句分析", color: C.accent4 },
  ];

  tools.forEach((t, i) => {
    const col = i % 6;
    const x = 0.5 + col * 2.1;
    const y = 2.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 1.9, h: 2.5,
      fill: { color: C.white }, shadow: mkShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 1.9, h: 0.06,
      fill: { color: t.color }
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.55, y: y + 0.2, w: 0.8, h: 0.8,
      fill: { color: t.color, transparency: 15 }
    });
    s.addText(t.name, {
      x: x + 0.55, y: y + 0.35, w: 0.8, h: 0.5,
      fontSize: 9, fontFace: "Calibri", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    s.addText(t.desc, {
      x: x + 0.1, y: y + 1.15, w: 1.7, h: 1.2,
      fontSize: 9, fontFace: "Calibri", color: C.text, align: "center", margin: 0
    });
  });

  // 補足
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.5, w: 12.3, h: 1.5,
    fill: { color: "F5F5FF" }, shadow: mkShadow()
  });
  s.addText("接続のしくみ", {
    x: 0.8, y: 5.6, w: 3, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "MCPサーバーを settings.json に追加するだけで接続完了（コーディング不要）", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "各ツールへの認証情報（APIキー等）は初回のみ設定。以降はClaudeが自動的にアクセス", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "新しいツールの追加も簡単 — MCPレジストリから検索して設定するだけ", options: { bullet: true, fontSize: 11 } },
  ], { x: 0.8, y: 6.0, w: 11.5, h: 0.9, fontFace: "Calibri", color: C.text, paraSpaceAfter: 4, margin: 0 });
}

// ═══════════════════════════════════════════════
// Slide 10 — 設計フロー（ゼロからどう設計したか）
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "設計フロー ― ゼロからどう設計したか", "参考: かいちのAI大学「Claude Codeで会社経営を行う方法」");
  addBottomBars(s);

  // 5ステップの設計フロー
  const designSteps = [
    {
      step: "Step 1",
      title: "フォルダ分けでAIエージェントを配置",
      detail: "agents/ フォルダに5つのエージェント定義ファイル（.md）を作成",
      shuwan: "agents/cmo.md / communication-planner.md / researcher.md / cso.md / cto.md",
      color: C.accent1,
    },
    {
      step: "Step 2",
      title: "ナレッジを固めて置く",
      detail: "エージェントが参照する知識・データをファイルとして整理・格納",
      shuwan: "context/memos/shuwan-master-input.md, sales-summary.md, KPI計画Excel 等",
      color: C.accent2,
    },
    {
      step: "Step 3",
      title: "ディレクトリ構造をつくる",
      detail: "ワークスペースに役割別のフォルダ構成を設計",
      shuwan: "context/strategy/ market/ communication/ sales/ tech/ + output/",
      color: C.accent5,
    },
    {
      step: "Step 4",
      title: "全エージェントに共通ルールを定める",
      detail: "全エージェントが守るべきルール（書式・更新ルール等）を共通ファイルに定義",
      shuwan: "agents/_common-rules.md（§1〜§6: 日付追記・数値根拠・整合性チェック等）",
      color: C.accent4,
    },
    {
      step: "Step 5",
      title: "CLAUDE.MD で全てのファイルに適用",
      detail: "プロジェクトルートの設定ファイルで、全エージェントに共通設定を一括適用",
      shuwan: "CLAUDE.md → エージェント定義・コンテキスト・出力先を統合管理",
      color: C.accent3,
    },
  ];

  designSteps.forEach((ds, i) => {
    const y = 1.55 + i * 1.15;
    // 背景カード
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: y, w: 12.3, h: 1.02,
      fill: { color: i % 2 === 0 ? "F8F8FC" : C.white }, shadow: mkShadow()
    });
    // 左アクセントバー
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: y, w: 0.07, h: 1.02,
      fill: { color: ds.color }
    });
    // ステップ番号バッジ
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.75, y: y + 0.12, w: 0.75, h: 0.35,
      fill: { color: ds.color }, rectRadius: 0.05
    });
    s.addText(ds.step, {
      x: 0.75, y: y + 0.12, w: 0.75, h: 0.35,
      fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0
    });
    // タイトル
    s.addText(ds.title, {
      x: 1.65, y: y + 0.08, w: 4.5, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
    });
    // 説明
    s.addText(ds.detail, {
      x: 1.65, y: y + 0.48, w: 4.5, h: 0.4,
      fontSize: 10.5, fontFace: "Calibri", color: C.text, margin: 0
    });
    // 矢印
    s.addText("\u25B6", {
      x: 6.2, y: y + 0.15, w: 0.3, h: 0.7,
      fontSize: 14, color: C.gray_ln, align: "center", valign: "middle", margin: 0
    });
    // SHUWAN実装例ラベル
    s.addText("SHUWAN実装", {
      x: 6.6, y: y + 0.08, w: 1.2, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: ds.color, bold: true, margin: 0
    });
    // SHUWAN実装内容
    s.addText(ds.shuwan, {
      x: 6.6, y: y + 0.38, w: 5.9, h: 0.55,
      fontSize: 10, fontFace: "Calibri", color: C.sub, margin: 0, valign: "top"
    });
    // 下矢印（最後以外）
    if (i < designSteps.length - 1) {
      s.addText("\u25BC", {
        x: 3.0, y: y + 0.95, w: 0.5, h: 0.22,
        fontSize: 10, color: C.gray_ln, align: "center", margin: 0
      });
    }
  });

  // 下部まとめ
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 7.1, w: 12.3, h: 0.25,
    fill: { color: "F0F0FF" }
  });
  s.addText("参考: かいちのAI大学「Claude Codeで会社経営を行う方法」― この5ステップに沿ってSHUWAN PDCAを構築", {
    x: 0.8, y: 7.1, w: 11.7, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: C.heading, bold: true, align: "center", margin: 0
  });
}

// ═══════════════════════════════════════════════
// Slide 11 — 構築ステップ
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "構築ステップ", "ゼロから Daily PDCA を立ち上げるまでの7ステップ");
  addBottomBars(s);

  const steps = [
    { step: "1", title: "Claude Code\nインストール", desc: "Node.js環境にClaude Codeをインストール。Anthropic APIキーを設定。", color: C.accent1 },
    { step: "2", title: "マスター\nインプット作成", desc: "商品情報・販売実績・目標値をshuwan-master-input.mdに集約。", color: C.accent2 },
    { step: "3", title: "エージェント\n定義作成", desc: "agents/*.mdで5つのエージェントの役割・ツール・読み込みファイルを定義。", color: C.accent3 },
    { step: "4", title: "コンテキスト\nフォルダ構成", desc: "context/配下にstrategy/ market/ communication/ sales/ tech/を作成。", color: C.accent4 },
    { step: "5", title: "PDCAオーケスト\nレーター作成", desc: "daily-pdca.mdで6フェーズの実行順序と各エージェントの起動手順を定義。", color: C.accent5 },
    { step: "6", title: "スケジュール\nタスク設定", desc: "scheduled-tasks/で毎日自動実行を設定。人手を介さず毎朝PDCAが回る。", color: C.accent6 },
    { step: "7", title: "ダッシュボード\n構築", desc: "ai-agent-dashboardで進捗可視化。各エージェントの状態をリアルタイム表示。", color: C.green },
  ];

  steps.forEach((st, i) => {
    const x = 0.2 + i * 1.85;
    // ステップ番号
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.5, y: 1.75, w: 0.65, h: 0.65,
      fill: { color: st.color }
    });
    s.addText(st.step, {
      x: x + 0.5, y: 1.8, w: 0.65, h: 0.55,
      fontSize: 18, fontFace: "Calibri", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    // 矢印
    if (i < steps.length - 1) {
      s.addText("\u25B6", {
        x: x + 1.55, y: 1.85, w: 0.3, h: 0.45,
        fontSize: 10, color: C.gray_ln, align: "center", valign: "middle", margin: 0
      });
    }
    // タイトル
    s.addText(st.title, {
      x: x, y: 2.55, w: 1.65, h: 0.55,
      fontSize: 10, fontFace: "Calibri", color: C.heading, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    // カード
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 3.2, w: 1.65, h: 2.0,
      fill: { color: C.white }, shadow: mkShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 3.2, w: 1.65, h: 0.05,
      fill: { color: st.color }
    });
    s.addText(st.desc, {
      x: x + 0.08, y: 3.35, w: 1.49, h: 1.7,
      fontSize: 9, fontFace: "Calibri", color: C.text, margin: 0, valign: "top"
    });
  });

  // 下部補足
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.6, w: 12.3, h: 1.4,
    fill: { color: "F5FFF5" }, shadow: mkShadow()
  });
  s.addText("ポイント", {
    x: 0.8, y: 5.7, w: 3, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0
  });
  s.addText([
    { text: "全ての設定はMarkdownファイル（.md）で記述 — プログラミング知識は不要", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "エージェントの追加・変更はファイルを編集するだけ。コードの書き換えは不要", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "段階的に構築可能 — まずStep 1-3で基本を作り、徐々に拡張していくのがおすすめ", options: { bullet: true, fontSize: 11 } },
  ], { x: 0.8, y: 6.1, w: 11.5, h: 0.8, fontFace: "Calibri", color: C.text, paraSpaceAfter: 4, margin: 0 });
}

// ═══════════════════════════════════════════════
// Slide 11 — 導入効果・まとめ
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.dark_bg };
  const colors = [C.accent1, C.accent2, C.accent3, C.accent4, C.accent5, C.accent6];
  colors.forEach((c, i) => {
    const barW = 13.33 / colors.length;
    s.addShape(pres.shapes.RECTANGLE, {
      x: i * barW, y: 0, w: barW + 0.01, h: 0.08,
      fill: { color: c }, line: { color: c }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: i * barW, y: 7.35, w: barW + 0.01, h: 0.15,
      fill: { color: c }, line: { color: c }
    });
  });

  s.addText("SHUWAN", {
    x: 0.8, y: 0.5, w: 3, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: "888899",
    charSpacing: 5, margin: 0
  });
  s.addText("導入効果とまとめ", {
    x: 0.8, y: 0.9, w: 10, h: 0.6,
    fontSize: 30, fontFace: "Calibri", color: "FFFFFF", bold: true, margin: 0
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 1.6, w: 4, h: 0,
    line: { color: C.accent5, width: 2 }
  });

  const effects = [
    { title: "一気通貫のKPI連動サイクル", desc: "着地見込→示唆→チャンス・課題→\n活動修正を毎日自動で高速に回す。\n戦略の上流まで一気通貫。", color: C.accent3 },
    { title: "意思決定への集中", desc: "AIが55情報源の調査・分析・GAP要因\n特定・活動修正案まで自動生成。\n人間は判断と実行に集中できる。", color: C.accent2 },
    { title: "データの蓄積と一貫性", desc: "日付付き追記で変化の履歴が自動蓄積。\n365日休まず一貫したKPIトラッキング。", color: C.accent5 },
    { title: "コスト効率", desc: "5人分のAIチームが24時間稼働。\n少人数チームでも大企業並みの\nマーケティングオペレーション。", color: C.green },
  ];

  effects.forEach((ef, i) => {
    const x = 0.5 + (i % 2) * 6.2;
    const y = 1.9 + Math.floor(i / 2) * 2.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 5.8, h: 2.2,
      fill: { color: "2A2A3E" }, shadow: mkShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 0.08, h: 2.2,
      fill: { color: ef.color }
    });
    s.addText(ef.title, {
      x: x + 0.4, y: y + 0.15, w: 5, h: 0.4,
      fontSize: 18, fontFace: "Calibri", color: ef.color, bold: true, margin: 0
    });
    s.addText(ef.desc, {
      x: x + 0.4, y: y + 0.65, w: 5, h: 1.3,
      fontSize: 13, fontFace: "Calibri", color: "CCCCDD", margin: 0
    });
  });

  s.addText("着地見込 → 示唆 → チャンス・課題 → 活動修正。この高速サイクルで、少人数でも戦える。", {
    x: 0.8, y: 6.6, w: 11, h: 0.5,
    fontSize: 16, fontFace: "Calibri", color: C.accent6, italic: true, margin: 0
  });
}

// ═══════════════════════════════════════════════
// 保存
// ═══════════════════════════════════════════════
pres.writeFile({ fileName: "C:/Users/hara/OneDrive/デスクトップ/SHUWAN_DailyPDCA_構築ガイド_v5.pptx" })
  .then(() => console.log("DONE: SHUWAN_DailyPDCA_構築ガイド.pptx"))
  .catch(err => console.error(err));
