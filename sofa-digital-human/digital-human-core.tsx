"use client"

import { useState, useEffect } from "react"
import {
  Sofa,
  Brain,
  Heart,
  Target,
  Shield,
  Mic,
  Volume2,
  Phone,
  MessageSquare,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  Clock,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DigitalHumanPersonality {
  mode: "professional" | "friendly" | "premium"
  voiceSpeed: number
  emotionalTone: string
  currentEmotion: "neutral" | "excited" | "empathetic" | "confident"
}

interface CustomerProfile {
  id: string
  name: string
  type: "A类客户" | "B类客户" | "C类客户"
  scenario: "新房装修" | "旧房改造" | "父母孝心" | "换新升级"
  emotionalState: "兴奋积极" | "冷淡抗拒" | "焦虑犹豫" | "愤怒不满" | "中性"
  intentLevel: number
  budget: string
  concerns: string[]
  decisionFactors: string[]
}

interface ScriptTemplate {
  id: string
  name: string
  category: "开场话术" | "情景应对" | "异议处理" | "成交促进" | "情感共鸣"
  scenario: string
  content: string
  successRate: number
  emotionalTone: string
}

export default function DigitalHumanCore() {
  const [digitalHuman, setDigitalHuman] = useState<DigitalHumanPersonality>({
    mode: "friendly",
    voiceSpeed: 190,
    emotionalTone: "温和亲切",
    currentEmotion: "neutral",
  })

  const [currentCustomer] = useState<CustomerProfile>({
    id: "CUST_001",
    name: "张先生",
    type: "A类客户",
    scenario: "新房装修",
    emotionalState: "兴奋积极",
    intentLevel: 75,
    budget: "2-3万",
    concerns: ["质量担心", "价格考虑"],
    decisionFactors: ["舒适度", "品质", "性价比"],
  })

  const [isActive, setIsActive] = useState(false)
  const [currentScript, setCurrentScript] = useState<ScriptTemplate | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    callDuration: 0,
    emotionScore: 85,
    intentImprovement: 15,
    scriptEffectiveness: 92,
  })

  // 智能话术库
  const scriptTemplates: ScriptTemplate[] = [
    {
      id: "opening_new_house",
      name: "新房装修专业开场",
      category: "开场话术",
      scenario: "新房装修",
      content: `您好，我是左右沙发的专属数字顾问小左。恭喜您有了新家！🏡

我刚刚通过AI分析了您的需求，作为一个也经历过装修的智能顾问，我特别理解新房装修时既兴奋又纠结的心情。

根据我们服务过的8万多个新房装修家庭的大数据分析，我发现大家在选沙发时最关心三个问题：

1️⃣ **风格搭配** - 怎样选择与装修风格匹配的沙发
2️⃣ **尺寸规划** - 如何在有限空间里摆放得既美观又实用  
3️⃣ **预算分配** - 怎样在预算内买到最满意的产品

基于AI智能分析，我已经为您准备了3套个性化方案。您现在装修到什么阶段了？`,
      successRate: 68.5,
      emotionalTone: "专业温暖",
    },
    {
      id: "objection_price",
      name: "价格异议智能化解",
      category: "异议处理",
      scenario: "价格敏感",
      content: `我完全理解您对价格的关注，这说明您是一个理性的消费者。

让我用AI大数据为您分析真正的价值：

💡 **什么是真正的'贵'？**
• 便宜沙发：5000元，用3年 = 每年1667元
• 左右沙发：15000元，用15年 = 每年1000元

📊 **10万+客户数据显示：**
• 选择便宜沙发的客户，平均3.2年更换一次
• 选择左右沙发的客户，平均使用15.8年

🎯 **而且我们有智能解决方案：**
• 12期0利息分期，每月只需1250元
• AI推荐的以旧换新，最高抵扣3000元
• 智能优惠匹配，为您争取最大优惠

真正的智慧不是买最便宜的，而是买最值得的。您说呢？`,
      successRate: 76.3,
      emotionalTone: "理性说服",
    },
    {
      id: "emotional_family",
      name: "家庭情感共鸣话术",
      category: "情感共鸣",
      scenario: "家庭温馨",
      content: `让我为您描绘一个AI预测的美好生活场景：

🌅 **周末的早晨**，阳光透过窗帘洒在客厅里，您和爱人坐在舒适的左右沙发上，一起喝着咖啡，聊着这一周的趣事。孩子在旁边的地毯上玩着积木，偶尔跑过来在您们中间挤一挤。

🎬 **晚饭后**，全家人窝在沙发上看电影。您搂着爱人，孩子靠在您的怀里，这种简单的幸福，就是生活最美好的样子。

👥 **朋友来访时**，大家围坐在宽敞舒适的沙发上，谈笑风生。朋友们都夸您的沙发舒服，夸您的家温馨，那种被认可的满足感，特别美好。

根据我们的客户反馈数据，97.8%的家庭都实现了这样的美好场景。

一款好沙发承载的不仅仅是身体的舒适，更是情感的寄托，是家庭记忆的载体。

这样的价值，您觉得珍贵吗？`,
      successRate: 89.2,
      emotionalTone: "温暖感人",
    },
  ]

  // 智能情绪识别与适应
  const adaptToCustomerEmotion = (emotion: string) => {
    switch (emotion) {
      case "兴奋积极":
        setDigitalHuman((prev) => ({
          ...prev,
          currentEmotion: "excited",
          voiceSpeed: 200,
          emotionalTone: "热情洋溢",
        }))
        break
      case "冷淡抗拒":
        setDigitalHuman((prev) => ({
          ...prev,
          currentEmotion: "empathetic",
          voiceSpeed: 170,
          emotionalTone: "温和耐心",
        }))
        break
      case "焦虑犹豫":
        setDigitalHuman((prev) => ({
          ...prev,
          currentEmotion: "confident",
          voiceSpeed: 160,
          emotionalTone: "稳重安心",
        }))
        break
      default:
        setDigitalHuman((prev) => ({
          ...prev,
          currentEmotion: "neutral",
          voiceSpeed: 180,
          emotionalTone: "专业友好",
        }))
    }
  }

  // 智能话术推荐
  const getRecommendedScript = (customer: CustomerProfile): ScriptTemplate => {
    if (customer.scenario === "新房装修") {
      return scriptTemplates[0]!
    }
    if (customer.concerns.includes("价格考虑")) {
      return scriptTemplates[1]!
    }
    return scriptTemplates[2]!
  }

  // 实时数据更新
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setRealTimeMetrics((prev) => ({
          callDuration: prev.callDuration + 1,
          emotionScore: Math.min(100, prev.emotionScore + Math.random() * 2 - 1),
          intentImprovement: Math.min(50, prev.intentImprovement + Math.random() * 1),
          scriptEffectiveness: Math.min(100, prev.scriptEffectiveness + Math.random() * 1 - 0.5),
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isActive])

  // 启动数字人
  const activateDigitalHuman = () => {
    setIsActive(true)
    adaptToCustomerEmotion(currentCustomer.emotionalState)
    setCurrentScript(getRecommendedScript(currentCustomer))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 - 数字人状态 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Sofa className="h-10 w-10 text-white" />
                </div>
                {isActive && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse border-2 border-slate-900"></div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  数字人小左
                </h1>
                <p className="text-slate-400">左右沙发专属智能顾问 · 真实为基·专业为核·情感为辅·心理为伴</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                    {digitalHuman.emotionalTone}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                    语速: {digitalHuman.voiceSpeed}字/分钟
                  </Badge>
                  <Badge
                    className={`${
                      isActive
                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                        : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                    }`}
                  >
                    {isActive ? "服务中" : "待机中"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isActive ? (
                <Button onClick={activateDigitalHuman} className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="mr-2 h-5 w-5" />
                  启动数字人
                </Button>
              ) : (
                <Button onClick={() => setIsActive(false)} variant="outline" className="border-red-500 text-red-400">
                  <Phone className="mr-2 h-5 w-5" />
                  结束服务
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左侧 - 客户画像与实时数据 */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* 客户画像 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  智能客户画像
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">客户姓名</span>
                    <span className="text-sm text-slate-200">{currentCustomer.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">客户类型</span>
                    <Badge
                      className={`text-xs ${
                        currentCustomer.type === "A类客户"
                          ? "bg-red-500/20 text-red-400 border-red-500/50"
                          : currentCustomer.type === "B类客户"
                            ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                      }`}
                    >
                      {currentCustomer.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">应用场景</span>
                    <Badge variant="outline" className="bg-slate-800/50 text-xs">
                      {currentCustomer.scenario}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">情绪状态</span>
                    <Badge
                      className={`text-xs ${
                        currentCustomer.emotionalState === "兴奋积极"
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : currentCustomer.emotionalState === "冷淡抗拒"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                            : currentCustomer.emotionalState === "焦虑犹豫"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                              : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                      }`}
                    >
                      {currentCustomer.emotionalState}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">购买意向</span>
                      <span className="text-sm text-slate-200">{currentCustomer.intentLevel}%</span>
                    </div>
                    <Progress value={currentCustomer.intentLevel} className="h-2" />
                  </div>
                  <div>
                    <span className="text-sm text-slate-400 block mb-2">关注要点</span>
                    <div className="flex flex-wrap gap-1">
                      {currentCustomer.decisionFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-slate-800/50">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 实时数据监控 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
                  实时数据监控
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-slate-400">通话时长</span>
                    </div>
                    <span className="text-lg font-bold text-blue-400">{formatTime(realTimeMetrics.callDuration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-slate-400">情感评分</span>
                    </div>
                    <span className="text-lg font-bold text-red-400">{realTimeMetrics.emotionScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-slate-400">意向提升</span>
                    </div>
                    <span className="text-lg font-bold text-green-400">+{realTimeMetrics.intentImprovement}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-slate-400">话术效果</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">
                      {realTimeMetrics.scriptEffectiveness.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 核心理念展示 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Award className="mr-2 h-5 w-5 text-purple-500" />
                  核心理念
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-slate-800/30">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-200">真实为基</div>
                      <div className="text-xs text-slate-400">10万+真实客户数据驱动</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-slate-800/30">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-200">专业为核</div>
                      <div className="text-xs text-slate-400">37年行业经验沉淀</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-slate-800/30">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-200">情感为辅</div>
                      <div className="text-xs text-slate-400">温度化沟通体验</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-slate-800/30">
                    <Target className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-200">心理为伴</div>
                      <div className="text-xs text-slate-400">深层心理洞察</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 中间 - 数字人交互界面 */}
          <div className="col-span-12 lg:col-span-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-[800px] flex flex-col">
              <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MessageSquare className="mr-2 h-6 w-6 text-cyan-500" />
                    数字人小左 - 智能对话
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                      {digitalHuman.mode === "professional"
                        ? "专业顾问模式"
                        : digitalHuman.mode === "friendly"
                          ? "贴心朋友模式"
                          : "高端服务模式"}
                    </Badge>
                    {isActive && (
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                          <Mic className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-6">
                {!isActive ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <Avatar className="w-32 h-32 border-4 border-purple-500/30">
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl">
                            小左
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 p-2 bg-slate-800 rounded-full border-2 border-slate-700">
                          <Sofa className="h-4 w-4 text-purple-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-200 mb-2">数字人小左待机中</h3>
                      <p className="text-slate-400 mb-6">
                        我是左右沙发的专属智能顾问，拥有37年行业经验沉淀
                        <br />
                        基于10万+真实客户数据，为您提供最专业的服务
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-800/30 rounded-lg p-3">
                          <div className="text-purple-400 font-medium mb-1">智能识别</div>
                          <div className="text-slate-400">情绪·意图·需求</div>
                        </div>
                        <div className="bg-slate-800/30 rounded-lg p-3">
                          <div className="text-blue-400 font-medium mb-1">个性化服务</div>
                          <div className="text-slate-400">千人千面定制</div>
                        </div>
                        <div className="bg-slate-800/30 rounded-lg p-3">
                          <div className="text-green-400 font-medium mb-1">情感共鸣</div>
                          <div className="text-slate-400">温度化沟通</div>
                        </div>
                        <div className="bg-slate-800/30 rounded-lg p-3">
                          <div className="text-yellow-400 font-medium mb-1">专业权威</div>
                          <div className="text-slate-400">数据驱动决策</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* 数字人头像和状态 */}
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-slate-800/30 rounded-lg">
                      <div className="relative">
                        <Avatar className="w-16 h-16 border-2 border-purple-500/50">
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            小左
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse border-2 border-slate-900"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-medium text-slate-200">数字人小左</h4>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">在线服务</Badge>
                        </div>
                        <div className="text-sm text-slate-400">正在为 {currentCustomer.name} 提供专业咨询服务</div>
                        <div className="flex items-center space-x-4 mt-2 text-xs">
                          <span className="text-purple-400">语调: {digitalHuman.emotionalTone}</span>
                          <span className="text-blue-400">语速: {digitalHuman.voiceSpeed}字/分</span>
                          <span className="text-green-400">通话: {formatTime(realTimeMetrics.callDuration)}</span>
                        </div>
                      </div>
                    </div>

                    {/* 当前推荐话术 */}
                    {currentScript && (
                      <div className="flex-1 bg-slate-800/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-slate-200">{currentScript.name}</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                            成功率 {currentScript.successRate}%
                          </Badge>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 mb-3 max-h-80 overflow-y-auto">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                            {currentScript.content}
                          </pre>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>情感基调: {currentScript.emotionalTone}</span>
                          <span>适用场景: {currentScript.scenario}</span>
                        </div>
                      </div>
                    )}

                    {/* 实时反馈 */}
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-2">实时反馈</div>
                      <div className="grid grid-cols-4 gap-3 text-xs">
                        <div className="text-center">
                          <div className="text-blue-400 font-bold">{realTimeMetrics.emotionScore.toFixed(0)}</div>
                          <div className="text-slate-500">情感分</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold">+{realTimeMetrics.intentImprovement}</div>
                          <div className="text-slate-500">意向提升</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold">
                            {realTimeMetrics.scriptEffectiveness.toFixed(0)}%
                          </div>
                          <div className="text-slate-500">话术效果</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-bold">{currentCustomer.intentLevel}%</div>
                          <div className="text-slate-500">购买意向</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧 - 系统数据与效果分析 */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* 今日数据 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  今日数据
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-slate-400">接通率</span>
                    </div>
                    <span className="text-lg font-bold text-blue-400">52.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-sm text-slate-400">意向率</span>
                    </div>
                    <span className="text-lg font-bold text-purple-400">28.6%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-slate-400">成交率</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">16.0%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-slate-400">满意度</span>
                    </div>
                    <span className="text-lg font-bold text-green-400">95.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 效果对比 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-orange-500" />
                  效果对比
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">传统电销</span>
                      <span className="text-slate-400">vs</span>
                      <span className="text-slate-400">数字人电销</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">接通率</span>
                          <span className="text-red-400">35%</span>
                          <span className="text-green-400">52%</span>
                        </div>
                        <div className="flex space-x-2">
                          <Progress value={35} className="h-1 flex-1" />
                          <Progress value={52} className="h-1 flex-1" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">意向率</span>
                          <span className="text-red-400">15%</span>
                          <span className="text-green-400">28%</span>
                        </div>
                        <div className="flex space-x-2">
                          <Progress value={15} className="h-1 flex-1" />
                          <Progress value={28} className="h-1 flex-1" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">成交率</span>
                          <span className="text-red-400">8%</span>
                          <span className="text-green-400">16%</span>
                        </div>
                        <div className="flex space-x-2">
                          <Progress value={8} className="h-1 flex-1" />
                          <Progress value={16} className="h-1 flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="text-green-400 text-sm font-medium mb-1">整体提升</div>
                    <div className="text-green-300 text-xs">转化率提升 100%+</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 智能功能 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-cyan-500" />
                  智能功能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "情绪识别", icon: Heart, status: "active", accuracy: "96.8%" },
                    { name: "意图分析", icon: Target, status: "active", accuracy: "94.2%" },
                    { name: "话术匹配", icon: MessageSquare, status: "active", accuracy: "92.5%" },
                    { name: "实时优化", icon: Zap, status: "active", accuracy: "89.7%" },
                    { name: "效果预测", icon: TrendingUp, status: "active", accuracy: "87.3%" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-slate-800/30">
                      <div className="flex items-center">
                        <feature.icon className="h-4 w-4 mr-2 text-cyan-500" />
                        <span className="text-sm text-slate-300">{feature.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-400">{feature.accuracy}</span>
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
