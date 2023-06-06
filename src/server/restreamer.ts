import { spawn } from 'child_process'
import path from 'path'

const ffmpegArgs = (url: string, outDir: string) => [
  ...['-rtsp_transport', 'tcp'],
  ...['-i', url],
  ...['-c:a', 'copy'],
  ...['-c:v', 'copy'],
  ...['-f', 'hls'],
  ...['-hls_time', '10'],
  ...['-hls_list_size', '3'],
  ...['-hls_segment_filename', path.join(outDir, `s-${Date.now()}-%d.ts`)],
  '-hide_banner',
  path.join(outDir, 'playlist.m3u8')
]

export const streamDaemon = (rtsp_url: string, outDir: string): void => {
  const child = spawn('ffmpeg', ffmpegArgs(rtsp_url, outDir))
  // child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  const timeout = setTimeout(() => {
    child.kill()
  }, 1000 * 60 * 60)

  child.on('exit', (code, signal) => {
    clearTimeout(timeout)
    console.log(`Process exited with code ${code} and signal ${signal}. Restarting...`)
    streamDaemon(rtsp_url, outDir)
  })

  child.on('error', (error) => {
    console.log('Process encountered an error:', error)
    streamDaemon(rtsp_url, outDir)
  })
}
