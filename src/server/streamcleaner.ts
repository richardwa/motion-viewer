import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

export function getFilesOlderThan(folderPath: string, millis: number, extname?: string): string[] {
  const files = fs.readdirSync(folderPath)
  const oneHourAgo = new Date(Date.now() - millis)

  return files
    .filter((file) => path.extname(file) === extname)
    .filter((file) => {
      const filePath = path.join(folderPath, file)
      const fileStats = fs.statSync(filePath)
      const modifiedTime = fileStats.mtime
      return modifiedTime < oneHourAgo
    })
}

export function detectMotionInVideos(videoPaths: string[], threshold: number): Promise<boolean[]> {
  return new Promise<boolean[]>((resolve, reject) => {
    let command = `ffmpeg`

    videoPaths.forEach((videoPath, index) => {
      command += ` -i ${videoPath} -vf "select='gt(scene,${threshold})',metadata=print" -an -f null -`
      if (index !== videoPaths.length - 1) {
        command += ` -f null -`
      }
    })

    console.log(command)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }

      const outputLines = stdout.split('\n')
      const motionDetected = outputLines.map((line) => line.includes('lavfi.scene_score'))

      resolve(motionDetected)
    })
  })
}

export const cleanup = (outDir: string, captures: string, minutes: number) => {
  const aged = getFilesOlderThan(outDir, minutes, '.ts')
    .map((f) => path.join(outDir, f))
    .slice(0, 20)
  console.log('aged files', aged)
  detectMotionInVideos(aged, 0.1).then((hasMotionList) => {
    console.log('hasMotion', hasMotionList)
    hasMotionList.forEach((hasMotion, index) => {
      if (hasMotion) {
        fs.copyFile(aged[index], captures, (e) => {
          if (e) {
            console.log(e)
          }
          fs.unlink(aged[index], (e) => {
            console.log(e)
          })
        })
      } else {
        fs.unlink(aged[index], (e) => {
          console.log(e)
        })
      }
    })
  })
}
