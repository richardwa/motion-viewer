import fetch from 'cross-fetch'
import fs from 'fs'

// parses an apache directory index
export const getListing = (camera: string): Promise<string[]> =>
  fetch(`/captures/${camera}`).then((r) => r.json())

export function createFoldersIfNotExist(folderPath: string): void {
  console.log('checking', folderPath)
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`Created folder: ${folderPath}`)
  }
}
