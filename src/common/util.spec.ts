import { describe, it, expect } from 'vitest'
import { hello } from './util'

describe('test', () => {
  it('should exec', () => {
    expect(hello()).toBe('hello')
  })
})
