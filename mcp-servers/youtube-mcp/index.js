import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import https from "https";

const API_KEY =
  process.env.YOUTUBE_API_KEY || "AIzaSyCNsylGzC4zNsNrJqJn6CGV5oFUCRk7q9U";

// Helper: HTTPS GET returning JSON
function ytGet(path) {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3${path}&key=${API_KEY}`;
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.error.message));
            } else {
              resolve(json);
            }
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

// Format number with commas
function fmt(n) {
  return Number(n).toLocaleString("ja-JP");
}

// Server
const server = new McpServer({
  name: "youtube",
  version: "1.0.0",
});

// 1. youtube_search
server.tool(
  "youtube_search",
  "Search YouTube videos by keyword. Returns title, description, view count, and publish date.",
  {
    query: z.string().describe("Search keyword"),
    maxResults: z
      .number()
      .min(1)
      .max(50)
      .default(10)
      .describe("Number of results (1-50, default 10)"),
  },
  async ({ query, maxResults }) => {
    const search = await ytGet(
      `/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}`
    );
    if (!search.items || search.items.length === 0) {
      return { content: [{ type: "text", text: "No results found." }] };
    }

    const ids = search.items.map((i) => i.id.videoId).join(",");

    const details = await ytGet(
      `/videos?part=snippet,statistics&id=${ids}`
    );

    const lines = details.items.map((v, idx) => {
      const s = v.snippet;
      const st = v.statistics;
      return [
        `[${idx + 1}] ${s.title}`,
        `    Video ID   : ${v.id}`,
        `    Channel    : ${s.channelTitle}`,
        `    Published  : ${s.publishedAt.slice(0, 10)}`,
        `    Views      : ${fmt(st.viewCount)}`,
        `    Likes      : ${fmt(st.likeCount || 0)}`,
        `    Comments   : ${fmt(st.commentCount || 0)}`,
        `    Description: ${(s.description || "").slice(0, 120)}`,
        `    URL        : https://www.youtube.com/watch?v=${v.id}`,
      ].join("\n");
    });

    return {
      content: [{ type: "text", text: lines.join("\n\n") }],
    };
  }
);

// 2. youtube_video_comments
server.tool(
  "youtube_video_comments",
  "Get comments for a YouTube video by video ID.",
  {
    videoId: z.string().describe("YouTube video ID"),
    maxResults: z
      .number()
      .min(1)
      .max(100)
      .default(20)
      .describe("Number of comments (1-100, default 20)"),
    order: z
      .enum(["relevance", "time"])
      .default("relevance")
      .describe("Sort order: relevance or time"),
  },
  async ({ videoId, maxResults, order }) => {
    const res = await ytGet(
      `/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=${order}&textFormat=plainText`
    );

    if (!res.items || res.items.length === 0) {
      return {
        content: [
          { type: "text", text: "No comments found (comments may be disabled)." },
        ],
      };
    }

    const lines = res.items.map((item, idx) => {
      const c = item.snippet.topLevelComment.snippet;
      return [
        `[${idx + 1}] ${c.authorDisplayName}  (${c.publishedAt.slice(0, 10)})`,
        `    Likes: ${fmt(c.likeCount)}`,
        `    ${c.textDisplay}`,
      ].join("\n");
    });

    return {
      content: [
        {
          type: "text",
          text: `Comments for video ${videoId} (${res.items.length} items):\n\n${lines.join("\n\n")}`,
        },
      ],
    };
  }
);

// 3. youtube_channel_info
server.tool(
  "youtube_channel_info",
  "Get YouTube channel information by channel ID or username.",
  {
    channelId: z
      .string()
      .optional()
      .describe("Channel ID (e.g. UCxxxx)"),
    username: z
      .string()
      .optional()
      .describe("Channel username / handle"),
  },
  async ({ channelId, username }) => {
    let path;
    if (channelId) {
      path = `/channels?part=snippet,statistics,brandingSettings&id=${encodeURIComponent(channelId)}`;
    } else if (username) {
      path = `/channels?part=snippet,statistics,brandingSettings&forHandle=${encodeURIComponent(username)}`;
    } else {
      return {
        content: [
          { type: "text", text: "Please provide either channelId or username." },
        ],
      };
    }

    const res = await ytGet(path);
    if (!res.items || res.items.length === 0) {
      return { content: [{ type: "text", text: "Channel not found." }] };
    }

    const ch = res.items[0];
    const s = ch.snippet;
    const st = ch.statistics;

    const text = [
      `Channel: ${s.title}`,
      `ID     : ${ch.id}`,
      `URL    : https://www.youtube.com/channel/${ch.id}`,
      `Created: ${s.publishedAt.slice(0, 10)}`,
      `Country: ${s.country || "N/A"}`,
      `Subscribers: ${fmt(st.subscriberCount)}`,
      `Total Views: ${fmt(st.viewCount)}`,
      `Videos     : ${fmt(st.videoCount)}`,
      `Description:\n${s.description || "(none)"}`,
    ].join("\n");

    return { content: [{ type: "text", text }] };
  }
);

// 4. youtube_trending
server.tool(
  "youtube_trending",
  "Get trending videos in Japan.",
  {
    maxResults: z
      .number()
      .min(1)
      .max(50)
      .default(10)
      .describe("Number of results (1-50, default 10)"),
    categoryId: z
      .string()
      .default("0")
      .describe("Video category ID (0=all, 10=Music, 20=Gaming, etc.)"),
  },
  async ({ maxResults, categoryId }) => {
    const res = await ytGet(
      `/videos?part=snippet,statistics&chart=mostPopular&regionCode=JP&maxResults=${maxResults}&videoCategoryId=${categoryId}`
    );

    if (!res.items || res.items.length === 0) {
      return { content: [{ type: "text", text: "No trending videos found." }] };
    }

    const lines = res.items.map((v, idx) => {
      const s = v.snippet;
      const st = v.statistics;
      return [
        `[${idx + 1}] ${s.title}`,
        `    Channel   : ${s.channelTitle}`,
        `    Published : ${s.publishedAt.slice(0, 10)}`,
        `    Views     : ${fmt(st.viewCount)}`,
        `    Likes     : ${fmt(st.likeCount || 0)}`,
        `    URL       : https://www.youtube.com/watch?v=${v.id}`,
      ].join("\n");
    });

    return {
      content: [
        {
          type: "text",
          text: `Trending in Japan (category ${categoryId}):\n\n${lines.join("\n\n")}`,
        },
      ],
    };
  }
);

// Start
const transport = new StdioServerTransport();
await server.connect(transport);
