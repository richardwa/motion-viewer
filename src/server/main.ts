import { endPoints } from '@/common/config'
import http, { IncomingMessage, ServerResponse } from 'http'
import path from 'path'
import { serveFolder } from './fileserver'
import httpProxy from 'http-proxy';

const args = process.argv.slice(2)
const port = args[0]

const proxy = httpProxy.createProxyServer();
const clientJS = path.join(process.cwd(), 'build', 'client')
const captures = path.join(process.cwd(), endPoints.captures)

const serveClientJS = serveFolder({ folder: clientJS })
const serveCaptures = serveFolder({
  folder: captures,
  startsWith: endPoints.captures,
  useCache: false
})

const handlers: {
  [s: string]: (req: IncomingMessage, res: ServerResponse, matched: string) => boolean
} = {}

handlers[endPoints.hello] = (req, res, m) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello from server!!')
  return true
}

handlers[endPoints.stream] = (req, res, m) => {
  const target = `http://cam.mangosplit.com:8083/${req.url?.substring(m.length + 1)}`
  console.log('target', target)
  proxy.web(req, res, { target });
  return true
}

handlers[''] = (req, res) => serveCaptures(req, res) || serveClientJS(req, res)

const handlerKeys = Object.keys(handlers)
const server = http.createServer((req, res) => {
  try {
    if (req.url === '' || req.url === '/') {
      res.writeHead(302, {
        Location: '/index.html'
      })
      res.end()
      return
    }

    for (const key of handlerKeys) {
      if (req.url?.startsWith(key)) {
        const handled = handlers[key](req, res, key)
        if (handled) return
      }
    }

    // default handler
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('File not found!')
    return
  } catch (e) {
    console.log(e)
  }
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
