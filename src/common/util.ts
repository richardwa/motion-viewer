import type { Item, Listing } from '@/types'
import fetch from 'cross-fetch'
import fs from 'fs'
import path from 'path'

const bytes = (str: string) => {
  if (str) {
    const match = '([0-9.]*?)([A-Za-z])'
    const m = [...str.matchAll(new RegExp(match, 'g'))][0]
    if (!m) return null
    const num = Number(m[1])
    const suf = m[2]
    switch (suf) {
      case 'K':
        return Math.floor(num * 1024)
      case 'M':
        return Math.floor(num * 1024 * 1024)
      case 'G':
        return Math.floor(num * 1024 * 1024 * 1024)
    }
  }
}

const parse = (src: string) => {
  const dirMath = '<h1>Index of (.*?)</h1>'
  const dir = [...src.matchAll(new RegExp(dirMath, 'g'))][0][1]

  const files: Item[] = []
  const regexp = [
    '<tr>',
    '<td.*?>(.*?)</td>', // 1
    '<td.*?><a href="(.*?)">(.*?)</a></td>', // 2, 3
    '<td.*?>(.*?)</td>', // 4
    '<td.*?>(.*?)</td>',
    '<td.*?>(.*?)</td>',
    '</tr>'
  ].join('')
  const array = Array.from(src.matchAll(new RegExp(regexp, 'g')))
  for (let i = 1; i < array.length; i++) {
    const row = array[i]
    const path = row[2]
    const item: Item = {
      type: path.endsWith('/') ? 'directory' : 'file',
      path: [dir, path].join('/'),
      name: row[3],
      lastModified: row[4].trim(),
      size: bytes(row[5]) as any,
      description: row[6]
    }
    files.push(item)
  }

  return { dir, files }
}

// parses an apache directory index
export const getListing = (url: string): Promise<Listing> =>
  fetch(url)
    .then((r) => r.text())
    .then(parse)

export async function createFoldersIfNotExist(folderPath: string): Promise<void> {
  console.log('checking', folderPath)
  const folders = folderPath.split(path.sep)
  let currentPath = ''

  for (const folder of folders) {
    currentPath = path.join(currentPath, folder)

    if (!fs.existsSync(currentPath)) {
      await fs.promises.mkdir(currentPath)
    }
  }
}
