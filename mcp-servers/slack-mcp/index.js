import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WebClient } from "@slack/web-api";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const slack = new WebClient(SLACK_BOT_TOKEN);

const server = new Server(
  { name: "slack-order-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "slack_order_channels",
      description:
        "Slackワークスペースのチャンネル一覧を取得します（パブリック・プライベート両方）。チャンネルIDの特定に使用。",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "チャンネル名で絞り込み（部分一致）。省略時は全チャンネル",
          },
          limit: {
            type: "number",
            description: "取得数（デフォルト: 100）",
          },
        },
      },
    },
    {
      name: "slack_read_orders",
      description:
        "Slackチャンネルのメッセージを読み込みます。オーダーまとめチャンネルの受注データ集計に使用。プライベートチャンネルも読み取り可能。",
      inputSchema: {
        type: "object",
        properties: {
          channel_id: {
            type: "string",
            description: "チャンネルID（例: C092B3F368Z）",
          },
          oldest: {
            type: "string",
            description: "取得開始日時（Unix timestamp または YYYY-MM-DD形式）",
          },
          latest: {
            type: "string",
            description: "取得終了日時（Unix timestamp または YYYY-MM-DD形式）",
          },
          limit: {
            type: "number",
            description: "取得メッセージ数（デフォルト: 200、最大: 1000）",
          },
        },
        required: ["channel_id"],
      },
    },
    {
      name: "slack_read_order_thread",
      description:
        "Slackスレッドの返信メッセージを読み込みます。スレッド内の詳細な受注情報の取得に使用。",
      inputSchema: {
        type: "object",
        properties: {
          channel_id: {
            type: "string",
            description: "チャンネルID",
          },
          thread_ts: {
            type: "string",
            description: "スレッドの親メッセージのtimestamp",
          },
          limit: {
            type: "number",
            description: "取得メッセージ数（デフォルト: 100）",
          },
        },
        required: ["channel_id", "thread_ts"],
      },
    },
  ],
}));

// YYYY-MM-DD → Unix timestamp 変換
function parseDate(dateStr) {
  if (!dateStr) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return String(new Date(dateStr + "T00:00:00+09:00").getTime() / 1000);
  }
  return dateStr; // already unix timestamp
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!SLACK_BOT_TOKEN) {
    return {
      content: [{
        type: "text",
        text: "エラー: SLACK_BOT_TOKEN が設定されていません。settings.local.json の env を確認してください。",
      }],
    };
  }

  try {
    switch (name) {
      case "slack_order_channels": {
        const types = "public_channel,private_channel";
        const result = await slack.conversations.list({
          types,
          limit: args.limit || 100,
          exclude_archived: true,
        });

        let channels = result.channels || [];
        if (args.query) {
          const q = args.query.toLowerCase();
          channels = channels.filter(
            (c) => c.name.toLowerCase().includes(q) || (c.purpose?.value || "").toLowerCase().includes(q)
          );
        }

        let output = `## Slackチャンネル一覧（${channels.length}件）\n\n`;
        output += "| チャンネル名 | ID | タイプ | メンバー数 |\n";
        output += "|---|---|---|---|\n";
        for (const ch of channels) {
          const type = ch.is_private ? "プライベート" : "パブリック";
          output += `| #${ch.name} | ${ch.id} | ${type} | ${ch.num_members} |\n`;
        }
        return { content: [{ type: "text", text: output }] };
      }

      case "slack_read_orders": {
        const oldest = parseDate(args.oldest);
        const latest = parseDate(args.latest);
        const limit = Math.min(args.limit || 200, 1000);

        let allMessages = [];
        let cursor;
        let remaining = limit;

        do {
          const batchSize = Math.min(remaining, 200);
          const result = await slack.conversations.history({
            channel: args.channel_id,
            oldest,
            latest,
            limit: batchSize,
            cursor,
          });

          const messages = result.messages || [];
          allMessages = allMessages.concat(messages);
          remaining -= messages.length;
          cursor = result.response_metadata?.next_cursor;
        } while (cursor && remaining > 0);

        // 時系列順にソート（古い→新しい）
        allMessages.sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));

        let output = `## Slackメッセージ（${allMessages.length}件）\n\n`;

        for (const msg of allMessages) {
          const date = new Date(parseFloat(msg.ts) * 1000);
          const dateStr = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
          const user = msg.user || "bot";
          const text = msg.text || "";
          const threadInfo = msg.reply_count ? ` [スレッド: ${msg.reply_count}件の返信]` : "";
          const threadTs = msg.thread_ts && msg.thread_ts !== msg.ts ? " (スレッド返信)" : "";

          output += `### ${dateStr} (user: ${user})${threadInfo}${threadTs}\n`;
          output += `ts: ${msg.ts}\n`;
          output += `${text}\n\n---\n\n`;
        }

        return { content: [{ type: "text", text: output }] };
      }

      case "slack_read_order_thread": {
        const result = await slack.conversations.replies({
          channel: args.channel_id,
          ts: args.thread_ts,
          limit: args.limit || 100,
        });

        const messages = result.messages || [];
        let output = `## スレッド返信（${messages.length}件）\n\n`;

        for (const msg of messages) {
          const date = new Date(parseFloat(msg.ts) * 1000);
          const dateStr = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
          output += `### ${dateStr} (user: ${msg.user || "bot"})\n`;
          output += `${msg.text || ""}\n\n---\n\n`;
        }

        return { content: [{ type: "text", text: output }] };
      }

      default:
        return { content: [{ type: "text", text: `不明なツール: ${name}` }] };
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Slack APIエラー: ${error.message}\n\nボットがチャンネルに招待されているか、スコープが正しいか確認してください。`,
      }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
