const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "SHUWAN 4月着地見込サマリー（週次レビュー 2026-04-10）";

// ── 雛形カラーパレット ──
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
  gray_bg: "F2F2F2",
  gray_ln: "D9D9D9",
  white:   "FFFFFF",
  green:   "27AE60",
  red:     "E74C3C",
  yellow:  "F39C12",
  navy:    "1B3A5C",
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
      x: 0.5, y: 1.05, w: 11, h: 0.35,
      fontSize: 11, fontFace: "Calibri", color: C.sub,
      margin: 0, italic: true
    });
  }
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 1.4, w: 12.3, h: 0,
    line: { color: C.gray_ln, width: 1 }
  });
}

// 判定マーク色
function judgColor(s) {
  if (s.includes("×")) return C.red;
  if (s.includes("△")) return C.yellow;
  if (s.includes("✓") || s.includes("◎") || s.includes("○")) return C.green;
  return C.text;
}

// 前月比色
function momColor(val) {
  const n = parseInt(val);
  if (isNaN(n)) return C.sub;
  return n >= 100 ? C.green : C.red;
}

// ═══════════════════════════════════════════════
// Slide 1 — 全体サマリー（4月着地見込 vs 3月確定）
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "全体サマリー（4月着地見込 vs 3月確定）", "週次レビュー 2026-04-10｜レンジ: 4/4〜4/10｜いまでや除外");

  const headerOpts = {
    fontSize: 10, fontFace: "Calibri", color: C.white, bold: true,
    fill: { color: C.navy }, align: "center", valign: "middle",
    border: { type: "solid", color: "FFFFFF", pt: 1 }, margin: [2,4,2,4]
  };
  const cellOpts = {
    fontSize: 10, fontFace: "Calibri", color: C.text, align: "center", valign: "middle",
    border: { type: "solid", color: C.gray_ln, pt: 0.5 }, margin: [2,4,2,4]
  };
  const totalOpts = {
    ...cellOpts, bold: true, fill: { color: "F0F0F0" }
  };

  const rows = [
    // Header
    [
      { text: "チャネル", options: { ...headerOpts, w: 1.3 } },
      { text: "3月確定\n(碗)", options: headerOpts },
      { text: "4月目標\n(碗)", options: headerOpts },
      { text: "4月月中実績\n(4/1-10)", options: { ...headerOpts, w: 2.2 } },
      { text: "4月着地見込\n(碗)", options: headerOpts },
      { text: "達成率", options: headerOpts },
      { text: "前月比", options: headerOpts },
    ],
    // 自社EC
    [
      { text: "自社EC", options: { ...cellOpts, align: "left", bold: true } },
      { text: "218", options: cellOpts },
      { text: "540", options: cellOpts },
      { text: "34件 / ¥330K", options: cellOpts },
      { text: "285", options: { ...cellOpts, bold: true } },
      { text: "53% ×", options: { ...cellOpts, color: C.red } },
      { text: "131%", options: { ...cellOpts, color: C.green } },
    ],
    // Amazon
    [
      { text: "Amazon", options: { ...cellOpts, align: "left", bold: true } },
      { text: "133", options: cellOpts },
      { text: "420", options: cellOpts },
      { text: "50件 / ¥221K", options: cellOpts },
      { text: "207", options: { ...cellOpts, bold: true } },
      { text: "49% ×", options: { ...cellOpts, color: C.red } },
      { text: "156%", options: { ...cellOpts, color: C.green } },
    ],
    // 酒販店
    [
      { text: "酒販店", options: { ...cellOpts, align: "left", bold: true } },
      { text: "269", options: cellOpts },
      { text: "300", options: cellOpts },
      { text: "200碗", options: cellOpts },
      { text: "250", options: { ...cellOpts, bold: true } },
      { text: "83% △", options: { ...cellOpts, color: C.yellow } },
      { text: "93%", options: { ...cellOpts, color: C.red } },
    ],
    // 外販
    [
      { text: "外販", options: { ...cellOpts, align: "left", bold: true } },
      { text: "185", options: cellOpts },
      { text: "410", options: cellOpts },
      { text: "70碗\n(エルスタイル+\nなびっぴドットコム)", options: { ...cellOpts, fontSize: 8 } },
      { text: "120", options: { ...cellOpts, bold: true } },
      { text: "29% ×", options: { ...cellOpts, color: C.red } },
      { text: "65%", options: { ...cellOpts, color: C.red } },
    ],
    // 料飲店
    [
      { text: "料飲店", options: { ...cellOpts, align: "left", bold: true } },
      { text: "16", options: cellOpts },
      { text: "175", options: cellOpts },
      { text: "0碗", options: cellOpts },
      { text: "50", options: { ...cellOpts, bold: true } },
      { text: "29% ×", options: { ...cellOpts, color: C.red } },
      { text: "313%", options: { ...cellOpts, color: C.green } },
    ],
    // MAKUAKE
    [
      { text: "MAKUAKE", options: { ...cellOpts, align: "left", bold: true, color: C.sub } },
      { text: "0", options: { ...cellOpts, color: C.sub } },
      { text: "0", options: { ...cellOpts, color: C.sub } },
      { text: "—", options: { ...cellOpts, color: C.sub } },
      { text: "0", options: { ...cellOpts, color: C.sub } },
      { text: "—", options: { ...cellOpts, color: C.sub } },
      { text: "—", options: { ...cellOpts, color: C.sub } },
    ],
    // 合計
    [
      { text: "合計", options: { ...totalOpts, align: "left" } },
      { text: "821", options: totalOpts },
      { text: "1,845", options: totalOpts },
      { text: "304碗", options: totalOpts },
      { text: "912", options: { ...totalOpts, fontSize: 12 } },
      { text: "49% ×", options: { ...totalOpts, color: C.red } },
      { text: "111%", options: { ...totalOpts, color: C.green } },
    ],
  ];

  s.addTable(rows, {
    x: 0.4, y: 1.6, w: 12.5,
    colW: [1.3, 1.2, 1.2, 2.2, 1.5, 1.2, 1.2],
    rowH: [0.5, 0.45, 0.45, 0.45, 0.6, 0.45, 0.4, 0.5],
    autoPage: false,
  });

  // 注釈
  s.addText("※ いまでや経由（12碗）はレベシェア対象外のため全チャネルからカウント除外", {
    x: 0.5, y: 6.4, w: 10, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.sub, italic: true, margin: 0
  });
  s.addText("※ 外販ベースシナリオ: エルスタイル36碗+ブラックス70碗+TANP8碗+GiftFUL6碗=120碗（トロス成約で+60〜120碗の上振れ余地）", {
    x: 0.5, y: 6.65, w: 12, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.sub, italic: true, margin: 0
  });
  s.addText("※ 対目標49%（未達）だが対前月111%（成長基調）。4月目標は3月の2.8倍に設定されている点に留意", {
    x: 0.5, y: 6.9, w: 12, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.sub, italic: true, margin: 0
  });
}

// ═══════════════════════════════════════════════
// Slide 2 — レベシェア利益サマリー
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "レベシェア利益サマリー（4月着地見込 vs 3月確定）", "レベシェア利益 = 碗数 × チャネル単価 × 60%（限界利益率）× 60%（シンクロ取り分）");

  const headerOpts = {
    fontSize: 10, fontFace: "Calibri", color: C.white, bold: true,
    fill: { color: C.navy }, align: "center", valign: "middle",
    border: { type: "solid", color: "FFFFFF", pt: 1 }, margin: [2,4,2,4]
  };
  const cellOpts = {
    fontSize: 10, fontFace: "Calibri", color: C.text, align: "right", valign: "middle",
    border: { type: "solid", color: C.gray_ln, pt: 0.5 }, margin: [2,6,2,6]
  };
  const totalOpts = {
    ...cellOpts, bold: true, fill: { color: "F0F0F0" }
  };

  function fmtYen(n) {
    return "¥" + n.toLocaleString();
  }

  const rows = [
    // Header
    [
      { text: "チャネル", options: { ...headerOpts, w: 1.3 } },
      { text: "3月実績利益\n(円)", options: headerOpts },
      { text: "4月目標利益\n(円)", options: headerOpts },
      { text: "4月着地見込\n利益(円)", options: headerOpts },
      { text: "達成率", options: headerOpts },
      { text: "前月比", options: headerOpts },
    ],
    // 自社EC
    [
      { text: "自社EC", options: { ...cellOpts, align: "left", bold: true } },
      { text: fmtYen(253875), options: cellOpts },
      { text: fmtYen(560000), options: cellOpts },
      { text: fmtYen(395640), options: { ...cellOpts, bold: true } },
      { text: "71% △", options: { ...cellOpts, align: "center", color: C.yellow } },
      { text: "156%", options: { ...cellOpts, align: "center", color: C.green } },
    ],
    // Amazon
    [
      { text: "Amazon", options: { ...cellOpts, align: "left", bold: true } },
      { text: fmtYen(169969), options: cellOpts },
      { text: fmtYen(410000), options: cellOpts },
      { text: fmtYen(341640), options: { ...cellOpts, bold: true } },
      { text: "83% △", options: { ...cellOpts, align: "center", color: C.yellow } },
      { text: "201%", options: { ...cellOpts, align: "center", color: C.green } },
    ],
    // 酒販店
    [
      { text: "酒販店", options: { ...cellOpts, align: "left", bold: true } },
      { text: fmtYen(140425), options: cellOpts },
      { text: fmtYen(247000), options: cellOpts },
      { text: fmtYen(205920), options: { ...cellOpts, bold: true } },
      { text: "83% △", options: { ...cellOpts, align: "center", color: C.yellow } },
      { text: "147%", options: { ...cellOpts, align: "center", color: C.green } },
    ],
    // 外販
    [
      { text: "外販", options: { ...cellOpts, align: "left", bold: true } },
      { text: fmtYen(106804), options: cellOpts },
      { text: fmtYen(267000), options: cellOpts },
      { text: fmtYen(78192), options: { ...cellOpts, bold: true } },
      { text: "29% ×", options: { ...cellOpts, align: "center", color: C.red } },
      { text: "73%", options: { ...cellOpts, align: "center", color: C.red } },
    ],
    // 料飲店
    [
      { text: "料飲店", options: { ...cellOpts, align: "left", bold: true } },
      { text: fmtYen(12074), options: cellOpts },
      { text: fmtYen(114000), options: cellOpts },
      { text: fmtYen(53208), options: { ...cellOpts, bold: true } },
      { text: "47% ×", options: { ...cellOpts, align: "center", color: C.red } },
      { text: "441%", options: { ...cellOpts, align: "center", color: C.green } },
    ],
    // MAKUAKE
    [
      { text: "MAKUAKE", options: { ...cellOpts, align: "left", bold: true, color: C.sub } },
      { text: "¥0", options: { ...cellOpts, color: C.sub } },
      { text: "¥0", options: { ...cellOpts, color: C.sub } },
      { text: "¥0", options: { ...cellOpts, color: C.sub } },
      { text: "—", options: { ...cellOpts, align: "center", color: C.sub } },
      { text: "—", options: { ...cellOpts, align: "center", color: C.sub } },
    ],
    // 合計
    [
      { text: "合計", options: { ...totalOpts, align: "left" } },
      { text: fmtYen(683147), options: totalOpts },
      { text: fmtYen(1598000), options: totalOpts },
      { text: fmtYen(1074600), options: { ...totalOpts, fontSize: 11 } },
      { text: "67% △", options: { ...totalOpts, align: "center", color: C.yellow } },
      { text: "157%", options: { ...totalOpts, align: "center", color: C.green, fontSize: 12 } },
    ],
  ];

  s.addTable(rows, {
    x: 0.4, y: 1.6, w: 12.5,
    colW: [1.3, 2.0, 2.0, 2.2, 1.3, 1.3],
    rowH: [0.5, 0.45, 0.45, 0.45, 0.45, 0.45, 0.4, 0.5],
    autoPage: false,
  });

  // KPIコールアウト
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.9, w: 3.6, h: 1.0,
    fill: { color: "F0FFF0" }, line: { color: C.green, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText([
    { text: "前月比 ", options: { fontSize: 11, color: C.sub } },
    { text: "+¥391,453", options: { fontSize: 18, color: C.green, bold: true } },
    { text: "\n683K → 1,075K（+57%成長）", options: { fontSize: 10, color: C.sub } },
  ], { x: 0.6, y: 5.95, w: 3.4, h: 0.9, fontFace: "Calibri", margin: 0, valign: "middle" });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 4.4, y: 5.9, w: 3.6, h: 1.0,
    fill: { color: "FFF8F0" }, line: { color: C.yellow, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText([
    { text: "対目標 ", options: { fontSize: 11, color: C.sub } },
    { text: "67%（▲¥523K）", options: { fontSize: 18, color: C.yellow, bold: true } },
    { text: "\n4月目標1,598Kに対し1,075K", options: { fontSize: 10, color: C.sub } },
  ], { x: 4.5, y: 5.95, w: 3.4, h: 0.9, fontFace: "Calibri", margin: 0, valign: "middle" });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 8.3, y: 5.9, w: 4.5, h: 1.0,
    fill: { color: "F8F8FF" }, line: { color: C.gray_ln, width: 1 },
    rectRadius: 0.1
  });
  s.addText([
    { text: "単価: ", options: { fontSize: 9, color: C.sub } },
    { text: "EC¥3,858 / Amazon¥4,580 / 酒販¥2,288\n外販¥1,810 / 料飲¥2,956", options: { fontSize: 9, color: C.sub } },
    { text: "\n上振れ: トロス成約+60〜120碗 / Meta広告稼働+50〜80碗", options: { fontSize: 9, color: C.navy, bold: true } },
  ], { x: 8.4, y: 5.95, w: 4.3, h: 0.9, fontFace: "Calibri", margin: 0, valign: "middle" });
}

// ── 出力 ──
const outPath = "C:/Users/hara/.claude/output/SHUWAN_4月着地見込サマリー.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Created: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
