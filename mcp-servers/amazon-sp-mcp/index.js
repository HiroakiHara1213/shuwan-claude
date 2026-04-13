/**
 * Amazon SP-API MCP Server for SHUWAN
 * 売上・注文・在庫・財務データをPDCAシステムに提供
 *
 * 必要な環境変数:
 *   LWA_CLIENT_ID      - Login with Amazon クライアントID
 *   LWA_CLIENT_SECRET  - Login with Amazon クライアントシークレット
 *   LWA_REFRESH_TOKEN  - リフレッシュトークン（セラーセントラルで生成）
 *   AMAZON_SELLER_ID   - セラーID（セラーセントラル右上）
 *   AMAZON_MARKETPLACE_ID - マーケットプレイスID（日本: A1VC38T7YXB528）
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import https from 'https';

// ── 設定 ────────────────────────────────────────────────
const SP_API_BASE = 'https://sellingpartnerapi-fe.amazon.com';
const LWA_ENDPOINT = 'https://api.amazon.com/auth/o2/token';
const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID || 'A1VC38T7YXB528'; // 日本
const SELLER_ID      = process.env.AMAZON_SELLER_ID;
const CLIENT_ID      = process.env.LWA_CLIENT_ID;
const CLIENT_SECRET  = process.env.LWA_CLIENT_SECRET;
const REFRESH_TOKEN  = process.env.LWA_REFRESH_TOKEN;

// ── LWAトークンキャッシュ ────────────────────────────────
let _accessToken = null;
let _tokenExpiry = 0;

async function getLwaAccessToken() {
  if (_accessToken && Date.now() < _tokenExpiry - 60000) {
    return _accessToken;
  }
  const body = new URLSearchParams({
    grant_type:    'refresh_token',
    refresh_token: REFRESH_TOKEN,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }).toString();

  const data = await httpsPost('https://api.amazon.com', '/auth/o2/token', body, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  _accessToken = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in * 1000);
  return _accessToken;
}

// ── HTTP ユーティリティ ──────────────────────────────────
function httpsRequest(method, host, path, body, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host.replace('https://', ''),
      path,
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function httpsPost(host, path, body, headers) {
  return httpsRequest('POST', host, path, body, headers);
}

async function spApiGet(endpoint, params = {}) {
  const token = await getLwaAccessToken();
  const query = new URLSearchParams(params).toString();
  const path = query ? `${endpoint}?${query}` : endpoint;
  return httpsRequest('GET', SP_API_BASE, path, null, {
    'x-amz-access-token': token,
    'Accept': 'application/json',
  });
}

// ── 日付ユーティリティ ───────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function toIso(dateStr) {
  return new Date(dateStr).toISOString();
}

// ── MCPサーバー ──────────────────────────────────────────
const server = new McpServer({
  name: 'amazon-sp-mcp',
  version: '1.0.0',
});

// ── Tool 1: 注文一覧取得 ─────────────────────────────────
server.tool(
  'amazon_get_orders',
  {
    created_after:  z.string().optional().describe('開始日時 ISO8601（例: 2026-03-01T00:00:00Z）。省略時は過去30日'),
    created_before: z.string().optional().describe('終了日時 ISO8601。省略時は現在'),
    order_statuses: z.array(z.string()).optional().describe('注文ステータス。例: ["Shipped","Unshipped"]。省略時は全ステータス'),
    max_results:    z.number().optional().describe('最大取得件数（1-100）。デフォルト50'),
  },
  async ({ created_after, created_before, order_statuses, max_results }) => {
    const params = {
      MarketplaceIds: MARKETPLACE_ID,
      CreatedAfter:  created_after  || daysAgo(30),
      MaxResultsPerPage: String(max_results || 50),
    };
    if (created_before)  params.CreatedBefore = created_before;
    if (order_statuses?.length) params.OrderStatuses = order_statuses.join(',');

    const data = await spApiGet('/orders/v0/orders', params);
    const orders = data.payload?.Orders || [];

    // SHUWAN向けサマリー集計
    let totalAmount = 0;
    let totalItems = 0;
    const statusBreakdown = {};

    orders.forEach(o => {
      const amt = parseFloat(o.OrderTotal?.Amount || 0);
      totalAmount += amt;
      totalItems += (o.NumberOfItemsShipped || 0) + (o.NumberOfItemsUnshipped || 0);
      const st = o.OrderStatus;
      statusBreakdown[st] = (statusBreakdown[st] || 0) + 1;
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: {
            total_orders: orders.length,
            total_amount_jpy: Math.round(totalAmount),
            total_items: totalItems,
            status_breakdown: statusBreakdown,
          },
          orders: orders.map(o => ({
            order_id:       o.AmazonOrderId,
            status:         o.OrderStatus,
            purchase_date:  o.PurchaseDate,
            total:          o.OrderTotal,
            items_shipped:  o.NumberOfItemsShipped,
            items_pending:  o.NumberOfItemsUnshipped,
            fulfillment:    o.FulfillmentChannel,
            buyer_email:    o.BuyerEmail,
          })),
          next_token: data.payload?.NextToken || null,
        }, null, 2),
      }],
    };
  }
);

// ── Tool 2: 注文明細取得 ─────────────────────────────────
server.tool(
  'amazon_get_order_items',
  {
    order_id: z.string().describe('AmazonOrderId（例: 503-XXXXXXX-XXXXXXX）'),
  },
  async ({ order_id }) => {
    const data = await spApiGet(`/orders/v0/orders/${order_id}/orderItems`);
    const items = data.payload?.OrderItems || [];

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          order_id,
          items: items.map(i => ({
            asin:              i.ASIN,
            sku:               i.SellerSKU,
            title:             i.Title,
            quantity_ordered:  i.QuantityOrdered,
            quantity_shipped:  i.QuantityShipped,
            item_price:        i.ItemPrice,
            item_tax:          i.ItemTax,
            promotion_discount: i.PromotionDiscount,
          })),
        }, null, 2),
      }],
    };
  }
);

// ── Tool 3: 売上KPIサマリー（PDCA用） ────────────────────
server.tool(
  'amazon_get_kpi_summary',
  {
    days: z.number().optional().describe('集計日数（例: 7=週次, 30=月次）。デフォルト30'),
  },
  async ({ days = 30 }) => {
    const params = {
      MarketplaceIds: MARKETPLACE_ID,
      CreatedAfter:  daysAgo(days),
      OrderStatuses: 'Shipped,Unshipped,PartiallyShipped,Pending',
      MaxResultsPerPage: '100',
    };

    const data = await spApiGet('/orders/v0/orders', params);
    const orders = data.payload?.Orders || [];

    // SHUWAN PDCA KPI集計（碗数・売上・FBA/FBM別）
    let totalRevenue = 0;
    let totalBowls = 0; // QuantityOrdered合計
    let fbaOrders = 0;
    let fbmOrders = 0;
    const dailyRevenue = {};

    for (const o of orders) {
      const amt = parseFloat(o.OrderTotal?.Amount || 0);
      totalRevenue += amt;
      const qty = (o.NumberOfItemsShipped || 0) + (o.NumberOfItemsUnshipped || 0);
      totalBowls += qty;
      if (o.FulfillmentChannel === 'AFN') fbaOrders++;
      else fbmOrders++;

      // 日次集計
      const day = o.PurchaseDate?.split('T')[0];
      if (day) {
        if (!dailyRevenue[day]) dailyRevenue[day] = { revenue: 0, orders: 0, bowls: 0 };
        dailyRevenue[day].revenue += amt;
        dailyRevenue[day].orders++;
        dailyRevenue[day].bowls += qty;
      }
    }

    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const dailySorted = Object.entries(dailyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v, revenue: Math.round(v.revenue) }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          period: `過去${days}日間`,
          kpi: {
            total_revenue_jpy:   Math.round(totalRevenue),
            total_orders:        orders.length,
            total_bowls:         totalBowls,
            avg_order_value_jpy: Math.round(avgOrderValue),
            fba_orders:          fbaOrders,
            fbm_orders:          fbmOrders,
            daily_avg_revenue:   Math.round(totalRevenue / days),
            daily_avg_orders:    Math.round((orders.length / days) * 10) / 10,
          },
          daily_trend: dailySorted,
          next_token: data.payload?.NextToken || null,
        }, null, 2),
      }],
    };
  }
);

// ── Tool 4: 在庫確認 ─────────────────────────────────────
server.tool(
  'amazon_get_inventory',
  {
    sku_filter: z.string().optional().describe('SKUの部分一致フィルター（省略時は全在庫）'),
  },
  async ({ sku_filter }) => {
    const params = {
      marketplaceIds: MARKETPLACE_ID,
      details: 'true',
    };
    if (sku_filter) params.sellerSkus = sku_filter;

    const data = await spApiGet('/fba/inventory/v1/summaries', params);
    const summaries = data.payload?.inventorySummaries || [];

    const lowStock = summaries.filter(s => (s.totalQuantity || 0) < 10);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          total_skus: summaries.length,
          low_stock_alert: lowStock.map(s => ({
            sku:      s.sellerSku,
            asin:     s.asin,
            name:     s.productName,
            qty:      s.totalQuantity,
            sellable: s.fulfillableQuantity,
          })),
          inventory: summaries.map(s => ({
            sku:               s.sellerSku,
            asin:              s.asin,
            name:              s.productName,
            total_qty:         s.totalQuantity,
            sellable_qty:      s.fulfillableQuantity,
            inbound_qty:       s.inboundWorkingQuantity,
            reserved_qty:      s.reservedQuantity?.totalReservedQuantity,
            condition:         s.condition,
          })),
        }, null, 2),
      }],
    };
  }
);

// ── Tool 5: 財務サマリー ──────────────────────────────────
server.tool(
  'amazon_get_finance_summary',
  {
    posted_after:  z.string().optional().describe('開始日時 ISO8601。省略時は過去30日'),
    posted_before: z.string().optional().describe('終了日時 ISO8601。省略時は現在'),
  },
  async ({ posted_after, posted_before }) => {
    const params = {
      PostedAfter:  posted_after  || daysAgo(30),
      MarketplaceId: MARKETPLACE_ID,
    };
    if (posted_before) params.PostedBefore = posted_before;

    const data = await spApiGet('/finances/v0/financialEventGroups', params);
    const groups = data.payload?.FinancialEventGroupList || [];

    let totalSales     = 0;
    let totalFees      = 0;
    let totalRefunds   = 0;
    let totalDeposited = 0;

    groups.forEach(g => {
      totalSales     += parseFloat(g.OriginalTotal?.CurrencyAmount || 0);
      totalFees      += parseFloat(g.ConvertedTotal?.CurrencyAmount || 0);
      totalDeposited += parseFloat(g.AccountTail || 0);
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: {
            total_sales_jpy:     Math.round(totalSales),
            total_fees_jpy:      Math.round(totalFees),
            net_proceeds_jpy:    Math.round(totalSales + totalFees),
            payment_groups:      groups.length,
          },
          groups: groups.map(g => ({
            group_id:           g.FinancialEventGroupId,
            processing_status:  g.ProcessingStatus,
            fund_transfer_date: g.FundTransferDate,
            original_total:     g.OriginalTotal,
            converted_total:    g.ConvertedTotal,
            begin_date:         g.FinancialEventGroupStart,
            end_date:           g.FinancialEventGroupEnd,
          })),
        }, null, 2),
      }],
    };
  }
);

// ── Tool 6: セラーパフォーマンス指標 ─────────────────────
server.tool(
  'amazon_get_seller_metrics',
  {},
  async () => {
    // セラーフィードバック・パフォーマンス
    const [feedback] = await Promise.allSettled([
      spApiGet(`/sellers/v1/marketplaceParticipations`),
    ]);

    const participations = feedback.status === 'fulfilled'
      ? feedback.value?.payload || []
      : [];

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          marketplace_participations: participations,
          note: '詳細な出品者パフォーマンス指標はセラーセントラルのAccount Health APIを有効化後に取得可能です',
        }, null, 2),
      }],
    };
  }
);

// ── 起動 ─────────────────────────────────────────────────
async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !SELLER_ID) {
    process.stderr.write(
      '[amazon-sp-mcp] ERROR: 必要な環境変数が設定されていません。\n' +
      '  LWA_CLIENT_ID, LWA_CLIENT_SECRET, LWA_REFRESH_TOKEN, AMAZON_SELLER_ID\n'
    );
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('[amazon-sp-mcp] Amazon SP-API MCP Server started\n');
}

main().catch(err => {
  process.stderr.write(`[amazon-sp-mcp] Fatal: ${err.message}\n`);
  process.exit(1);
});
