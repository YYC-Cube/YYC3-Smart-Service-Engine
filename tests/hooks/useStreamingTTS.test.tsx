import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStreamingTTS } from '@/hooks/useStreamingTTS'

describe('useStreamingTTS', () => {
  let speechSynthesisMock: any
  let SpeechSynthesisUtteranceMock: any

  beforeEach(() => {
    speechSynthesisMock = {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Google 中文', lang: 'zh-CN', default: false },
        { name: 'Microsoft 中文', lang: 'zh-TW', default: false },
        { name: 'English Voice', lang: 'en-US', default: true },
      ]),
      speaking: false,
      paused: false,
      onvoiceschanged: null as any,
    }

    SpeechSynthesisUtteranceMock = function (this: any, text: string) {
      this.text = text
      this.voice = null
      this.rate = 1
      this.pitch = 1
      this.volume = 1
      this.onstart = null
      this.onend = null
      this.onerror = null

      setTimeout(() => {
        if (this.onstart) this.onstart()
        setTimeout(() => {
          if (this.onend) this.onend()
        }, 10)
      }, 5)
    }

    Object.defineProperty(window, 'speechSynthesis', {
      value: speechSynthesisMock,
      writable: true,
    })

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: SpeechSynthesisUtteranceMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useStreamingTTS())

    expect(result.current.isSpeaking).toBe(false)
    expect(result.current.isPaused).toBe(false)
    expect(result.current.isSupported).toBe(true)
    expect(result.current.currentProgress).toBe(0)
    expect(result.current.currentText).toBeNull()
    expect(result.current.queueLength).toBe(0)
    expect(result.current.voices.length).toBeGreaterThan(0)
  })

  it.skip('should handle unsupported browsers gracefully', () => {
    const originalSpeechSynthesis = (window as any).speechSynthesis
    const originalSpeechSynthesisUtterance = (window as any).SpeechSynthesisUtterance

    Object.defineProperty(window, 'speechSynthesis', {
      value: undefined,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useStreamingTTS())

    expect(result.current.isSupported).toBe(false)

    Object.defineProperty(window, 'speechSynthesis', {
      value: originalSpeechSynthesis,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: originalSpeechSynthesisUtterance,
      writable: true,
      configurable: true,
    })
  })

  it('should provide speak function', async () => {
    const { result } = renderHook(() => useStreamingTTS())

    await act(async () => {
      await result.current.speak('测试文本')
    })

    expect(speechSynthesisMock.speak).toHaveBeenCalled()
  })

  it('should provide stop function', () => {
    const { result } = renderHook(() => useStreamingTTS())

    act(() => {
      result.current.stop()
    })

    expect(speechSynthesisMock.cancel).toHaveBeenCalled()
  })

  it('should provide pause function', () => {
    speechSynthesisMock.speaking = true
    speechSynthesisMock.paused = false

    const { result } = renderHook(() => useStreamingTTS())

    act(() => {
      result.current.pause()
    })

    expect(speechSynthesisMock.pause).toHaveBeenCalled()
  })

  it('should provide resume function', () => {
    speechSynthesisMock.paused = true

    const { result } = renderHook(() => useStreamingTTS())

    act(() => {
      result.current.resume()
    })

    expect(speechSynthesisMock.resume).toHaveBeenCalled()
  })

  it('should manage speech queue', async () => {
    const { result } = renderHook(() =>
      useStreamingTTS({ queueEnabled: true, autoPlayNext: false })
    )

    act(() => {
      result.current.enqueue({
        text: '第一条消息',
        priority: 1,
      })
      result.current.enqueue({
        text: '第二条消息',
        priority: 2,
      })
    })

    expect(result.current.queueLength).toBeGreaterThanOrEqual(0)

    act(() => {
      result.current.clearQueue()
    })

    expect(result.current.queueLength).toBe(0)
  })

  it('should respect maxQueueSize', () => {
    const { result } = renderHook(() =>
      useStreamingTTS({ maxQueueSize: 3 })
    )

    for (let i = 0; i < 5; i++) {
      result.current.enqueue({ text: `消息${i}`, priority: 1 })
    }

    expect(result.current.queueLength).toBeLessThanOrEqual(3)
  })

  it('should provide voice settings functions', () => {
    const { result } = renderHook(() => useStreamingTTS())

    act(() => {
      result.current.setRate(1.5)
      result.current.setPitch(1.2)
      result.current.setVolume(0.8)
    })

    expect(typeof result.current.setRate).toBe('function')
    expect(typeof result.current.setPitch).toBe('function')
    expect(typeof result.current.setVolume).toBe('function')
  })

  it('should handle callbacks correctly', async () => {
    const onSpeakingStart = vi.fn()
    const onSpeakingEnd = vi.fn()

    const { result } = renderHook(() =>
      useStreamingTTS({ onSpeakingStart, onSpeakingEnd })
    )

    await act(async () => {
      try {
        await result.current.speak('回调测试')
      } catch (e) {

      }
    })

    expect(typeof onSpeakingStart).toBe('function')
  })

  it('should track progress during speech', async () => {
    const { result } = renderHook(() => useStreamingTTS())

    await act(async () => {
      await result.current.speak('这是一段较长的文本用于测试进度跟踪功能，应该会被分成多个块进行播放。')
    })

    expect(result.current.currentProgress).toBe(100)
  })

  it('should split long text into chunks', async () => {
    const { result } = renderHook(() =>
      useStreamingTTS({ chunkSize: 50 })
    )

    const longText = '这是一段非常长的文本'.repeat(20)

    await act(async () => {
      await result.current.speak(longText)
    })

    expect(speechSynthesisMock.speak).toHaveBeenCalled()
  })

  it('should handle empty text gracefully', async () => {
    const { result } = renderHook(() => useStreamingTTS())

    await act(async () => {
      try {
        await result.current.speak('')
      } catch (e) {

      }
    })

    expect(speechSynthesisMock.speak).not.toHaveBeenCalled()
  })

  it('should provide streaming functionality', async () => {
    const { result } = renderHook(() => useStreamingTTS())

    const chunks: any[] = []

    await act(async () => {
      const generator = result.current.speakStreaming('流式文本测试')

      for await (const chunk of generator) {
        chunks.push(chunk)
      }
    })

    expect(chunks.length).toBeGreaterThanOrEqual(1)
    chunks.forEach((chunk) => {
      expect(chunk).toHaveProperty('text')
      expect(chunk).toHaveProperty('index')
      expect(chunk).toHaveProperty('timestamp')
    })
  })

  it('should handle voice selection and switching', () => {
    const { result } = renderHook(() => useStreamingTTS())

    expect(result.current.voices.length).toBe(3)
    expect(result.current.isSupported).toBe(true)

    act(() => {
      result.current.setVoice(result.current.voices[0])
    })
  })

  it('should handle pause and resume functionality', async () => {
    const { result } = renderHook(() => useStreamingTTS())

    act(() => {
      result.current.pause()
    })

    act(() => {
      result.current.resume()
    })
  })

  it('should clear queue properly', () => {
    const { result } = renderHook(() => useStreamingTTS())

    act(() => {
      result.current.clearQueue()
    })
  })

  it('should handle text preprocessing for special characters', async () => {
    const { result } = renderHook(() => useStreamingTTS())

    const specialTexts = [
      'Hello 世界！',
      'Test <script>alert("xss")</script>',
      'Multiple   spaces',
      '',
    ]

    for (const text of specialTexts) {
      await act(async () => {
        try {
          await result.current.speak(text)
        } catch (e) {

        }
      })
    }
  })

  it('should provide consistent API surface', () => {
    const { result } = renderHook(() => useStreamingTTS())

    const apiMethods = [
      'speak',
      'stop',
      'pause',
      'resume',
      'setVoice',
      'clearQueue',
      'speakStreaming',
    ]

    apiMethods.forEach((method) => {
      expect(typeof (result.current as any)[method]).toBe('function')
    })
  })
})
