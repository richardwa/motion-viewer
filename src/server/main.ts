import { endPoints } from '@/common/config'
import path from 'path'
import { serveFolder } from './fileserver'
import httpProxy from 'http-proxy'
import express from 'express'

// catch-all to prevent node from exiting
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise)
  console.error('Reason:', reason)
})

const args = process.argv.slice(2)
const port = args[0]

const proxy = httpProxy.createProxyServer()
const clientJS = path.join(process.cwd(), 'build', 'client')
const captures = path.join(process.cwd(), endPoints.captures)

const serveClientJS = serveFolder({ folder: clientJS })
const serveCaptures = serveFolder({
  folder: captures,
  startsWith: endPoints.captures,
  useCache: false
})

const app = express()

app.get(endPoints.hello, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello from server!!')
})

app.get(`${endPoints.stream}/*`, (req, res) => {
  const url = req.url?.substring(endPoints.stream.length + 1)
  const target = `http://localhost:8083/${url}`
  proxy.web(req, res, { target })
})

app.get('/', (req, res) => {
  res.redirect('/index.html')
})

app.use(async (req, res) => {
  const handled =
    (await serveCaptures(req, res)) ||
    (await serveClientJS(req, res)) ||
    (() => {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('File not found!')
      return true
    })()
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
