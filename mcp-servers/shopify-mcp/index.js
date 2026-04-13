import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = "2025-01";

async function shopifyGraphQL(query, variables = {}) {
  const url = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API Error (${res.status}): ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json;
}

function formatCurrency(amount) {
  return `¥${Math.round(Number(amount)).toLocaleString()}`;
}

function dateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

const server = new Server(
  { name: "shopify-mcp-server", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "shopify_orders_summary",
      description:
        "Shopifyの注文サマリー。指定期間の注文数・売上・平均注文単価を取得します。GraphQL Admin APIを使用。",
      inputSchema: {
        type: "object",
        properties: {
          days: { type: "number", description: "過去何日分（デフォルト: 30）" },
          limit: { type: "number", description: "取得する注文数（デフォルト: 50、最大250）" },
        },
      },
    },
    {
      name: "shopify_product_performance",
      description:
        "Shopifyの商品別パフォーマンス。売上・注文数・数量を商品別に集計します。",
      inputSchema: {
        type: "object",
        properties: {
          days: { type: "number", description: "過去何日分（デフォルト: 30）" },
          limit: { type: "number", description: "取得する注文数（デフォルト: 100）" },
        },
      },
    },
    {
      name: "shopify_recent_orders",
      description:
        "Shopifyの最新注文一覧。注文番号・日時・金額・商品を取得します。",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "取得する注文数（デフォルト: 10、最大50）" },
        },
      },
    },
    {
      name: "shopify_products_list",
      description:
        "Shopifyの商品一覧。商品名・価格・在庫・ステータスを取得します。",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "取得する商品数（デフォルト: 20）" },
        },
      },
    },
    {
      name: "shopify_inventory",
      description:
        "Shopifyの在庫状況。全商品のバリアント別在庫数を取得します。",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "shopify_custom_graphql",
      description:
        "カスタムGraphQLクエリをShopify Admin APIに送信します。orders, products, customers等のリソースにアクセスできます。",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "GraphQLクエリ文字列",
          },
          variables: {
            type: "object",
            description: "GraphQL変数（任意）",
          },
        },
        required: ["query"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    return {
      content: [{
        type: "text",
        text: "エラー: SHOPIFY_STORE または SHOPIFY_ACCESS_TOKEN 環境変数が設定されていません。",
      }],
    };
  }

  try {
    switch (name) {
      case "shopify_orders_summary": {
        const days = args?.days || 30;
        const limit = Math.min(args?.limit || 50, 250);
        const since = dateNDaysAgo(days);

        // Fetch orders with pagination
        let allOrders = [];
        let cursor = null;
        let hasMore = true;
        let remaining = limit;

        while (hasMore && remaining > 0) {
          const batchSize = Math.min(remaining, 50);
          const afterClause = cursor ? `, after: "${cursor}"` : "";
          const result = await shopifyGraphQL(`{
            orders(first: ${batchSize}, sortKey: CREATED_AT, reverse: true${afterClause}, query: "created_at:>=${since}") {
              edges {
                cursor
                node {
                  name
                  createdAt
                  displayFinancialStatus
                  totalPriceSet { shopMoney { amount currencyCode } }
                  subtotalPriceSet { shopMoney { amount } }
                  totalShippingPriceSet { shopMoney { amount } }
                  totalDiscountsSet { shopMoney { amount } }
                  lineItems(first: 10) {
                    edges {
                      node { title quantity originalTotalSet { shopMoney { amount } } }
                    }
                  }
                }
              }
              pageInfo { hasNextPage }
            }
          }`);

          const edges = result.data.orders.edges;
          allOrders = allOrders.concat(edges.map(e => e.node));
          hasMore = result.data.orders.pageInfo.hasNextPage;
          cursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
          remaining -= edges.length;
        }

        // Aggregate
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.totalPriceSet.shopMoney.amount), 0);
        const totalDiscount = allOrders.reduce((sum, o) => sum + Number(o.totalDiscountsSet.shopMoney.amount), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Daily breakdown
        const dailyMap = {};
        for (const o of allOrders) {
          const day = o.createdAt.split("T")[0];
          if (!dailyMap[day]) dailyMap[day] = { orders: 0, revenue: 0 };
          dailyMap[day].orders++;
          dailyMap[day].revenue += Number(o.totalPriceSet.shopMoney.amount);
        }

        let result = `## 💰 注文サマリー（過去${days}日間）\n\n`;
        result += `| 指標 | 値 |\n| --- | --- |\n`;
        result += `| 注文件数 | ${totalOrders}件 |\n`;
        result += `| 売上合計 | ${formatCurrency(totalRevenue)} |\n`;
        result += `| 平均注文単価（AOV） | ${formatCurrency(avgOrderValue)} |\n`;
        result += `| 割引合計 | ${formatCurrency(totalDiscount)} |\n\n`;

        result += `### 日別内訳\n\n`;
        result += `| 日付 | 注文数 | 売上 |\n| --- | --- | --- |\n`;
        const sortedDays = Object.keys(dailyMap).sort().reverse();
        for (const day of sortedDays) {
          result += `| ${day} | ${dailyMap[day].orders}件 | ${formatCurrency(dailyMap[day].revenue)} |\n`;
        }

        return { content: [{ type: "text", text: result }] };
      }

      case "shopify_product_performance": {
        const days = args?.days || 30;
        const limit = Math.min(args?.limit || 100, 250);
        const since = dateNDaysAgo(days);

        let allOrders = [];
        let cursor = null;
        let hasMore = true;
        let remaining = limit;

        while (hasMore && remaining > 0) {
          const batchSize = Math.min(remaining, 50);
          const afterClause = cursor ? `, after: "${cursor}"` : "";
          const result = await shopifyGraphQL(`{
            orders(first: ${batchSize}, sortKey: CREATED_AT, reverse: true${afterClause}, query: "created_at:>=${since}") {
              edges {
                cursor
                node {
                  lineItems(first: 20) {
                    edges {
                      node {
                        title
                        quantity
                        originalTotalSet { shopMoney { amount } }
                      }
                    }
                  }
                }
              }
              pageInfo { hasNextPage }
            }
          }`);

          const edges = result.data.orders.edges;
          allOrders = allOrders.concat(edges.map(e => e.node));
          hasMore = result.data.orders.pageInfo.hasNextPage;
          cursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
          remaining -= edges.length;
        }

        // Aggregate by product
        const productMap = {};
        for (const order of allOrders) {
          for (const edge of order.lineItems.edges) {
            const item = edge.node;
            const title = item.title.replace(/ \(ご注文後.*?\)/g, "").trim();
            if (!productMap[title]) productMap[title] = { orders: 0, units: 0, revenue: 0 };
            productMap[title].orders++;
            productMap[title].units += item.quantity;
            productMap[title].revenue += Number(item.originalTotalSet.shopMoney.amount);
          }
        }

        const sorted = Object.entries(productMap).sort((a, b) => b[1].revenue - a[1].revenue);

        let result = `## 📦 商品別パフォーマンス（過去${days}日間）\n\n`;
        result += `| 商品名 | 注文回数 | 販売数 | 売上 | 平均単価 |\n| --- | --- | --- | --- | --- |\n`;
        for (const [title, data] of sorted) {
          const avgPrice = data.units > 0 ? data.revenue / data.units : 0;
          result += `| ${title} | ${data.orders}回 | ${data.units}個 | ${formatCurrency(data.revenue)} | ${formatCurrency(avgPrice)} |\n`;
        }

        return { content: [{ type: "text", text: result }] };
      }

      case "shopify_recent_orders": {
        const limit = Math.min(args?.limit || 10, 50);
        const result = await shopifyGraphQL(`{
          orders(first: ${limit}, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                name
                createdAt
                displayFinancialStatus
                totalPriceSet { shopMoney { amount currencyCode } }
                lineItems(first: 10) {
                  edges { node { title quantity } }
                }
              }
            }
          }
        }`);

        let text = `## 📋 最新注文一覧（${limit}件）\n\n`;
        text += `| 注文番号 | 日時 | 金額 | 状態 | 商品 |\n| --- | --- | --- | --- | --- |\n`;
        for (const edge of result.data.orders.edges) {
          const o = edge.node;
          const items = o.lineItems.edges.map(e => `${e.node.title}×${e.node.quantity}`).join(", ");
          const date = new Date(o.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
          text += `| ${o.name} | ${date} | ${formatCurrency(o.totalPriceSet.shopMoney.amount)} | ${o.displayFinancialStatus} | ${items} |\n`;
        }

        return { content: [{ type: "text", text }] };
      }

      case "shopify_products_list": {
        const limit = Math.min(args?.limit || 20, 50);
        const result = await shopifyGraphQL(`{
          products(first: ${limit}, sortKey: TITLE) {
            edges {
              node {
                title
                status
                totalInventory
                priceRangeV2 {
                  minVariantPrice { amount currencyCode }
                  maxVariantPrice { amount currencyCode }
                }
                variants(first: 5) {
                  edges {
                    node { title price inventoryQuantity sku }
                  }
                }
              }
            }
          }
        }`);

        let text = `## 🏷️ 商品一覧\n\n`;
        text += `| 商品名 | ステータス | 価格 | 在庫合計 |\n| --- | --- | --- | --- |\n`;
        for (const edge of result.data.products.edges) {
          const p = edge.node;
          const min = formatCurrency(p.priceRangeV2.minVariantPrice.amount);
          const max = formatCurrency(p.priceRangeV2.maxVariantPrice.amount);
          const price = min === max ? min : `${min}〜${max}`;
          text += `| ${p.title} | ${p.status} | ${price} | ${p.totalInventory} |\n`;
        }

        return { content: [{ type: "text", text }] };
      }

      case "shopify_inventory": {
        const result = await shopifyGraphQL(`{
          products(first: 50, sortKey: TITLE) {
            edges {
              node {
                title
                variants(first: 10) {
                  edges {
                    node { title sku inventoryQuantity }
                  }
                }
              }
            }
          }
        }`);

        let text = `## 📊 在庫状況\n\n`;
        text += `| 商品 | バリアント | SKU | 在庫数 |\n| --- | --- | --- | --- |\n`;
        for (const edge of result.data.products.edges) {
          const p = edge.node;
          for (const v of p.variants.edges) {
            const variant = v.node;
            text += `| ${p.title} | ${variant.title} | ${variant.sku || "-"} | ${variant.inventoryQuantity} |\n`;
          }
        }

        return { content: [{ type: "text", text }] };
      }

      case "shopify_custom_graphql": {
        if (!args?.query) {
          return { content: [{ type: "text", text: "エラー: GraphQLクエリを指定してください。" }] };
        }
        const result = await shopifyGraphQL(args.query, args?.variables || {});
        return { content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }] };
      }

      default:
        return { content: [{ type: "text", text: `不明なツール: ${name}` }] };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Shopify APIエラー: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
