import { endPoints, cameras } from '@/common/config'
import { serveStaticFile } from './fileserver'
import { stream } from './restreamer'
import http from 'http'

const args = process.argv.slice(2)
const port = args[0]

const server = http.createServer((req, res) => {
  let pattern = endPoints.hello
  if (req.url?.startsWith(pattern)) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello from server!!')
    return
  }

  pattern = endPoints.stream
  if (req.url?.startsWith(pattern)) {
    const id = parseInt(req.url.substring(pattern.length))
    const camera = cameras[id]
    if (!camera) {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('no config for stream #' + id)
      return
    }
    res.writeHead(200, { 'Content-Type': 'video/x-matroska' })
    const s = stream(camera.rtsp)
    s.stdout.on('data', (data: BinaryData) => {
      res.write(data)
    })
    s.stderr.on('data', (data) => {
      console.error(`FFmpeg stderr: ${data}`)
    })
    s.on('close', (code) => {
      res.end()
    })
    req.on('close', () => {
      s.kill()
    })
    return
  }

  serveStaticFile(req, res)
  return
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
