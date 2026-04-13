#!/usr/bin/env node
/**
 * Gmail MCP Server for hara@thinqlo.co.jp
 * Purpose: SHUWAN meeting notes, agendas, and project memos
 *
 * Setup: Run `node setup-oauth.js` first to generate credentials.json
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js')
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js')
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js')
const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json')

function getAuth() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      'credentials.json not found. Run: node setup-oauth.js\n' +
      'See README.md for setup instructions.'
    )
  }
  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'))
  const { client_id, client_secret, refresh_token } = creds
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, 'urn:ietf:wg:oauth:2.0:oob')
  oauth2Client.setCredentials({ refresh_token })
  return oauth2Client
}

const server = new Server(
  { name: 'gmail-thinqlo-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'gmail_thinqlo_search',
      description: 'Search emails in hara@thinqlo.co.jp (SHUWAN meeting notes, agendas, memos)',
      inputSchema: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Gmail search query (e.g. "SHUWAN 議事録 after:2026/04/01")' },
          maxResults: { type: 'number', description: 'Max results (default: 10)', default: 10 },
        },
        required: ['q'],
      },
    },
    {
      name: 'gmail_thinqlo_read',
      description: 'Read a specific email from hara@thinqlo.co.jp by message ID',
      inputSchema: {
        type: 'object',
        properties: {
          messageId: { type: 'string', description: 'Gmail message ID from search results' },
        },
        required: ['messageId'],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    const auth = getAuth()
    const gmail = google.gmail({ version: 'v1', auth })

    if (name === 'gmail_thinqlo_search') {
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: args.q,
        maxResults: args.maxResults ?? 10,
      })
      const messages = res.data.messages ?? []
      const results = await Promise.all(
        messages.map(async (m) => {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: m.id,
            format: 'metadata',
            metadataHeaders: ['Subject', 'From', 'Date'],
          })
          const headers = msg.data.payload?.headers ?? []
          const get = (name) => headers.find((h) => h.name === name)?.value ?? ''
          return {
            messageId: m.id,
            subject: get('Subject'),
            from: get('From'),
            date: get('Date'),
            snippet: msg.data.snippet,
          }
        })
      )
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] }
    }

    if (name === 'gmail_thinqlo_read') {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: args.messageId,
        format: 'full',
      })
      const headers = msg.data.payload?.headers ?? []
      const get = (name) => headers.find((h) => h.name === name)?.value ?? ''

      // Decode body
      let body = ''
      const parts = msg.data.payload?.parts ?? [msg.data.payload]
      for (const part of parts) {
        if (part?.mimeType === 'text/plain' && part.body?.data) {
          body += Buffer.from(part.body.data, 'base64').toString('utf-8')
        }
      }
      if (!body && msg.data.payload?.body?.data) {
        body = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf-8')
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            subject: get('Subject'),
            from: get('From'),
            date: get('Date'),
            body: body.slice(0, 5000),
          }, null, 2),
        }],
      }
    }

    throw new Error(`Unknown tool: ${name}`)
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true }
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(console.error)
