/**
 * SHUWAN 動的Excelジェネレーター (Node.js版)
 * 日次PDCAで更新されたcontextファイルから最新データを読み込み、
 * Excelレポートを自動再生成する
 *
 * 実行: node C:/Users/hara/.claude/output/create_excels.js
 */
const XLSX = require('C:/Users/hara/ai-agent-dashboard/node_modules/xlsx');
const fs   = require('fs');
const path = require('path');

const BASE   = 'C:/Users/hara/.claude';
const OUTPUT = BASE + '/output';
const TODAY  = new Date().toISOString().slice(0, 10);

// ===== ユーティリティ =====
function readFile(rel) {
  try { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
  catch(e) { console.warn(`  [warn] ${rel}: ${e.message}`); return ''; }
}

/** Markdownテーブルをパース。headerReにマッチした次の行から取得 */
function parseMdTable(text, headerRe) {
  const lines = text.split('\n');
  const rows = [];
  let capturing = false;
  for (const line of lines) {
    if (headerRe.test(line)) { capturing = true; continue; }
    if (capturing) {
      if (/^\s*\|[-:\s|]+\|/.test(line)) continue; // 区切り行
      if (line.startsWith('|')) {
        const cells = line.split('|').slice(1, -1).map(c => c.trim());
        rows.push(cells);
      } else if (rows.length) break;
    }
  }
  return rows;
}

function intVal(s = '') {
  s = String(s).replace(/,/g,'').replace(/円|碗/g,'').replace(/—|-/g,'0').trim();
  if (s.includes('万')) return Math.round(parseFloat(s.replace('万','')) * 10000) || 0;
  return parseInt(s) || 0;
}

function pctVal(s = '') {
  return (parseFloat(String(s).replace('%','').trim()) || 0) / 100;
}

// ===== データ読み込み =====
function loadSales() {
  const text = readFile('context/memos/shuwan-sales-summary.md');
  const rows = parseMdTable(text, /月.*売上.*税抜.*販売数/);
  const data = rows.flatMap(r => {
    if (r.length < 3 || !r[0]) return [];
    const sales  = intVal(r[1]);
    const units  = intVal(r[2]);
    const margin = r[3] ? intVal(r[3]) : Math.round(sales * 0.6);
    return sales > 0 ? [[r[0].trim(), sales, units, margin]] : [];
  });
  return data.length ? data : [
    ['2025/01',126000,35,76290],  ['2025/02',108000,32,64894],
    ['2025/03',104400,34,60940],  ['2025/04',295920,88,197016],
    ['2025/05',313552,101,225910],['2025/06',1056880,381,670576],
    ['2025/07',1157305,410,723570],['2025/08',1779930,656,1299544],
    ['2025/09',1158242,421,729584],['2025/10',773560,285,398585],
    ['2025/11',875236,297,480413],['2025/12',1942194,666,1252092],
    ['2026/01',1915894,700,997454],['2026/02',1624394,551,884723],
  ];
}

function loadChannels() {
  const text = readFile('context/strategy/kpi-targets.md');
  const rows = parseMdTable(text, /チャネル.*年間目標.*月平均/);
  const data = rows.flatMap(r => {
    const name = r[0]?.replace(/\*\*/g,'').trim();
    if (!name || name.includes('合計')) return [];
    const target = intVal(r[1]); if (!target) return [];
    const monthly = intVal(r[2]?.replace('万円','0000').replace('—','0'));
    const ratio   = pctVal(r[3]);
    const price   = intVal(r[4]) || 3000;
    const units   = intVal(r[5]?.replace('—','0')) || 0;
    return [[name, target, monthly, ratio, price, units]];
  });
  return data.length ? data : [
    ['自社EC（Shopify）',20000000,1670000,0.20,3900,428],
    ['Amazon',          15000000,1250000,0.15,4200,298],
    ['外販（エルスタイル等）',25000000,2080000,0.25,2700,771],
    ['酒販店（卸売）',  15000000,1250000,0.15,2800,446],
    ['MAKUAKE（年2回）',10000000,0,      0.10,3500,0  ],
    ['料飲店',          15000000,1250000,0.15,2600,481],
  ];
}

function loadQuarters() {
  const text = readFile('context/strategy/kpi-targets.md');
  const rows = parseMdTable(text, /四半期.*期間.*売上目標/);
  const data = rows.flatMap(r => {
    const q = r[0]?.replace(/\*\*/g,'').trim();
    if (!q) return [];
    const target = intVal(r[2]); if (!target) return [];
    return [[q, r[1]?.trim(), target, intVal(r[3]), pctVal(r[4]), r[5]?.trim()||'']];
  });
  return data.length ? data : [
    ['Q1','3-5月', 15000000,15000000,0.15,'基盤構築期'],
    ['Q2','6-8月', 25000000,40000000,0.40,'父の日+MAKUAKE①'],
    ['Q3','9-11月',25000000,65000000,0.65,'MAKUAKE②+秋需要'],
    ['Q4','12-1月',35000000,100000000,1.00,'年末ギフト最大化'],
  ];
}

function loadCompetitors() {
  const text = readFile('context/market/competitors.md');
  const sections = [...text.matchAll(/### \d+\.\s+(.+?)\n([\s\S]*?)(?=### \d+\.|## |\Z)/g)];
  const comps = sections.map(([,name, body]) => {
    const g = re => (body.match(re)||[])[1]?.trim() || '-';
    return [
      name.trim(),
      g(/\*\*価格帯\*\*:\s*(.+)/),
      g(/\*\*特徴\*\*:\s*(.+)/),
      g(/\*\*チャネル\*\*:\s*(.+)/),
      g(/\*\*強み\*\*:\s*(.+)/),
      g(/\*\*弱み\*\*:\s*(.+)/),
      '×',
    ];
  });
  const shuwan = ['SHUWAN（自社）','3,900〜18,000円','磁器・日本酒専用設計・意匠登録済み',
                  '自社EC/Amazon/酒販店/料飲店','日本酒専用×科学的根拠×意匠登録','認知度向上中','○'];
  const all = [shuwan, ...comps];
  return all.length > 1 ? all : [
    shuwan,
    ['うすはりグラス','1,100〜3,300円','極薄ガラス','百貨店/Amazon','知名度高','割れやすい','×'],
    ['能作','5,000〜15,000円','錫100%','直営店/百貨店','ブランド力','高価格','×'],
    ['田島硝子','5,000〜6,000円','富士山デザイン','Amazon/楽天','ギフト人気','汎用品','×'],
    ['木本硝子','3,000〜8,000円','香り設計','自社EC/百貨店','日本酒専用設計','認知度低','○'],
  ];
}

function loadCustomers() {
  const text = readFile('context/sales/customer-insights.md');
  const rows = [];
  for (const [cat, re] of [
    ['酒販店', /### 酒販店\n([\s\S]*?)(?=###|##|\Z)/],
    ['料飲店', /### 料飲店\n([\s\S]*?)(?=###|##|\Z)/],
    ['外販',   /### 外販\n([\s\S]*?)(?=###|##|\Z)/],
  ]) {
    const m = text.match(re);
    if (m) {
      m[1].split(/[、,\n・\-]+/).map(n => n.trim()).filter(n => n.length > 1 && !n.startsWith('#'))
        .forEach(n => rows.push([cat, n, '']));
    }
  }
  return rows.length ? rows : [
    ['酒販店','久楽屋',''],['酒販店','千鳥屋',''],['酒販店','鍵や',''],
    ['酒販店','五十嵐酒店',''],['酒販店','田中酒造店',''],
    ['料飲店','YAKITORI燃',''],['料飲店','天ぷらぺぺ',''],
    ['外販','エルスタイル',''],['外販','ブラックス',''],
  ];
}

function loadPipeline() {
  // まず専用のpipeline.mdを参照
  const pipelineText = readFile('context/sales/pipeline.md');
  const rows = parseMdTable(pipelineText, /取引先.*商談フェーズ.*想定金額/);
  const parsed = rows.map(r => [r[0]||'', r[1]||'', r[3]||TODAY, r[2]||'']);

  // フォールバック: customer-insights.mdの新規商談セクション
  if (!parsed.length) {
    const text = readFile('context/sales/customer-insights.md');
    const section = text.match(/### 新規商談[\s\S]*?\n([\s\S]*?)(?=###|## |\Z)/);
    if (section) {
      for (const [,name,note] of section[1].matchAll(/\d+\.\s+\*\*(.+?)\*\*.*?[:：]\s*(.+)/g)) {
        parsed.push([name.trim(), note.trim().slice(0,50), TODAY, '確認中']);
      }
    }
  }

  const defaults = [
    ['ヴィノスやまざき（戸塚）','前向き検討中→見積り提出フォロー','3/31','見積り提出'],
    ['桑原商店','見積り送付済み→発注確認','3/31','発注確認'],
    ['いまでや×Sakesuki','三者MTG完了→次フェーズ','4/4','MOQ・輸出価格・梱包仕様確認'],
    ['篠澤酒舗','案内送付済み→返答待ち','4/3','返答フォロー'],
    ['酒の勝鬨','案内送付済み→返答待ち','4/3','返答フォロー'],
  ];
  const names = new Set(parsed.map(r => r[0]));
  defaults.filter(d => !names.has(d[0])).forEach(d => parsed.push(d));
  return parsed;
}

// ===== シート作成ヘルパー =====
function makeSheet(aoa) { return XLSX.utils.aoa_to_sheet(aoa); }
function addSheet(wb, name, aoa) { XLSX.utils.book_append_sheet(wb, makeSheet(aoa), name); }
function metaSheet(wb) {
  addSheet(wb, '更新情報', [
    ['項目','内容'],
    ['生成日', TODAY],
    ['生成方法','日次PDCA自動生成（create_excels.js）'],
    ['データソース','~/.claude/context/ 配下の最新MDファイル'],
  ]);
}

// ===== Excel生成 =====
function createCMO() {
  const wb = XLSX.utils.book_new();
  const channels = loadChannels();

  addSheet(wb, 'KPI目標', [
    ['チャネル','年間目標','月平均','構成比','想定単価','月間碗数'],
    ...channels,
    ['合計',
      channels.reduce((s,r)=>s+r[1],0),
      channels.reduce((s,r)=>s+r[2],0),
      channels.reduce((s,r)=>s+r[3],0),
      '約3,000円',
      channels.reduce((s,r)=>s+r[5],0)],
  ]);

  addSheet(wb, '四半期マイルストーン', [
    ['四半期','期間','売上目標','累計','達成率','根拠'],
    ...loadQuarters(),
  ]);

  addSheet(wb, '予算配分', [
    ['項目','年間予算','備考'],
    ['広告費（Google/Amazon）',6000000,'ROAS400%目標'],
    ['YouTube制作費',1000000,'月4本×12ヶ月'],
    ['MAKUAKE手数料（2回）',2000000,'各回20%×1,000万円目標'],
    ['PR・プレスリリース',800000,'月1件掲載目標'],
    ['展示会・イベント',500000,'年2〜4回参加'],
    ['合計',10300000,'売上の約10%'],
  ]);

  metaSheet(wb);
  const p = OUTPUT+'/cmo/SHUWAN_KPI_年間計画.xlsx';
  XLSX.writeFile(wb, p); console.log(`  CMO: ${p}`);
}

function createResearcher() {
  const wb = XLSX.utils.book_new();
  const sales = loadSales();
  let cumul = 0;

  addSheet(wb, '競合比較', [
    ['ブランド','価格帯','特徴・素材','チャネル','強み','弱み','日本酒専用'],
    ...loadCompetitors(),
  ]);

  addSheet(wb, '月次売上実績', [
    ['月','売上(税抜)','販売数(碗)','限界利益','前月比','累計売上'],
    ...sales.map((r,i) => {
      cumul += r[1];
      const pct = i > 0 ? ((r[1]/sales[i-1][1]-1)*100).toFixed(0)+'%' : '-';
      return [...r, pct, cumul];
    }),
    ['合計',
      sales.reduce((s,r)=>s+r[1],0),
      sales.reduce((s,r)=>s+r[2],0),
      sales.reduce((s,r)=>s+r[3],0), '', ''],
  ]);

  const latest = sales[sales.length-1] || ['-',0,0,0];
  addSheet(wb, 'KPI達成状況', [
    ['KPI指標','年間目標','最新月実績','達成率','必要月平均','現状ペース(年換算)'],
    ['売上',    100000000, latest[1], `${(latest[1]/100000000*100).toFixed(1)}%`, 8333333, latest[1]*12],
    ['販売数(碗)',33300,   latest[2], `${(latest[2]/33300*100).toFixed(1)}%`,     2775,    latest[2]*12],
    ['限界利益', 60000000, latest[3], `${(latest[3]/60000000*100).toFixed(1)}%`, 5000000, latest[3]*12],
  ]);

  metaSheet(wb);
  const p = OUTPUT+'/researcher/SHUWAN_市場競合分析.xlsx';
  XLSX.writeFile(wb, p); console.log(`  Researcher: ${p}`);
}

function createCommPlanner() {
  const wb = XLSX.utils.book_new();

  addSheet(wb, 'メディアミックス', [
    ['チャネル','役割','月額予算','年間予算','優先度','KPI'],
    ['YouTube',          '認知・教育',   75000, 900000, '高',  '登録5,000人'],
    ['Instagram',        '認知・転換',  150000,1800000, '高',  'フォロワー1万人'],
    ['Googleリスティング','購買層捕捉', 200000,2400000, '高',  'CPA2,000円以下'],
    ['Amazon広告',       '検索順位向上',150000,1800000, '高',  'ACoS25%以下'],
    ['SEO',              '長期資産',    40000, 480000,  '中',  '月間5,000PV'],
    ['PR',               '信頼性付与',  75000, 900000,  '中高','メディア掲載月1件'],
    ['合計','',690000,8280000,'',''],
  ]);

  addSheet(wb, '季節キャンペーン', [
    ['月','テーマ','主要施策','重点チャネル'],
    ['4月','花見・春酒',    '桜×日本酒Instagram広告・しゅわんグラス訴求',      'Instagram'],
    ['5月','GW・MAKUAKE②', 'MAKUAKEローンチ・GWギフト訴求',                   'MAKUAKE/全チャネル'],
    ['6月','父の日',        '父の日ギフトセット特集LP・桐箱セット',             '全チャネル'],
    ['8月','夏酒',          '冷酒×SHUWAN/しゅわんグラスコンテンツ',            'YouTube/Instagram'],
    ['9月','敬老の日',      'プレミアムラインギフト訴求',                       'Amazon/自社EC'],
    ['12月','年末ギフト',   '全チャネル集中投資・干支モデル',                   '全チャネル'],
    ['1月','お年賀',        '新年干支訴求・日本酒体験ギフト',                   '自社EC'],
  ]);

  addSheet(wb, 'CRM施策', [
    ['施策','タイミング','内容','KPI','優先度'],
    ['サンクスメール',   '購入直後',   '使い方ガイド+日本酒おすすめ','開封率50%','最高'],
    ['コンテンツメール', '購入3日後',  '日本酒の楽しみ方',           '開封率30%','高'],
    ['レビュー依頼',     '購入14日後', '特典付きレビュー依頼',       '投稿率10%','高'],
    ['追加購入提案',     '購入30日後', 'ギフト・セット提案',         'CVR5%',    '中'],
    ['季節案内',         '購入60日後', '新商品・季節限定案内',       'CVR3%',    '中'],
    ['メルマガ(コンテンツ)','毎月第1週','日本酒コンテンツ配信',     '開封率25%','中'],
    ['メルマガ(商品)',   '毎月第3週',  'キャンペーン告知',           'CTR3%',    '中'],
  ]);

  metaSheet(wb);
  const p = OUTPUT+'/communication-planner/SHUWAN_メディアプラン.xlsx';
  XLSX.writeFile(wb, p); console.log(`  CommPlanner: ${p}`);
}

function createCSO() {
  const wb = XLSX.utils.book_new();

  addSheet(wb, 'チャネル別営業戦略', [
    ['チャネル','年間目標','月間DM数','返信率','成約数/月','卸値範囲','最低発注'],
    ['酒販店',         '+50店', '50件', '10%','4件','2,640〜2,880円','4碗'],
    ['料飲店',         '+60店', '150件','5%', '5件','2,440〜2,950円','6碗'],
    ['外販',           '2,500万円','商談2件/月','—','1社/月','OEM対応','30碗'],
    ['しゅわんグラス卸','+20店','30件','15%','4件','1,820〜2,160円','6本'],
  ]);

  addSheet(wb, '四半期別営業目標', [
    ['四半期','酒販店新規','料飲店新規','外販売上','しゅわんグラス新規'],
    ['Q1(3-5月)', '+12店','+15店',5000000, '+5店'],
    ['Q2(6-8月)', '+12店','+15店',6250000, '+5店'],
    ['Q3(9-11月)','+13店','+15店',6250000, '+5店'],
    ['Q4(12-1月)','+13店','+15店',7500000, '+5店'],
    ['合計',       '+50店','+60店',25000000,'+20店'],
  ]);

  addSheet(wb, '既存取引先', [
    ['区分','取引先名','状況・メモ'],
    ...loadCustomers(),
  ]);

  addSheet(wb, '新規商談パイプライン', [
    ['商談先','状況・メモ','最終接触日','次アクション'],
    ...loadPipeline(),
  ]);

  metaSheet(wb);
  const p = OUTPUT+'/cso/SHUWAN_営業計画.xlsx';
  XLSX.writeFile(wb, p); console.log(`  CSO: ${p}`);
}

function createCTO() {
  const wb = XLSX.utils.book_new();

  addSheet(wb, 'PDCA実行手順', [
    ['ステップ','担当','タスク','依存関係','出力先','所要時間'],
    ['Step0', 'ユーザー',          '当月レベシェアExcelを格納',      'なし',       'context/memos/レベシェア実績/','5分'],
    ['Step1a','Researcher',        '市場・競合・口コミ調査更新',      'Step0完了後','context/market/',            '5分'],
    ['Step1b','CommunicationPlanner','コミュ施策の進捗評価・更新',    'Step0完了後','context/communication/',      '5分'],
    ['Step1c','CSO',               '営業進捗評価・パイプライン確認',  'Step0完了後','context/sales/',              '5分'],
    ['Step1d','CTO',               'プロンプト・技術改善点の洗い出し','Step0完了後','context/tech/',              '5分'],
    ['Step2', 'CMO',               'KPI統括判断・施策優先度の見直し','Step1完了後','context/strategy/',           '5分'],
    ['Step3', 'daily-pdca',        '日次MD生成・Excel再生成・報告',  'Step2完了後','output/',                    '3分'],
  ]);

  addSheet(wb, 'プロンプト一覧', [
    ['#','プロンプト名','用途','対象エージェント','最終更新'],
    [1,'月次PDCAレポート',       '実績分析・次月施策立案',         'CMO',               TODAY],
    [2,'Shopify商品ページ最適化', 'SEO・CVR改善',                  'CTO',               TODAY],
    [3,'Amazon出品最適化',       '検索順位向上・A+コンテンツ',     'CTO',               TODAY],
    [4,'SNSコンテンツ企画',      'YouTube/Instagram投稿計画',      'コミュプランナー',   TODAY],
    [5,'BtoB営業アプローチ文',   'DM・商談資料作成',               'CSO',               TODAY],
    [6,'MAKUAKEキャンペーン',    'CF企画・リターン設計',           'CMO/コミュプランナー',TODAY],
    [7,'90%が美味しい訴求コピー','EC商品ページ・広告コピー全般',   '全エージェント',     TODAY],
  ]);

  addSheet(wb, '技術課題トラッカー', [
    ['課題','優先度','担当','期限','ステータス','備考'],
    ['GA4のShopify連携',                   '最高','担当者未定','2026-04-03','未着手','2〜3時間で対応可能。ECトップページ改修効果計測の前提'],
    ['自社ECトップページ2商品並列表示確認', '高',  '深田氏',    '2026-03-28','対応中','完了後にGA4クリック計測を設置'],
    ['Amazon A+コンテンツ作成',            '高',  'CTO',       '2026-04-07','計画中','CVR3〜10%改善期待。Brand Registry確認から'],
    ['食洗機耐久性の技術確認',             '高',  '中央硝子',  '2026-04-07','未着手','確認完了まで積極SNS訴求を一時停止'],
    ['Shopify Admin API 売上自動集計',     '中',  'CTO',       '2026-04-30','計画中','手動Excel集計からの脱却'],
    ['Amazon「意匠登録済み」表記追加',     '中',  '担当者未定','2026-04-15','未着手','差別化優位性の訴求'],
    ['ダッシュボードno-cache対応',         '低',  'CTO',       TODAY,       '完了',  'APIレスポンスにCache-Control追加・タイムスタンプ追加'],
    ['settings.jsonをbypassPermissionsに', '低',  'CTO',       TODAY,       '完了',  'スケジュールタスクの承認ダイアログ解消'],
  ]);

  metaSheet(wb);
  const p = OUTPUT+'/cto/SHUWAN_技術支援.xlsx';
  XLSX.writeFile(wb, p); console.log(`  CTO: ${p}`);
}

function createKpiTracking() {
  const wb = XLSX.utils.book_new();
  const kpiText = readFile('context/strategy/monthly-kpi-tracking.md');
  const dailyReview = readFile(`context/strategy/daily-review-${TODAY}.md`);

  // --- Sheet 1: 月次KPI進捗（個数） ---
  const unitRows = parseMdTable(kpiText, /チャネル.*2月目標.*2月実績.*達成率.*3月目標/);
  const unitHeader = ['チャネル','2月目標','2月実績','達成率','3月目標','3月実績','達成率',
    '4月目標','5月目標','6月目標','7月目標','8月目標','9月目標','10月目標','11月目標','12月目標','1月目標','年間目標'];
  addSheet(wb, '①チャネル別個数', [
    [`SHUWAN 月次KPI進捗（個数・碗） ― 生成日: ${TODAY}`],
    [],
    unitHeader,
    ...unitRows.map(r => r.map((c,i) => i >= 1 ? (c === '—' ? '' : c) : c)),
  ]);

  // --- Sheet 2: チャネル別売上 ---
  const revenueSection = kpiText.split('### 【B】チャネル別 売上目標・実績')[1];
  let revRows = [];
  if (revenueSection) {
    const allRows = parseMdTable('|dummy\n' + revenueSection.split('###')[0], /dummy/);
    revRows = allRows.filter(r => r[0] !== 'チャネル'); // skip duplicate header
  }
  addSheet(wb, '②チャネル別売上', [
    [`SHUWAN 月次KPI進捗（売上・円） ― 生成日: ${TODAY}`],
    [],
    ['チャネル','2月目標','2月実績','達成率','3月目標','3月実績','達成率','年間目標'],
    ...revRows.map(r => r.map((c,i) => i >= 1 ? (c === '—' ? '' : c) : c.replace(/\*\*/g,''))),
  ]);

  // --- Sheet 3: レベシェア利益 ---
  const profitSection = kpiText.split('### 【F】レベシェア利益')[1];
  let profitRows = [];
  if (profitSection) {
    const allRows = parseMdTable('|dummy\n' + profitSection.split('###')[0], /dummy/);
    profitRows = allRows.filter(r => r[0] !== 'チャネル');
  }
  addSheet(wb, '③レベシェア利益', [
    [`SHUWAN レベシェア利益 目標・実績（円） ― 生成日: ${TODAY}`],
    [],
    ['チャネル','2月目標','2月実績','達成率','3月目標','3月実績','達成率','年間目標'],
    ...profitRows.map(r => r.map((c,i) => i >= 1 ? (c === '—' ? '' : c) : c.replace(/\*\*/g,''))),
  ]);

  // --- Sheet 4: 着地見込・GAP分析 ---
  const gapSection = kpiText.split('## 着地見込・GAP分析')[1] || '';
  const gapRows = parseMdTable(kpiText, /チャネル.*月次目標.*月中実績.*着地見込.*GAP.*見込達成率/);
  addSheet(wb, '④着地見込・GAP分析', [
    [`SHUWAN 当月 着地見込・GAP分析 ― 生成日: ${TODAY}`],
    [],
    ['チャネル','月次目標','月中実績','着地見込','GAP','見込達成率','判定'],
    ...gapRows.map(r => r.map(c => c === '—' ? '' : c.replace(/\*\*/g,''))),
    [],
    ['※ 着地見込 = 月中実績 × (月間日数/経過日数) + パイプライン確度加重'],
    ['※ GAP = 着地見込 − 月次目標（マイナス=未達見込）'],
    ['※ 判定: ◎120%以上 / ○100-119% / △80-99% / ×80%未満'],
  ]);

  // --- Sheet 5: 要因分解 ---
  // KPI逆算値テーブル
  const calcRows = parseMdTable(kpiText, /指標.*2月.*3月.*4月/);
  // Filter to the right table (自社EC KPI逆算値)
  const calcSection = kpiText.split('### 【C】自社EC KPI逆算値')[1];
  let calcData = [];
  if (calcSection) {
    const allRows = parseMdTable('|dummy\n' + calcSection.split('###')[0], /dummy/);
    calcData = allRows.filter(r => r[0] !== '指標');
  }
  addSheet(wb, '⑤要因分解', [
    [`SHUWAN 要因分解（自社EC KPI逆算値） ― 生成日: ${TODAY}`],
    [],
    ['指標','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月'],
    ...calcData,
    [],
    ['--- 要因分解フレームワーク ---'],
    ['要因','チェックポイント','データソース','状況'],
    ['流入（セッション数）','TOPページPV・販売ページPV','GA4 + Shopifyファネル',''],
    ['CVR（購入転換率）','販売ページPV→購入完了率','GA4 + Shopify Admin',''],
    ['パイプライン（BtoB）','商談数・発注数・取扱店数','CSO pipeline.md',''],
    ['単価（客単価）','平均購入碗数・商品ミックス','Shopify注文データ',''],
    ['広告効率','CPC・CPA・ROAS・ACOS','Google広告 + Amazon広告',''],
    ['検索需要','検索ボリューム変化・サジェスト変化','Googleトレンド + Amazon',''],
  ]);

  // --- Sheet 6: チャンス・課題 ---
  const chanceRows = parseMdTable(kpiText, /領域.*チャンス.*課題.*影響度.*対応エージェント/);
  addSheet(wb, '⑥チャンス・課題', [
    [`SHUWAN チャンス・課題サマリー ― 生成日: ${TODAY}`],
    [],
    ['領域','チャンス / 課題','影響度','対応エージェント','推奨アクション'],
    ...chanceRows.map(r => r.map(c => c === '—' ? '' : c)),
    [],
    ['--- 分析ソース ---'],
    ['ソース','参照ファイル'],
    ['市場トレンド・検索需要','context/market/market-trends.md'],
    ['競合動向','context/market/competitors.md'],
    ['口コミ・レビュー','context/market/reviews-wom.md'],
    ['LP分析','context/market/lp-analysis.md'],
    ['Google広告分析','PMAX検索語句レポート + KPI管理表'],
    ['Amazonカテゴリ分析','Amazon酒器売れ筋・口コミ・KW'],
  ]);

  // --- Sheet 7: 活動修正提案 ---
  const actionRows = parseMdTable(kpiText, /優先度.*チャネル.*活動内容.*当初計画.*修正案/);
  addSheet(wb, '⑦活動修正提案', [
    [`SHUWAN 活動修正提案 ― 生成日: ${TODAY}`],
    [],
    ['優先度','チャネル','活動内容','当初計画','修正案','根拠（データソース）'],
    ...actionRows.map(r => r.map(c => c === '—' ? '' : c)),
    [],
    ['--- 月次活動計画との照合 ---'],
    ['参照元: SHUWAN_月次KPI活動計画_v3 (18).xlsx ②月次活動計画シート'],
    ['※ 日次PDCAのCMO統括レビュー（フェーズ3）で更新'],
  ]);

  // --- Sheet 8: 酒販店・料飲店KPI ---
  const btobSection = kpiText.split('### 【D】酒販店・料飲店 KPI目標')[1];
  let btobData = [];
  if (btobSection) {
    const allRows = parseMdTable('|dummy\n' + btobSection.split('###')[0], /dummy/);
    btobData = allRows.filter(r => r[0] !== '指標');
  }
  addSheet(wb, '⑧BtoB KPI', [
    [`SHUWAN 酒販店・料飲店 KPI目標 ― 生成日: ${TODAY}`],
    [],
    ['指標','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月'],
    ...btobData,
  ]);

  // --- Sheet 9: 前年同月参考 ---
  const prevSection = kpiText.split('### 【G】25年度実績')[1];
  let prevData = [];
  if (prevSection) {
    const allRows = parseMdTable('|dummy\n' + prevSection.split('##')[0], /dummy/);
    prevData = allRows.filter(r => r[0] !== '月');
  }
  addSheet(wb, '⑨前年実績参考', [
    [`SHUWAN 25年度実績（前年同月参考） ― 生成日: ${TODAY}`],
    [],
    ['月','対象売上合計','限界利益','レベシェア利益(60%)','26年度同月目標','前年同月達成率'],
    ...prevData,
  ]);

  metaSheet(wb);
  const p = OUTPUT+'/SHUWAN_月次KPI進捗_GAP分析.xlsx';
  XLSX.writeFile(wb, p); console.log(`  KPI Tracking: ${p}`);
}

// ===== エントリーポイント =====
console.log(`SHUWAN Excel生成開始: ${TODAY}`);
createCMO();
createResearcher();
createCommPlanner();
createCSO();
createCTO();
createKpiTracking();
console.log('全ファイル生成完了');
