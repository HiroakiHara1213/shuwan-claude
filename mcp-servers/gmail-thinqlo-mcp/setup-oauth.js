#!/usr/bin/env node
/**
 * OAuth2セットアップスクリプト — hara@thinqlo.co.jp
 *
 * 使い方:
 *   1. Google Cloud Console で OAuth2 デスクトップクライアントを作成済み
 *   2. 環境変数 GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET をセット
 *   3. node setup-oauth.js を実行
 *   4. ブラウザが開くので hara@thinqlo.co.jp でログイン・許可
 *   5. 自動的に認証コードを受け取り credentials.json を生成
 */

const { google } = require('googleapis')
const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const CLIENT_ID = process.env.GMAIL_CLIENT_ID || 'YOUR_CLIENT_ID_HERE'
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE'
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const REDIRECT_PORT = 3847
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`

async function main() {
  if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE') {
    console.error('❌ GMAIL_CLIENT_ID と GMAIL_CLIENT_SECRET を環境変数にセットしてください')
    process.exit(1)
  }

  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    login_hint: 'hara@thinqlo.co.jp',
  })

  console.log('\n=== Gmail OAuth2 セットアップ (hara@thinqlo.co.jp) ===\n')
  console.log('ブラウザで以下のURLを開いてください:')
  console.log('\n' + authUrl + '\n')

  // ブラウザを自動で開く
  const { exec } = require('child_process')
  const openCmd = process.platform === 'win32' ? 'start' :
                  process.platform === 'darwin' ? 'open' : 'xdg-open'
  exec(`${openCmd} "${authUrl}"`)

  // ローカルサーバーで認証コードを受信
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, REDIRECT_URI)
      const code = url.searchParams.get('code')
      const error = url.searchParams.get('error')

      if (error) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('<h1>❌ 認証がキャンセルされました</h1><p>ウィンドウを閉じてください。</p>')
        console.error('❌ 認証エラー:', error)
        server.close()
        process.exit(1)
      }

      if (!code) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('<p>認証中...</p>')
        return
      }

      const { tokens } = await oauth2Client.getToken(code)
      const credentials = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
        token_type: 'Bearer',
        scope: SCOPES.join(' '),
        account: 'hara@thinqlo.co.jp',
      }

      const outPath = path.join(__dirname, 'credentials.json')
      fs.writeFileSync(outPath, JSON.stringify(credentials, null, 2))

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end('<h1>✅ 認証完了</h1><p>credentials.json を生成しました。このウィンドウを閉じてください。</p>')

      console.log('\n✅ credentials.json を生成しました:', outPath)
      console.log('次のステップ: Claude Code を再起動してください')

      server.close()
      setTimeout(() => process.exit(0), 1000)
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(`<h1>❌ エラー</h1><p>${err.message}</p>`)
      console.error('❌ エラー:', err.message)
      server.close()
      process.exit(1)
    }
  })

  server.listen(REDIRECT_PORT, () => {
    console.log(`認証コード待機中 (localhost:${REDIRECT_PORT})...`)
    console.log('ブラウザで認証を完了してください。\n')
  })
}

main()
