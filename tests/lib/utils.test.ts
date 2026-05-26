import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'active', false && 'hidden')).toBe(
      'base-class active'
    )
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('', null, undefined)).toBe('')
  })

  it('should merge Tailwind classes without conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should handle object syntax', () => {
    expect(cn({ 'text-red': true, 'text-blue': false })).toBe('text-red')
  })

  it('should handle array inputs', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
  })
})
