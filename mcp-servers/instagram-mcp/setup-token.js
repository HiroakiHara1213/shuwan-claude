#!/usr/bin/env node
/**
 * Instagram Graph API セットアップスクリプト
 *
 * 使い方:
 *   node setup-token.js <短期ユーザートークン>
 *
 * 短期トークンの取得方法:
 *   1. https://developers.facebook.com/tools/explorer/ を開く
 *   2. アプリを選択 → 「ユーザーまたはページ」→ 自分のアカウント
 *   3. 権限を追加:
 *      - instagram_basic
 *      - instagram_manage_insights
 *      - pages_show_list
 *      - pages_read_engagement
 *   4. 「アクセストークンを生成」ボタンをクリック
 *   5. 生成されたトークンをコピーしてこのスクリプトに渡す
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const APP_ID = process.env.META_APP_ID;
const APP_SECRET = process.env.META_APP_SECRET;
const SHORT_TOKEN = process.argv[2];

if (!SHORT_TOKEN) {
  console.error("使い方: node setup-token.js <短期ユーザートークン>");
  console.error("\n短期トークンは https://developers.facebook.com/tools/explorer/ で取得してください");
  process.exit(1);
}

if (!APP_ID || !APP_SECRET) {
  console.error("エラー: META_APP_ID と META_APP_SECRET が環境変数に設定されていません");
  console.error("~/.claude/credentials/instagram-token.json に app_id と app_secret を記載後、");
  console.error("export META_APP_ID=xxx META_APP_SECRET=yyy を実行してください");
  process.exit(1);
}

async function setup() {
  console.log("=== Instagram Graph API セットアップ ===\n");

  // Step 1: 短期トークン → 長期トークン（60日有効）に変換
  console.log("Step 1: 長期アクセストークンを取得中...");
  const longTokenRes = await fetch(
    `https://graph.facebook.com/oauth/access_token?` +
    `grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${SHORT_TOKEN}`
  );
  const longTokenData = await longTokenRes.json();
  if (longTokenData.error) {
    throw new Error(`長期トークン取得失敗: ${longTokenData.error.message}`);
  }
  const longToken = longTokenData.access_token;
  const expiresIn = longTokenData.expires_in;
  console.log(`✅ 長期トークン取得成功（有効期間: ${Math.floor(expiresIn / 86400)}日）\n`);

  // Step 2: Facebookページ一覧を取得
  console.log("Step 2: 接続済みFacebookページを確認中...");
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?access_token=${longToken}`
  );
  const pagesData = await pagesRes.json();
  if (!pagesData.data || pagesData.data.length === 0) {
    throw new Error("Facebookページが見つかりません。@shuwan_sakeがFacebookページと連携されているか確認してください");
  }
  console.log(`✅ Facebookページ: ${pagesData.data.length}件発見`);
  pagesData.data.forEach(p => console.log(`   - ${p.name} (ID: ${p.id})`));
  console.log();

  // Step 3: 各ページに紐づくInstagramビジネスアカウントIDを取得
  console.log("Step 3: Instagramビジネスアカウントを検索中...");
  let igAccountId = null;
  let igUsername = null;
  let pageAccessToken = null;

  for (const page of pagesData.data) {
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
    );
    const igData = await igRes.json();
    if (igData.instagram_business_account) {
      igAccountId = igData.instagram_business_account.id;
      pageAccessToken = page.access_token;

      // ユーザー名を確認
      const profileRes = await fetch(
        `https://graph.facebook.com/v21.0/${igAccountId}?fields=username,followers_count,media_count&access_token=${pageAccessToken}`
      );
      const profileData = await profileRes.json();
      igUsername = profileData.username;

      console.log(`✅ Instagramアカウント発見: @${igUsername}`);
      console.log(`   フォロワー数: ${profileData.followers_count.toLocaleString()}名`);
      console.log(`   投稿数: ${profileData.media_count}件`);
      console.log(`   アカウントID: ${igAccountId}\n`);
      break;
    }
  }

  if (!igAccountId) {
    throw new Error(
      "Instagramビジネスアカウントが見つかりません。\n" +
      "Instagram設定 → 「アカウントの種類とツール」→ 「プロアカウントに切り替える」を確認してください。\n" +
      "また、InstagramとFacebookページが連携されている必要があります。"
    );
  }

  // Step 4: credentials/instagram-token.json に保存
  const credDir = join(homedir(), ".claude", "credentials");
  mkdirSync(credDir, { recursive: true });

  const tokenData = {
    access_token: longToken,
    instagram_account_id: igAccountId,
    instagram_username: igUsername,
    app_id: APP_ID,
    expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
    created_at: new Date().toISOString(),
    note: "60日で期限切れ。期限前に `instagram_refresh_token` ツールで更新すること",
  };

  const credPath = join(credDir, "instagram-token.json");
  writeFileSync(credPath, JSON.stringify(tokenData, null, 2));
  console.log(`✅ 認証情報を保存: ${credPath}\n`);

  console.log("=== セットアップ完了 ===");
  console.log("\n次のステップ:");
  console.log("1. settings.local.json に instagram-mcp を追加（下記をコピー）");
  console.log(`
    "instagram-mcp": {
      "command": "node",
      "args": ["C:/Users/hara/.claude/mcp-servers/instagram-mcp/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "${longToken}",
        "INSTAGRAM_ACCOUNT_ID": "${igAccountId}"
      }
    }
  `);
  console.log("2. Claude Code を再起動");
  console.log("3. `instagram_get_profile` ツールで動作確認");
  console.log("\n⚠️  トークンは60日で期限切れ。月次PDCAで `instagram_refresh_token` を実行してください。");
}

setup().catch(err => {
  console.error(`\n❌ エラー: ${err.message}`);
  process.exit(1);
});
