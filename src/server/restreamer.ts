import { spawn, type ChildProcessWithoutNullStreams } from 'child_process'
import type { Response } from 'express'

const ffmpegArgs = (url: string) => [
  ...['-rtsp_transport', 'tcp'],
  ...['-i', url],
  ...['-c', 'copy'],
  ...['-f', 'matroska'],
  ...['-movflags', 'frag_keyframe+empty_moov'],
  ...['-reset_timestamps', '1'],
  ...['-loglevel', 'error'],
  '-hide_banner',
  'pipe:1'
]

export class RestreamVideo {
  rtsp_url: string
  clients: Response[]
  firstSegment?: BinaryData
  _process: ChildProcessWithoutNullStreams

  constructor(rtsp_url: string) {
    this.rtsp_url = rtsp_url
    this.clients = []
    this._process = spawn('ffmpeg', ffmpegArgs(this.rtsp_url))
    this._init()
  }

  _init() {
    this._process.stderr.on('data', (data) => {
      console.error(`FFmpeg stderr: ${data}`)
    })

    this._process.stdout.on('data', (data: BinaryData) => {
      if (this.firstSegment === null) {
        this.firstSegment = data
      }
      for (const client of this.clients) {
        client.write(data)
      }
    })

    this._process.on('close', (code) => {
      console.error(`FFmpeg process exited with code ${code}`)
      this.clients.forEach((client) => {
        client.end()
      })
      this.clients = []
    })
  }

  _destory() {
    this._process.kill()
  }

  register(res: Response) {
    if (this.firstSegment) {
      res.write(this.firstSegment)
    }
    this.clients.push(res)
  }

  unregister(res: Response) {
    this.clients = this.clients.filter((c) => c !== res)
    if (this.clients.length === 0) {
      this._destory()
    }
    return this.clients.length
  }
}
