const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches
pres.title = "SHUWAN YouTube戦略 社内答申";

// ── 雛形カラーパレット（白背景＋下部カラーバー）──
const C = {
  bg:      "FFFFFF",
  text:    "333333",
  heading: "222222",
  sub:     "666666",
  accent1: "CD2ECB", // ピンク
  accent2: "E75EE2", // 紫
  accent3: "E44054", // 赤
  accent4: "F65445", // オレンジレッド
  accent5: "F6A623", // オレンジ
  accent6: "F9CB28", // イエロー
  gray_bg: "F2F2F2",
  gray_ln: "D9D9D9",
  white:   "FFFFFF",
};

// 下部カラーバー
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

// ヘッダーヘルパー（コンテンツスライド用）
function addHeader(slide, title, subtitle) {
  slide.addText("SHUWAN", {
    x: 0.5, y: 0.2, w: 3, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.sub,
    charSpacing: 5, margin: 0
  });
  slide.addText(title, {
    x: 0.5, y: 0.5, w: 10, h: 0.6,
    fontSize: 28, fontFace: "Calibri", color: C.heading,
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
  s.background = { color: C.bg };
  addBottomBars(s);

  s.addText("SHUWAN", {
    x: 0.8, y: 1.4, w: 8, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: C.sub,
    charSpacing: 8, margin: 0
  });
  s.addText("YouTube戦略 社内答申", {
    x: 0.8, y: 1.9, w: 11, h: 1.1,
    fontSize: 44, fontFace: "Calibri", color: C.heading,
    bold: true, margin: 0
  });
  s.addText("動画コンテンツ戦略：1本制作 × 多チャネル展開でサイト流入3,000へ", {
    x: 0.8, y: 3.1, w: 11, h: 0.5,
    fontSize: 17, fontFace: "Calibri", color: C.sub,
    margin: 0
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 3.75, w: 5, h: 0,
    line: { color: C.accent3, width: 2 }
  });

  const meta = [
    { label: "作成日",  val: "2026年4月" },
    { label: "作成者",  val: "株式会社シュワン" },
    { label: "目的",    val: "YouTube活用による流入増・CVR改善の全社方針共有" },
  ];
  meta.forEach((m, i) => {
    s.addText(m.label, { x: 0.8, y: 4.1 + i * 0.45, w: 1.4, h: 0.35,
      fontSize: 11, fontFace: "Calibri", color: C.accent3, bold: true, margin: 0 });
    s.addText(m.val,   { x: 2.3, y: 4.1 + i * 0.45, w: 8,   h: 0.35,
      fontSize: 11, fontFace: "Calibri", color: C.text, margin: 0 });
  });
}

// ═══════════════════════════════════════════════
// Slide 2 — KPI全体構造
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "事業全体像とKPI構造", "認知チャネル5つのうち B・C・Dがコア — チャネル全体に波及する活動に集中する");

  // ── 左エリア：認知チャネル → 購買ルート ──

  // セクションラベル
  s.addText("知るきっかけ（5チャネル）", { x: 0.5, y: 1.6, w: 3, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.sub, bold: true, margin: 0 });

  const channels = [
    { id: "A", label: "酒販店で知る",            core: false, color: C.sub },
    { id: "B", label: "YouTube・SNSで知る",      core: true,  color: C.accent5 },
    { id: "C", label: "検索（酒器）で知る",       core: true,  color: C.accent5 },
    { id: "D", label: "クチコミで知る",           core: true,  color: C.accent5 },
    { id: "E", label: "料飲店で知る・体験する",    core: false, color: C.sub },
  ];

  channels.forEach((ch, i) => {
    const y = 1.95 + i * 0.58;
    const bg = ch.core ? "FFF8E1" : C.white;
    const border = ch.core ? C.accent5 : C.gray_ln;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 3.0, h: 0.48,
      fill: { color: bg }, line: { color: border, width: ch.core ? 1.5 : 1 } });
    if (ch.core) {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.06, h: 0.48,
        fill: { color: C.accent5 }, line: { color: C.accent5 } });
    }
    s.addText(`${ch.id}. ${ch.label}`, { x: 0.65, y, w: 2.75, h: 0.48,
      fontSize: 11, fontFace: "Calibri", color: ch.core ? C.heading : C.sub,
      bold: ch.core, valign: "middle", margin: 0 });
  });

  // コアラベル
  s.addShape(pres.shapes.RECTANGLE, { x: 3.6, y: 2.4, w: 0.7, h: 1.3,
    fill: { color: "FFF3CD" }, line: { color: C.accent6, width: 1.5 } });
  s.addText("コア", { x: 3.6, y: 2.75, w: 0.7, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.accent4, bold: true, align: "center", margin: 0 });

  // ── 中央：購買ルート ──
  s.addText("購買ルート", { x: 4.45, y: 1.6, w: 2.5, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.sub, bold: true, margin: 0 });

  // 酒販店ルート（A→酒販店購入）
  s.addShape(pres.shapes.RECTANGLE, { x: 4.45, y: 1.95, w: 2.2, h: 0.48,
    fill: { color: C.gray_bg }, line: { color: C.gray_ln } });
  s.addText("酒販店で購入", { x: 4.55, y: 1.95, w: 2.0, h: 0.48,
    fontSize: 11, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0 });

  // 自社ECルート（B/C/D → 自社EC納得 → 購入）
  s.addShape(pres.shapes.RECTANGLE, { x: 4.45, y: 2.55, w: 2.2, h: 0.82,
    fill: { color: "EEF4FB" }, line: { color: C.accent2, width: 1.5 } });
  s.addText("自社ECで\n納得→購入", { x: 4.55, y: 2.58, w: 2.0, h: 0.76,
    fontSize: 11, fontFace: "Calibri", color: C.accent2, bold: true, valign: "middle", margin: 0 });

  // 料飲店ルート（E）
  s.addShape(pres.shapes.RECTANGLE, { x: 4.45, y: 3.5, w: 2.2, h: 0.48,
    fill: { color: C.gray_bg }, line: { color: C.gray_ln } });
  s.addText("料飲店で体験→購入", { x: 4.55, y: 3.5, w: 2.0, h: 0.48,
    fontSize: 11, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0 });

  // ── KPI 10個を3領域に ──
  s.addText("重点3領域 × KPI10個", { x: 0.5, y: 4.25, w: 4, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.sub, bold: true, margin: 0 });

  const areas = [
    { label: "サイト流入", kpis: "③流入数", color: C.accent5, w: 2.0 },
    { label: "CVR改善", kpis: "④遷移 ⑤CVR ⑥碗数", color: C.accent2, w: 2.35 },
    { label: "体験満足度UP", kpis: "⑩成功体験数", color: C.accent3, w: 2.0 },
  ];
  areas.forEach((a, i) => {
    const x = 0.5 + (i === 0 ? 0 : i === 1 ? 2.1 : 4.55);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.6, w: a.w, h: 0.75,
      fill: { color: C.white }, line: { color: a.color, width: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.6, w: a.w, h: 0.07,
      fill: { color: a.color }, line: { color: a.color } });
    s.addText(a.label, { x: x + 0.1, y: 4.7, w: a.w - 0.2, h: 0.25,
      fontSize: 10, fontFace: "Calibri", color: a.color, bold: true, margin: 0 });
    s.addText(a.kpis, { x: x + 0.1, y: 4.96, w: a.w - 0.2, h: 0.28,
      fontSize: 10, fontFace: "Calibri", color: C.text, margin: 0 });
  });

  // 酒販店・料飲店KPI（小さく補足）
  s.addText("酒販店 ①取扱企業数 ②発注数 ／ 料飲店 ⑦直アプローチ ⑧注文 ⑨導入点数", {
    x: 0.5, y: 5.45, w: 6, h: 0.25,
    fontSize: 9, fontFace: "Calibri", color: C.sub, margin: 0 });

  // ── 右エリア：ECファネル 実績 vs 計画 ──
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 1.6, w: 5.8, h: 4.2,
    fill: { color: C.gray_bg }, line: { color: C.gray_ln }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 1.6, w: 5.8, h: 0.07,
    fill: { color: C.accent3 }, line: { color: C.accent3 } });
  s.addText("自社ECファネル：実績 → 計画（5月以降）", { x: 7.2, y: 1.72, w: 5.4, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.accent3, bold: true, margin: 0 });

  // ファネルテーブル
  const funnelHdrs = ["", "実績", "転換率", "", "計画", "目標転換率"];
  const funnelHdrX = [7.15, 8.5, 9.5, 10.15, 10.45, 11.55];
  const funnelHdrW = [1.3, 0.9, 0.6, 0.3, 1.0, 1.1];
  funnelHdrs.forEach((h, i) => {
    if (h === "") return;
    s.addText(h, { x: funnelHdrX[i], y: 2.15, w: funnelHdrW[i], h: 0.28,
      fontSize: 9, fontFace: "Calibri", color: C.sub, bold: true, align: "center", margin: 0 });
  });

  const funnelRows = [
    { step: "販売ページ流入", actual: "1,800", rate: "",    target: "3,000",  tRate: "",     highlight: true },
    { step: "購入ボタンclick", actual: "450",  rate: "25%", target: "850",    tRate: "35%",  highlight: false },
    { step: "カート追加",      actual: "170",  rate: "40%", target: "380",    tRate: "45%",  highlight: false },
    { step: "購入人数",        actual: "60",   rate: "40%", target: "170",    tRate: "40%",  highlight: false },
    { step: "購入碗数",        actual: "110",  rate: "",    target: "300",    tRate: "",     highlight: true },
  ];

  funnelRows.forEach((r, i) => {
    const y = 2.5 + i * 0.52;
    const bg = r.highlight ? "FFF3CD" : (i % 2 === 0 ? C.white : "FAFAFA");
    s.addShape(pres.shapes.RECTANGLE, { x: 7.15, y, w: 5.5, h: 0.46,
      fill: { color: bg }, line: { color: C.gray_ln } });
    s.addText(r.step, { x: 7.2, y, w: 1.3, h: 0.46,
      fontSize: 10, fontFace: "Calibri", color: C.heading, valign: "middle", margin: 0 });
    s.addText(r.actual, { x: 8.5, y, w: 0.9, h: 0.46,
      fontSize: 11, fontFace: "Calibri", color: C.heading, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(r.rate, { x: 9.5, y, w: 0.6, h: 0.46,
      fontSize: 9, fontFace: "Calibri", color: C.sub, align: "center", valign: "middle", margin: 0 });
    // 矢印
    s.addText("→", { x: 10.15, y, w: 0.3, h: 0.46,
      fontSize: 12, fontFace: "Calibri", color: C.accent4, align: "center", valign: "middle", margin: 0 });
    const tColor = r.highlight ? C.accent3 : C.heading;
    s.addText(r.target, { x: 10.45, y, w: 1.0, h: 0.46,
      fontSize: 12, fontFace: "Calibri", color: tColor, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(r.tRate, { x: 11.55, y, w: 1.1, h: 0.46,
      fontSize: 9, fontFace: "Calibri", color: C.accent5, bold: true, align: "center", valign: "middle", margin: 0 });
  });

  // CVR行
  s.addShape(pres.shapes.RECTANGLE, { x: 7.15, y: 5.1, w: 5.5, h: 0.42,
    fill: { color: C.accent3 }, line: { color: C.accent3 } });
  s.addText("CVR", { x: 7.2, y: 5.1, w: 1.3, h: 0.42,
    fontSize: 10, fontFace: "Calibri", color: C.white, bold: true, valign: "middle", margin: 0 });
  s.addText("3.5%", { x: 8.5, y: 5.1, w: 1.6, h: 0.42,
    fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  s.addText("→", { x: 10.15, y: 5.1, w: 0.3, h: 0.42,
    fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText("5%", { x: 10.45, y: 5.1, w: 2.2, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

  // ── 下部：核心メッセージ ──
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.9, w: 12.3, h: 1.15,
    fill: { color: "FFF3CD" }, line: { color: C.accent6, width: 1.5 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.9, w: 0.07, h: 1.15,
    fill: { color: C.accent4 }, line: { color: C.accent4 } });
  s.addText("核心", { x: 0.7, y: 5.98, w: 1, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: C.accent4, bold: true, margin: 0 });
  s.addText(
    "B（YouTube・SNS）C（検索）D（クチコミ）はチャネル全体に波及するコアな活動。\nこの3チャネルの起点となる「動画コンテンツ」が、流入3,000＋CVR5%の達成エンジンになる。",
    { x: 0.7, y: 6.22, w: 12.0, h: 0.7,
      fontSize: 12, fontFace: "Calibri", color: C.heading, wrap: true, margin: 0 });

  // 循環ラベル
  s.addText("【流入増 ← 検索増 ← クチコミ ← 成功体験】", {
    x: 7.0, y: 5.55, w: 5.8, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.accent4, align: "center", bold: true, margin: 0 });
}

// ═══════════════════════════════════════════════
// Slide 3 — なぜ動画か
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "なぜ今、動画なのか", "1本の動画コンテンツを多チャネルに展開し、認知・信頼・購買を同時に高める");

  // Left card: 現状課題
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.65, w: 5.6, h: 5.4,
    fill: { color: C.gray_bg }, line: { color: C.gray_ln, width: 1 }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.65, w: 5.6, h: 0.07,
    fill: { color: C.accent3 }, line: { color: C.accent3 } });
  s.addText("解決すべき2つの壁", { x: 0.7, y: 1.82, w: 5.2, h: 0.38,
    fontSize: 14, fontFace: "Calibri", color: C.accent3, bold: true, margin: 0 });

  const issues = [
    { label: "「知らない」壁", val: "月間購買ページ流入1,800\n（目標3,000・達成率60%）" },
    { label: "「信じられない」壁", val: "CVR 3.5%（目標5%）\n根拠が伝わらず購入に至らない" },
    { label: "動画が解決する", val: "テキスト・静止画では伝わらない\n「体験・根拠」を動画なら一瞬で届けられる" },
  ];
  issues.forEach((it, i) => {
    const bg = i === 2 ? "FFF3CD" : C.bg;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.35 + i * 1.3, w: 5.1, h: 1.15,
      fill: { color: bg }, line: { color: C.gray_ln, width: 1 } });
    s.addText(it.label, { x: 0.85, y: 2.42 + i * 1.3, w: 4.8, h: 0.3,
      fontSize: 11, fontFace: "Calibri", color: i === 2 ? C.accent4 : C.accent3, bold: true, margin: 0 });
    s.addText(it.val, { x: 0.85, y: 2.72 + i * 1.3, w: 4.8, h: 0.55,
      fontSize: 11, fontFace: "Calibri", color: C.heading, wrap: true, margin: 0 });
  });

  // Right card: 3領域の展開構造
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.6, y: 1.65, w: 6.2, h: 5.4,
    fill: { color: C.gray_bg }, line: { color: C.gray_ln, width: 1 }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.6, y: 1.65, w: 6.2, h: 0.07,
    fill: { color: C.accent5 }, line: { color: C.accent5 } });
  s.addText("動画1本 → 3領域で活用", { x: 6.8, y: 1.82, w: 5.8, h: 0.38,
    fontSize: 14, fontFace: "Calibri", color: C.accent4, bold: true, margin: 0 });

  // 動画コンテンツ起点ボックス
  s.addShape(pres.shapes.RECTANGLE, { x: 8.2, y: 2.28, w: 2.9, h: 0.52,
    fill: { color: C.accent4 }, line: { color: C.accent4 }, shadow: mkShadow() });
  s.addText("動画コンテンツ（①②）", { x: 8.2, y: 2.32, w: 2.9, h: 0.44,
    fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0 });

  // 3領域
  const domains = [
    {
      no: "①", label: "広告",
      items: ["Meta動画広告（リール/フィード）", "PMAX動画アセット", "YouTube広告（インストリーム）"],
      x: 6.65, y: 2.95, color: C.accent3,
    },
    {
      no: "②", label: "SNS・PRコラボ（コスト低）",
      items: ["Instagram Reels（有機拡散）", "YouTubeコラボ動画（酒泉洞堀一等）", "酒蔵・料飲店への投稿依頼"],
      x: 6.65, y: 4.42, color: C.accent5,
    },
    {
      no: "③", label: "自社EC CVR向上",
      items: ["EC商品ページへの動画埋め込み", "→ 即効CVRリフト（コストゼロ）"],
      x: 6.65, y: 5.9, color: C.accent2,
    },
  ];

  domains.forEach((d) => {
    const h = d.items.length === 2 ? 1.25 : 1.3;
    s.addShape(pres.shapes.RECTANGLE, { x: d.x, y: d.y, w: 6.0, h,
      fill: { color: C.white }, line: { color: d.color, width: 1.5 } });
    // 左ラベルバー
    s.addShape(pres.shapes.RECTANGLE, { x: d.x, y: d.y, w: 0.07, h,
      fill: { color: d.color }, line: { color: d.color } });
    // ヘッダー
    s.addText(`${d.no} ${d.label}`, { x: d.x + 0.18, y: d.y + 0.08, w: 5.6, h: 0.3,
      fontSize: 12, fontFace: "Calibri", color: d.color, bold: true, margin: 0 });
    // 項目
    d.items.forEach((item, j) => {
      s.addShape(pres.shapes.OVAL, { x: d.x + 0.22, y: d.y + 0.48 + j * 0.32 + 0.06, w: 0.08, h: 0.08,
        fill: { color: d.color }, line: { color: d.color } });
      s.addText(item, { x: d.x + 0.38, y: d.y + 0.46 + j * 0.32, w: 5.4, h: 0.28,
        fontSize: 10.5, fontFace: "Calibri", color: C.text, margin: 0 });
    });
  });
}

// ═══════════════════════════════════════════════
// Slide 3 — 2層構造
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "YouTube戦略の2層構造", "「発見」で流入を増やし「納得」でCVRを高める");

  // Layer 1: 発見層
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.65, w: 5.6, h: 2.5,
    fill: { color: "FFF3CD" }, line: { color: C.accent6, width: 2 }, shadow: mkShadow()
  });
  s.addText("発見層", { x: 0.7, y: 1.75, w: 2, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.accent4, bold: true, margin: 0 });
  s.addText("コンテンツ③④（コラボ動画）", { x: 0.7, y: 2.1, w: 5.2, h: 0.3,
    fontSize: 12, fontFace: "Calibri", color: C.heading, bold: true, margin: 0 });
  s.addText("③ おつまみ×日本酒チャンネル\n④ 銘柄飲み比べ×SHUWAN（酒泉洞堀一）", {
    x: 0.7, y: 2.45, w: 5.2, h: 0.6,
    fontSize: 11, fontFace: "Calibri", color: C.text, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 3.2, w: 5.1, h: 0,
    line: { color: C.gray_ln, width: 1 } });
  s.addText("→ 認知獲得・流入増: 1,800 → 3,000（+67%）", {
    x: 0.7, y: 3.3, w: 5.2, h: 0.3,
    fontSize: 12, fontFace: "Calibri", color: C.accent3, bold: true, margin: 0 });

  // Arrow
  s.addText("▼", { x: 2.6, y: 4.25, w: 0.6, h: 0.4,
    fontSize: 20, fontFace: "Calibri", color: C.accent4, align: "center", margin: 0 });

  // Layer 2: 納得層
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.75, w: 5.6, h: 2.3,
    fill: { color: "EEF4FB" }, line: { color: C.accent2, width: 2 }, shadow: mkShadow()
  });
  s.addText("納得層", { x: 0.7, y: 4.85, w: 2, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.accent2, bold: true, margin: 0 });
  s.addText("コンテンツ①②（EC掲載・動画広告）", { x: 0.7, y: 5.2, w: 5.2, h: 0.3,
    fontSize: 12, fontFace: "Calibri", color: C.heading, bold: true, margin: 0 });
  s.addText("① プロの愛用者インタビュー\n② ワイングラスとSHUWANの違い（公開済✅）", {
    x: 0.7, y: 5.55, w: 5.2, h: 0.55,
    fontSize: 11, fontFace: "Calibri", color: C.text, margin: 0 });
  s.addText("→ CVR向上: 3.5% → 5%", { x: 0.7, y: 6.2, w: 5.2, h: 0.3,
    fontSize: 12, fontFace: "Calibri", color: C.accent2, bold: true, margin: 0 });

  // Right: KPI chain
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.1, y: 1.65, w: 5.7, h: 5.4,
    fill: { color: C.gray_bg }, line: { color: C.gray_ln, width: 1 }, shadow: mkShadow()
  });
  s.addText("目標達成の連鎖", { x: 7.3, y: 1.8, w: 5.3, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.heading, bold: true, margin: 0 });

  const chain = [
    { step: "STEP 1", text: "②動画をEC商品ページに埋め込み\n→ CVR改善（即効・コストゼロ）", color: C.accent2 },
    { step: "STEP 2", text: "コラボ動画でYouTube/SNS拡散\n→ 月間流入1,800→3,000", color: C.accent5 },
    { step: "STEP 3", text: "成功体験の共有（クチコミ）\n→ 検索増→さらなる流入増", color: C.accent6 },
    { step: "最終目標", text: "月間購買碗数 110 → 300碗\n（達成率 +173%）", color: C.accent3 },
  ];
  chain.forEach((c, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 2.35 + i * 1.1, w: 0.07, h: 0.65,
      fill: { color: c.color }, line: { color: c.color } });
    s.addText(c.step, { x: 7.45, y: 2.35 + i * 1.1, w: 5.2, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: c.color, bold: true, margin: 0 });
    s.addText(c.text, { x: 7.45, y: 2.65 + i * 1.1, w: 5.2, h: 0.55,
      fontSize: 11, fontFace: "Calibri", color: C.heading, margin: 0 });
  });
  s.addText("流入増 ← 検索増 ← クチコミ ← 成功体験", {
    x: 7.3, y: 6.6, w: 5.3, h: 0.35,
    fontSize: 11, fontFace: "Calibri", color: C.sub, italic: true, margin: 0
  });
}

// ═══════════════════════════════════════════════
// Slide 4 — コンテンツ①〜④の役割
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "4つのコンテンツと役割", "発見層・納得層それぞれの目的・活用先・優先度を整理");

  const colors = [C.accent2, C.accent3, C.accent5, C.accent6];
  const rows = [
    { no: "①", title: "プロ愛用者インタビュー", effect: "CVRリフト（信頼・権威）",
      usage: "EC掲載→納得→購入", priority: "高・短期", status: "未撮影\n候補：取引酒蔵・料飲店" },
    { no: "②", title: "ワイングラスとSHUWANの違い", effect: "CVRリフト（根拠提示）",
      usage: "EC掲載＋動画広告→購入", priority: "最高・即時", status: "✅撮影済\nYouTube公開済" },
    { no: "③", title: "おつまみ×日本酒チャンネル", effect: "認知獲得・流入増",
      usage: "コラボ先経由→EC流入", priority: "中・コラボ先依存", status: "コラボ先選定中" },
    { no: "④", title: "銘柄飲み比べ×SHUWAN常連出演", effect: "認知獲得・流入増",
      usage: "コラボ先経由→EC流入", priority: "中・コラボ先依存", status: "✅酒泉洞堀一\n実現済み" },
  ];

  const hdrs = ["No.", "コンテンツ名", "主な効果", "活用先", "優先度", "制作状況"];
  const cols = [0.5, 1.1, 3.5, 5.5, 7.7, 9.4];
  const widths = [0.5, 2.3, 1.9, 2.1, 1.6, 3.4];
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.6, w: 12.3, h: 0.42,
    fill: { color: "EEEEEE" }, line: { color: C.gray_ln } });
  hdrs.forEach((h, i) => {
    s.addText(h, { x: cols[i] + 0.1, y: 1.65, w: widths[i], h: 0.3,
      fontSize: 11, fontFace: "Calibri", color: C.sub, bold: true, margin: 0 });
  });

  rows.forEach((r, ri) => {
    const y = 2.1 + ri * 1.18;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 12.3, h: 1.12,
      fill: { color: ri % 2 === 0 ? C.bg : "FAFAFA" }, line: { color: C.gray_ln } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.07, h: 1.12,
      fill: { color: colors[ri] }, line: { color: colors[ri] } });
    s.addText(r.no, { x: 0.6, y: y + 0.35, w: 0.45, h: 0.4,
      fontSize: 18, fontFace: "Calibri", color: colors[ri], bold: true, align: "center", margin: 0 });
    s.addText(r.title, { x: cols[1] + 0.1, y: y + 0.1, w: widths[1], h: 0.9,
      fontSize: 12, fontFace: "Calibri", color: C.heading, bold: true, wrap: true, margin: 0 });
    s.addText(r.effect, { x: cols[2] + 0.1, y: y + 0.1, w: widths[2], h: 0.9,
      fontSize: 11, fontFace: "Calibri", color: C.text, wrap: true, margin: 0 });
    s.addText(r.usage, { x: cols[3] + 0.1, y: y + 0.1, w: widths[3], h: 0.9,
      fontSize: 11, fontFace: "Calibri", color: C.text, wrap: true, margin: 0 });
    const priColor = r.priority.includes("最高") ? C.accent3 : r.priority.includes("高") ? C.accent4 : C.sub;
    s.addText(r.priority, { x: cols[4] + 0.1, y: y + 0.1, w: widths[4], h: 0.9,
      fontSize: 11, fontFace: "Calibri", color: priColor, bold: r.priority.includes("最高"), wrap: true, margin: 0 });
    s.addText(r.status, { x: cols[5] + 0.1, y: y + 0.1, w: widths[5], h: 0.9,
      fontSize: 11, fontFace: "Calibri", color: C.text, wrap: true, margin: 0 });
  });
}

// ═══════════════════════════════════════════════
// Slide 5 — フェーズ別進め方
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "3フェーズでの実行計画", "既存資産の最大化から始め、データで自社制作の可否を判断する");

  const phases = [
    {
      no: "Phase 1", period: "4月・即実行", color: C.accent3,
      items: [
        "②動画をshop.shuwan.jpに埋め込み（コストゼロ・最速CVR改善）",
        "②動画をPMAX/リスティングの動画アセットに追加",
        "酒泉洞堀一へ埋め込み許諾＋グラス紹介動画依頼（下書き準備済）",
        "①撮影候補リストアップ（取引酒蔵・料飲店から2〜3名）",
      ]
    },
    {
      no: "Phase 2", period: "4〜5月・コラボ検証", color: C.accent5,
      items: [
        "③④は自社制作せず既存チャンネルとのコラボで仮説検証",
        "コラボ候補：酒泉洞堀一（1.63万人・実績あり）、酒とゆいと",
        "UTMパラメータで「コラボ動画→EC流入→CVR」を計測",
        "YouTubeショート（Shorts）の積極活用（登録者ゼロでも拡散）",
      ]
    },
    {
      no: "Phase 3", period: "6月以降・自社チャンネル判断", color: C.accent2,
      items: [
        "Phase2データ（EC流入数・CVR）で③か④の自社制作を判断",
        "「再生数」ではなく「EC流入・CVR」で意思決定する",
        "酒蔵・料飲店への「SHUWAN使用動画」投稿依頼（30蔵以上）",
      ]
    },
  ];

  phases.forEach((ph, i) => {
    const x = 0.5 + i * 4.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.65, w: 4.05, h: 5.4,
      fill: { color: C.gray_bg }, line: { color: C.gray_ln }, shadow: mkShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.65, w: 4.05, h: 0.07,
      fill: { color: ph.color }, line: { color: ph.color } });
    s.addText(ph.no, { x: x + 0.2, y: 1.82, w: 3.6, h: 0.42,
      fontSize: 18, fontFace: "Calibri", color: ph.color, bold: true, margin: 0 });
    s.addText(ph.period, { x: x + 0.2, y: 2.25, w: 3.6, h: 0.3,
      fontSize: 11, fontFace: "Calibri", color: C.sub, italic: true, margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.2, y: 2.62, w: 3.6, h: 0,
      line: { color: C.gray_ln, width: 1 } });
    ph.items.forEach((item, j) => {
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.22, y: 2.8 + j * 0.8, w: 0.06, h: 0.35,
        fill: { color: ph.color }, line: { color: ph.color } });
      s.addText(item, { x: x + 0.37, y: 2.77 + j * 0.8, w: 3.45, h: 0.65,
        fontSize: 10.5, fontFace: "Calibri", color: C.text, wrap: true, margin: 0 });
    });
  });
}

// ═══════════════════════════════════════════════
// Slide 6 — 追加施策⑤⑥⑦
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "さらに強化する3つの施策", "YouTubeショート・酒蔵投稿依頼・SEO設計で認知を面的に拡大");

  const tactics = [
    {
      no: "⑤", title: "YouTubeショート（Shorts）活用", color: C.accent3,
      points: [
        "②動画はすでにShortsで公開済み ✅",
        "①インタビューも必ず60秒Shorts版を制作",
        "アルゴリズム拡散力が強く、登録者ゼロでも伸びる",
        "縦型15〜60秒でスマホ閲覧層にリーチ",
      ]
    },
    {
      no: "⑥", title: "酒蔵・料飲店への投稿依頼", color: C.accent5,
      points: [
        "30蔵以上・ミシュラン店が既にSHUWANを採用",
        "「テイスティングにSHUWANを使用」とSNS/YouTube投稿依頼",
        "コストゼロで口コミ波及を実現",
        "酒蔵のブランド力×SHUWANで相互発信効果",
      ]
    },
    {
      no: "⑦", title: "YouTube SEO設計", color: C.accent2,
      points: [
        "「酒器」「日本酒 おすすめ グラス」でYouTube検索上位を狙う",
        "タイトル・概要欄・タグの統一設計が必要",
        "酒泉洞堀一「黄金比の酒器を解説」は既にSEO効果あり",
        "概要欄にshop.shuwan.jpリンク設置（全動画に依頼）",
      ]
    },
  ];

  tactics.forEach((t, i) => {
    const x = 0.5 + i * 4.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.65, w: 4.05, h: 5.4,
      fill: { color: C.gray_bg }, line: { color: C.gray_ln }, shadow: mkShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.65, w: 4.05, h: 0.07,
      fill: { color: t.color }, line: { color: t.color } });
    s.addText(t.no, { x: x + 0.2, y: 1.8, w: 0.7, h: 0.45,
      fontSize: 22, fontFace: "Calibri", color: t.color, bold: true, margin: 0 });
    s.addText(t.title, { x: x + 0.2, y: 2.3, w: 3.6, h: 0.55,
      fontSize: 13, fontFace: "Calibri", color: C.heading, bold: true, wrap: true, margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.2, y: 2.95, w: 3.6, h: 0,
      line: { color: C.gray_ln, width: 1 } });
    t.points.forEach((pt, j) => {
      s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: 3.1 + j * 0.78 + 0.09, w: 0.1, h: 0.1,
        fill: { color: t.color }, line: { color: t.color } });
      s.addText(pt, { x: x + 0.4, y: 3.08 + j * 0.78, w: 3.45, h: 0.65,
        fontSize: 11, fontFace: "Calibri", color: C.text, wrap: true, margin: 0 });
    });
  });
}

// ═══════════════════════════════════════════════
// Slide 7 — KPI体系
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "KPI体系（測定指標）", "再生数ではなく「EC流入・CVR」で成否を判断する");

  const kpis = [
    { cat: "流入", name: "YouTube経由EC月間流入数", target: "300セッション\n（全体3,000の10%）", measure: "GA4 UTM", color: C.accent5 },
    { cat: "流入", name: "コラボ動画1本あたりEC流入数", target: "採用基準：\n50セッション以上", measure: "GA4", color: C.accent5 },
    { cat: "CVR", name: "動画あり商品ページCVR", target: "3%以上\n（現状推定1%）", measure: "Shopify×GA4", color: C.accent2 },
    { cat: "コンテンツ", name: "②動画の商品ページ視聴完了率", target: "40%以上", measure: "Clarity or GA4", color: C.accent3 },
    { cat: "認知", name: "YouTubeチャンネル登録者数", target: "月+100人", measure: "YouTube Studio", color: C.accent6 },
    { cat: "認知", name: "Shorts平均再生数", target: "1本5,000再生以上", measure: "YouTube Studio", color: C.accent6 },
  ];

  const hdrs2 = ["カテゴリ", "KPI指標", "目標値", "計測方法"];
  const cols2 = [0.5, 1.85, 6.8, 9.9];
  const ws2 = [1.25, 4.85, 3.0, 2.9];
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.6, w: 12.3, h: 0.4,
    fill: { color: "EEEEEE" }, line: { color: C.gray_ln } });
  hdrs2.forEach((h, i) => {
    s.addText(h, { x: cols2[i] + 0.1, y: 1.65, w: ws2[i], h: 0.28,
      fontSize: 11, fontFace: "Calibri", color: C.sub, bold: true, margin: 0 });
  });

  kpis.forEach((k, i) => {
    const y = 2.08 + i * 0.75;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 12.3, h: 0.7,
      fill: { color: i % 2 === 0 ? C.bg : "FAFAFA" }, line: { color: C.gray_ln } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.07, h: 0.7,
      fill: { color: k.color }, line: { color: k.color } });
    s.addText(k.cat, { x: 0.65, y: y + 0.15, w: ws2[0], h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: k.color, bold: true, align: "center", margin: 0 });
    s.addText(k.name, { x: cols2[1] + 0.1, y: y + 0.1, w: ws2[1], h: 0.5,
      fontSize: 12, fontFace: "Calibri", color: C.heading, wrap: true, margin: 0 });
    s.addText(k.target, { x: cols2[2] + 0.1, y: y + 0.05, w: ws2[2], h: 0.6,
      fontSize: 11, fontFace: "Calibri", color: C.heading, bold: true, wrap: true, margin: 0 });
    s.addText(k.measure, { x: cols2[3] + 0.1, y: y + 0.15, w: ws2[3], h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: C.sub, margin: 0 });
  });

  // Final goal bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 6.65, w: 12.3, h: 0.5,
    fill: { color: "FFF3CD" }, line: { color: C.accent6, width: 1.5 } });
  s.addText(
    "最終目標：月間購買ページ流入 1,800 → 3,000　｜　CVR 3.5% → 5%　｜　月間購買碗数 110 → 300碗",
    { x: 0.7, y: 6.7, w: 12.0, h: 0.38,
      fontSize: 12, fontFace: "Calibri", color: C.heading, bold: true, align: "center", margin: 0 }
  );
}

// ═══════════════════════════════════════════════
// Slide 8 — まとめ・推奨アクション
// ═══════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBottomBars(s);
  addHeader(s, "今週の推奨アクション", "すでにある資産（②動画・酒泉洞堀一との関係）を最大化することが最速の施策");

  const actions = [
    { no: "#1", action: "②動画をshop.shuwan.jpに埋め込む",              owner: "深田氏/松窪", due: "4/4", effect: "最速CVR改善・コストゼロ",       color: C.accent3 },
    { no: "#2", action: "②動画をPMAX動画アセットに追加申請",             owner: "松窪",       due: "4/7", effect: "広告効率改善",                 color: C.accent4 },
    { no: "#3", action: "酒泉洞堀一へ埋め込み許諾＋グラス紹介依頼メール送付", owner: "原",    due: "4/4", effect: "下書き準備済。送付するだけ",      color: C.accent5 },
    { no: "#4", action: "①撮影候補3名リストアップ",                      owner: "原",         due: "4/7", effect: "酒蔵・料飲店から選定",           color: C.accent2 },
  ];

  const hdrs3 = ["#", "アクション", "担当", "期限", "期待効果"];
  const cols3 = [0.5, 1.2, 7.6, 9.1, 10.2];
  const ws3 = [0.6, 6.3, 1.4, 1.0, 2.65];
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.6, w: 12.3, h: 0.42,
    fill: { color: "EEEEEE" }, line: { color: C.gray_ln } });
  hdrs3.forEach((h, i) => {
    s.addText(h, { x: cols3[i] + 0.1, y: 1.65, w: ws3[i], h: 0.28,
      fontSize: 11, fontFace: "Calibri", color: C.sub, bold: true, margin: 0 });
  });

  actions.forEach((a, i) => {
    const y = 2.1 + i * 0.95;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 12.3, h: 0.88,
      fill: { color: i % 2 === 0 ? C.bg : "FAFAFA" }, line: { color: C.gray_ln } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.07, h: 0.88,
      fill: { color: a.color }, line: { color: a.color } });
    s.addText(a.no, { x: 0.65, y: y + 0.25, w: ws3[0], h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: a.color, bold: true, align: "center", margin: 0 });
    s.addText(a.action, { x: cols3[1] + 0.1, y: y + 0.1, w: ws3[1], h: 0.65,
      fontSize: 13, fontFace: "Calibri", color: C.heading, bold: true, wrap: true, margin: 0 });
    s.addText(a.owner, { x: cols3[2] + 0.1, y: y + 0.25, w: ws3[2], h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.text, margin: 0 });
    s.addText(a.due, { x: cols3[3] + 0.1, y: y + 0.25, w: ws3[3], h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: a.color, bold: true, align: "center", margin: 0 });
    s.addText(a.effect, { x: cols3[4] + 0.1, y: y + 0.1, w: ws3[4], h: 0.65,
      fontSize: 11, fontFace: "Calibri", color: C.text, wrap: true, margin: 0 });
  });

  // Summary box
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 6.0, w: 12.3, h: 1.05,
    fill: { color: "FFF3CD" }, line: { color: C.accent6, width: 1.5 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 6.0, w: 0.07, h: 1.05,
    fill: { color: C.accent4 }, line: { color: C.accent4 } });
  s.addText("一言まとめ", { x: 0.7, y: 6.08, w: 2, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: C.accent4, bold: true, margin: 0 });
  s.addText(
    "すでにある資産（②動画・酒泉洞堀一との関係）を最大化することが最速の施策。\n新規制作より先に既存資産のEC活用を徹底し、Phase2以降でコラボデータを蓄積してから判断する。",
    { x: 0.7, y: 6.38, w: 12.0, h: 0.58,
      fontSize: 12, fontFace: "Calibri", color: C.heading, wrap: true, margin: 0 }
  );
}

pres.writeFile({ fileName: "SHUWAN_YouTube戦略_答申_20260401.pptx" })
  .then(() => console.log("✅ SHUWAN_YouTube戦略_答申_20260401.pptx を生成しました"))
  .catch(e => console.error("❌ エラー:", e));
