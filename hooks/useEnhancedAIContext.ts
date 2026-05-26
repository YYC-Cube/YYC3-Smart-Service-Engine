import { useState, useCallback, useRef, useEffect } from "react"

export interface ConversationMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    entities?: Entity[]
    sentiment?: SentimentType
    functionCall?: string
    tokens?: number
    model?: string
    [key: string]: unknown
  }
}

export interface Entity {
  type: string
  value: string
  confidence: number
}

export type SentimentType = "positive" | "negative" | "neutral"

export interface ConversationSummary {
  topic: string
  keyPoints: string[]
  entities: Entity[]
  sentiment: SentimentType
  messageCount: number
  duration: number
  lastActive: Date
}

export interface ContextWindow {
  maxMessages: number
  maxTokens: number
  currentTokens: number
  messages: ConversationMessage[]
}

export interface UseEnhancedAIContextConfig {
  maxContextMessages?: number
  maxContextTokens?: number
  autoSummarize?: boolean
  summarizeThreshold?: number
  persistenceEnabled?: boolean
  storageKey?: string
  onContextUpdate?: (context: EnhancedAIContext) => void
  onSummarize?: (summary: ConversationSummary) => void
}

interface EnhancedAIContext {
  sessionId: string
  conversationState: "active" | "idle" | "ended"
  currentTopic?: string
  userPreferences: Record<string, any>
  contextWindow: ContextWindow
  summaries: ConversationSummary[]
  totalMessages: number
  startTime: Date
  lastActivity: Date
}

interface UseEnhancedAIContextReturn {
  context: EnhancedAIContext
  addMessage: (
    message: Omit<ConversationMessage, "id" | "timestamp">
  ) => Promise<ConversationMessage>
  updatePreferences: (preferences: Record<string, any>) => void
  analyzeIntent: (text: string) => IntentAnalysisResult
  generateResponse: (input: string) => Promise<string>
  getRelevantHistory: (query: string, limit?: number) => ConversationMessage[]
  getConversationSummary: () => ConversationSummary | null
  clearContext: () => void
  exportContext: () => string
  importContext: (data: string) => boolean
  getContextStats: () => ContextStats
}

interface IntentAnalysisResult {
  intent: string
  confidence: number
  entities: Entity[]
  sentiment: SentimentType
  suggestedActions: string[]
}

interface ContextStats {
  messageCount: number
  averageMessageLength: number
  topIntents: Array<{ intent: string; count: number }>
  activeDuration: number
  contextUtilization: number
}

const DEFAULT_CONFIG = {
  maxContextMessages: 50,
  maxContextTokens: 4000,
  autoSummarize: true,
  summarizeThreshold: 0.8,
  persistenceEnabled: false,
  storageKey: "yyc3_ai_context",
}

export function useEnhancedAIContext(
  config: UseEnhancedAIContextConfig = {}
): UseEnhancedAIContextReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  const [context, setContext] = useState<EnhancedAIContext>(() => {
    const initialContext: EnhancedAIContext = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationState: "active",
      userPreferences: {},
      contextWindow: {
        maxMessages: mergedConfig.maxContextMessages,
        maxTokens: mergedConfig.maxContextTokens,
        currentTokens: 0,
        messages: [],
      },
      summaries: [],
      totalMessages: 0,
      startTime: new Date(),
      lastActivity: new Date(),
    }

    if (mergedConfig.persistenceEnabled) {
      try {
        const saved = localStorage.getItem(mergedConfig.storageKey!)
        if (saved) {
          return JSON.parse(saved)
        }
      } catch (error) {
        console.error("Failed to load persisted context:", error)
      }
    }

    return initialContext
  })

  const contextRef = useRef(context)
  contextRef.current = context

  useEffect(() => {
    if (mergedConfig.persistenceEnabled) {
      try {
        localStorage.setItem(mergedConfig.storageKey!, JSON.stringify(context))
      } catch (error) {
        console.error("Failed to persist context:", error)
      }
    }
  }, [context])

  const estimateTokens = useCallback((text: string): number => {
    return Math.ceil(text.length / 4)
  }, [])

  const manageContextWindow = useCallback(
    (newMessage: ConversationMessage) => {
      setContext((prev) => {
        let updatedMessages = [...prev.contextWindow.messages, newMessage]
        let newTokenCount =
          prev.contextWindow.currentTokens + estimateTokens(newMessage.content)

        while (
          (updatedMessages.length > prev.contextWindow.maxMessages ||
            newTokenCount > prev.contextWindow.maxTokens) &&
          updatedMessages.length > 1
        ) {
          const removed = updatedMessages.shift()
          if (removed) {
            newTokenCount -= estimateTokens(removed.content)
          }
        }

        return {
          ...prev,
          contextWindow: {
            ...prev.contextWindow,
            messages: updatedMessages,
            currentTokens: Math.max(0, newTokenCount),
          },
          totalMessages: prev.totalMessages + 1,
          lastActivity: new Date(),
        }
      })
    },
    [estimateTokens]
  )

  const generateSummary = useCallback(
    (messages: ConversationMessage[]): ConversationSummary => {
      const allText = messages.map((m) => m.content).join(" ")
      const intents = messages
        .filter((m) => m.metadata?.intent)
        .map((m) => m.metadata!.intent!)

      const entityMap = new Map<string, number>()
      messages.forEach((m) => {
        m.metadata?.entities?.forEach((entity) => {
          const key = `${entity.type}:${entity.value}`
          entityMap.set(key, (entityMap.get(key) || 0) + 1)
        })
      })

      const topEntities: Entity[] = Array.from(entityMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([key]) => {
          const [type, value] = key.split(":")
          return { type: type || '', value: value || '', confidence: 1 }
        })

      const sentimentCounts = { positive: 0, negative: 0, neutral: 0 }
      messages.forEach((m) => {
        if (m.metadata?.sentiment) {
          sentimentCounts[m.metadata.sentiment]++
        }
      })

      const dominantSentiment = (Object.entries(sentimentCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || 'neutral') as SentimentType

      const summary: ConversationSummary = {
        topic: extractTopic(allText, intents),
        keyPoints: extractKeyPoints(messages),
        entities: topEntities,
        sentiment: dominantSentiment,
        messageCount: messages.length,
        duration:
          new Date().getTime() -
          (messages[0]?.timestamp?.getTime() || 0),
        lastActive: new Date(),
      }

      mergedConfig.onSummarize?.(summary)

      return summary
    },
    [mergedConfig.onSummarize]
  )

  const addMessage = useCallback(
    async (
      messageData: Omit<ConversationMessage, "id" | "timestamp">
    ): Promise<ConversationMessage> => {
      const message: ConversationMessage = {
        ...messageData,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      }

      if (message.role === "user") {
        const analysis = analyzeIntentInternal(message.content)
        message.metadata = {
          ...message.metadata,
          ...analysis,
        }
      }

      manageContextWindow(message)

      setContext((prev) => {
        const utilization =
          prev.contextWindow.currentTokens / prev.contextWindow.maxTokens

        if (
          mergedConfig.autoSummarize &&
          utilization >= mergedConfig.summarizeThreshold! &&
          prev.contextWindow.messages.length > 5
        ) {
          const summary = generateSummary(prev.contextWindow.messages)
          return {
            ...prev,
            summaries: [...prev.summaries.slice(-10), summary],
            contextWindow: {
              ...prev.contextWindow,
              messages: [message],
              currentTokens: estimateTokens(message.content),
            },
          }
        }

        return prev
      })

      mergedConfig.onContextUpdate?.(contextRef.current)

      return message
    },
    [manageContextWindow, generateSummary, estimateTokens, mergedConfig]
  )

  const analyzeIntentInternal = useCallback(
    (text: string): Partial<IntentAnalysisResult> => {
      const lowerText = text.toLowerCase()

      const intentPatterns: Record<string, string[]> = {
        greeting: ["你好", "您好", "hi", "hello", "早上好", "下午好"],
        farewell: ["再见", "拜拜", "bye", "下次见"],
        image_generation: ["生成", "画", "图片", "图像", "创作", "绘制"],
        voice_interaction: ["语音", "说话", "听", "播放", "朗读"],
        data_analysis: ["分析", "数据", "报表", "统计", "图表"],
        customer_service: ["客服", "咨询", "服务", "帮助", "问题"],
        digital_human: ["小左", "数字人", "沙发", "销售"],
        creative_work: ["创意", "文案", "内容", "写作"],
        question: ["什么", "怎么", "如何", "为什么", "?", "？"],
        gratitude: ["谢谢", "感谢", "多谢"],
        apology: ["对不起", "抱歉", "不好意思"],
      }

      let bestIntent = "general"
      let maxScore = 0
      const entities: Entity[] = []

      for (const [intent, keywords] of Object.entries(intentPatterns)) {
        const score = keywords.reduce(
          (acc, keyword) => acc + (lowerText.includes(keyword) ? 1 : 0),
          0
        )
        if (score > maxScore) {
          maxScore = score
          bestIntent = intent
        }
      }

      const numberMatches = text.match(/\d+/g)
      if (numberMatches) {
        entities.push({ type: "number", value: numberMatches.join(", "), confidence: 0.9 })
      }

      const positiveWords = ["好", "棒", "优秀", "喜欢", "满意", "不错"]
      const negativeWords = ["不好", "差", "糟糕", "不喜欢", "不满意"]

      const positiveScore = positiveWords.filter((word) =>
        lowerText.includes(word)
      ).length
      const negativeScore = negativeWords.filter((word) =>
        lowerText.includes(word)
      ).length

      let sentiment: SentimentType = "neutral"
      if (positiveScore > negativeScore) sentiment = "positive"
      else if (negativeScore > positiveScore) sentiment = "negative"

      const suggestedActions = getSuggestedActions(bestIntent, text)

      return {
        intent: bestIntent,
        confidence: Math.min(1, maxScore / 3),
        entities,
        sentiment,
        suggestedActions,
      }
    },
    []
  )

  const analyzeIntent = useCallback(
    (text: string): IntentAnalysisResult => {
      return analyzeIntentInternal(text) as IntentAnalysisResult
    },
    [analyzeIntentInternal]
  )

  const updatePreferences = useCallback((preferences: Record<string, any>) => {
    setContext((prev) => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...preferences },
    }))
  }, [])

  const generateResponse = useCallback(
    async (input: string): Promise<string> => {
      await addMessage({ role: "user", content: input })

      const intent = analyzeIntent(input)
      const recentContext = contextRef.current.contextWindow.messages.slice(-5)

      let response = ""

      switch (intent.intent) {
        case "greeting":
          response = `👋 您好！我是YYC³ AI助手，很高兴为您服务！\n\n我可以帮您：\n🎨 AI图像生成\n🎤 语音交互\n📊 数据分析\n🤖 智能客服\n\n请告诉我您需要什么帮助？`
          break

        case "image_generation":
          response = `🎨 **AI图像生成功能已就绪**\n\n请描述您想要生成的图片，例如：\n• "生成一张现代简约风格的客厅"\n• "创作一幅山水风景画"\n• "设计一个科技感的产品海报"\n\n我将为您生成高质量的AI图像！`
          break

        case "voice_interaction":
          response = `🎤 **语音交互系统**\n\n✅ 语音识别已启用\n✅ 文本转语音就绪\n\n您可以通过语音与我对话，我也能朗读回复内容。`
          break

        default:
          response = generateContextualResponse(input, intent, recentContext)
      }

      await addMessage({
        role: "assistant",
        content: response,
        metadata: {
          intent: intent.intent,
          confidence: intent.confidence,
        },
      })

      return response
    },
    [addMessage, analyzeIntent]
  )

  const getRelevantHistory = useCallback(
    (query: string, limit = 5): ConversationMessage[] => {
      const queryLower = query.toLowerCase()
      const queryWords = queryLower.split(/\s+/)

      const scored = contextRef.current.contextWindow.messages
        .map((msg) => {
          let score = 0

          for (const word of queryWords) {
            if (msg.content.toLowerCase().includes(word)) {
              score += 1
            }
          }

          if (msg.metadata?.intent && queryLower.includes(msg.metadata.intent)) {
            score += 2
          }

          msg.metadata?.entities?.forEach((entity) => {
            if (queryLower.includes(entity.value.toLowerCase())) {
              score += 1.5
            }
          })

          const timeDecay =
            1 /
            (1 +
              (Date.now() - msg.timestamp.getTime()) / (1000 * 60 * 60))

          return { msg, score: score * timeDecay }
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      return scored.map((item) => item.msg)
    },
    []
  )

  const getConversationSummary = useCallback((): ConversationSummary | null => {
    if (contextRef.current.contextWindow.messages.length === 0) {
      return null
    }

    return generateSummary(contextRef.current.contextWindow.messages)
  }, [generateSummary])

  const clearContext = useCallback(() => {
    setContext({
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationState: "active",
      userPreferences: {},
      contextWindow: {
        maxMessages: mergedConfig.maxContextMessages,
        maxTokens: mergedConfig.maxContextTokens,
        currentTokens: 0,
        messages: [],
      },
      summaries: [],
      totalMessages: 0,
      startTime: new Date(),
      lastActivity: new Date(),
    })
  }, [mergedConfig])

  const exportContext = useCallback((): string => {
    try {
      return JSON.stringify(contextRef.current, null, 2)
    } catch (error) {
      console.error("Failed to export context:", error)
      return ""
    }
  }, [])

  const importContext = useCallback((data: string): boolean => {
    try {
      const imported = JSON.parse(data)

      if (!imported.sessionId || !imported.contextWindow) {
        throw new Error("Invalid context format")
      }

      setContext(imported)
      return true
    } catch (error) {
      console.error("Failed to import context:", error)
      return false
    }
  }, [])

  const getContextStats = useCallback((): ContextStats => {
    const ctx = contextRef.current
    const messages = ctx.contextWindow.messages

    const avgLength =
      messages.length > 0
        ? messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length
        : 0

    const intentCounts: Record<string, number> = {}
    messages.forEach((m) => {
      if (m.metadata?.intent) {
        intentCounts[m.metadata.intent] = (intentCounts[m.metadata.intent] || 0) + 1
      }
    })

    const topIntents = Object.entries(intentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([intent, count]) => ({ intent, count }))

    return {
      messageCount: ctx.totalMessages,
      averageMessageLength: avgLength,
      topIntents,
      activeDuration: Date.now() - ctx.startTime.getTime(),
      contextUtilization: ctx.contextWindow.currentTokens / ctx.contextWindow.maxTokens,
    }
  }, [])

  return {
    context,
    addMessage,
    updatePreferences,
    analyzeIntent,
    generateResponse,
    getRelevantHistory,
    getConversationSummary,
    clearContext,
    exportContext,
    importContext,
    getContextStats,
  }
}

function extractTopic(text: string, intents: string[]): string {
  const commonWords = new Set([
    "的", "是", "在", "有", "和", "了", "我", "你", "他", "她",
    "这", "那", "个", "们", "会", "能", "想", "要", "可以", "请",
    "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can",
    "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "into", "through",
  ])

  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1 && !commonWords.has(word))

  const wordFreq: Record<string, number> = {}
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word)

  if (intents.length > 0) {
    const primaryIntent = intents[0]
    return `${primaryIntent}: ${topWords.join(", ")}`
  }

  return topWords.join(", ") || "General Conversation"
}

function extractKeyPoints(messages: ConversationMessage[]): string[] {
  const points: string[] = []

  messages.forEach((msg) => {
    if (msg.role === "assistant" && msg.content.length > 50) {
      const sentences = msg.content
        .split(/[。！？.!?]/)
        .filter((s) => s.trim().length > 20)

      if (sentences.length > 0) {
        points.push(sentences[0]?.trim() || '')
      }
    }
  })

  return points.slice(-5)
}

function getSuggestedActions(intent: string, text: string): string[] {
  const actionMap: Record<string, string[]> = {
    greeting: ["开始对话", "展示功能"],
    image_generation: ["调用文生图引擎", "设置参数"],
    voice_interaction: ["启动语音识别", "开启TTS"],
    customer_service: ["连接智能客服", "查询知识库"],
    digital_human: ["激活数字人小左", "加载话术库"],
    data_analysis: ["调用数据魔方", "生成报表"],
    creative_work: ["打开言启万象", "选择模板"],
    question: ["提供答案", "搜索知识库"],
    gratitude: ["表达感谢", "继续服务"],
    farewell: ["结束对话", "保存上下文"],
  }

  return actionMap[intent] || ["提供一般性回应"]
}

function generateContextualResponse(
  input: string,
  intent: IntentAnalysisResult,
  recentContext: ConversationMessage[]
): string {
  const hasContext = recentContext.length > 2

  if (hasContext) {
    const lastUserMsg = [...recentContext]
      .reverse()
      .find((m) => m.role === "user")

    if (lastUserMsg && intent.entities.length > 0) {
      const entityInfo = intent.entities
        .map((e) => `${e.type}: ${e.value}`)
        .join(", ")

      return `💭 基于我们的对话，我注意到您提到了 **${entityInfo}**。\n\n让我为您详细说明...\n\n（结合上下文的个性化回复）`
    }
  }

  return `🤔 我理解您的询问关于"${input.substring(0, 50)}${input.length > 50 ? "..." : ""}"。\n\n作为YYC³ AI助手，我可以为您提供全方位的智能服务。请问您希望我从哪个方面为您解答？`
}
