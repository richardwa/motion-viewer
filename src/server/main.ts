import { cameras, endPoints } from '@/common/config'
import http from 'http'
import path from 'path'
import { serveFolder } from './fileserver'
import { streamDaemon } from './restreamer'

const args = process.argv.slice(2)
const port = args[0]

const clientJS = path.join(process.cwd(), 'build', 'client')
const captures = path.join(process.cwd(), 'captures')

const serveClientJS = serveFolder({ folder: clientJS })
const serveClips = serveFolder({ folder: captures, startsWith: '/captures', useCache: false })

const server = http.createServer((req, res) => {
  try {
    let pattern = endPoints.hello
    if (req.url?.startsWith(pattern)) {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Hello from server!!')
      return
    }

    pattern = endPoints.stream
    if (req.url?.startsWith(pattern)) {
      const name = req.url.substring(pattern.length + 1)
      const camera = cameras[name]
      if (!camera) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('no config for stream ' + name)
        return
      }
      res.writeHead(200, { 'Content-Type': 'video/x-matroska' })
      const s = streamDaemon(camera.rtsp)
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

    const handled = serveClientJS(req, res) || serveClips(req, res)
    if (handled) return

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
