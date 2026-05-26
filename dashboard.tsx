"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  Send,
  Upload,
  Settings,
  Zap,
  Brain,
  MessageSquare,
  ImageIcon,
  Sparkles,
  Bot,
  User,
  Palette,
} from "lucide-react"
import { TextToImageGenerator } from "@/text-to-image/text-to-image-generator"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  category?: "chat" | "image" | "customer-service" | "operations"
  imageUrl?: string
  metadata?: any
}

interface ParticleProps {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

const Particle: React.FC<ParticleProps> = ({ x, y, size, opacity }) => (
  <div
    className="absolute rounded-full bg-cyan-400/30 animate-pulse"
    style={{
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: opacity,
    }}
  />
)

const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const createParticles = () => {
      const newParticles: ParticleProps[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
      setParticles(newParticles)
    }

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        })),
      )
      animationRef.current = requestAnimationFrame(animateParticles)
    }

    createParticles()
    animateParticles()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [isStarted, setIsStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isStarted) {
        setIsStarted(true)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isStarted])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      category: activeTab as any,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue, activeTab),
        timestamp: new Date(),
        category: activeTab as any,
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (input: string, category: string): string => {
    const responses = {
      chat: `我理解您的需求："${input}"。作为NEXUS OS智能助手，我可以帮您处理各种任务。您需要我协助什么具体工作吗？`,
      image: `正在为您生成图像："${input}"。请稍候，我将创建符合您描述的高质量图像。`,
      "customer-service": `已收到您的客服需求："${input}"。我将为您提供专业的客户服务解决方案。`,
      operations: `正在分析您的运营需求："${input}"。我将为您制定智能化的客户运营策略。`,
    }
    return responses[category as keyof typeof responses] || responses.chat
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // 这里可以集成语音识别API
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        type: "user",
        content: `已上传文件: ${file.name}`,
        timestamp: new Date(),
        category: "chat",
      }
      setMessages((prev) => [...prev, message])
    }
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />

        <div className="text-center z-10 space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center animate-spin-slow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NEXUS OS
              </h1>
            </div>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">下一代智能操作系统</p>

            <div className="flex items-center justify-center space-x-6 text-slate-400">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI驱动</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>智能对话</span>
              </div>
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>文生图</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-slate-400 text-lg animate-pulse">按任意键开始体验</div>
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col h-screen">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">NEXUS OS</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              AI 在线
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 flex">
          {/* 功能标签页 */}
          <div className="w-80 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700/50 p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 grid-rows-2 gap-1 bg-slate-700/50">
                <TabsTrigger value="chat" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>智能对话</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>文生图</span>
                </TabsTrigger>
                <TabsTrigger value="customer-service" className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>客服系统</span>
                </TabsTrigger>
                <TabsTrigger value="operations" className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>客户运营</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                <TabsContent value="chat" className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-300">智能对话助手</h3>
                  <p className="text-xs text-slate-400">与AI进行自然语言交互，获得智能回答和建议</p>
                </TabsContent>

                <TabsContent value="image" className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-300">AI文生图</h3>
                  <p className="text-xs text-slate-400">通过文字描述生成高质量图像，支持多种风格</p>
                </TabsContent>

                <TabsContent value="customer-service" className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-300">智能客服</h3>
                  <p className="text-xs text-slate-400">家居行业专业客服系统，提供个性化服务</p>
                </TabsContent>

                <TabsContent value="operations" className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-300">客户运营</h3>
                  <p className="text-xs text-slate-400">智能客户生命周期管理和运营策略</p>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* 对话区域 */}
          <div className="flex-1 flex flex-col">
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 mt-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    {activeTab === "chat" && <MessageSquare className="w-8 h-8" />}
                    {activeTab === "image" && <Palette className="w-8 h-8" />}
                    {activeTab === "customer-service" && <Bot className="w-8 h-8" />}
                    {activeTab === "operations" && <Sparkles className="w-8 h-8" />}
                  </div>
                  <p className="text-lg">开始您的AI体验之旅</p>
                  <p className="text-sm mt-2">输入消息或选择功能开始互动</p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-slate-700/50 text-slate-100 backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {message.type === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl || "/placeholder.svg"}
                            alt="Generated"
                            className="mt-2 rounded-lg max-w-full h-auto"
                          />
                        )}
                        <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-slate-300" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="p-4 bg-slate-800/30 backdrop-blur-sm border-t border-slate-700/50">
              {activeTab === "image" && (
                <TextToImageGenerator
                  onImageGenerated={(imageUrl: string) => {
                    const message: Message = {
                      id: Date.now().toString(),
                      type: "ai",
                      content: "图像生成完成！",
                      timestamp: new Date(),
                      category: "image",
                      imageUrl,
                    }
                    setMessages((prev) => [...prev, message])
                  }}
                />
              )}

              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      activeTab === "chat"
                        ? "输入您的问题..."
                        : activeTab === "image"
                          ? "描述您想要生成的图像..."
                          : activeTab === "customer-service"
                            ? "描述客服需求..."
                            : "描述运营需求..."
                    }
                    className="min-h-[60px] bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`border-slate-600/50 ${isListening ? "bg-red-500/20 border-red-500/50" : ""}`}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>

                  <Button variant="outline" size="sm" className="border-slate-600/50 bg-transparent">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4" />
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
