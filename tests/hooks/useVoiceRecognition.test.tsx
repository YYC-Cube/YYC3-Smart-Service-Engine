import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'

describe('useVoiceRecognition Hook', () => {
  let mockRecognition: any

  beforeEach(() => {
    mockRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      continuous: true,
      interimResults: true,
      lang: 'zh-CN',
      maxAlternatives: 3,
      onresult: null as Function | null,
      onerror: null as Function | null,
      onend: null as Function | null,
      onstart: null as Function | null,
    }

    ;(window as any).SpeechRecognition = function () { return mockRecognition }
    ;(window as any).webkitSpeechRecognition = function () { return mockRecognition }
  })

  afterEach(() => {
    delete (window as any).SpeechRecognition
    delete (window as any).webkitSpeechRecognition
    vi.restoreAllMocks()
  })

  it('should initialize with default values when supported', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    expect(result.current.isSupported).toBe(true)
    expect(result.current.isListening).toBe(false)
    expect(result.current.transcript).toBe('')
    expect(result.current.confidence).toBe(0)
    expect(result.current.error).toBeNull()
  })

  it('should detect browser support correctly', () => {
    delete (window as any).SpeechRecognition
    delete (window as any).webkitSpeechRecognition

    const { result } = renderHook(() => useVoiceRecognition())

    expect(result.current.isSupported).toBe(false)
    expect(result.current.error).toContain('不支持')
  })

  it('should configure recognition with correct settings', () => {
    renderHook(() => useVoiceRecognition())

    expect(mockRecognition.continuous).toBe(true)
    expect(mockRecognition.interimResults).toBe(true)
    expect(mockRecognition.lang).toBe('zh-CN')
    expect(mockRecognition.maxAlternatives).toBe(3)
  })

  it('should start listening when startListening() is called', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      result.current.startListening()
    })

    expect(mockRecognition.start).toHaveBeenCalled()
  })

  it('should expose stopListening function', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    expect(typeof result.current.stopListening).toBe('function')

    act(() => {
      result.current.stopListening()
    })
  })

  it('should handle final recognition results', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onresult) {
        mockRecognition.onresult({
          resultIndex: 0,
          results: [
            {
              isFinal: true,
              0: {
                transcript: '你好世界',
                confidence: 0.95,
              },
            },
          ],
        })
      }
    })

    expect(result.current.transcript).toBe('你好世界')
    expect(result.current.confidence).toBe(0.95)
    expect(result.current.error).toBeNull()
  })

  it('should handle interim results', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onresult) {
        mockRecognition.onresult({
          resultIndex: 0,
          results: [
            {
              isFinal: false,
              0: {
                transcript: '你',
                confidence: 0.7,
              },
            },
          ],
        })
      }
    })

    expect(result.current.transcript).toBe('你')
    expect(result.current.confidence).toBe(0.5)
  })

  it('should handle no-speech error', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'no-speech' })
      }
    })

    expect(result.current.error).toContain('未检测到语音')
    expect(result.current.isListening).toBe(false)
  })

  it('should handle audio-capture error', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'audio-capture' })
      }
    })

    expect(result.current.error).toContain('无法访问麦克风')
  })

  it('should handle not-allowed error', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'not-allowed' })
      }
    })

    expect(result.current.error).toContain('权限被拒绝')
  })

  it('should handle network error', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'network' })
      }
    })

    expect(result.current.error).toContain('网络错误')
  })

  it('should handle unknown errors', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'unknown-error' })
      }
    })

    expect(result.current.error).toContain('unknown-error')
  })

  it('should update isListening to true on start event', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onstart) {
        mockRecognition.onstart()
      }
    })

    expect(result.current.isListening).toBe(true)
  })

  it('should update isListening to false on end event', () => {
    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      if (mockRecognition.onend) {
        mockRecognition.onend()
      }
    })

    expect(result.current.isListening).toBe(false)
  })

  it('should not start listening if not supported', () => {
    delete (window as any).SpeechRecognition
    delete (window as any).webkitSpeechRecognition

    const { result } = renderHook(() => useVoiceRecognition())

    act(() => {
      result.current.startListening()
    })

    expect(result.current.error).toContain('不可用')
  })

  it('should clean up recognition on unmount', () => {
    const { unmount } = renderHook(() => useVoiceRecognition())

    unmount()

    expect(mockRecognition.stop).toHaveBeenCalled()
  })
})
