"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Bot, MessageSquare, Heart, Shield, BarChart3, Settings } from "lucide-react"

export default function SmartCustomerService() {
  const [activeScenario, setActiveScenario] = useState("consultation")
  const [customerInput, setCustomerInput] = useState("")
  const [aiResponse, setAiResponse] = useState("")

  const scenarios = [
    {
      id: "consultation",
      name: "产品咨询",
      icon: MessageSquare,
      description: "专业产品介绍和推荐",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    },
    {
      id: "emotional",
      name: "情感回复",
      icon: Heart,
      description: "温暖贴心的情感交流",
      color: "bg-pink-500/20 text-pink-400 border-pink-500/50",
    },
    {
      id: "objection",
      name: "异议处理",
      icon: Shield,
      description: "专业化解客户疑虑",
      color: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    },
    {
      id: "analysis",
      name: "质量分析",
      icon: BarChart3,
      description: "对话质量实时监控",
      color: "bg-green-500/20 text-green-400 border-green-500/50",
    },
  ]

  const handleGenerateResponse = () => {
    if (!customerInput.trim()) return

    const responses = {
      consultation: `感谢您对我们产品的关注！基于您的需求"${customerInput}"，我为您推荐以下解决方案：

🛋️ **产品推荐**
• 根据您的空间需求，推荐现代简约系列
• 材质采用进口头层牛皮，舒适耐用
• 尺寸可定制，完美适配您的客厅

💡 **专业建议**
• 建议选择浅色系，提升空间明亮度
• 配套茶几和地毯，营造整体氛围
• 提供免费上门测量服务

🎯 **优惠信息**
• 本月享受8.5折优惠
• 免费配送安装
• 3年质保服务

您还有什么其他问题吗？我很乐意为您详细介绍！`,

      emotional: `我完全理解您的感受，选择家具确实是一个重要的决定。

💝 **感同身受**
您提到的"${customerInput}"让我想到，每个家都承载着家人的温暖回忆。选择一套合适的沙发，不仅是为了舒适，更是为了创造更多美好的家庭时光。

🏠 **用心服务**
我们不仅仅是在销售产品，更希望能为您的家增添温馨。我们的设计师团队会根据您的生活习惯和喜好，为您量身定制最适合的方案。

🤝 **贴心承诺**
• 如果您不满意，我们提供30天无理由退换
• 专业售后团队，随时为您服务
• 定期回访，确保您的使用体验

您的满意是我们最大的心愿，让我们一起为您的家创造更多美好！`,

      objection: `我理解您的顾虑，这确实是需要慎重考虑的问题。

🔍 **专业解答**
关于您提到的"${customerInput}"，让我为您详细说明：

📊 **数据支撑**
• 我们产品通过国际质量认证
• 客户满意度达到98.5%
• 平均使用寿命超过15年

🛡️ **品质保障**
• 严格的质量检测流程
• 选用环保材料，通过E0级标准
• 专业工艺，每道工序都有质检

💰 **价值分析**
• 虽然初期投入较高，但长期使用成本更低
• 优质材料确保持久耐用
• 经典设计，不会过时

🎁 **风险承诺**
• 提供质量保险
• 免费维修服务
• 不满意全额退款

我们用实际行动证明产品价值，您的每一分投入都物有所值！`,

      analysis: `📊 **对话质量分析报告**

🎯 **客户输入分析**
输入内容："${customerInput}"
• 情感倾向：中性偏积极
• 需求明确度：较高
• 购买意向：中等

📈 **服务质量评估**
• 响应速度：优秀 (< 2秒)
• 专业程度：高
• 情感温度：适中
• 解决方案：完整

🔍 **改进建议**
• 可增加更多个性化推荐
• 适当增加情感化表达
• 提供更多产品细节

📋 **后续跟进**
• 建议24小时内电话回访
• 发送产品详细资料
• 安排门店体验预约

整体服务质量：优秀 ⭐⭐⭐⭐⭐`,
    }

    setAiResponse(responses[activeScenario as keyof typeof responses])
  }

  return (
    <div className="space-y-6">
      {/* 场景选择 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scenarios.map((scenario) => {
          const IconComponent = scenario.icon
          return (
            <Button
              key={scenario.id}
              variant={activeScenario === scenario.id ? "default" : "outline"}
              onClick={() => setActiveScenario(scenario.id)}
              className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                activeScenario === scenario.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "border-slate-700 bg-slate-800/50"
              }`}
            >
              <IconComponent className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{scenario.name}</div>
                <div className="text-xs opacity-70">{scenario.description}</div>
              </div>
            </Button>
          )
        })}
      </div>

      {/* 主要交互区域 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 客户输入 */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-200">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <span>客户输入</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={customerInput}
              onChange={(e) => setCustomerInput(e.target.value)}
              placeholder="请输入客户的问题或需求..."
              className="min-h-[120px] bg-slate-700/50 border-slate-600/50 text-slate-200"
            />
            <Button
              onClick={handleGenerateResponse}
              disabled={!customerInput.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Bot className="h-4 w-4 mr-2" />
              生成AI回复
            </Button>
          </CardContent>
        </Card>

        {/* AI回复 */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-200">
              <Bot className="h-5 w-5 text-green-400" />
              <span>AI智能回复</span>
              <Badge className={scenarios.find((s) => s.id === activeScenario)?.color}>
                {scenarios.find((s) => s.id === activeScenario)?.name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiResponse ? (
              <div className="bg-slate-700/30 rounded-lg p-4 text-slate-200 whitespace-pre-line text-sm">
                {aiResponse}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>请输入客户问题，AI将生成专业回复</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 功能特性 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <Settings className="h-5 w-5 text-purple-400" />
            <span>系统特性</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-medium text-slate-200 mb-1">智能识别</h3>
              <p className="text-xs text-slate-400">自动识别客户意图和情感状态</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <Heart className="h-8 w-8 mx-auto mb-2 text-pink-400" />
              <h3 className="font-medium text-slate-200 mb-1">情感回复</h3>
              <p className="text-xs text-slate-400">温暖贴心的个性化情感交流</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <h3 className="font-medium text-slate-200 mb-1">质量监控</h3>
              <p className="text-xs text-slate-400">实时监控对话质量和效果</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
