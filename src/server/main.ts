import { cameras } from '../common/config'
import { serveStaticFile } from './fileserver'
import { RestreamVideo } from './restreamer'
import http from 'http'

const base = '/srv'
const args = process.argv.slice(2)
const port = args[0]

const cache = new Map<string, RestreamVideo>()
setInterval(() => {
  for (const stream of cache.values()) {
    console.log('connected clients', stream.clients.length)
    const validClients = stream.clients.filter((c) => {
      const req = c.req
      if (req.closed) {
        console.log('client disconnected')
      }
      return !req.closed
    })
    stream.clients = validClients
    if (validClients.length <= 0) {
      cache.delete(stream.rtsp_url)
      stream._destory()
    }
  }
}, 5000)

const server = http.createServer((req, res) => {
  let pattern = `${base}/`
  if (req.url === pattern) {
    res.setHeader('Content-Type', 'text/html')
    res.end('Hello from server!!')
    return
  }

  pattern = `${base}/stream/`
  if (req.url?.startsWith(pattern)) {
    const id = parseInt(req.url.substring(pattern.length))
    const camera = cameras[id]
    if (!camera) {
      res.end('no config for stream #' + id)
      return
    }
    const stream = cache.get(camera.rtsp) || new RestreamVideo(camera.rtsp)
    cache.set(camera.rtsp, stream)

    res.setHeader('Content-Type', 'video/x-matroska')
    stream.register(res)
    return
  }

  serveStaticFile(req, res)

  res.statusCode = 404
  res.end('Not found')
  return
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
