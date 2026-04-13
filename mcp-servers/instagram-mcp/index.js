#!/usr/bin/env node
/**
 * Instagram Graph API MCP Server for SHUWAN
 *
 * 提供ツール:
 *   instagram_get_profile   - フォロワー数・投稿数・プロフィール取得
 *   instagram_get_insights  - リーチ・インプレッション・エンゲージメント取得
 *   instagram_list_media    - 最新投稿一覧（エンゲージメント付き）
 *   instagram_refresh_token - アクセストークンの更新（60日有効）
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
const API_BASE = "https://graph.facebook.com/v21.0";

async function apiFetch(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("access_token", ACCESS_TOKEN);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) {
    throw new Error(`Instagram API Error: ${data.error.message} (code: ${data.error.code})`);
  }
  return data;
}

const server = new Server(
  { name: "instagram-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "instagram_get_profile",
      description: "SHUWANのInstagramプロフィール情報を取得。フォロワー数・投稿数・ユーザー名など。",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "instagram_get_insights",
      description: "Instagram アカウントのインサイト（リーチ・インプレッション・プロフィールPV）を取得。period: day or week or days_28",
      inputSchema: {
        type: "object",
        properties: {
          period: {
            type: "string",
            enum: ["day", "week", "days_28"],
            description: "集計期間。デフォルト: week",
          },
        },
      },
    },
    {
      name: "instagram_list_media",
      description: "最新の投稿一覧と各投稿のいいね数・コメント数を取得",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "取得件数（デフォルト: 10）",
          },
        },
      },
    },
    {
      name: "instagram_refresh_token",
      description: "長期アクセストークンを更新（60日有効。24時間以上経過後に実行可能）",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!ACCESS_TOKEN) {
    return {
      content: [{ type: "text", text: "エラー: INSTAGRAM_ACCESS_TOKEN が設定されていません。~/.claude/credentials/instagram-token.json を確認してください。" }],
      isError: true,
    };
  }
  if (!IG_ACCOUNT_ID) {
    return {
      content: [{ type: "text", text: "エラー: INSTAGRAM_ACCOUNT_ID が設定されていません。setup-token.js を実行してIDを取得してください。" }],
      isError: true,
    };
  }

  try {
    switch (request.params.name) {
      case "instagram_get_profile": {
        const data = await apiFetch(`/${IG_ACCOUNT_ID}`, {
          fields: "username,followers_count,follows_count,media_count,profile_picture_url,biography,website",
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              username: data.username,
              followers_count: data.followers_count,
              follows_count: data.follows_count,
              media_count: data.media_count,
              biography: data.biography,
              website: data.website,
              retrieved_at: new Date().toISOString(),
            }, null, 2),
          }],
        };
      }

      case "instagram_get_insights": {
        const period = request.params.arguments?.period || "week";
        const metrics = [
          "impressions",
          "reach",
          "profile_views",
          "accounts_engaged",
          "total_interactions",
        ].join(",");
        const data = await apiFetch(`/${IG_ACCOUNT_ID}/insights`, {
          metric: metrics,
          period,
          metric_type: "total_value",
        });
        const result = {};
        for (const item of (data.data || [])) {
          result[item.name] = item.total_value?.value ?? item.values?.[item.values.length - 1]?.value ?? "N/A";
        }
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ period, ...result, retrieved_at: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case "instagram_list_media": {
        const limit = request.params.arguments?.limit || 10;
        const data = await apiFetch(`/${IG_ACCOUNT_ID}/media`, {
          fields: "id,caption,media_type,timestamp,like_count,comments_count,permalink",
          limit,
        });
        const posts = (data.data || []).map(p => ({
          id: p.id,
          media_type: p.media_type,
          timestamp: p.timestamp,
          like_count: p.like_count,
          comments_count: p.comments_count,
          permalink: p.permalink,
          caption_preview: (p.caption || "").slice(0, 80),
        }));
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ count: posts.length, posts, retrieved_at: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case "instagram_refresh_token": {
        const url = new URL("https://graph.instagram.com/refresh_access_token");
        url.searchParams.set("grant_type", "ig_refresh_token");
        url.searchParams.set("access_token", ACCESS_TOKEN);
        const res = await fetch(url.toString());
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              new_token: data.access_token,
              expires_in_seconds: data.expires_in,
              expires_in_days: Math.floor(data.expires_in / 86400),
              note: "~/.claude/credentials/instagram-token.json の access_token を更新してください",
            }, null, 2),
          }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `未知のツール: ${request.params.name}` }],
          isError: true,
        };
    }
  } catch (err) {
    return {
      content: [{ type: "text", text: `エラー: ${err.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
