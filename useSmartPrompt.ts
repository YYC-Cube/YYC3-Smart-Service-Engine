"use client"

import { useState, useCallback, useEffect } from "react"
import {
  type PromptTemplate,
  type ImagePromptTemplate,
  fillTemplate,
  getPromptTemplate,
  getImagePromptTemplate,
} from "@/prompt-templates"

interface UseSmartPromptReturn {
  currentTemplate: PromptTemplate | ImagePromptTemplate | null
  variables: Record<string, string>
  filledPrompt: string
  setTemplate: (templateId: string, type?: "chat" | "image") => void
  setVariable: (key: string, value: string) => void
  setVariables: (vars: Record<string, string>) => void
  clearTemplate: () => void
  generatePrompt: () => string
  isValid: boolean
  missingVariables: string[]
}

export function useSmartPrompt(): UseSmartPromptReturn {
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | ImagePromptTemplate | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [filledPrompt, setFilledPrompt] = useState("")

  const setTemplate = useCallback((templateId: string, type: "chat" | "image" = "chat") => {
    const template = type === "chat" ? getPromptTemplate(templateId) : getImagePromptTemplate(templateId)

    if (template) {
      setCurrentTemplate(template)
      // 重置变量
      const newVariables: Record<string, string> = {}
      if ("variables" in template) {
        template.variables.forEach((variable) => {
          newVariables[variable] = ""
        })
      }
      setVariables(newVariables)
    }
  }, [])

  const setVariable = useCallback((key: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const setVariablesCallback = useCallback((vars: Record<string, string>) => {
    setVariables(vars)
  }, [])

  const clearTemplate = useCallback(() => {
    setCurrentTemplate(null)
    setVariables({})
    setFilledPrompt("")
  }, [])

  const generatePrompt = useCallback(() => {
    if (!currentTemplate) return ""

    if ("template" in currentTemplate) {
      // Chat template
      return fillTemplate(currentTemplate, variables)
    } else {
      // Image template
      return currentTemplate.prompt
    }
  }, [currentTemplate, variables])

  // 计算填充后的提示词
  useEffect(() => {
    const prompt = generatePrompt()
    setFilledPrompt(prompt)
  }, [generatePrompt])

  // 检查是否所有必需变量都已填写
  const isValid = useCallback(() => {
    if (!currentTemplate || !("variables" in currentTemplate)) return true

    return currentTemplate.variables.every((variable: string) => variables[variable]?.trim() !== "")
  }, [currentTemplate, variables])

  // 获取缺失的变量
  const missingVariables = useCallback(() => {
    if (!currentTemplate || !("variables" in currentTemplate)) return []

    return currentTemplate.variables.filter((variable: string) => !variables[variable]?.trim())
  }, [currentTemplate, variables])

  return {
    currentTemplate,
    variables,
    filledPrompt,
    setTemplate,
    setVariable,
    setVariables: setVariablesCallback,
    clearTemplate,
    generatePrompt,
    isValid: isValid(),
    missingVariables: missingVariables(),
  }
}

// 智能提示词建议 Hook
export function usePromptSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getSuggestions = useCallback(async (input: string, _category?: string) => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    try {
      // 模拟API调用获取智能建议
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockSuggestions = [
        `${input}，高质量，专业摄影`,
        `${input}，4K超高清，细节丰富`,
        `${input}，自然光线，温馨氛围`,
        `${input}，现代简约风格，干净整洁`,
        `${input}，专业布光，商业用途`,
      ]

      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error("获取建议失败:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  return {
    suggestions,
    isLoading,
    getSuggestions,
    clearSuggestions,
  }
}

// 提示词历史记录 Hook
export function usePromptHistory() {
  const [history, setHistory] = useState<
    Array<{
      id: string
      prompt: string
      timestamp: Date
      category: string
      result?: string
    }>
  >([])

  const addToHistory = useCallback((prompt: string, category: string, result?: string) => {
    const newEntry = {
      id: Date.now().toString(),
      prompt,
      timestamp: new Date(),
      category,
      result,
    }

    setHistory((prev) => [newEntry, ...prev.slice(0, 49)]) // 保留最近50条记录
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const getHistoryByCategory = useCallback(
    (category: string) => {
      return history.filter((entry) => entry.category === category)
    },
    [history],
  )

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryByCategory,
  }
}
