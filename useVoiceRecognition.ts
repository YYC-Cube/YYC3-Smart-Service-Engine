"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { SpeechGrammarList } from "web-speech-api"

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  serviceURI: string
  grammars: SpeechGrammarList
  start(): void
  stop(): void
  abort(): void
  addEventListener(type: "result", listener: (event: SpeechRecognitionEvent) => void): void
  addEventListener(type: "error", listener: (event: SpeechRecognitionErrorEvent) => void): void
  addEventListener(
    type:
      | "start"
      | "end"
      | "speechstart"
      | "speechend"
      | "soundstart"
      | "soundend"
      | "audiostart"
      | "audioend"
      | "nomatch",
    listener: (event: Event) => void,
  ): void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // 检查浏览器支持
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      const recognition = recognitionRef.current

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "zh-CN"
      recognition.maxAlternatives = 1

      recognition.addEventListener("start", () => {
        setIsListening(true)
        setError(null)
      })

      recognition.addEventListener("end", () => {
        setIsListening(false)
      })

      recognition.addEventListener("result", (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            setConfidence(result[0].confidence)
          } else {
            interimTranscript += result[0].transcript
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript.trim())
        } else if (interimTranscript) {
          setTranscript(interimTranscript.trim())
        }

        // 重置超时
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
          }
        }, 3000) // 3秒无声音自动停止
      })

      recognition.addEventListener("error", (event: SpeechRecognitionErrorEvent) => {
        setError(event.error)
        setIsListening(false)
        console.error("语音识别错误:", event.error, event.message)
      })

      recognition.addEventListener("speechstart", () => {
        setError(null)
      })

      recognition.addEventListener("speechend", () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      })
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      setConfidence(0)
      setError(null)
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("启动语音识别失败:", error)
        setError("启动语音识别失败")
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setConfidence(0)
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
