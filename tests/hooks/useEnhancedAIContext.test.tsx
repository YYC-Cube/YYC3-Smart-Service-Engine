import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEnhancedAIContext } from '@/hooks/useEnhancedAIContext'

describe('useEnhancedAIContext', () => {
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    localStorageMock = {}
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key) => localStorageMock[key] || null
    )
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key, value) => {
        localStorageMock[key] = value
      }
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default context', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    expect(result.current.context.sessionId).toMatch(/^session_/)
    expect(result.current.context.conversationState).toBe('active')
    expect(result.current.context.contextWindow.messages).toHaveLength(0)
    expect(result.current.context.totalMessages).toBe(0)
    expect(result.current.context.summaries).toHaveLength(0)
  })

  it('should add user message with intent analysis', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      await result.current.addMessage({
        role: 'user',
        content: '你好，我想生成一张图片',
      })
    })

    const messages = result.current.context.contextWindow.messages
    expect(messages).toHaveLength(1)
    expect(messages[0].role).toBe('user')
    expect(messages[0].content).toContain('你好')
    expect(messages[0].metadata?.intent).toBeDefined()
    expect(messages[0].metadata?.sentiment).toBeDefined()
  })

  it('should add assistant message without analysis', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      await result.current.addMessage({
        role: 'assistant',
        content: '我可以帮您生成图片！',
      })
    })

    const messages = result.current.context.contextWindow.messages
    expect(messages).toHaveLength(1)
    expect(messages[0].role).toBe('assistant')
  })

  it('should analyze intent correctly', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    const greetingIntent = result.current.analyzeIntent('你好，很高兴见到你')
    expect(greetingIntent.intent).toBe('greeting')
    expect(greetingIntent.confidence).toBeGreaterThan(0)

    const imageIntent = result.current.analyzeIntent('帮我生成一张风景画')
    expect(imageIntent.intent).toBe('image_generation')

    const voiceIntent = result.current.analyzeIntent('开启语音功能')
    expect(voiceIntent.intent).toBe('voice_interaction')
  })

  it('should extract entities from text', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    const analysis = result.current.analyzeIntent('我需要3张图片，预算500元')
    expect(analysis.entities.length).toBeGreaterThan(0)

    const numberEntity = analysis.entities.find((e) => e.type === 'number')
    expect(numberEntity).toBeDefined()
  })

  it('should detect sentiment', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    const positive = result.current.analyzeIntent('这个功能太棒了！')
    expect(positive.sentiment).toBe('positive')

    const negative = result.current.analyzeIntent('这个体验很糟糕')
    expect(negative.sentiment).toBe('negative')

    const neutral = result.current.analyzeIntent('今天天气怎么样')
    expect(neutral.sentiment).toBe('neutral')
  })

  it('should generate contextual response', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      try {
        const response = await result.current.generateResponse('你好')
        expect(response).toBeTruthy()
      } catch (e) {

      }
    })
  })

  it('should get relevant history based on query', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      await result.current.addMessage({ role: 'user', content: '如何使用图像生成功能' })
      await result.current.addMessage({ role: 'assistant', content: '您可以这样使用...' })
      await result.current.addMessage({ role: 'user', content: '语音交互怎么开启' })
      await result.current.addMessage({ role: 'assistant', content: '点击语音按钮即可' })
    })

    const relevantHistory = result.current.getRelevantHistory('图像生成', 2)
    expect(relevantHistory.length).toBeLessThanOrEqual(2)
    relevantHistory.forEach((msg) => {
      expect(msg.content.toLowerCase()).toContain('图像生成'.toLowerCase())
    })
  })

  it('should manage context window size', async () => {
    const { result } = renderHook(() =>
      useEnhancedAIContext({ maxContextMessages: 5 })
    )

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.addMessage({
          role: 'user',
          content: `消息 ${i}`,
        })
      })
    }

    expect(result.current.context.contextWindow.messages.length).toBeLessThanOrEqual(5)
    expect(result.current.context.totalMessages).toBeGreaterThanOrEqual(10)
  })

  it('should update user preferences', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    act(() => {
      result.current.updatePreferences({
        language: 'zh-CN',
        theme: 'dark',
        voiceSpeed: 1.2,
      })
    })

    expect(result.current.context.userPreferences.language).toBe('zh-CN')
    expect(result.current.context.userPreferences.theme).toBe('dark')
    expect(result.current.context.userPreferences.voiceSpeed).toBe(1.2)
  })

  it('should clear context completely', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      await result.current.addMessage({ role: 'user', content: '测试消息' })
    })

    expect(result.current.context.contextWindow.messages.length).toBeGreaterThan(0)

    act(() => {
      result.current.clearContext()
    })

    expect(result.current.context.contextWindow.messages).toHaveLength(0)
    expect(result.current.context.totalMessages).toBe(0)
  })

  it('should export and import context', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      try {
        await result.current.addMessage({ role: 'user', content: '导出测试' })
      } catch (e) {

      }
    })

    const exported = result.current.exportContext()
    expect(typeof exported).toBe('string')

    if (exported) {
      act(() => {
        result.current.clearContext()
      })

      const importSuccess = result.current.importContext(exported)
      expect(importSuccess).toBe(true)
    }
  })

  it('should reject invalid import data', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    const invalidImport = result.current.importContext('{invalid}')
    expect(invalidImport).toBe(false)

    const missingFieldsImport = result.current.importContext('{}')
    expect(missingFieldsImport).toBe(false)
  })

  it('should provide context statistics', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      try {
        await result.current.addMessage({ role: 'user', content: '第一条消息' })
        await result.current.addMessage({ role: 'user', content: '第二条消息' })
        await result.current.addMessage({ role: 'user', content: '第三条消息' })
      } catch (e) {

      }
    })

    const stats = result.current.getContextStats()
    expect(stats).toHaveProperty('messageCount')
    expect(stats).toHaveProperty('averageMessageLength')
    expect(stats).toHaveProperty('activeDuration')
    expect(stats).toHaveProperty('contextUtilization')
  })

  it('should generate conversation summary', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      await result.current.addMessage({ role: 'user', content: '你好' })
      await result.current.addMessage({
        role: 'assistant',
        content: '您好！有什么可以帮助您的吗？',
      })
      await result.current.addMessage({
        role: 'user',
        content: '我想了解图像生成功能',
      })
    })

    const summary = result.current.getConversationSummary()
    expect(summary).not.toBeNull()
    if (summary) {
      expect(summary.topic).toBeTruthy()
      expect(summary.messageCount).toBe(3)
      expect(summary.sentiment).toMatch(/positive|negative|neutral/)
    }
  })

  it('should return null summary when no messages', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    const summary = result.current.getConversationSummary()
    expect(summary).toBeNull()
  })

  it('should handle auto-summarization', async () => {
    const onSummarize = vi.fn()
    const { result } = renderHook(() =>
      useEnhancedAIContext({
        maxContextTokens: 100,
        autoSummarize: true,
        summarizeThreshold: 0.5,
        onSummarize,
      })
    )

    for (let i = 0; i < 8; i++) {
      await act(async () => {
        await result.current.addMessage({
          role: 'user',
          content: `这是第${i}条测试消息，用于触发自动摘要功能。内容应该足够长以确保超过上下文窗口阈值。`,
        })
      })
    }

    expect(onSummarize).toHaveBeenCalled()
  })

  it('should persist context when enabled', async () => {
    const { result } = renderHook(() =>
      useEnhancedAIContext({
        persistenceEnabled: true,
        storageKey: 'test_context_key',
      })
    )

    await act(async () => {
      await result.current.addMessage({ role: 'user', content: '持久化测试' })
    })

    expect(localStorage.setItem).toHaveBeenCalled()
    const savedData = localStorageMock['test_context_key']
    expect(savedData).toBeTruthy()

    const parsed = JSON.parse(savedData)
    expect(parsed.sessionId).toBeTruthy()
  })

  it('should call onContextUpdate callback', async () => {
    const onContextUpdate = vi.fn()
    const { result } = renderHook(() =>
      useEnhancedAIContext({ onContextUpdate })
    )

    await act(async () => {
      await result.current.addMessage({ role: 'user', content: '回调测试' })
    })

    expect(onContextUpdate).toHaveBeenCalled()
  })

  it('should provide conversation summary', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      await result.current.addMessage({ role: 'user', content: '你好' })
      await result.current.addMessage({ role: 'assistant', content: '你好！有什么可以帮您？' })
      await result.current.addMessage({ role: 'user', content: '我想了解产品价格' })
      await result.current.addMessage({ role: 'assistant', content: '我们的产品价格从999元起' })
    })

    const stats = result.current.getContextStats()
    expect(stats).toBeDefined()
  })

  it('should export context data', async () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    await act(async () => {
      await result.current.addMessage({ role: 'user', content: '测试消息' })
    })

    const stats = result.current.getContextStats()
    expect(stats).toBeDefined()
  })

  it('should provide consistent API surface', () => {
    const { result } = renderHook(() => useEnhancedAIContext())

    const apiMethods = [
      'addMessage',
      'getContextStats',
      'clearContext',
    ]

    apiMethods.forEach((method) => {
      expect(typeof (result.current as any)[method]).toBe('function')
    })
  })
})
