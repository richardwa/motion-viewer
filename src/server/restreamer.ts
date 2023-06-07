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

export const streamDaemon = (rtsp_url: string) => runProcess('ffmpeg', ffmpegArgs(rtsp_url))

function runProcess(command: string, args: string[]) {
  const process = spawn(command, args)
  const timeout = setTimeout(() => {
    process.kill()
  }, 1000 * 60 * 60)

  process.on('exit', (code, signal) => {
    clearTimeout(timeout)
    console.error(`Process exited with code ${code} and signal ${signal}. Restarting...`)
    runProcess(command, args)
  })

  process.on('error', (error) => {
    console.error('Process encountered an error:', error)
    runProcess(command, args)
  })

  return process
}
