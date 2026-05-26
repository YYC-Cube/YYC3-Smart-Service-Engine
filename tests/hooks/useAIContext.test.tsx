import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAIContext } from '@/hooks/useAIContext'

describe('useAIContext Hook', () => {
  it('should initialize with default context', () => {
    const { result } = renderHook(() => useAIContext())

    expect(result.current.context).toBeDefined()
    expect(result.current.context.messages).toEqual([])
    expect(result.current.context.sessionId).toMatch(/^session_/)
    expect(result.current.context.conversationState).toBe('active')
  })

  it('should add message correctly', () => {
    const { result } = renderHook(() => useAIContext())

    act(() => {
      result.current.addMessage({
        type: 'user',
        content: 'Hello AI'
      })
    })

    expect(result.current.context.messages).toHaveLength(1)
    expect(result.current.context.messages[0].type).toBe('user')
    expect(result.current.context.messages[0].content).toBe('Hello AI')
    expect(result.current.context.messages[0].timestamp).toBeInstanceOf(Date)
  })

  it('should update context', () => {
    const { result } = renderHook(() => useAIContext())

    act(() => {
      result.current.updateContext({
        currentTopic: 'image-generation',
        conversationState: 'idle'
      })
    })

    expect(result.current.context.currentTopic).toBe('image-generation')
    expect(result.current.context.conversationState).toBe('idle')
  })

  it('should clear context', () => {
    const { result } = renderHook(() => useAIContext())

    act(() => {
      result.current.addMessage({ type: 'user', content: 'Test' })
      result.current.updateContext({ currentTopic: 'test' })
      result.current.clearContext()
    })

    expect(result.current.context.messages).toEqual([])
    expect(result.current.context.currentTopic).toBeUndefined()
  })

  it('should analyze intent correctly', async () => {
    const { result } = renderHook(() => useAIContext())

    let analysisResult
    await waitFor(async () => {
      analysisResult = await result.current.analyzeIntent('生成一张图片')
    })

    expect(analysisResult!.intent).toBe('image_generation')
    expect(analysisResult!.confidence).toBeGreaterThan(0)
    expect(analysisResult!.entities).toBeDefined()
    expect(['positive', 'negative', 'neutral']).toContain(analysisResult!.sentiment)
  })

  it('should analyze greeting intent', async () => {
    const { result } = renderHook(() => useAIContext())

    const result_data = await result.current.analyzeIntent('你好')

    expect(result_data.intent).toBe('greeting')
    expect(result_data.sentiment).toBe('positive')
  })

  it('should get relevant history', () => {
    const { result } = renderHook(() => useAIContext())

    act(() => {
      result.current.addMessage({
        type: 'user',
        content: 'I want to generate an image of a cat'
      })
      result.current.addMessage({
        type: 'ai',
        content: 'Sure, I can help you generate that image'
      })
    })

    const history = result.current.getRelevantHistory('image')
    expect(history.length).toBeGreaterThanOrEqual(1)
  })

  it('should generate contextual response', async () => {
    const { result } = renderHook(() => useAIContext())

    let response
    await waitFor(async () => {
      response = await result.current.generateContextualResponse('生成图片', 'image_generation')
    })

    expect(response!).toBeDefined()
    expect(response!.length).toBeGreaterThan(0)
    expect(response!).toContain('文生图')
  }, 10000)

  it('should handle multiple messages in order', () => {
    const { result } = renderHook(() => useAIContext())

    act(() => {
      result.current.addMessage({ type: 'user', content: 'First' })
      result.current.addMessage({ type: 'ai', content: 'Response to first' })
      result.current.addMessage({ type: 'user', content: 'Second' })
    })

    expect(result.current.context.messages).toHaveLength(3)
    expect(result.current.context.messages[0].content).toBe('First')
    expect(result.current.context.messages[2].content).toBe('Second')
  })
})
