import { cameras } from '../common/config'
import express from 'express'
import path from 'path'
import { RestreamVideo } from './restreamer'

const base = '/srv'
const args = process.argv.slice(2)
const app = express()

const port = args[0]
app.use(express.static(path.join(__dirname, '../client')))

app.get(`${base}/`, (req, res) => {
  res.send('Hello from server!!')
})

const cache = new Map<string, RestreamVideo>()
app.get(`${base}/stream/:id`, (req, res) => {
  const id = parseInt(req.params.id)
  const camera = cameras[id]
  if (!camera) {
    res.end('no config for stream #' + id)
    return
  }
  const stream = cache.get(camera.rtsp) || new RestreamVideo(camera.rtsp)
  cache.set(camera.rtsp, stream)

  res.setHeader('Content-Type', 'video/x-matroska')
  stream.register(res)
  req.on('close', () => {
    const remaining = stream.unregister(res)
    if (remaining === 0) {
      console.log('no more clients end stream')
      cache.delete(camera.rtsp)
    }
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
