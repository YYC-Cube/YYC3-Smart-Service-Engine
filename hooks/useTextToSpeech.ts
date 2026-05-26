"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseTextToSpeechReturn {
  speak: (text: string, options?: SpeechSynthesisUtterance) => void
  stop: () => void
  pause: () => void
  resume: () => void
  isSpeaking: boolean
  isPaused: boolean
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
  setVoice: (voice: SpeechSynthesisVoice) => void
  setRate: (rate: number) => void
  setPitch: (pitch: number) => void
  setVolume: (volume: number) => void
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null | undefined>(null)
  const [rate, setRateState] = useState(1)
  const [pitch, setPitchState] = useState(1)
  const [volume, setVolumeState] = useState(1)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 检查浏览器支持并加载语音
  useEffect(() => {
    if ("speechSynthesis" in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)

        const chineseVoices = availableVoices.filter((voice) => voice.lang.includes("zh") || voice.lang.includes("CN"))

        // 优先选择质量更好的中文语音
        const preferredVoice =
          chineseVoices.find((v) => v.name.includes("Google")) ||
          chineseVoices.find((v) => v.name.includes("Microsoft")) ||
          chineseVoices[0]

        if (preferredVoice) {
          setSelectedVoice(preferredVoice ?? null)
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0])
        }
      }

      // 语音加载完成后设置
      speechSynthesis.onvoiceschanged = loadVoices
      loadVoices()

      const checkSpeaking = () => {
        setIsSpeaking(speechSynthesis.speaking)
        setIsPaused(speechSynthesis.paused)
      }

      const interval = setInterval(checkSpeaking, 100)
      return () => clearInterval(interval)
    } else {
      setIsSupported(false)
    }
  }, [])

  // 语音合成
  const speak = useCallback(
    (text: string, options?: Partial<SpeechSynthesisUtterance>) => {
      if (!isSupported || !text.trim()) return

      // 停止当前播放
      speechSynthesis.cancel()

      const maxLength = 200
      const chunks = text.match(new RegExp(`.{1,${maxLength}}`, "g")) || [text]

      chunks.forEach((chunk, index) => {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(chunk)

          // 设置语音参数
          if (selectedVoice) {
            utterance.voice = selectedVoice
          }
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume

          // 应用自定义选项
          if (options) {
            Object.assign(utterance, options)
          }

          // 事件处理
          utterance.onstart = () => {
            setIsSpeaking(true)
            setIsPaused(false)
          }

          utterance.onend = () => {
            if (index === chunks.length - 1) {
              setIsSpeaking(false)
              setIsPaused(false)
            }
          }

          utterance.onerror = (event) => {
            console.error("语音合成错误:", event.error)
            setIsSpeaking(false)
            setIsPaused(false)
          }

          utterance.onpause = () => {
            setIsPaused(true)
          }

          utterance.onresume = () => {
            setIsPaused(false)
          }

          utteranceRef.current = utterance
          speechSynthesis.speak(utterance)
        }, index * 100)
      })
    },
    [isSupported, selectedVoice, rate, pitch, volume],
  )

  // 停止语音
  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [isSupported])

  // 暂停语音
  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isSupported, isSpeaking])

  // 恢复语音
  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [isSupported, isPaused])

  // 设置语音
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice)
  }, [])

  // 设置语速
  const setRate = useCallback((newRate: number) => {
    setRateState(Math.max(0.1, Math.min(10, newRate)))
  }, [])

  // 设置音调
  const setPitch = useCallback((newPitch: number) => {
    setPitchState(Math.max(0, Math.min(2, newPitch)))
  }, [])

  // 设置音量
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }, [])

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  }
}
