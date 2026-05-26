import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDigitalHumanStateMachine } from '@/hooks/useDigitalHumanStateMachine'

describe('useDigitalHumanStateMachine', () => {
  let consoleSpy: any

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    expect(result.current.currentState).toBe('idle')
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.transitionHistory).toHaveLength(0)
  })

  it('should transition from idle to listening', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    await act(async () => {
      const success = await result.current.startListening()
      expect(success).toBe(true)
    })

    expect(result.current.currentState).toBe('listening')
    expect(result.current.transitionHistory).toHaveLength(1)
    expect(result.current.transitionHistory[0]).toEqual({
      from: 'idle',
      to: 'listening',
      timestamp: expect.any(Date),
      reason: 'User started input',
    })
  })

  it('should transition through full conversation cycle', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    await act(async () => {
      await result.current.startListening()
    })
    expect(result.current.currentState).toBe('listening')

    await act(async () => {
      await result.current.stopListening()
    })
    expect(result.current.currentState).toBe('thinking')

    await act(async () => {
      await result.current.startSpeaking()
    })
    expect(result.current.currentState).toBe('speaking')

    await act(async () => {
      await result.current.completeSpeaking()
    })
    expect(result.current.currentState).toBe('idle')
  })

  it('should prevent invalid state transitions', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    await act(async () => {
      const success = await result.current.transitionTo('speaking' as any)
      expect(success).toBe(false)
    })

    expect(result.current.currentState).toBe('idle')
    expect(result.current.error).not.toBeNull()
    expect(result.current.error?.message).toContain('Invalid state transition')
  })

  it('should call onStateChange callback on transition', async () => {
    const onStateChange = vi.fn()
    const { result } = renderHook(() =>
      useDigitalHumanStateMachine({ onStateChange })
    )

    await act(async () => {
      await result.current.startListening()
    })

    expect(onStateChange).toHaveBeenCalledWith('listening', 'idle')
  })

  it('should call onError callback on invalid transition', async () => {
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useDigitalHumanStateMachine({ onError })
    )

    await act(async () => {
      await result.current.transitionTo('speaking' as any)
    })

    expect(onError).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      'idle'
    )
  })

  it('should track transition history', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    await act(async () => {
      await result.current.startListening()
      await result.current.stopListening()
      await result.current.startSpeaking()
    })

    expect(result.current.transitionHistory).toHaveLength(3)
    expect(result.current.transitionHistory[0].from).toBe('idle')
    expect(result.current.transitionHistory[1].from).toBe('listening')
    expect(result.current.transitionHistory[2].from).toBe('thinking')
  })

  it('should limit transition history to last 50 entries', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    for (let i = 0; i < 60; i++) {
      await act(async () => {
        if (result.current.currentState === 'idle') {
          await result.current.startListening()
        } else {
          await result.current.resetToIdle()
        }
      })
    }

    expect(result.current.transitionHistory.length).toBeLessThanOrEqual(50)
  })

  it('should provide accurate state info', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    const initialInfo = result.current.getStateInfo()
    expect(initialInfo.state).toBe('idle')
    expect(initialInfo.isProcessing).toBe(false)
    expect(initialInfo.totalTransitions).toBe(0)

    await act(async () => {
      await result.current.startThinking()
    })

    const thinkingInfo = result.current.getStateInfo()
    expect(thinkingInfo.state).toBe('thinking')
    expect(thinkingInfo.isProcessing).toBe(true)
    expect(thinkingInfo.totalTransitions).toBe(1)
  })

  it('should clear error state', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    await act(async () => {
      await result.current.transitionTo('speaking' as any)
    })

    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should handle rapid state transitions', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    await act(async () => {
      await result.current.startListening()
      await result.current.stopListening()
      await result.current.startSpeaking()
      await result.current.completeSpeaking()
      await result.current.startListening()
    })

    expect(result.current.currentState).toBe('listening')
    expect(result.current.transitionHistory).toHaveLength(5)
  })

  it('should support autoReturnToIdle option', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useDigitalHumanStateMachine({
        autoReturnToIdle: true,
        thinkingTimeout: 1000,
        speakingTimeout: 1000,
      })
    )

    await act(async () => {
      await result.current.startThinking()
    })

    expect(result.current.currentState).toBe('thinking')

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(result.current.currentState).toBe('idle')

    vi.useRealTimers()
  })

  it('should disable autoReturnToIdle when configured', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useDigitalHumanStateMachine({
        autoReturnToIdle: false,
        thinkingTimeout: 100,
      })
    )

    await act(async () => {
      await result.current.startThinking()
    })

    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.currentState).toBe('thinking')

    vi.useRealTimers()
  })

  it('should validate canTransitionTo method', () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    expect(result.current.canTransitionTo('listening')).toBe(true)
    expect(result.current.canTransitionTo('thinking')).toBe(true)
    expect(result.current.canTransitionTo('speaking')).toBe(false)

    act(() => {
      result.current.startListening()
    })

    expect(result.current.canTransitionTo('thinking')).toBe(true)
    expect(result.current.canTransitionTo('idle')).toBe(true)
  })

  it('should measure state duration correctly', async () => {
    const { result } = renderHook(() => useDigitalHumanStateMachine())

    const initialDuration = result.current.getStateDuration()
    expect(initialDuration).toBeGreaterThanOrEqual(0)

    await act(async () => {
      await result.current.startListening()
    })

    const listeningDuration = result.current.getStateDuration()
    expect(listeningDuration).toBeGreaterThanOrEqual(0)
  })

  it('should handle all valid transitions from each state', async () => {
    const fromIdle = renderHook(() => useDigitalHumanStateMachine())
    await act(async () => {
      await fromIdle.result.current.startListening()
    })
    expect(fromIdle.result.current.currentState).toBe('listening')
    await act(async () => {
      const invalidSuccess = await fromIdle.result.current.transitionTo('speaking' as any)
      expect(invalidSuccess).toBe(false)
    })
    fromIdle.unmount()

    const fromListening = renderHook(() => useDigitalHumanStateMachine())
    await act(async () => {
      await fromListening.result.current.startListening()
    })
    expect(fromListening.result.current.currentState).toBe('listening')
    await act(async () => {
      const success1 = await fromListening.result.current.stopListening()
      expect(success1).toBe(true)
    })
    expect(fromListening.result.current.currentState).toBe('thinking')
    await act(async () => {
      const success2 = await fromListening.result.current.resetToIdle()
      expect(success2).toBe(true)
    })
    fromListening.unmount()

    const fromThinking = renderHook(() => useDigitalHumanStateMachine())
    await act(async () => {
      await fromThinking.result.current.startListening()
      await fromThinking.result.current.stopListening()
    })
    expect(fromThinking.result.current.currentState).toBe('thinking')
    await act(async () => {
      const success1 = await fromThinking.result.current.transitionTo('speaking')
      expect(success1).toBe(true)
    })
    expect(fromThinking.result.current.currentState).toBe('speaking')
    await act(async () => {
      const success2 = await fromThinking.result.current.transitionTo('listening')
      expect(success2).toBe(true)
    })
    await act(async () => {
      const success3 = await fromThinking.result.current.resetToIdle()
      expect(success3).toBe(true)
    })
    fromThinking.unmount()

    const fromSpeaking = renderHook(() => useDigitalHumanStateMachine())
    await act(async () => {
      await fromSpeaking.result.current.startListening()
      await fromSpeaking.result.current.stopListening()
      await fromSpeaking.result.current.startSpeaking()
    })
    expect(fromSpeaking.result.current.currentState).toBe('speaking')
    await act(async () => {
      const success1 = await fromSpeaking.result.current.transitionTo('idle')
      expect(success1).toBe(true)
    })
    await act(async () => {
      const success2 = await fromSpeaking.result.current.transitionTo('listening')
      expect(success2).toBe(true)
    })
    await act(async () => {
      const success3 = await fromSpeaking.result.current.transitionTo('thinking' as any)
      expect(success3).toBe(true)
    })
    fromSpeaking.unmount()
  })
})
