"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedVoiceInterface } from "@/components/enhanced-voice-interface"
import { EnhancedImageGenerator } from "@/components/enhanced-image-generator"
import { useAIContext } from "@/hooks/useAIContext"

type AppState = "splash" | "main"

interface ChatMessage {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  functionCall?: string
  metadata?: any
  imageUrl?: string
  audioUrl?: string
  progress?: number
}

interface SmartSuggestion {
  title: string
  description: string
  icon: string
  action: string
  category: string
}

interface FunctionModule {
  id: string
  name: string
  description: string
  layer: "core" | "business" | "application" | "interaction"
  category: "creative" | "analytics" | "management" | "communication" | "system" | "automation"
  keywords: string[]
  activated: boolean
  status: "ready" | "processing" | "completed" | "error"
}

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  networkLatency: number
  activeConnections: number
  cloudStatus: "connected" | "disconnected" | "syncing"
  uptime: number
}

// 水纹动画组件
const WaterRipple = ({ onClick }: { onClick: () => void }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { id: Date.now(), x, y }
    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 1000)

    setTimeout(() => {
      onClick()
    }, 500)
  }

  return (
    <div
      className="relative w-80 h-80 rounded-full cursor-pointer transition-all duration-500 hover:scale-105"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 70%)
        `,
        border: "2px solid rgba(6, 182, 212, 0.5)",
        boxShadow: `
          0 0 50px rgba(6, 182, 212, 0.3),
          inset 0 0 50px rgba(59, 130, 246, 0.2)
        `,
      }}
    >
      {/* 内部发光圈 */}
      <div className="absolute inset-4 rounded-full border border-cyan-400/30 animate-pulse" />
      <div
        className="absolute inset-8 rounded-full border border-blue-400/20 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute inset-12 rounded-full border border-purple-400/20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* 中心LOGO区域 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            YYC³
          </div>
          <div className="text-sm text-cyan-300 font-medium">点击进入</div>
        </div>
      </div>

      {/* 旋转光环 */}
      <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: "20s" }}>
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1" />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 translate-y-1" />
        <div className="absolute left-0 top-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2 -translate-x-1" />
        <div className="absolute right-0 top-1/2 w-2 h-2 bg-pink-400 rounded-full transform -translate-y-1/2 translate-x-1" />
      </div>

      {/* 水纹效果 */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-4 h-4 border-2 border-cyan-400 rounded-full animate-ping opacity-75" />
          <div
            className="absolute inset-0 w-4 h-4 border border-blue-400 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="absolute inset-0 w-4 h-4 border border-purple-400 rounded-full animate-ping opacity-25"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      ))}

      {/* 悬停效果 */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse" />
      )}
    </div>
  )
}

// 粒子背景组件
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
    }> = []

    const particleCount = 200

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`,
        opacity: Math.random() * 0.8 + 0.2,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // 绘制粒子
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // 连接附近的粒子
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = ((100 - distance) / 100) * 0.2
            ctx.strokeStyle = particle.color
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>("splash")
  const [userInput, setUserInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showVoiceInterface, setShowVoiceInterface] = useState(false)
  const [showImageGenerator, setShowImageGenerator] = useState(false)

  // 文件上传
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  // 图像生成进度
  const [imageGenerationProgress, setImageGenerationProgress] = useState(0)

  // 系统监控
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 18,
    memoryUsage: 42,
    networkLatency: 8,
    activeConnections: 128,
    cloudStatus: "connected",
    uptime: 0,
  })

  // AI上下文管理
  const {
    context,
    addMessage,
    updateContext,
    analyzeIntent,
    generateContextualResponse,
    getRelevantHistory,
    clearContext,
  } = useAIContext()

  // 功能模块系统
  const [functionModules, setFunctionModules] = useState<FunctionModule[]>([
    {
      id: "text-to-image",
      name: "文生图引擎",
      description: "AI文本生成图像创作平台",
      layer: "application",
      category: "creative",
      keywords: ["文生图", "图像生成", "AI绘画", "创意图片", "文本转图像", "AI艺术", "画", "生成图片", "创建图像"],
      activated: false,
      status: "ready",
    },
    {
      id: "digital-human",
      name: "数字人小左",
      description: "左右沙发智能电销数字人",
      layer: "application",
      category: "communication",
      keywords: ["左右沙发", "数字人", "小左", "电销", "沙发销售", "家具"],
      activated: false,
      status: "ready",
    },
    {
      id: "smart-customer-service",
      name: "智能客服",
      description: "全场景AI对话系统",
      layer: "application",
      category: "communication",
      keywords: ["客服", "咨询", "服务", "对话", "话术", "沟通"],
      activated: false,
      status: "ready",
    },
    {
      id: "creative-workshop",
      name: "言启万象",
      description: "AI创意内容生成平台",
      layer: "application",
      category: "creative",
      keywords: ["创意", "设计", "文案", "图片", "视频", "创作"],
      activated: false,
      status: "ready",
    },
    {
      id: "data-cube",
      name: "数据魔方",
      description: "智能数据分析系统",
      layer: "business",
      category: "analytics",
      keywords: ["数据", "分析", "报表", "统计", "可视化"],
      activated: false,
      status: "ready",
    },
    {
      id: "customer-management",
      name: "客资系统",
      description: "客户资源管理平台",
      layer: "business",
      category: "management",
      keywords: ["客户", "CRM", "管理", "客资"],
      activated: false,
      status: "ready",
    },
    {
      id: "customer-operations",
      name: "智能客户运维",
      description: "家居整装行业客户全生命周期管理系统",
      layer: "business",
      category: "management",
      keywords: ["客户运维", "生命周期", "家居整装", "运营管理", "智能运维"],
      activated: false,
      status: "ready",
    },
    {
      id: "smart-forms",
      name: "智能表单系统",
      description: "AI驱动的智能表单创建、分析与管理平台",
      layer: "application",
      category: "automation",
      keywords: ["智能表单", "表单系统", "AI表单", "数据收集", "表单分析"],
      activated: false,
      status: "ready",
    },
    {
      id: "yanyu-cloud",
      name: "言语云平台",
      description: "YYC³ AI Center云端智能服务平台",
      layer: "core",
      category: "system",
      keywords: ["言语云", "云平台", "YYC", "云服务", "AI中心"],
      activated: true,
      status: "ready",
    },
    {
      id: "system-monitor",
      name: "系统监控",
      description: "实时系统状态监控",
      layer: "core",
      category: "system",
      keywords: ["系统", "监控", "状态", "性能"],
      activated: true,
      status: "ready",
    },
  ])

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [scrollPosition, setScrollPosition] = useState(0)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const scrollTop = chatContainerRef.current.scrollTop
        setScrollPosition(scrollTop)
      }
    }

    const container = chatContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const calculateOpacity = useCallback(
    (baseOpacity: number, scrollFactor = 0.0001) => {
      const opacity = Math.max(baseOpacity - scrollPosition * scrollFactor, baseOpacity * 0.7)
      return opacity
    },
    [scrollPosition],
  )

  // 系统初始化函数
  const initializeSystem = useCallback(() => {
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: "ai",
        content: `🌟 **YYC³ AI Center** 万象归元于云枢

**深栈智启新纪元** - 未来智能操作系统已成功启动！

🎯 **无边界智能交互设计**
所有功能均通过AI聊天交互操作，无需复杂界面，一句话即可调用任何功能！

🏗️ **YYC³ 分层架构设计：**

**☁️ 云枢核心层 (YanYu Cloud Core)**
• 言语云平台 - 云端AI智能服务中心
• AI引擎 - 智能决策与深度学习
• 系统监控 - 实时状态管理
• 安全防护 - 数据保护机制

**💼 业务智能层 (Business Intelligence)**
• 数据魔方 - 智能分析引擎
• 客资系统 - 客户关系管理
• 智能客户运维 - 全生命周期管理

**🎯 应用服务层 (Application Services)**
• 言启万象 - AI创意工坊
• 智能客服 - 全场景对话
• 数字人小左 - 专业电销顾问
• 智能表单系统 - AI驱动数据收集
• 文生图引擎 - AI图像创作平台

**🎨 交互体验层 (Interaction Experience)**
• 语音交互 - 自然语言处理
• 文件处理 - 多格式支持
• 智能推荐 - 个性化建议

💡 **万象归元交互方式（一句话调用）：**

**🎨 创意类功能：**
• "生成一张现代简约风格的客厅图片"
• "创建一个营销文案"
• "设计一个产品海报"
• "制作一个视频脚本"

**📊 分析类功能：**
• "分析这个月的销售数据"
• "生成客户满意度报告"
• "制作数据可视化图表"
• "预测下季度业绩"

**👥 管理类功能：**
• "查看客户信息"
• "创建客户档案"
• "安排跟进任务"
• "生成客户报表"

**🤖 沟通类功能：**
• "启动智能客服"
• "开始语音对话"
• "连接数字人小左"
• "生成客服话术"

**⚙️ 系统类功能：**
• "查看系统状态"
• "监控性能指标"
• "备份数据"
• "优化系统"

**🔄 自动化功能：**
• "创建智能表单"
• "设置自动回复"
• "配置工作流程"
• "批量处理数据"

🚀 **深栈智启特色：**
• 🌐 云原生架构 - 弹性扩展，无限可能
• 🧠 深度学习 - AI驱动，智能进化
• 🔗 万象归元 - 功能融合，协同增效
• ⚡ 实时响应 - 毫秒级交互体验
• 🛡️ 安全可信 - 企业级安全保障
• 🎯 无边界设计 - 一句话调用所有功能

🆕 **YYC³ 新纪元功能：**
• 真实语音交互 - 支持语音识别和语音合成
• 智能上下文记忆 - AI理解能力大幅提升
• 高质量图像生成 - 文生图引擎全面升级
• 个性化体验 - 基于用户偏好的智能推荐
• 无边界操作 - 所有功能通过对话调用

🎊 **欢迎进入YYC³ AI Center时代！**

📋 **快速体验指南（直接对话即可）：**

**🎤 语音交互测试：**
• "开启语音功能"
• "我想用语音对话"
• "启动语音助手"

**🎨 文生图创作：**
• "生成一张[详细描述]的图片"
• "创作一幅[风格][主题]的画作"
• "制作一个[用途]的设计图"

**🧠 智能对话：**
• "帮我分析一下..."
• "我需要制作..."
• "请协助我..."

**🔍 功能探索：**
• "显示所有功能"
• "我能做什么"
• "系统有哪些能力"

**💡 智能建议：**
• "给我一些创意建议"
• "推荐适合的功能"
• "优化我的工作流程"

🌟 **无边界智能体验 - 想到即可说到，说到即可做到！**

所有功能都已真实实现，开启您的智能之旅！直接告诉我您想要什么，我会智能匹配最合适的功能为您服务！`,
        timestamp: new Date(),
      }

      setChatMessages([welcomeMessage])
      addMessage({
        type: "ai",
        content: welcomeMessage.content,
        metadata: { intent: "welcome", confidence: 1.0 },
      })
    }, 800)
  }, [addMessage])

  // 系统监控更新
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(5, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLatency: Math.max(1, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 5)),
        activeConnections: Math.max(50, Math.min(500, prev.activeConnections + Math.floor((Math.random() - 0.5) * 20))),
        uptime: prev.uptime + 1,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // 智能建议生成
  const generateSmartSuggestions = useCallback(
    (input: string) => {
      const suggestions: SmartSuggestion[] = []
      const lowerInput = input.toLowerCase()

      // 创意类建议
      if (
        lowerInput.includes("图") ||
        lowerInput.includes("画") ||
        lowerInput.includes("生成") ||
        lowerInput.includes("创作")
      ) {
        suggestions.push({
          title: "🎨 启动文生图引擎",
          description: "AI图像创作平台",
          icon: "🎨",
          action: "生成一张现代简约风格的客厅图片",
          category: "creative",
        })
      }

      // 沟通类建议
      if (lowerInput.includes("客服") || lowerInput.includes("咨询") || lowerInput.includes("对话")) {
        suggestions.push({
          title: "🤖 智能客服系统",
          description: "全场景AI对话",
          icon: "🤖",
          action: "启动智能客服系统",
          category: "communication",
        })
      }

      // 分析类建议
      if (lowerInput.includes("数据") || lowerInput.includes("分析") || lowerInput.includes("报表")) {
        suggestions.push({
          title: "📊 数据魔方分析",
          description: "智能数据洞察",
          icon: "📊",
          action: "分析客户数据并生成报表",
          category: "analytics",
        })
      }

      // 语音类建议
      if (lowerInput.includes("语音") || lowerInput.includes("说话") || lowerInput.includes("声音")) {
        suggestions.push({
          title: "🎤 语音交互系统",
          description: "自然语言对话",
          icon: "🎤",
          action: "开启语音交互功能",
          category: "interaction",
        })
      }

      // 数字人建议
      if (lowerInput.includes("小左") || lowerInput.includes("沙发") || lowerInput.includes("数字人")) {
        suggestions.push({
          title: "👤 数字人小左",
          description: "专业电销顾问",
          icon: "👤",
          action: "启动数字人小左",
          category: "communication",
        })
      }

      // 表单类建议
      if (lowerInput.includes("表单") || lowerInput.includes("收集") || lowerInput.includes("调查")) {
        suggestions.push({
          title: "📝 智能表单系统",
          description: "AI驱动数据收集",
          icon: "📝",
          action: "创建智能表单",
          category: "automation",
        })
      }

      // 客户管理建议
      if (lowerInput.includes("客户") || lowerInput.includes("CRM") || lowerInput.includes("管理")) {
        suggestions.push({
          title: "👥 客户管理系统",
          description: "客户关系管理",
          icon: "👥",
          action: "查看客户管理系统",
          category: "management",
        })
      }

      // 系统类建议
      if (lowerInput.includes("系统") || lowerInput.includes("监控") || lowerInput.includes("状态")) {
        suggestions.push({
          title: "⚙️ 系统监控",
          description: "实时状态监控",
          icon: "⚙️",
          action: "显示系统监控状态",
          category: "system",
        })
      }

      // 如果没有匹配的建议，提供通用建议
      if (suggestions.length === 0) {
        suggestions.push(
          {
            title: "🎨 AI创意工坊",
            description: "文生图、设计、创作",
            icon: "🎨",
            action: "生成一张专业的产品展示图片",
            category: "creative",
          },
          {
            title: "🎤 语音助手",
            description: "开启语音对话",
            icon: "🎤",
            action: "开启语音交互功能",
            category: "interaction",
          },
          {
            title: "📊 智能分析",
            description: "数据洞察服务",
            icon: "📊",
            action: "分析业务数据趋势",
            category: "analytics",
          },
          {
            title: "🤖 智能客服",
            description: "专业对话服务",
            icon: "🤖",
            action: "启动智能客服系统",
            category: "communication",
          },
        )
      }

      setSmartSuggestions(suggestions.slice(0, 6))
      setShowSuggestions(true)
    },
    [setSmartSuggestions, setShowSuggestions],
  )

  // 智能功能匹配
  const matchFunction = useCallback(
    (input: string): FunctionModule | null => {
      const lowerInput = input.toLowerCase()

      for (const module of functionModules) {
        if (module.keywords.some((keyword) => lowerInput.includes(keyword.toLowerCase()))) {
          return module
        }
      }

      return null
    },
    [functionModules],
  )

  // 处理用户输入
  const handleUserInput = useCallback(
    async (input: string, confidence = 1.0) => {
      if (!input.trim()) return

      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        type: "user",
        content: input,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, userMessage])
      addMessage({
        type: "user",
        content: input,
        metadata: { confidence },
      })

      setIsTyping(true)
      setShowSuggestions(false)

      try {
        // 意图分析
        const intentResult = await analyzeIntent(input)

        // 功能匹配
        const matchedFunction = matchFunction(input)

        // 生成智能建议
        generateSmartSuggestions(input)

        // 特殊功能处理
        const lowerInput = input.toLowerCase()

        // 检查是否需要显示特殊界面
        if (
          (lowerInput.includes("图") || lowerInput.includes("画") || lowerInput.includes("生成")) &&
          (lowerInput.includes("图片") || lowerInput.includes("图像") || lowerInput.includes("画作"))
        ) {
          setShowImageGenerator(true)
        }

        if (
          lowerInput.includes("语音") &&
          (lowerInput.includes("开启") || lowerInput.includes("启动") || lowerInput.includes("测试"))
        ) {
          setShowVoiceInterface(true)
        }

        // 生成上下文回复
        const response = await generateContextualResponse(input, intentResult.intent)

        // 功能激活处理
        if (matchedFunction) {
          setFunctionModules((prev) =>
            prev.map((module) =>
              module.id === matchedFunction.id ? { ...module, activated: true, status: "processing" } : module,
            ),
          )

          setTimeout(() => {
            setFunctionModules((prev) =>
              prev.map((module) => (module.id === matchedFunction.id ? { ...module, status: "completed" } : module)),
            )
          }, 2000)
        }

        // 添加AI回复
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: `msg_${Date.now()}_ai`,
            type: "ai",
            content: response,
            timestamp: new Date(),
            functionCall: matchedFunction?.name,
            metadata: {
              intent: intentResult.intent,
              confidence: intentResult.confidence,
              entities: intentResult.entities,
              sentiment: intentResult.sentiment,
            },
          }

          setChatMessages((prev) => [...prev, aiMessage])
          addMessage({
            type: "ai",
            content: response,
            metadata: aiMessage.metadata,
          })

          setIsTyping(false)
        }, 1500)
      } catch (error) {
        console.error("处理用户输入时出错:", error)
        setIsTyping(false)
      }
    },
    [addMessage, analyzeIntent, generateContextualResponse, generateSmartSuggestions, matchFunction],
  )

  // 处理发送消息
  const handleSendMessage = useCallback(() => {
    if (userInput.trim()) {
      handleUserInput(userInput)
      setUserInput("")
    }
  }, [userInput, handleUserInput])

  // 处理语音输入
  const handleVoiceInput = useCallback(
    (text: string, confidence: number) => {
      handleUserInput(text, confidence)
    },
    [handleUserInput],
  )

  // 处理语音输出
  const handleVoiceOutput = useCallback((text: string) => {
    console.log("语音输出:", text)
  }, [])

  // 处理图像生成
  const handleImageGenerated = useCallback(
    (result: any) => {
      const imageMessage: ChatMessage = {
        id: `msg_${Date.now()}_image`,
        type: "ai",
        content: `🎨 **图像生成完成**

**创作详情：**
• **提示词：** ${result.prompt}
• **艺术风格：** ${result.style}
• **图像尺寸：** ${result.metadata.size}
• **生成质量：** ${result.metadata.quality}
• **生成步数：** ${result.metadata.steps}步
• **随机种子：** ${result.metadata.seed}
• **完成时间：** ${new Date().toLocaleTimeString()}

您的专属AI艺术作品已完成！可以下载保存或继续创作变体。`,
        timestamp: new Date(),
        imageUrl: result.url,
        functionCall: "文生图引擎",
      }

      setChatMessages((prev) => [...prev, imageMessage])
      addMessage({
        type: "ai",
        content: imageMessage.content,
        metadata: { functionCall: "text-to-image", imageGenerated: true },
      })
    },
    [addMessage],
  )

  // 处理建议点击
  const handleSuggestionClick = useCallback(
    (suggestion: SmartSuggestion) => {
      handleUserInput(suggestion.action)
      setShowSuggestions(false)
    },
    [handleUserInput],
  )

  // 文件上传处理
  const handleFileUpload = useCallback((files: FileList) => {
    const fileArray = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...fileArray])

    // 模拟上传进度
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => setUploadProgress(0), 1000)
      }
    }, 200)

    // 添加文件上传消息
    const fileMessage: ChatMessage = {
      id: `msg_${Date.now()}_file`,
      type: "system",
      content: `📁 **文件上传完成**

**上传文件列表：**
${fileArray.map((file, index) => `${index + 1}. **${file.name}** (${(file.size / 1024 / 1024).toFixed(2)} MB)`).join("\n")}

**文件处理建议：**
• 图片文件：可用于AI图像分析、风格提取
• 文档文件：可进行内容分析、摘要生成
• 数据文件：可进行数据分析、可视化处理

请告诉我您希望如何处理这些文件，我会为您提供相应的智能服务！`,
      timestamp: new Date(),
    }

    setTimeout(() => {
      setChatMessages((prev) => [...prev, fileMessage])
    }, 2000)
  }, [])

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // 进入主界面
  const handleEnterMain = useCallback(() => {
    setAppState("main")
    initializeSystem()
  }, [initializeSystem])

  // 首页启动画面
  if (appState === "splash") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />

        <div className="relative z-10 text-center space-y-12 max-w-6xl mx-auto px-6">
          {/* 主标题区域 */}
          <div className="space-y-6">
            <div className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              YYC³
            </div>
            <div className="text-3xl md:text-5xl text-white font-light tracking-wider">AI Center</div>
          </div>

          {/* 核心理念 */}
          <div className="space-y-4">
            <div className="text-2xl md:text-3xl text-cyan-300 font-bold animate-bounce">万象归元于云枢</div>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
            <div className="text-xl md:text-2xl text-blue-200 font-semibold">深栈智启新纪元</div>
          </div>

          {/* 水纹动画圈 */}
          <div className="flex justify-center">
            <WaterRipple onClick={handleEnterMain} />
          </div>

          {/* 功能特色展示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎨</div>
              <div className="text-sm text-slate-300">AI创意工坊</div>
              <div className="text-xs text-slate-400">文生图·设计·创作</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl">📊</div>
              <div className="text-sm text-slate-300">智能数据分析</div>
              <div className="text-xs text-slate-400">洞察·预测·决策</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl">👥</div>
              <div className="text-sm text-slate-300">客户管理</div>
              <div className="text-xs text-slate-400">CRM·运维·服务</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl">🤖</div>
              <div className="text-sm text-slate-300">智能对话</div>
              <div className="text-xs text-slate-400">语音·文本·交互</div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="space-y-3">
            <div className="text-slate-400 text-base">YanYu Cloud Cube - 言语云立方体</div>
            <div className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
              融合AI创意、智能分析、客户管理于一体的未来智能操作系统
              <br />
              所有功能均通过AI聊天交互操作，一句话即可调用任何功能
            </div>
            <div className="text-cyan-400 text-lg font-semibold animate-pulse">点击中心圆圈开始体验</div>
          </div>
        </div>

        {/* 装饰性光效 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    )
  }

  // 主界面 - 完全无边界设计
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col h-screen">
        <div
          className="bg-black/20 backdrop-blur-md border-b border-white/10 p-3 transition-all duration-300"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${calculateOpacity(0.2)})`,
            backdropFilter: `blur(${12 + scrollPosition * 0.01}px)`,
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                YYC³ AI Center
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                智能运行中
              </Badge>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-slate-400">
                  CPU: <span className="text-cyan-300">{systemMetrics.cpuUsage.toFixed(1)}%</span>
                </span>
                <span className="text-slate-400">
                  延迟: <span className="text-green-300">{systemMetrics.networkLatency}ms</span>
                </span>
                <span className="text-slate-400">
                  连接: <span className="text-purple-300">{systemMetrics.activeConnections}</span>
                </span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">☁️ 云端已连接</Badge>
            </div>
          </div>
        </div>

        {/* 主要聊天区域 - 完全无边界 */}
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(59, 130, 246, 0.5) rgba(0, 0, 0, 0.2)",
            }}
          >
            {chatMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-4xl p-6 rounded-2xl backdrop-blur-md transition-all duration-300 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-50"
                      : message.type === "ai"
                        ? "bg-black/30 border border-white/20 text-slate-50"
                        : "bg-slate-600/20 border border-slate-500/20 text-slate-200"
                  }`}
                  style={{
                    backgroundColor:
                      message.type === "user"
                        ? `rgba(6, 182, 212, ${calculateOpacity(0.2, 0.00005)})`
                        : message.type === "ai"
                          ? `rgba(0, 0, 0, ${calculateOpacity(0.3, 0.00005)})`
                          : `rgba(71, 85, 105, ${calculateOpacity(0.2, 0.00005)})`,
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">
                      {message.type === "user" ? "👤" : message.type === "ai" ? "🤖" : "⚙️"}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</div>
                      </div>

                      {message.imageUrl && (
                        <div className="mt-4">
                          <img
                            src={message.imageUrl || "/placeholder.svg"}
                            alt="AI生成的图像"
                            className="max-w-lg rounded-xl border border-white/20 shadow-2xl"
                          />
                          <div className="mt-3 flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              onClick={() => {
                                const link = document.createElement("a")
                                link.href = message.imageUrl!
                                link.download = `YYC3_AI_Generated_${Date.now()}.png`
                                link.click()
                              }}
                            >
                              📥 下载图像
                            </Button>
                            <Button
                              size="sm"
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              onClick={() => setUserInput("基于这张图片生成一个类似风格的变体")}
                            >
                              🎨 生成变体
                            </Button>
                          </div>
                        </div>
                      )}

                      {message.functionCall && (
                        <div className="mt-3">
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            🔧 {message.functionCall}
                          </Badge>
                        </div>
                      )}

                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.metadata?.confidence && (
                          <span>置信度: {Math.round(message.metadata.confidence * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-black/30 border border-white/20 p-6 rounded-2xl backdrop-blur-md">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">🤖</div>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-slate-300">AI正在智能分析并生成回复...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && smartSuggestions.length > 0 && (
            <div
              className="p-4 backdrop-blur-md border-t border-white/10 transition-all duration-300"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${calculateOpacity(0.2)})`,
              }}
            >
              <div className="text-sm text-slate-300 mb-3 flex items-center">
                <span className="text-lg mr-2">💡</span>
                <span>智能建议 - 点击快速执行</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {smartSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="h-auto p-4 border-white/20 bg-white/5 text-slate-200 hover:bg-white/10 backdrop-blur-md rounded-xl"
                  >
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{suggestion.icon}</div>
                      <div className="font-medium text-xs">{suggestion.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-2">{suggestion.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div
            className="p-4 backdrop-blur-md border-t border-white/10 transition-all duration-300"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${calculateOpacity(0.2)})`,
            }}
          >
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="💬 与YYC³ AI Center对话... 一句话调用任何功能！例如：'生成一张现代客厅图片'、'开启语音对话'、'分析数据'等"
                  className="min-h-[80px] bg-black/30 border-white/20 text-slate-100 placeholder-slate-400 resize-none backdrop-blur-md rounded-xl text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                {/* 文件上传 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-white/20 bg-white/5 text-slate-300 hover:bg-white/10 backdrop-blur-md rounded-xl"
                  title="上传文件"
                >
                  📎
                </Button>

                {/* 发送按钮 */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl px-6 py-3"
                  title="发送消息"
                >
                  <div className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>发送</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* 上传进度 */}
            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                  <span>📁 文件上传中...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 已上传文件 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <Badge key={index} className="bg-white/10 text-slate-300 border-white/20 backdrop-blur-md">
                    📄 {file.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* 快速操作提示 */}
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <span>💡 快速体验:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserInput("开启语音交互功能")}
                  className="text-xs text-slate-400 hover:text-slate-200 h-6"
                >
                  🎤 语音对话
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserInput("生成一张现代科技风格的办公室图片")}
                  className="text-xs text-slate-400 hover:text-slate-200 h-6"
                >
                  🎨 AI绘画
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserInput("显示所有可用功能")}
                  className="text-xs text-slate-400 hover:text-slate-200 h-6"
                >
                  ❓ 功能列表
                </Button>
              </div>
              <div className="text-slate-500">Enter发送 • Shift+Enter换行</div>
            </div>
          </div>
        </div>

        {showVoiceInterface && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div
              className="backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-in slide-in-from-bottom-8 duration-500"
              style={{
                backgroundColor: `rgba(0, 0, 0, 0.4)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-slate-100 flex items-center">
                  <span className="text-3xl mr-3">🎤</span>
                  智能语音交互系统
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoiceInterface(false)}
                  className="border-white/20 bg-white/10 text-slate-300 hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  ✕ 关闭
                </Button>
              </div>
              <EnhancedVoiceInterface
                onVoiceInput={handleVoiceInput}
                onVoiceOutput={handleVoiceOutput}
                autoSpeak={true}
              />
            </div>
          </div>
        )}

        {showImageGenerator && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div
              className="backdrop-blur-xl rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-in slide-in-from-bottom-8 duration-500"
              style={{
                backgroundColor: `rgba(0, 0, 0, 0.4)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-slate-100 flex items-center">
                  <span className="text-3xl mr-3">🎨</span>
                  AI文生图创作引擎
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageGenerator(false)}
                  className="border-white/20 bg-white/10 text-slate-300 hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  ✕ 关闭
                </Button>
              </div>
              <EnhancedImageGenerator
                onImageGenerated={handleImageGenerated}
                onProgressUpdate={setImageGenerationProgress}
              />
            </div>
          </div>
        )}

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />
      </div>
    </div>
  )
}
