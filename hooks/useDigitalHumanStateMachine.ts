import { useState, useCallback, useRef, useEffect } from 'react'

export type DigitalHumanState = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface StateTransition {
  from: DigitalHumanState
  to: DigitalHumanState
  timestamp: Date
  reason?: string
}

export interface StateMachineConfig {
  onStateChange?: (state: DigitalHumanState, prevState: DigitalHumanState) => void
  onError?: (error: Error, state: DigitalHumanState) => void
  thinkingTimeout?: number
  speakingTimeout?: number
  autoReturnToIdle?: boolean
  debug?: boolean
}

const VALID_TRANSITIONS: Record<DigitalHumanState, DigitalHumanState[]> = {
  idle: ['listening', 'thinking'],
  listening: ['thinking', 'idle'],
  thinking: ['speaking', 'listening', 'idle'],
  speaking: ['idle', 'listening', 'thinking'],
}

export function useDigitalHumanStateMachine(config: StateMachineConfig = {}) {
  const {
    onStateChange,
    onError,
    thinkingTimeout = 10000,
    speakingTimeout = 30000,
    autoReturnToIdle = true,
    debug = false,
  } = config

  const [currentState, setCurrentState] = useState<DigitalHumanState>('idle')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transitionHistory, setTransitionHistory] = useState<StateTransition[]>([])
  const [error, setError] = useState<Error | null>(null)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const stateStartTimeRef = useRef<Date>(new Date())
  const isMountedRef = useRef(true)
  const currentStateRef = useRef<DigitalHumanState>('idle')

  const log = useCallback(
    (message: string, data?: any) => {
      if (debug) {
        console.log(`[DigitalHumanStateMachine] ${message}`, data || '')
      }
    },
    [debug]
  )

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const canTransitionTo = useCallback(
    (targetState: DigitalHumanState): boolean => {
      const allowedTransitions = VALID_TRANSITIONS[currentStateRef.current]
      return allowedTransitions.includes(targetState)
    },
    []
  )

  const transitionTo = useCallback(
    async (newState: DigitalHumanState, reason?: string): Promise<boolean> => {
      if (!isMountedRef.current) return false

      if (!canTransitionTo(newState)) {
        const errorMsg = `Invalid state transition from ${currentStateRef.current} to ${newState}`
        const error = new Error(errorMsg)
        setError(error)
        onError?.(error, currentStateRef.current)
        log('Transition failed:', { from: currentStateRef.current, to: newState, reason: errorMsg })
        return false
      }

      const prevState = currentStateRef.current
      const now = new Date()
      const transition: StateTransition = {
        from: prevState,
        to: newState,
        timestamp: now,
        reason,
      }

      log('State transition:', transition)

      try {
        clearTimeoutRef()

        setCurrentState(newState)
        currentStateRef.current = newState
        setTransitionHistory((prev) => {
          const newHistory = [...prev, transition]
          return newHistory.length > 50 ? newHistory.slice(-50) : newHistory
        })
        setError(null)
        stateStartTimeRef.current = now

        onStateChange?.(newState, prevState)

        if (newState === 'thinking') {
          setIsProcessing(true)
          if (autoReturnToIdle) {
            timeoutRef.current = setTimeout(() => {
              if (isMountedRef.current && currentStateRef.current === 'thinking') {
                transitionTo('idle', 'Thinking timeout')
              }
            }, thinkingTimeout)
          }
        } else if (newState === 'speaking') {
          setIsProcessing(false)
          if (autoReturnToIdle) {
            timeoutRef.current = setTimeout(() => {
              if (isMountedRef.current && currentStateRef.current === 'speaking') {
                transitionTo('idle', 'Speaking completed')
              }
            }, speakingTimeout)
          }
        } else if (newState === 'idle') {
          setIsProcessing(false)
        } else if (newState === 'listening') {
          setIsProcessing(false)
        }

        return true
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error, prevState)
        log('Transition error:', error)
        return false
      }
    },
    [
      canTransitionTo,
      onStateChange,
      onError,
      thinkingTimeout,
      speakingTimeout,
      autoReturnToIdle,
      log,
      clearTimeoutRef,
    ]
  )

  const startListening = useCallback(async (): Promise<boolean> => {
    log('Start listening')
    return transitionTo('listening', 'User started input')
  }, [transitionTo, log])

  const stopListening = useCallback(async (): Promise<boolean> => {
    log('Stop listening')
    return transitionTo('thinking', 'User finished input')
  }, [transitionTo, log])

  const startThinking = useCallback(async (): Promise<boolean> => {
    log('Start thinking')
    return transitionTo('thinking', 'Processing user input')
  }, [transitionTo, log])

  const startSpeaking = useCallback(async (): Promise<boolean> => {
    log('Start speaking')
    return transitionTo('speaking', 'Generating response')
  }, [transitionTo, log])

  const completeSpeaking = useCallback(async (): Promise<boolean> => {
    log('Complete speaking')
    return transitionTo('idle', 'Response completed')
  }, [transitionTo, log])

  const resetToIdle = useCallback(async (): Promise<boolean> => {
    log('Reset to idle')
    return transitionTo('idle', 'Manual reset')
  }, [transitionTo, log])

  const getStateDuration = useCallback((): number => {
    const now = new Date()
    return now.getTime() - stateStartTimeRef.current.getTime()
  }, [])

  const getStateInfo = useCallback(() => {
    return {
      state: currentState,
      duration: getStateDuration(),
      isProcessing,
      error: error?.message || null,
      lastTransition: transitionHistory[transitionHistory.length - 1] || null,
      totalTransitions: transitionHistory.length,
    }
  }, [currentState, getStateDuration, isProcessing, error, transitionHistory])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      clearTimeoutRef()
    }
  }, [clearTimeoutRef])

  return {
    currentState,
    isProcessing,
    error,
    transitionHistory,

    transitionTo,
    startListening,
    stopListening,
    startThinking,
    startSpeaking,
    completeSpeaking,
    resetToIdle,

    canTransitionTo,
    getStateDuration,
    getStateInfo,
    clearError: () => setError(null),
  }
}
