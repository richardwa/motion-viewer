import { endPoints, cameras } from '@/common/config'
import { serveStaticFile } from './fileserver'
import { RestreamVideo } from './restreamer'
import http from 'http'

const args = process.argv.slice(2)
const port = args[0]

const cache = new Map<string, RestreamVideo>()
setInterval(() => {
  for (const stream of cache.values()) {
    console.log('connected clients', stream.clients.length)
    const validClients = stream.clients.filter((c) => {
      const req = c.req
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
  if (req.url?.startsWith(endPoints.hello)) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello from server!!')
    return
  }

  if (req.url?.startsWith(endPoints.stream)) {
    const id = parseInt(req.url.substring(endPoints.stream.length))
    const camera = cameras[id]
    if (!camera) {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('no config for stream #' + id)
      return
    }

    const stream = cache.get(camera.rtsp) || new RestreamVideo(camera.rtsp)
    cache.set(camera.rtsp, stream)

    res.writeHead(200, { 'Content-Type': 'video/x-matroska' })
    stream.register(res)
    return
  }

  serveStaticFile(req, res)
  return
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
