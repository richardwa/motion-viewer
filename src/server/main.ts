import { cameras, endPoints } from '@/common/config'
import { createFoldersIfNotExist } from '@/common/util'
import http from 'http'
import path from 'path'
import { serveFolder } from './fileserver'
import { streamDaemon } from './restreamer'

const args = process.argv.slice(2)
const port = args[0]

const clientJS = path.join(process.cwd(), 'build', 'client')
const feeds = path.join(process.cwd(), 'feeds')
const clips = path.join(process.cwd(), 'clips')

cameras.forEach((c) => {
  const outDir = path.join(feeds, c.name)
  createFoldersIfNotExist(outDir).then(() => {
    console.log('starting', c.rtsp)
    console.log('outDir', outDir)
    // streamDaemon(c.rtsp, outDir)
  })
})

const serveClientJS = serveFolder({ folder: clientJS })
const serveFeeds = serveFolder({ folder: feeds, startsWith: '/feeds', useCache: false })
const serveClips = serveFolder({ folder: clips, startsWith: '/clips', useCache: false })

const server = http.createServer((req, res) => {
  try {
    let pattern = endPoints.hello
    if (req.url?.startsWith(pattern)) {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Hello from server!!')
      return
    }

    const handled = serveClientJS(req, res) || serveFeeds(req, res) || serveClips(req, res)
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
