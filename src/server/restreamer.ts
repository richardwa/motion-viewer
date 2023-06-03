import { spawn, type ChildProcessWithoutNullStreams } from 'child_process'
import type { IncomingMessage, ServerResponse } from 'http'

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
type Response = ServerResponse<IncomingMessage>

export class RestreamVideo {
  rtsp_url: string
  clients: Response[]
  initalData: BinaryData[]
  _process: ChildProcessWithoutNullStreams

  constructor(rtsp_url: string) {
    console.log('starting restreamer for', rtsp_url)

    this.rtsp_url = rtsp_url
    this.clients = []
    this._process = spawn('ffmpeg', ffmpegArgs(this.rtsp_url))
    this.initalData = []
    this._init()
  }

  _init() {
    this._process.stderr.on('data', (data) => {
      console.error(`FFmpeg stderr: ${data}`)
    })

    this._process.stdout.on('data', (data: BinaryData) => {
      if (this.initalData.length < 1) {
        this.initalData.push(data)
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
    for (const data of this.initalData) {
      res.write(data)
    }
    this.clients.push(res)
  }
}