import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

describe('useIsMobile Hook', () => {
  it('should initialize with isMobile as false by default (desktop)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('should return true when viewport is mobile size', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 500,
    })

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('should handle matchMedia change event', async () => {
    let changeCallback: ((e: MediaQueryListEvent) => void) | null = null

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          changeCallback = callback
        }
      }),
      removeEventListener: vi.fn((event: string) => {
        if (event === 'change') {
          changeCallback = null
        }
      }),
      dispatchEvent: vi.fn(),
    }))

    const { result, unmount } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)


    await act(async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })
      if (changeCallback) {
        changeCallback({ matches: true } as MediaQueryListEvent)
      }
    })


    expect(result.current).toBe(true)

    unmount()
  })
})
