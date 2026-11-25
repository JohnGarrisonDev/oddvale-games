// Zero-dependency static file server for local play-testing.
// Usage: node scripts/serve.mjs [dir=dist] [port=4173]
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const root = path.resolve(args[0] || 'dist')
const port = Number(args[1] || 4173)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' }

// With --api (or API_PROXY=http://127.0.0.1:8787 (npm run api:dev)), /api/* is forwarded there so the widgets can be tested locally.
const API_PROXY = process.env.API_PROXY || (process.argv.includes('--api') ? 'http://127.0.0.1:8787' : '')

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname.startsWith('/api/')) {
    if (!API_PROXY) { res.writeHead(404, { 'Content-Type': 'application/json' }).end('{"ok":false}'); return }
    const body = req.method === 'POST' ? await new Promise((ok) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => ok(Buffer.concat(c))) }) : undefined
    try {
      const r = await fetch(API_PROXY + req.url, { method: req.method, body, headers: { 'content-type': req.headers['content-type'] || '', origin: req.headers.origin || '', 'cf-connecting-ip': '127.0.0.1' } })
      res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') || 'application/json' }).end(Buffer.from(await r.arrayBuffer()))
    } catch { res.writeHead(502).end() }
    return
  }
  let file = path.join(root, decodeURIComponent(url.pathname))
  if (!file.startsWith(root)) { res.writeHead(403).end(); return }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) { res.writeHead(308, { Location: url.pathname + '/' + url.search }).end(); return }
    file = path.join(file, 'index.html')
  }
  if (!fs.existsSync(file)) {
    const nf = path.join(root, '404.html')
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found')
    return
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' })
  fs.createReadStream(file).pipe(res)
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root} at http://127.0.0.1:${port}`))
