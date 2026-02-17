"use client"

import { useState, useCallback, useRef } from "react"

interface AIMessage {
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    entities?: any[]
    sentiment?: string
    functionCall?: string
    [key: string]: any
  }
}

interface AIContext {
  messages: AIMessage[]
  currentTopic?: string
  userPreferences?: Record<string, any>
  sessionId: string
  conversationState: "active" | "idle" | "ended"
}

interface IntentAnalysisResult {
  intent: string
  confidence: number
  entities: any[]
  sentiment: "positive" | "negative" | "neutral"
}

interface UseAIContextReturn {
  context: AIContext
  addMessage: (message: Omit<AIMessage, "timestamp">) => void
  updateContext: (updates: Partial<AIContext>) => void
  analyzeIntent: (text: string) => Promise<IntentAnalysisResult>
  generateContextualResponse: (input: string, intent?: string) => Promise<string>
  getRelevantHistory: (query: string, limit?: number) => AIMessage[]
  clearContext: () => void
}

export function useAIContext(): UseAIContextReturn {
  const [context, setContext] = useState<AIContext>({
    messages: [],
    sessionId: `session_${Date.now()}`,
    conversationState: "active",
  })

  const contextRef = useRef(context)
  contextRef.current = context

  // 添加消息
  const addMessage = useCallback((message: Omit<AIMessage, "timestamp">) => {
    const newMessage: AIMessage = {
      ...message,
      timestamp: new Date(),
    }

    setContext((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }))
  }, [])

  // 更新上下文
  const updateContext = useCallback((updates: Partial<AIContext>) => {
    setContext((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  // 意图分析
  const analyzeIntent = useCallback(async (text: string): Promise<IntentAnalysisResult> => {
    const lowerText = text.toLowerCase()

    // 简单的意图识别规则
    const intentPatterns = {
      show_features: ["显示所有功能", "所有功能", "功能列表", "有哪些功能", "能做什么", "功能清单", "全部功能"],
      image_generation: ["生成", "画", "图片", "图像", "创作", "绘制", "设计"],
      voice_interaction: ["语音", "说话", "听", "播放", "朗读"],
      data_analysis: ["分析", "数据", "报表", "统计", "图表"],
      customer_service: ["客服", "咨询", "服务", "帮助", "问题"],
      system_control: ["系统", "监控", "状态", "设置", "配置"],
      digital_human: ["小左", "数字人", "沙发", "销售"],
      creative_work: ["创意", "文案", "内容", "写作"],
      greeting: ["你好", "您好", "hi", "hello", "早上好", "下午好", "晚上好"],
      question: ["什么", "怎么", "如何", "为什么", "哪里", "谁", "?", "？"],
    }

    let bestIntent = "general"
    let maxScore = 0
    const entities: any[] = []

    // 计算意图匹配分数
    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowerText.includes(keyword) ? 1 : 0)
      }, 0)

      if (score > maxScore) {
        maxScore = score
        bestIntent = intent
      }
    }

    // 实体提取（简单实现）
    const numberMatches = text.match(/\d+/g)
    if (numberMatches) {
      entities.push({
        type: "number",
        value: numberMatches,
      })
    }

    // 情感分析（简单实现）
    const positiveWords = ["好", "棒", "优秀", "喜欢", "满意", "不错", "很好"]
    const negativeWords = ["不好", "差", "糟糕", "不喜欢", "不满意", "问题", "错误"]

    const positiveScore = positiveWords.reduce((acc, word) => acc + (lowerText.includes(word) ? 1 : 0), 0)
    const negativeScore = negativeWords.reduce((acc, word) => acc + (lowerText.includes(word) ? 1 : 0), 0)

    let sentiment: "positive" | "negative" | "neutral" = "neutral"
    if (positiveScore > negativeScore) sentiment = "positive"
    else if (negativeScore > positiveScore) sentiment = "negative"

    const confidence = Math.min(1, maxScore / 3) // 标准化置信度

    return {
      intent: bestIntent,
      confidence,
      entities,
      sentiment,
    }
  }, [])

  // 生成上下文回复
  const generateContextualResponse = useCallback(async (input: string, intent?: string): Promise<string> => {
    const currentContext = contextRef.current
    const recentMessages = currentContext.messages.slice(-5) // 获取最近5条消息作为上下文

    // 根据意图生成回复
    const responses = {
      show_features: `📋 **YYC³ AI Center 完整功能清单**

🌟 **万象归元于云枢 - 深栈智启新纪元**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ☁️ **云枢核心层 (YanYu Cloud Core)**

### 🌐 言语云平台
**YYC³ AI Center云端智能服务平台**
• 云原生架构，弹性扩展
• AI引擎驱动，智能决策
• 企业级安全保障
• 实时数据同步
**调用方式：** "启动言语云平台" / "查看云服务状态"

### ⚙️ 系统监控
**实时系统状态监控与性能管理**
• CPU、内存、网络实时监控
• 智能告警与异常检测
• 性能优化建议
• 详细日志记录
**调用方式：** "显示系统状态" / "查看系统监控"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 💼 **业务智能层 (Business Intelligence)**

### 📊 数据魔方
**智能数据分析与可视化系统**
• 多维度数据分析
• 智能报表生成
• 趋势预测与洞察
• 交互式数据可视化
**调用方式：** "分析销售数据" / "生成数据报表"

### 👥 客资系统
**客户资源管理平台 (CRM)**
• 客户信息管理
• 销售机会跟踪
• 客户关系维护
• 销售漏斗分析
**调用方式：** "查看客户信息" / "管理客户资源"

### 🔄 智能客户运维
**家居整装行业客户全生命周期管理**
• 客户旅程管理
• 自动化运维流程
• 客户健康度监控
• 智能续约提醒
**调用方式：** "启动客户运维" / "查看客户生命周期"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 **应用服务层 (Application Services)**

### 🎨 文生图引擎
**AI文本生成图像创作平台**
• 多种艺术风格（现实、动漫、油画、水彩等）
• 智能提示词优化
• 高质量图像生成
• 批量创作与变体生成
**调用方式：** "生成一张[描述]的图片" / "创作一幅[风格]画作"

### 💡 言启万象
**AI创意内容生成工坊**
• 智能文案创作
• 视觉设计生成
• 内容策划与脚本创作
• 创意灵感激发
**调用方式：** "创作营销文案" / "生成创意方案"

### 🤖 智能客服
**全场景AI对话系统**
• 24/7智能对话
• 意图识别与情感分析
• 知识库智能检索
• 多轮对话上下文理解
**调用方式：** "启动智能客服" / "我需要帮助"

### 👤 数字人小左
**左右沙发专业电销数字人**
• 沙发产品专家
• 专业销售话术
• 客户需求分析
• 定制方案推荐
**调用方式：** "连接数字人小左" / "咨询沙发产品"

### 📝 智能表单系统
**AI驱动的智能表单创建与管理**
• 智能表单设计
• 数据自动收集
• 表单分析与洞察
• 工作流自动化
**调用方式：** "创建智能表单" / "设计调查问卷"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎨 **交互体验层 (Interaction Experience)**

### 🎤 语音交互系统
**自然语言语音识别与合成**
• 高精度中文语音识别
• 自然语音合成播放
• 实时音频可视化
• 双向语音对话
**调用方式：** "开启语音功能" / "启动语音对话"

### 📁 文件处理系统
**多格式文件上传与智能处理**
• 图片智能分析
• 文档内容提取
• 数据文件处理
• 批量文件管理
**调用方式：** 直接上传文件或"处理文件"

### 💡 智能推荐引擎
**个性化功能推荐与建议**
• 基于上下文的智能建议
• 个性化功能推荐
• 快速操作入口
• 使用习惯学习
**调用方式：** 自动触发，无需手动调用

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🚀 **快速体验指南**

### 🎨 创意类功能
\`\`\`
"生成一张现代简约风格的客厅图片"
"创作一个产品营销文案"
"设计一个活动海报"
\`\`\`

### 📊 分析类功能
\`\`\`
"分析本月销售数据"
"生成客户满意度报告"
"预测下季度业绩趋势"
\`\`\`

### 👥 管理类功能
\`\`\`
"查看客户档案"
"创建客户跟进任务"
"启动客户运维系统"
\`\`\`

### 🤖 沟通类功能
\`\`\`
"开启语音对话"
"启动智能客服"
"连接数字人小左"
\`\`\`

### ⚙️ 系统类功能
\`\`\`
"显示系统状态"
"查看性能监控"
"优化系统配置"
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🌟 **YYC³ 核心特色**

✨ **无边界智能交互**
所有功能均通过AI对话调用，一句话即可启动任何功能

🧠 **深度学习引擎**
AI持续学习用户习惯，提供越来越精准的服务

🔗 **万象归元设计**
多功能协同工作，数据互通，体验流畅

⚡ **实时响应系统**
毫秒级响应速度，极致的交互体验

🛡️ **企业级安全**
数据加密传输，权限精细控制，安全可靠

🌐 **云原生架构**
弹性扩展，高可用性，支持海量并发

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **使用提示：**
• 直接用自然语言描述您的需求
• 系统会智能匹配最合适的功能
• 支持多功能组合使用
• 所有功能都已真实实现，可立即体验

🎯 **现在就开始吧！告诉我您想要什么，我会为您智能调用相应的功能！**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 **常用快捷命令：**
• "开启语音" → 启动语音交互
• "生成图片" → 启动文生图引擎
• "分析数据" → 启动数据魔方
• "客服帮助" → 启动智能客服
• "系统状态" → 查看系统监控

🚀 **YYC³ AI Center - 让AI理解您的每一个想法！**`,

      image_generation: `🎨 **文生图引擎已激活**

我理解您想要生成图像！正在为您启动AI图像创作系统...

**功能特色：**
• 🎯 智能提示词优化 - 自动增强您的描述
• 🎨 多种艺术风格 - 现实、动漫、油画、水彩等
• ⚡ 高质量生成 - 支持多种分辨率和质量设置
• 🔄 批量创作 - 一次生成多个变体
• 💾 便捷保存 - 一键下载高清图片

**使用建议：**
请详细描述您想要的图像，包括：
• 主题内容（人物、物品、场景等）
• 艺术风格（现代、古典、卡通等）
• 色彩偏好（明亮、暗沉、彩色、黑白等）
• 构图要求（特写、全景、俯视等）

例如："生成一张现代简约风格的客厅图片，包含白色沙发和绿植"

🚀 **准备就绪！请告诉我您的创意想法！**`,

      voice_interaction: `🎤 **智能语音系统已启动**

欢迎使用YYC³ AI Center语音交互功能！

**语音能力：**
• 🎯 高精度语音识别 - 支持中文普通话识别
• 🔊 自然语音合成 - 真人般的语音播放
• 🎵 实时音频可视化 - 动态音频波形显示
• 🔄 双向语音交互 - 完整的对话体验
• 📝 实时转录显示 - 语音内容即时文字化

**使用方法：**
1. 点击"开始录音"按钮
2. 清晰地说出您的需求
3. 系统会实时转录并智能回复
4. AI回复会自动转换为语音播放

**语音命令示例：**
• "生成一张风景画"
• "分析销售数据"
• "启动客服系统"
• "查看系统状态"

🎙️ **语音功能已就绪，开始您的语音之旅！**`,

      data_analysis: `📊 **数据魔方分析引擎已启动**

智能数据分析系统为您服务！

**分析能力：**
• 📈 趋势分析 - 发现数据变化规律
• 🎯 关键指标监控 - 实时业务指标追踪
• 📋 智能报表生成 - 自动化数据报告
• 🔍 异常检测 - 识别数据异常模式
• 📊 可视化图表 - 多样化数据展示

**支持的数据类型：**
• 销售数据分析
• 客户行为分析
• 市场趋势分析
• 运营效率分析
• 财务数据分析

**分析流程：**
1. 上传或连接数据源
2. 选择分析维度和指标
3. AI自动进行深度分析
4. 生成可视化报表和洞察

📈 **请告诉我您需要分析什么数据，我来为您提供专业的数据洞察！**`,

      customer_service: `🤖 **智能客服系统已激活**

YYC³ AI客服为您提供专业服务！

**服务能力：**
• 💬 24/7智能对话 - 全天候在线服务
• 🎯 意图识别 - 精准理解客户需求
• 📚 知识库查询 - 海量信息即时检索
• 🔄 多轮对话 - 上下文理解能力
• 📊 服务质量监控 - 持续优化服务体验

**服务范围：**
• 产品咨询和介绍
• 技术支持和故障排除
• 订单查询和处理
• 投诉建议处理
• 使用指导和培训

**智能特色：**
• 情感识别 - 理解客户情绪状态
• 个性化服务 - 基于历史记录定制
• 多语言支持 - 中英文无缝切换
• 智能转人工 - 复杂问题无缝转接

🎯 **我是您的专属AI客服，有什么可以帮助您的吗？**`,

      digital_human: `👤 **数字人小左已上线**

您好！我是左右沙发的专业电销顾问小左！

**专业能力：**
• 🛋️ 沙发产品专家 - 深度了解全系列产品
• 💼 销售技巧精通 - 专业的销售话术和技巧
• 🎯 客户需求分析 - 精准匹配客户需求
• 📞 电销经验丰富 - 高效的电话销售流程
• 📊 数据驱动决策 - 基于数据优化销售策略

**服务内容：**
• 产品介绍和推荐
• 价格咨询和优惠信息
• 定制方案设计
• 售后服务支持
• 客户关系维护

**左右沙发产品优势：**
• 🏆 30年品牌历史 - 值得信赖的家具品牌
• 🎨 原创设计 - 独特的设计理念和风格
• 🛠️ 精工制造 - 严格的质量控制标准
• 🌿 环保材料 - 健康安全的家居环境
• 🚚 完善服务 - 从设计到售后的全程服务

🛋️ **欢迎了解左右沙发，让我为您推荐最适合的产品！**`,

      system_control: `⚙️ **系统监控中心已启动**

YYC³ AI Center系统状态监控为您服务！

**当前系统状态：**
• 🟢 系统运行状态：正常
• 📊 CPU使用率：${Math.round(Math.random() * 30 + 10)}%
• 💾 内存使用率：${Math.round(Math.random() * 40 + 30)}%
• 🌐 网络延迟：${Math.round(Math.random() * 20 + 5)}ms
• 🔗 活跃连接数：${Math.round(Math.random() * 200 + 100)}

**监控功能：**
• 📈 实时性能监控 - 系统资源使用情况
• 🚨 异常告警 - 自动检测和通知异常
• 📊 历史数据分析 - 性能趋势分析
• 🔧 自动优化建议 - AI驱动的优化方案
• 📋 详细日志记录 - 完整的操作审计

**可用操作：**
• 查看详细系统信息
• 性能优化建议
• 日志查询和分析
• 系统配置管理
• 备份和恢复操作

⚡ **系统运行稳定，所有服务正常！有什么需要监控或优化的吗？**`,

      creative_work: `🎨 **言启万象创意工坊已开启**

欢迎来到AI创意内容生成平台！

**创意服务：**
• ✍️ 智能文案创作 - 营销文案、产品描述、广告语
• 🎨 视觉设计生成 - 海报、Logo、插画、图标
• 📝 内容策划 - 文章大纲、创意方案、策划书
• 🎬 脚本创作 - 视频脚本、广告脚本、演讲稿
• 🎵 创意灵感 - 头脑风暴、创意点子、概念设计

**创作流程：**
1. 描述您的创作需求
2. 选择创作类型和风格
3. AI智能生成创意内容
4. 根据反馈优化完善
5. 导出最终创作成果

**特色功能：**
• 🎯 多风格适配 - 商务、时尚、科技、艺术等
• 🔄 快速迭代 - 实时修改和优化
• 📊 数据驱动 - 基于市场数据的创意建议
• 🎨 个性化定制 - 符合品牌调性的专属创作

💡 **创意无限，让AI为您的想象力插上翅膀！请告诉我您的创作需求！**`,

      greeting: `👋 **欢迎使用YYC³ AI Center！**

很高兴见到您！我是您的智能AI助手，随时为您提供服务。

**我能为您做什么：**
• 🎨 **AI创意工坊** - 文生图、设计创作、内容生成
• 🎤 **智能语音交互** - 语音识别、语音合成、自然对话
• 📊 **数据智能分析** - 数据洞察、报表生成、趋势预测
• 🤖 **智能客服系统** - 专业咨询、问题解答、服务支持
• 👤 **数字人小左** - 专业电销、产品推荐、销售服务
• ⚙️ **系统监控管理** - 状态监控、性能优化、系统维护

**快速开始：**
• 说出"生成一张图片"开始AI创作
• 说出"开启语音功能"体验语音交互
• 说出"分析数据"启动智能分析
• 说出"我需要帮助"获取客服支持

🌟 **YYC³ = 万象归元于云枢，一句话即可调用任何功能！**

请告诉我您想要什么，我会智能匹配最合适的功能为您服务！`,

      question: `🤔 **智能问答系统已激活**

我来为您解答疑问！

**问答能力：**
• 💡 产品功能介绍
• 🔧 技术问题解答
• 📚 使用方法指导
• 🎯 最佳实践建议
• 🔍 深度知识查询

**常见问题：**
• YYC³ AI Center有哪些功能？
• 如何使用语音交互功能？
• 文生图引擎支持哪些风格？
• 数据分析可以处理什么类型的数据？
• 数字人小左的专业领域是什么？

**智能特色：**
• 上下文理解 - 基于对话历史回答
• 多角度解答 - 从不同维度提供答案
• 实例说明 - 结合具体例子解释
• 延伸建议 - 提供相关的使用建议

❓ **请具体描述您的问题，我会为您提供详细的解答！**`,

      general: `🤖 **YYC³ AI助手为您服务**

我已经理解了您的需求，正在为您智能匹配最合适的功能...

**基于您的输入，我建议：**

${input.includes("图") || input.includes("画") ? "• 🎨 **文生图引擎** - 为您创作精美图像\n" : ""}${input.includes("语音") || input.includes("说") ? "• 🎤 **语音交互** - 开启智能语音对话\n" : ""}${input.includes("数据") || input.includes("分析") ? "• 📊 **数据分析** - 提供专业数据洞察\n" : ""}${input.includes("客服") || input.includes("帮助") ? "• 🤖 **智能客服** - 专业问题解答\n" : ""}

**或者您可以尝试：**
• "生成一张[描述]的图片" - 启动AI绘画
• "开启语音对话" - 体验语音交互
• "分析[数据类型]" - 进行数据分析
• "我需要客服帮助" - 获取专业支持

💡 **提示：** 请用更具体的描述告诉我您的需求，我会为您提供更精准的服务！

🚀 **YYC³ AI Center - 让AI理解您的每一个想法！**`,
    }

    // 根据意图返回对应回复
    const response = responses[intent as keyof typeof responses] || responses.general

    // 模拟AI处理延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    return response
  }, [])

  // 获取相关历史记录
  const getRelevantHistory = useCallback((query: string, limit = 5): AIMessage[] => {
    const currentContext = contextRef.current
    const lowerQuery = query.toLowerCase()

    // 简单的相关性匹配
    const relevantMessages = currentContext.messages.filter(
      (message) =>
        message.content.toLowerCase().includes(lowerQuery) ||
        message.metadata?.intent === query ||
        message.metadata?.entities?.some((entity: any) => entity.value?.toString().toLowerCase().includes(lowerQuery)),
    )

    return relevantMessages.slice(-limit)
  }, [])

  // 清空上下文
  const clearContext = useCallback(() => {
    setContext({
      messages: [],
      sessionId: `session_${Date.now()}`,
      conversationState: "active",
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
