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

export const stream = (rtsp_url: string) => spawn('ffmpeg', ffmpegArgs(rtsp_url))

