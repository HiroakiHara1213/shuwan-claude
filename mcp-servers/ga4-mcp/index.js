import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { google } from "googleapis";

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SHOPIFY_PROPERTY_ID = process.env.GA4_SHOPIFY_PROPERTY_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

function resolvePropertyId(site) {
  if (!site || site === "shuwan") return PROPERTY_ID;
  if (site === "shopify") return SHOPIFY_PROPERTY_ID;
  return PROPERTY_ID;
}

let analyticsClient;
try {
  analyticsClient = new BetaAnalyticsDataClient({
    keyFilename: CREDENTIALS_PATH,
  });
} catch (err) {
  console.error("Failed to initialize GA4 client:", err.message);
}

let sheetsAuth;
try {
  sheetsAuth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
} catch (err) {
  console.error("Failed to initialize Sheets auth:", err.message);
}

const server = new Server(
  { name: "ga4-mcp-server", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

const siteParam = {
  type: "string",
  enum: ["shuwan", "shopify"],
  description: "対象サイト。shuwan=SHUWAN統合版、shopify=商品サイト(Shopify)。デフォルト: shuwan",
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "ga4_report",
      description:
        "GA4プロパティからレポートデータを取得します。PV数、ユーザー数、セッション数、コンバージョンなどの指標をディメンション別に取得できます。site指定でSHUWAN統合版/Shopify商品サイトを切り替えできます。",
      inputSchema: {
        type: "object",
        properties: {
          site: siteParam,
          startDate: {
            type: "string",
            description: "開始日（YYYY-MM-DD形式、または 7daysAgo, 30daysAgo, yesterday, today）",
          },
          endDate: {
            type: "string",
            description: "終了日（YYYY-MM-DD形式、または yesterday, today）",
          },
          metrics: {
            type: "array",
            items: { type: "string" },
            description:
              "取得する指標の配列。例: ['screenPageViews', 'activeUsers', 'sessions', 'conversions', 'totalRevenue', 'averageSessionDuration', 'bounceRate', 'newUsers', 'ecommercePurchases', 'itemRevenue', 'addToCarts', 'checkouts']",
          },
          dimensions: {
            type: "array",
            items: { type: "string" },
            description:
              "ディメンションの配列（任意）。例: ['date', 'pagePath', 'sessionSource', 'sessionMedium', 'city', 'deviceCategory', 'pageTitle', 'itemName', 'itemCategory']",
          },
          limit: {
            type: "number",
            description: "取得する行数の上限（デフォルト: 20）",
          },
          orderBy: {
            type: "string",
            description: "並べ替えに使用する指標名（降順）",
          },
        },
        required: ["startDate", "endDate", "metrics"],
      },
    },
    {
      name: "ga4_realtime",
      description:
        "GA4プロパティのリアルタイムデータを取得します。現在サイトにいるアクティブユーザー数やページビューを確認できます。",
      inputSchema: {
        type: "object",
        properties: {
          site: siteParam,
          metrics: {
            type: "array",
            items: { type: "string" },
            description:
              "取得するリアルタイム指標の配列。例: ['activeUsers', 'screenPageViews', 'conversions']",
          },
          dimensions: {
            type: "array",
            items: { type: "string" },
            description:
              "ディメンションの配列（任意）。例: ['unifiedScreenName', 'city', 'deviceCategory']",
          },
          limit: {
            type: "number",
            description: "取得する行数の上限（デフォルト: 10）",
          },
        },
        required: ["metrics"],
      },
    },
    {
      name: "ga4_top_pages",
      description:
        "指定期間のトップページ（PV数順）を取得します。どのページが最も閲覧されているかを把握できます。",
      inputSchema: {
        type: "object",
        properties: {
          site: siteParam,
          startDate: {
            type: "string",
            description: "開始日（YYYY-MM-DD形式、または 7daysAgo, 30daysAgo）",
          },
          endDate: {
            type: "string",
            description: "終了日（YYYY-MM-DD形式、または yesterday, today）",
          },
          limit: {
            type: "number",
            description: "取得するページ数（デフォルト: 20）",
          },
        },
        required: ["startDate", "endDate"],
      },
    },
    {
      name: "ga4_traffic_sources",
      description:
        "指定期間の流入元（トラフィックソース）を取得します。どこからユーザーが来ているかを把握できます。",
      inputSchema: {
        type: "object",
        properties: {
          site: siteParam,
          startDate: { type: "string", description: "開始日" },
          endDate: { type: "string", description: "終了日" },
          limit: { type: "number", description: "取得する行数（デフォルト: 20）" },
        },
        required: ["startDate", "endDate"],
      },
    },
    {
      name: "ga4_user_demographics",
      description:
        "ユーザーの属性情報（デバイス、地域、言語など）を取得します。",
      inputSchema: {
        type: "object",
        properties: {
          site: siteParam,
          startDate: { type: "string", description: "開始日" },
          endDate: { type: "string", description: "終了日" },
          dimensionType: {
            type: "string",
            enum: ["device", "city", "country", "language", "browser"],
            description: "取得するデモグラフィクスのタイプ",
          },
          limit: { type: "number", description: "取得する行数（デフォルト: 20）" },
        },
        required: ["startDate", "endDate", "dimensionType"],
      },
    },
    {
      name: "ga4_shopify_funnel",
      description:
        "Shopify商品サイトのページファネル分析を行います。トップページ→商品一覧→商品詳細→カート→購入完了の各ステップのPV数・ユーザー数・離脱率を取得し、ボトルネックを特定します。",
      inputSchema: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description: "開始日（YYYY-MM-DD形式、または 7daysAgo, 30daysAgo）",
          },
          endDate: {
            type: "string",
            description: "終了日（YYYY-MM-DD形式、または yesterday, today）",
          },
        },
        required: ["startDate", "endDate"],
      },
    },
    {
      name: "ga4_shopify_product_performance",
      description:
        "Shopify商品サイトの商品別パフォーマンスを取得します。商品ページ別のPV数・ユーザー数・滞在時間から、人気商品と改善が必要な商品を特定します。",
      inputSchema: {
        type: "object",
        properties: {
          startDate: { type: "string", description: "開始日" },
          endDate: { type: "string", description: "終了日" },
          limit: { type: "number", description: "取得する商品数（デフォルト: 30）" },
        },
        required: ["startDate", "endDate"],
      },
    },
    {
      name: "sheets_read",
      description:
        "Google スプレッドシートのデータを読み込みます。Google広告のPMAX検索語句レポートやKPI管理表など、Googleスプレッドシートのデータ取得に使用します。サービスアカウント(shuwan-ga4-reader)に閲覧権限が必要です。",
      inputSchema: {
        type: "object",
        properties: {
          spreadsheetId: {
            type: "string",
            description: "スプレッドシートのID（URLの /d/ と /edit の間の文字列）",
          },
          range: {
            type: "string",
            description: "読み込む範囲（例: 'Sheet1!A1:Z100', 'シート名!A:Z'）。省略時はシート全体",
          },
          limit: {
            type: "number",
            description: "取得する最大行数（デフォルト: 200）",
          },
        },
        required: ["spreadsheetId"],
      },
    },
    {
      name: "ga4_shopify_landing_pages",
      description:
        "Shopify商品サイトのランディングページ（最初に訪問したページ）別のセッション数・直帰率・コンバージョンを取得します。どのページが集客に効いているかを把握できます。",
      inputSchema: {
        type: "object",
        properties: {
          startDate: { type: "string", description: "開始日" },
          endDate: { type: "string", description: "終了日" },
          limit: { type: "number", description: "取得するページ数（デフォルト: 20）" },
        },
        required: ["startDate", "endDate"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const propertyId = resolvePropertyId(args?.site);

  if (!propertyId) {
    return {
      content: [
        {
          type: "text",
          text: `エラー: ${args?.site || "shuwan"} のGA4プロパティIDが設定されていません。環境変数を確認してください。`,
        },
      ],
    };
  }

  if (!analyticsClient) {
    return {
      content: [
        {
          type: "text",
          text: "エラー: GA4クライアントの初期化に失敗しました。GOOGLE_APPLICATION_CREDENTIALS を確認してください。",
        },
      ],
    };
  }

  const prop = `properties/${propertyId}`;

  try {
    switch (name) {
      case "ga4_report": {
        const reportRequest = {
          property: prop,
          dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
          metrics: args.metrics.map((m) => ({ name: m })),
          limit: args.limit || 20,
        };
        if (args.dimensions) {
          reportRequest.dimensions = args.dimensions.map((d) => ({ name: d }));
        }
        if (args.orderBy) {
          reportRequest.orderBys = [
            { metric: { metricName: args.orderBy }, desc: true },
          ];
        }
        const [response] = await analyticsClient.runReport(reportRequest);
        return { content: [{ type: "text", text: formatReport(response, args.site) }] };
      }

      case "ga4_realtime": {
        const realtimeRequest = {
          property: prop,
          metrics: args.metrics.map((m) => ({ name: m })),
          limit: args.limit || 10,
        };
        if (args.dimensions) {
          realtimeRequest.dimensions = args.dimensions.map((d) => ({ name: d }));
        }
        const [response] = await analyticsClient.runRealtimeReport(realtimeRequest);
        return { content: [{ type: "text", text: formatReport(response, args.site) }] };
      }

      case "ga4_top_pages": {
        const [response] = await analyticsClient.runReport({
          property: prop,
          dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [
            { name: "screenPageViews" },
            { name: "activeUsers" },
            { name: "averageSessionDuration" },
          ],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: args.limit || 20,
        });
        return { content: [{ type: "text", text: formatReport(response, args.site) }] };
      }

      case "ga4_traffic_sources": {
        const [response] = await analyticsClient.runReport({
          property: prop,
          dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
          dimensions: [
            { name: "sessionSource" },
            { name: "sessionMedium" },
          ],
          metrics: [
            { name: "sessions" },
            { name: "activeUsers" },
            { name: "conversions" },
            { name: "bounceRate" },
          ],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: args.limit || 20,
        });
        return { content: [{ type: "text", text: formatReport(response, args.site) }] };
      }

      case "ga4_user_demographics": {
        const dimMap = {
          device: "deviceCategory",
          city: "city",
          country: "country",
          language: "language",
          browser: "browser",
        };
        const [response] = await analyticsClient.runReport({
          property: prop,
          dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
          dimensions: [{ name: dimMap[args.dimensionType] }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: args.limit || 20,
        });
        return { content: [{ type: "text", text: formatReport(response, args.site) }] };
      }

      case "ga4_shopify_funnel": {
        const shopifyProp = `properties/${SHOPIFY_PROPERTY_ID}`;
        if (!SHOPIFY_PROPERTY_ID) {
          return { content: [{ type: "text", text: "エラー: GA4_SHOPIFY_PROPERTY_ID が設定されていません。" }] };
        }

        // ファネル各ステップのページパスパターンでPV・ユーザー数を取得
        const [allPages] = await analyticsClient.runReport({
          property: shopifyProp,
          dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
          dimensions: [{ name: "pagePath" }],
          metrics: [
            { name: "screenPageViews" },
            { name: "activeUsers" },
            { name: "sessions" },
          ],
          limit: 500,
        });

        const funnelSteps = [
          { name: "トップページ", pattern: /^\/$/ },
          { name: "コレクション（商品一覧）", pattern: /^\/collections/ },
          { name: "商品詳細", pattern: /^\/products\// },
          { name: "カート", pattern: /^\/cart/ },
          { name: "チェックアウト", pattern: /^\/checkouts?\// },
          { name: "購入完了（Thank you）", pattern: /\/thank.you|\/orders\// },
        ];

        let result = `## 🛒 Shopifyファネル分析（${args.startDate} 〜 ${args.endDate}）\n\n`;
        result += "| ステップ | PV数 | ユーザー数 | セッション数 | 前ステップからの遷移率 |\n";
        result += "| --- | --- | --- | --- | --- |\n";

        const stepData = [];
        for (const step of funnelSteps) {
          let pv = 0, users = 0, sessions = 0;
          if (allPages.rows) {
            for (const row of allPages.rows) {
              const path = row.dimensionValues[0].value;
              if (step.pattern.test(path)) {
                pv += parseInt(row.metricValues[0].value) || 0;
                users += parseInt(row.metricValues[1].value) || 0;
                sessions += parseInt(row.metricValues[2].value) || 0;
              }
            }
          }
          stepData.push({ name: step.name, pv, users, sessions });
        }

        for (let i = 0; i < stepData.length; i++) {
          const s = stepData[i];
          const rate = i === 0 ? "—" :
            stepData[i - 1].users > 0
              ? `${((s.users / stepData[i - 1].users) * 100).toFixed(1)}%`
              : "—";
          result += `| ${s.name} | ${s.pv.toLocaleString()} | ${s.users.toLocaleString()} | ${s.sessions.toLocaleString()} | ${rate} |\n`;
        }

        // ボトルネック分析
        result += "\n### ボトルネック分析\n";
        let worstDrop = { idx: -1, rate: 100 };
        for (let i = 1; i < stepData.length; i++) {
          if (stepData[i - 1].users > 0) {
            const rate = (stepData[i].users / stepData[i - 1].users) * 100;
            if (rate < worstDrop.rate) {
              worstDrop = { idx: i, rate };
            }
          }
        }
        if (worstDrop.idx > 0) {
          result += `- **最大離脱ポイント**: ${stepData[worstDrop.idx - 1].name} → ${stepData[worstDrop.idx].name}（遷移率 ${worstDrop.rate.toFixed(1)}%）\n`;
        }

        return { content: [{ type: "text", text: result }] };
      }

      case "ga4_shopify_product_performance": {
        const shopifyProp = `properties/${SHOPIFY_PROPERTY_ID}`;
        if (!SHOPIFY_PROPERTY_ID) {
          return { content: [{ type: "text", text: "エラー: GA4_SHOPIFY_PROPERTY_ID が設定されていません。" }] };
        }

        const [response] = await analyticsClient.runReport({
          property: shopifyProp,
          dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [
            { name: "screenPageViews" },
            { name: "activeUsers" },
            { name: "averageSessionDuration" },
            { name: "bounceRate" },
          ],
          dimensionFilter: {
            filter: {
              fieldName: "pagePath",
              stringFilter: { matchType: "BEGINS_WITH", value: "/products/" },
            },
          },
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: args.limit || 30,
        });

        let result = `## 📦 Shopify商品別パフォーマンス（${args.startDate} 〜 ${args.endDate}）\n\n`;
        result += formatReport(response, "shopify");
        return { content: [{ type: "text", text: result }] };
      }

      case "ga4_shopify_landing_pages": {
        const shopifyProp = `properties/${SHOPIFY_PROPERTY_ID}`;
        if (!SHOPIFY_PROPERTY_ID) {
          return { content: [{ type: "text", text: "エラー: GA4_SHOPIFY_PROPERTY_ID が設定されていません。" }] };
        }

        const [response] = await analyticsClient.runReport({
          property: shopifyProp,
          dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
          dimensions: [{ name: "landingPagePlusQueryString" }],
          metrics: [
            { name: "sessions" },
            { name: "activeUsers" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
            { name: "conversions" },
          ],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: args.limit || 20,
        });

        let result = `## 🚪 Shopifyランディングページ分析（${args.startDate} 〜 ${args.endDate}）\n\n`;
        result += formatReport(response, "shopify");
        return { content: [{ type: "text", text: result }] };
      }

      case "sheets_read": {
        if (!sheetsAuth) {
          return { content: [{ type: "text", text: "エラー: Google Sheets認証の初期化に失敗しました。" }] };
        }
        const sheetsClient = google.sheets({ version: "v4", auth: sheetsAuth });
        const range = args.range || undefined;
        const limit = args.limit || 200;

        // シート名一覧を取得
        const meta = await sheetsClient.spreadsheets.get({
          spreadsheetId: args.spreadsheetId,
        });
        const sheetList = meta.data.sheets.map(s => ({
          title: s.properties.title,
          sheetId: s.properties.sheetId,
          index: s.properties.index,
        }));

        let response;
        if (range) {
          // 日本語シート名を含む場合はセル範囲のみに変換（"シート名!A:Z" → "A:Z"）
          const cellRange = range.includes("!") ? range.split("!").slice(1).join("!") : range;
          // 対象シートを特定してgidパラメータで指定
          const sheetName = range.includes("!") ? range.split("!")[0].replace(/^'|'$/g, "") : null;
          const targetSheet = sheetName
            ? sheetList.find(s => s.title === sheetName) || sheetList[0]
            : sheetList[0];
          response = await sheetsClient.spreadsheets.values.get({
            spreadsheetId: args.spreadsheetId,
            range: cellRange,
            // 複数シートある場合はrangeだけでは最初のシートになるため注意
          });
        } else {
          // range未指定時はシート一覧を返す
          return {
            content: [{
              type: "text",
              text: `スプレッドシートのシート一覧:\n${sheetList.map((s, i) => `${i + 1}. ${s.title}`).join("\n")}\n\nデータを読み込むには range パラメータにセル範囲を指定してください。例: "A:Z" または "A1:Z200"`,
            }],
          };
        }

        const rows = response.data.values || [];
        if (rows.length === 0) {
          return { content: [{ type: "text", text: "データがありません。シートが空か、サービスアカウントに閲覧権限がない可能性があります。\n\n共有設定で shuwan-ga4-reader@fleet-tensor-491503-m3.iam.gserviceaccount.com を閲覧者として追加してください。" }] };
        }

        const displayRows = rows.slice(0, limit);
        const headers = displayRows[0] || [];
        let result = `## スプレッドシートデータ（${args.range}）\n\n`;
        result += `取得行数: ${displayRows.length - 1}行（ヘッダー除く）/ 全${rows.length - 1}行\n\n`;
        result += `| ${headers.join(" | ")} |\n`;
        result += `| ${headers.map(() => "---").join(" | ")} |\n`;
        for (const row of displayRows.slice(1)) {
          // 列数をヘッダーに合わせる
          const paddedRow = Array.from({ length: headers.length }, (_, i) => row[i] ?? "");
          result += `| ${paddedRow.join(" | ")} |\n`;
        }
        return { content: [{ type: "text", text: result }] };
      }

      default:
        return {
          content: [{ type: "text", text: `不明なツール: ${name}` }],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `GA4 APIエラー: ${error.message}\n\nサービスアカウントにGA4プロパティの閲覧権限が付与されているか確認してください。`,
        },
      ],
    };
  }
});

function formatReport(response, site) {
  const siteLabel = site === "shopify" ? "【Shopify】" : "【SHUWAN統合版】";

  if (!response.rows || response.rows.length === 0) {
    return `${siteLabel} データがありません。`;
  }

  const dimensionHeaders = (response.dimensionHeaders || []).map(
    (h) => h.name
  );
  const metricHeaders = (response.metricHeaders || []).map((h) => h.name);
  const headers = [...dimensionHeaders, ...metricHeaders];

  let result = `${siteLabel}\n`;
  result += `| ${headers.join(" | ")} |\n`;
  result += `| ${headers.map(() => "---").join(" | ")} |\n`;

  for (const row of response.rows) {
    const dims = (row.dimensionValues || []).map((v) => v.value);
    const mets = (row.metricValues || []).map((v) => v.value);
    result += `| ${[...dims, ...mets].join(" | ")} |\n`;
  }

  result += `\n合計行数: ${response.rowCount || response.rows.length}`;
  return result;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
