"use client"

import { useState, useCallback, useRef } from "react"

interface Message {
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  metadata?: any
}

interface AIContext {
  messages: Message[]
  userPreferences: Record<string, any>
  sessionData: Record<string, any>
  conversationHistory: Message[]
}

interface IntentAnalysisResult {
  intent: string
  confidence: number
  entities: Array<{ type: string; value: string; confidence: number }>
  sentiment: "positive" | "negative" | "neutral"
}

export function useAIContext() {
  const [context, setContext] = useState<AIContext>({
    messages: [],
    userPreferences: {},
    sessionData: {},
    conversationHistory: [],
  })

  const contextRef = useRef(context)
  contextRef.current = context

  // 添加消息到上下文
  const addMessage = useCallback((message: Omit<Message, "timestamp">) => {
    const fullMessage: Message = {
      ...message,
      timestamp: new Date(),
    }

    setContext((prev) => ({
      ...prev,
      messages: [...prev.messages, fullMessage],
      conversationHistory: [...prev.conversationHistory, fullMessage].slice(-50), // 保留最近50条
    }))
  }, [])

  // 更新上下文数据
  const updateContext = useCallback((updates: Partial<AIContext>) => {
    setContext((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  // 意图分析
  const analyzeIntent = useCallback(async (input: string): Promise<IntentAnalysisResult> => {
    const lowerInput = input.toLowerCase()

    // 简单的意图识别逻辑
    let intent = "general"
    let confidence = 0.5
    const entities: Array<{ type: string; value: string; confidence: number }> = []
    let sentiment: "positive" | "negative" | "neutral" = "neutral"

    // 创意类意图
    if (lowerInput.includes("生成") || lowerInput.includes("创建") || lowerInput.includes("制作")) {
      if (lowerInput.includes("图") || lowerInput.includes("画") || lowerInput.includes("图片")) {
        intent = "image_generation"
        confidence = 0.9
      } else if (lowerInput.includes("文案") || lowerInput.includes("内容")) {
        intent = "content_creation"
        confidence = 0.8
      } else {
        intent = "creation"
        confidence = 0.7
      }
    }

    // 分析类意图
    else if (lowerInput.includes("分析") || lowerInput.includes("统计") || lowerInput.includes("报表")) {
      intent = "data_analysis"
      confidence = 0.8
    }

    // 查询类意图
    else if (lowerInput.includes("查看") || lowerInput.includes("显示") || lowerInput.includes("查询")) {
      intent = "query"
      confidence = 0.7
    }

    // 功能类意图
    else if (lowerInput.includes("启动") || lowerInput.includes("开启") || lowerInput.includes("打开")) {
      intent = "function_activation"
      confidence = 0.8
    }

    // 语音类意图
    else if (lowerInput.includes("语音") || lowerInput.includes("说话") || lowerInput.includes("听")) {
      intent = "voice_interaction"
      confidence = 0.9
    }

    // 客服类意图
    else if (lowerInput.includes("客服") || lowerInput.includes("咨询") || lowerInput.includes("帮助")) {
      intent = "customer_service"
      confidence = 0.8
    }

    // 情感分析
    const positiveWords = ["好", "棒", "优秀", "满意", "喜欢", "感谢", "谢谢"]
    const negativeWords = ["不好", "差", "不满意", "讨厌", "问题", "错误", "失败"]

    if (positiveWords.some((word) => lowerInput.includes(word))) {
      sentiment = "positive"
    } else if (negativeWords.some((word) => lowerInput.includes(word))) {
      sentiment = "negative"
    }

    // 实体提取
    const colorMatches = input.match(/(红色|蓝色|绿色|黄色|黑色|白色|灰色|紫色|橙色|粉色)/g)
    if (colorMatches) {
      colorMatches.forEach((color) => {
        entities.push({ type: "color", value: color, confidence: 0.9 })
      })
    }

    const sizeMatches = input.match(/(大|小|中等|巨大|微小|宽|窄|高|低)/g)
    if (sizeMatches) {
      sizeMatches.forEach((size) => {
        entities.push({ type: "size", value: size, confidence: 0.8 })
      })
    }

    return {
      intent,
      confidence,
      entities,
      sentiment,
    }
  }, [])

  // 生成上下文相关回复
  const generateContextualResponse = useCallback(async (input: string, intent: string): Promise<string> => {
    const currentContext = contextRef.current
    const recentMessages = currentContext.conversationHistory.slice(-5)

    // 基于意图生成回复
    const responses: Record<string, string[]> = {
      image_generation: [
        `🎨 **图像生成请求已接收**

我理解您想要生成图像："${input}"

**正在为您准备：**
• 🖼️ 启动AI文生图引擎
• 🎯 分析您的创意描述
• ⚙️ 优化生成参数
• 🎨 开始创作您的专属图像

请稍候，我将为您创作出符合描述的高质量图像！您也可以在弹出的文生图界面中进行更详细的设置。`,

        `🎨 **创意图像生成中**

基于您的描述："${input}"

**AI创作流程：**
1. 📝 解析创意要求
2. 🎯 匹配最佳风格
3. ⚙️ 调整生成参数  
4. 🖼️ 渲染高质量图像

我会为您生成多种风格选择，请在专业的文生图界面中查看详细选项！`,
      ],

      voice_interaction: [
        `🎤 **语音交互系统启动**

${input}

**语音功能已激活：**
• 🎙️ 实时语音识别
• 🔊 智能语音合成
• 📊 音频可视化显示
• 🎯 高精度语音转文字

现在您可以通过语音与我进行自然对话！请在弹出的语音界面中开始体验。`,

        `🎤 **智能语音助手就绪**

收到语音请求："${input}"

**语音交互特色：**
• 支持中文语音识别
• 实时转录显示
• 智能语音回复
• 多种音色选择

语音界面已为您打开，开始您的语音AI体验之旅！`,
      ],

      data_analysis: [
        `📊 **数据分析系统启动**

分析需求："${input}"

**智能分析能力：**
• 📈 数据趋势分析
• 📊 可视化图表生成
• 🎯 关键指标提取
• 💡 商业洞察建议

**数据魔方功能：**
• 多维度数据透视
• 实时数据监控
• 预测性分析
• 自定义报表生成

请提供具体的数据或告诉我您想分析的内容，我将为您提供专业的数据洞察！`,
      ],

      customer_service: [
        `🤖 **智能客服系统激活**

服务请求："${input}"

**专业客服能力：**
• 💬 24/7智能对话
• 📋 常见问题解答
• 🎯 个性化服务方案
• 📞 多渠道服务支持

**特色服务：**
• 家居行业专业知识
• 智能话术推荐
• 客户情绪识别
• 服务质量评估

我已准备好为您提供专业的客服支持，请告诉我具体需要什么帮助！`,
      ],

      function_activation: [
        `⚙️ **功能模块启动中**

激活请求："${input}"

**YYC³ 功能矩阵：**

**🎨 创意类：** 文生图引擎、言启万象创意工坊
**📊 分析类：** 数据魔方、智能报表系统  
**👥 管理类：** 客资系统、智能客户运维
**🤖 沟通类：** 智能客服、数字人小左
**⚙️ 系统类：** 言语云平台、系统监控
**🔄 自动化：** 智能表单、工作流程

请告诉我您想要使用哪个具体功能，我将为您详细介绍并启动相应模块！`,
      ],

      query: [
        `🔍 **信息查询处理中**

查询内容："${input}"

**查询服务范围：**
• 📋 系统功能介绍
• 📊 数据状态查看
• 👥 客户信息管理
• ⚙️ 系统运行状态
• 📚 使用帮助文档

**智能检索能力：**
• 语义理解查询
• 多维度信息整合
• 实时数据更新
• 个性化结果推荐

请告诉我您想查询的具体信息，我将为您提供准确详细的答案！`,
      ],

      content_creation: [
        `✍️ **内容创作助手启动**

创作需求："${input}"

**AI创作能力：**
• 📝 营销文案生成
• 🎨 创意设计方案
• 📊 商业计划书
• 🎬 视频脚本创作

**言启万象工坊：**
• 多风格内容生成
• 行业专业术语
• SEO优化建议
• 品牌调性匹配

请详细描述您的创作需求，包括内容类型、目标受众、风格偏好等，我将为您创作出专业的内容！`,
      ],

      general: [
        `🤖 **YYC³ AI助手为您服务**

您的需求："${input}"

**我能为您提供：**
• 🎨 AI图像创作与设计
• 🎤 智能语音交互体验  
• 📊 数据分析与可视化
• 👥 客户管理与运维
• 🤖 智能客服与对话
• ✍️ 内容创作与文案

**万象归元特色：**
• 一句话调用所有功能
• 智能理解您的需求
• 个性化服务体验
• 专业级解决方案

请告诉我您具体想要什么，我会智能匹配最合适的功能为您服务！您也可以说"显示所有功能"查看完整能力列表。`,

        `💡 **智能助手理解中**

基于您的输入："${input}"

**YYC³ 核心优势：**
• 🌐 云原生架构，无限扩展
• 🧠 深度学习，智能进化  
• 🔗 功能融合，协同增效
• ⚡ 实时响应，极速体验

**建议您尝试：**
• "生成一张[描述]的图片" - 启动AI绘画
• "开启语音功能" - 体验语音交互
• "分析[数据类型]" - 获得数据洞察
• "启动智能客服" - 专业服务支持

有什么具体需要帮助的吗？我随时为您提供专业服务！`,
      ],
    }

    const intentResponses = responses[intent] || responses.general
    const randomResponse = intentResponses[Math.floor(Math.random() * intentResponses.length)]

    // 如果有历史对话，可以添加上下文相关的个性化内容
    if (recentMessages.length > 0) {
      const lastUserMessage = recentMessages.filter((m) => m.type === "user").pop()
      if (lastUserMessage && lastUserMessage.content.includes("谢谢")) {
        return `${randomResponse}

😊 很高兴能帮助到您！如果还有其他需要，随时告诉我。`
      }
    }

    return randomResponse
  }, [])

  // 获取相关历史记录
  const getRelevantHistory = useCallback((query: string, limit = 5): Message[] => {
    const currentContext = contextRef.current
    return currentContext.conversationHistory
      .filter(
        (message) =>
          message.content.toLowerCase().includes(query.toLowerCase()) ||
          (message.metadata?.intent && message.metadata.intent.includes(query.toLowerCase())),
      )
      .slice(-limit)
  }, [])

  // 清空上下文
  const clearContext = useCallback(() => {
    setContext({
      messages: [],
      userPreferences: {},
      sessionData: {},
      conversationHistory: [],
    })
  }, [])

  return {
    context,
    addMessage,
    updateContext,
    analyzeIntent,
    generateContextualResponse,
    getRelevantHistory,
    clearContext,
  }
}
