import { useState, useCallback, useRef, useEffect } from "react"

export interface StreamingChunk {
  text: string
  index: number
  timestamp: Date
}

export interface SpeechQueueItem {
  id: string
  text: string
  priority: number
  options?: Partial<SpeechSynthesisUtterance>
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

export interface UseStreamingTTSConfig {
  chunkSize?: number
  queueEnabled?: boolean
  autoPlayNext?: boolean
  onSpeakingStart?: (text: string) => void
  onSpeakingEnd?: (text: string) => void
  onError?: (error: Error) => void
  maxQueueSize?: number
}

interface UseStreamingTTSReturn {
  speak: (text: string, options?: Partial<SpeechSynthesisUtterance>) => Promise<void>
  speakStreaming: (text: string, options?: Partial<SpeechSynthesisUtterance>) => AsyncGenerator<StreamingChunk>
  stop: () => void
  pause: () => void
  resume: () => void
  enqueue: (item: Omit<SpeechQueueItem, 'id'>) => string
  clearQueue: () => void
  isSpeaking: boolean
  isPaused: boolean
  isSupported: boolean
  currentProgress: number
  currentText: string | null
  queueLength: number
  voices: SpeechSynthesisVoice[]
  setVoice: (voice: SpeechSynthesisVoice) => void
  setRate: (rate: number) => void
  setPitch: (pitch: number) => void
  setVolume: (volume: number) => void
}

export function useStreamingTTS(config: UseStreamingTTSConfig = {}): UseStreamingTTSReturn {
  const {
    chunkSize = 100,
    queueEnabled = true,
    autoPlayNext = true,
    onSpeakingStart,
    onSpeakingEnd,
    onError,
    maxQueueSize = 20,
  } = config

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentText, setCurrentText] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [queue, setQueue] = useState<SpeechQueueItem[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRateState] = useState(1)
  const [pitch, setPitchState] = useState(1)
  const [volume, setVolumeState] = useState(1)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const currentItemIdRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isProcessingRef = useRef(false)

  useEffect(() => {
    if ("speechSynthesis" in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)

        const chineseVoices = availableVoices.filter(
          (voice) => voice.lang.includes("zh") || voice.lang.includes("CN")
        )

        const preferredVoice =
          chineseVoices.find((v) => v.name.includes("Google")) ||
          chineseVoices.find((v) => v.name.includes("Microsoft")) ||
          chineseVoices[0]

        if (preferredVoice) {
          setSelectedVoice(preferredVoice)
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0])
        }
      }

      if (speechSynthesis) {
        speechSynthesis.onvoiceschanged = loadVoices
        loadVoices()
      }

      return () => {
        if (speechSynthesis) {
          speechSynthesis.cancel()
        }
      }
    } else {
      setIsSupported(false)
    }
  }, [])

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || queue.length === 0) return

    const nextItem = queue[0]
    if (!nextItem) return

    isProcessingRef.current = true
    currentItemIdRef.current = nextItem.id

    try {
      await speakInternal(nextItem.text, nextItem.options, nextItem.onProgress)

      nextItem.onComplete?.()

      setQueue((prev) => prev.filter((item) => item.id !== nextItem.id))
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      nextItem.onError?.(err)
      onError?.(err)

      setQueue((prev) => prev.filter((item) => item.id !== nextItem.id))
    } finally {
      isProcessingRef.current = false
      currentItemIdRef.current = null

      if (autoPlayNext && queue.length > 1) {
        setTimeout(processQueue, 100)
      }
    }
  }, [queue, autoPlayNext, onError])

  useEffect(() => {
    if (queueEnabled && queue.length > 0 && !isProcessingRef.current) {
      processQueue()
    }
  }, [queue, queueEnabled, processQueue])

  const speakInternal = useCallback(
    async (
      text: string,
      options?: Partial<SpeechSynthesisUtterance>,
      onProgress?: (progress: number) => void
    ): Promise<void> => {
      if (!isSupported || !text.trim()) {
        throw new Error("Speech synthesis not supported or empty text")
      }

      speechSynthesis.cancel()
      setCurrentText(text)
      setCurrentProgress(0)
      setIsSpeaking(true)
      setIsPaused(false)
      onSpeakingStart?.(text)

      const chunks = splitIntoChunks(text, chunkSize)
      const totalChunks = chunks.length

      for (let i = 0; i < totalChunks; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          break
        }

        while (isPaused && !abortControllerRef.current?.signal.aborted) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        if (abortControllerRef.current?.signal.aborted) {
          break
        }

        await new Promise<void>((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(chunks[i])

          if (selectedVoice) {
            utterance.voice = selectedVoice
          }
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume

          if (options) {
            Object.assign(utterance, options)
          }

          const progress = ((i + 1) / totalChunks) * 100
          setCurrentProgress(progress)
          onProgress?.(progress)

          utterance.onstart = () => {}
          utterance.onend = () => resolve()
          utterance.onerror = (event: SpeechSynthesisErrorEvent) =>
            reject(new Error(event.error))

          utteranceRef.current = utterance
          speechSynthesis.speak(utterance)
        })
      }

      setIsSpeaking(false)
      setCurrentProgress(100)
      setCurrentText(null)
      onSpeakingEnd?.(text)
    },
    [isSupported, selectedVoice, rate, pitch, volume, chunkSize, onSpeakingStart, onSpeakingEnd]
  )

  const speak = useCallback(
    async (text: string, options?: Partial<SpeechSynthesisUtterance>): Promise<void> => {
      if (!queueEnabled) {
        await speakInternal(text, options)
      } else {
        enqueue({ text, priority: 1, options })
      }
    },
    [speakInternal, queueEnabled]
  )

  const speakStreaming = useCallback(
    async function* (
      text: string,
      options?: Partial<SpeechSynthesisUtterance>
    ): AsyncGenerator<StreamingChunk> {
      if (!isSupported || !text.trim()) return

      speechSynthesis.cancel()
      setIsSpeaking(true)
      setCurrentText(text)
      onSpeakingStart?.(text)

      const chunks = splitIntoChunks(text, chunkSize)

      for (let i = 0; i < chunks.length; i++) {
        yield {
          text: chunks[i],
          index: i,
          timestamp: new Date(),
        }

        await new Promise<void>((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(chunks[i])

          if (selectedVoice) {
            utterance.voice = selectedVoice
          }
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume

          if (options) {
            Object.assign(utterance, options)
          }

          const progress = ((i + 1) / chunks.length) * 100
          setCurrentProgress(progress)

          utterance.onend = (_event: SpeechSynthesisEvent) => resolve()
          utterance.onerror = (event: SpeechSynthesisErrorEvent) =>
            reject(new Error(event.error))

          speechSynthesis.speak(utterance)
        })
      }

      setIsSpeaking(false)
      setCurrentProgress(100)
      setCurrentText(null)
      onSpeakingEnd?.(text)
    },
    [isSupported, selectedVoice, rate, pitch, volume, chunkSize, onSpeakingStart, onSpeakingEnd]
  )

  const stop = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    setCurrentProgress(0)
    setCurrentText(null)
    isProcessingRef.current = false
  }, [])

  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [])

  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [])

  const enqueue = useCallback(
    (item: Omit<SpeechQueueItem, 'id'>): string => {
      const id = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const queueItem: SpeechQueueItem = { ...item, id }

      setQueue((prev) => {
        const newQueue = [...prev, queueItem]

        if (newQueue.length > maxQueueSize) {
          console.warn(`TTS queue exceeded maximum size (${maxQueueSize}), dropping oldest items`)
          return newQueue.slice(-maxQueueSize)
        }

        newQueue.sort((a, b) => b.priority - a.priority)
        return newQueue
      })

      return id
    },
    [maxQueueSize]
  )

  const clearQueue = useCallback(() => {
    setQueue([])
    isProcessingRef.current = false
  }, [])

  const setRate = useCallback((newRate: number) => {
    setRateState(Math.max(0.5, Math.min(2, newRate)))
  }, [])

  const setPitch = useCallback((newPitch: number) => {
    setPitchState(Math.max(0.5, Math.min(2, newPitch)))
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }, [])

  return {
    speak,
    speakStreaming,
    stop,
    pause,
    resume,
    enqueue,
    clearQueue,
    isSpeaking,
    isPaused,
    isSupported,
    currentProgress,
    currentText,
    queueLength: queue.length,
    voices,
    setVoice: setSelectedVoice,
    setRate,
    setPitch,
    setVolume,
  }
}

function splitIntoChunks(text: string, maxSize: number): string[] {
  if (text.length <= maxSize) return [text]

  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= maxSize) {
      chunks.push(remaining)
      break
    }

    let splitIndex = maxSize

    const lastSpace = remaining.lastIndexOf(' ', maxSize)
    const lastPunctuation = Math.max(
      remaining.lastIndexOf('。', maxSize),
      remaining.lastIndexOf('，', maxSize),
      remaining.lastIndexOf('、', maxSize),
      remaining.lastIndexOf('！', maxSize),
      remaining.lastIndexOf('？', maxSize),
      remaining.lastIndexOf('.', maxSize),
      remaining.lastIndexOf(',', maxSize),
      remaining.lastIndexOf('!', maxSize),
      remaining.lastIndexOf('?', maxSize)
    )

    if (lastPunctuation > maxSize * 0.7) {
      splitIndex = lastPunctuation + 1
    } else if (lastSpace > maxSize * 0.8) {
      splitIndex = lastSpace + 1
    }

    chunks.push(remaining.substring(0, splitIndex))
    remaining = remaining.substring(splitIndex).trimStart()
  }

  return chunks
}
