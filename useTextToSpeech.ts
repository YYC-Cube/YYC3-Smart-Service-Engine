"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface SpeechSynthesisVoice {
  default: boolean
  lang: string
  localService: boolean
  name: string
  voiceURI: string
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 加载可用语音
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

      // 优先选择中文语音
      const chineseVoice = availableVoices.find((voice) => voice.lang.includes("zh") || voice.lang.includes("CN"))
      if (chineseVoice && !selectedVoice) {
        setSelectedVoice(chineseVoice)
      } else if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0])
      }
    }

    loadVoices()
    speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [selectedVoice])

  // 监听语音合成状态
  useEffect(() => {
    const checkSpeaking = () => {
      setIsSpeaking(speechSynthesis.speaking)
      setIsPaused(speechSynthesis.paused)
    }

    const interval = setInterval(checkSpeaking, 100)
    return () => clearInterval(interval)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!text.trim()) return

      // 停止当前播放
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // 设置语音参数
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      // 事件监听
      utterance.addEventListener("start", () => {
        setIsSpeaking(true)
        setIsPaused(false)
      })

      utterance.addEventListener("end", () => {
        setIsSpeaking(false)
        setIsPaused(false)
        utteranceRef.current = null
      })

      utterance.addEventListener("error", (event) => {
        console.error("语音合成错误:", event.error)
        setIsSpeaking(false)
        setIsPaused(false)
        utteranceRef.current = null
      })

      utterance.addEventListener("pause", () => {
        setIsPaused(true)
      })

      utterance.addEventListener("resume", () => {
        setIsPaused(false)
      })

      // 开始播放
      speechSynthesis.speak(utterance)
    },
    [selectedVoice, rate, pitch, volume],
  )

  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
    }
  }, [])

  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
    }
  }, [])

  const stop = useCallback(() => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    utteranceRef.current = null
  }, [])

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice)
  }, [])

  return {
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    rate,
    pitch,
    volume,
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  }
}
