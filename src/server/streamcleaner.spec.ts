import path from 'path'
import { describe, it, expect } from 'vitest'
import { cleanup } from './streamcleaner'

describe('test', () => {
  it('should exec', () => {
    const feeds = path.join(process.cwd(), 'feeds', 'doorbell')
    const captures = path.join(process.cwd(), 'captures', 'doorbell')

    cleanup(feeds, captures, 1000 * 60)
    
  })
})
