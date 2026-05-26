"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

interface UseVoiceRecognitionReturn {
  isListening: boolean
  transcript: string
  confidence: number
  startListening: () => void
  stopListening: () => void
  isSupported: boolean
  error: string | null
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // 检查浏览器支持
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "zh-CN"
      recognitionRef.current.maxAlternatives = 3

      // 结果处理
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""
        let maxConfidence = 0

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          const confidence = result[0].confidence || 0.8

          if (result.isFinal) {
            finalTranscript += transcript
            maxConfidence = Math.max(maxConfidence, confidence)
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript.trim())
          setConfidence(maxConfidence)
          setError(null)
        } else if (interimTranscript) {
          setTranscript(interimTranscript.trim())
          setConfidence(0.5)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("语音识别错误:", event.error)

        const errorMessages: Record<string, string> = {
          "no-speech": "未检测到语音输入，请重试",
          "audio-capture": "无法访问麦克风，请检查权限",
          "not-allowed": "麦克风权限被拒绝",
          network: "网络错误，请检查连接",
          aborted: "语音识别已中止",
        }

        setError(errorMessages[event.error] || `语音识别错误: ${event.error}`)
        setIsListening(false)
      }

      // 结束处理
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      // 开始处理
      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError(null)
      }
    } else {
      setIsSupported(false)
      setError("浏览器不支持语音识别功能")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 开始监听
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError("语音识别不可用")
      return
    }

    try {
      setTranscript("")
      setConfidence(0)
      setError(null)
      recognitionRef.current.start()

      timeoutRef.current = setTimeout(() => {
        stopListening()
      }, 60000)
    } catch (error) {
      console.error("启动语音识别失败:", error)
      setError("启动语音识别失败")
    }
  }, [isSupported])

  // 停止监听
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsListening(false)
  }, [isListening])

  return {
    isListening,
    transcript,
    confidence,
    startListening,
    stopListening,
    isSupported,
    error,
  }
}
