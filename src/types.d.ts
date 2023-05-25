export type Item = {
  type: 'file' | 'directory'
  name: string
  path: string
  size: number
  description: string
  lastModified: string
}

export type Listing = {
  dir: string
  files: Item[]
}
