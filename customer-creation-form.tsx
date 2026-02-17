"use client"

import { useState } from "react"
import { User, Phone, Tag, TrendingUp, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomerData {
  name: string
  phone: string
  company: string
  email: string
  address: string
  position: string
  industry: string
  notes: string
  source: string
}

interface AIAnalysis {
  customerType: "A类客户" | "B类客户" | "C类客户"
  potentialValue: number
  successProbability: number
  recommendedTags: string[]
  followUpStrategy: string
  bestContactTime: string
}

export default function CustomerCreationForm() {
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    company: "",
    email: "",
    address: "",
    position: "",
    industry: "",
    notes: "",
    source: "",
  })

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [step, setStep] = useState(1)

  // 模拟AI分析
  const performAIAnalysis = () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      // 基于输入数据进行智能分析
      const analysis: AIAnalysis = {
        customerType:
          customerData.position.includes("总") || customerData.position.includes("经理")
            ? "A类客户"
            : customerData.company.includes("科技") || customerData.company.includes("集团")
              ? "B类客户"
              : "C类客户",
        potentialValue: Math.floor(Math.random() * 200000) + 50000,
        successProbability: Math.floor(Math.random() * 40) + 60,
        recommendedTags: [
          customerData.position.includes("总") ? "决策者" : "影响者",
          customerData.industry || "待确认行业",
          customerData.company.includes("科技") ? "技术导向" : "传统企业",
          "新客户",
        ],
        followUpStrategy: customerData.position.includes("总") ? "高层决策路线" : "技术路线切入",
        bestContactTime: "工作日 10:00-11:00, 14:00-16:00",
      }

      setAiAnalysis(analysis)
      setIsAnalyzing(false)
      setStep(2)
    }, 2000)
  }

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "A类客户":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "B类客户":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "C类客户":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 进度指示器 */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">客户录入进度</span>
            <span className="text-sm text-cyan-400">{step}/3 步骤</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span className={step >= 1 ? "text-cyan-400" : ""}>信息录入</span>
            <span className={step >= 2 ? "text-cyan-400" : ""}>AI分析</span>
            <span className={step >= 3 ? "text-cyan-400" : ""}>档案创建</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：信息录入表单 */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              客户信息录入
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  客户姓名 *
                </Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="请输入客户姓名"
                  className="bg-slate-800/50 border-slate-700/50"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-300">
                  联系电话 *
                </Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="138****1234"
                  className="bg-slate-800/50 border-slate-700/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company" className="text-slate-300">
                公司名称 *
              </Label>
              <Input
                id="company"
                value={customerData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="请输入公司名称"
                className="bg-slate-800/50 border-slate-700/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-slate-300">
                  邮箱地址
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@company.com"
                  className="bg-slate-800/50 border-slate-700/50"
                />
              </div>
              <div>
                <Label htmlFor="position" className="text-slate-300">
                  职位头衔
                </Label>
                <Input
                  id="position"
                  value={customerData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="技术总监"
                  className="bg-slate-800/50 border-slate-700/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-slate-300">
                公司地址
              </Label>
              <Input
                id="address"
                value={customerData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="深圳市南山区"
                className="bg-slate-800/50 border-slate-700/50"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="text-slate-300">
                行业类型
              </Label>
              <Select onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50">
                  <SelectValue placeholder="选择行业类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="软件开发">软件开发</SelectItem>
                  <SelectItem value="制造业">制造业</SelectItem>
                  <SelectItem value="金融服务">金融服务</SelectItem>
                  <SelectItem value="教育培训">教育培训</SelectItem>
                  <SelectItem value="医疗健康">医疗健康</SelectItem>
                  <SelectItem value="电商零售">电商零售</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source" className="text-slate-300">
                客户来源
              </Label>
              <Select onValueChange={(value) => handleInputChange("source", value)}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50">
                  <SelectValue placeholder="选择客户来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="官网咨询">官网咨询</SelectItem>
                  <SelectItem value="电话营销">电话营销</SelectItem>
                  <SelectItem value="朋友推荐">朋友推荐</SelectItem>
                  <SelectItem value="展会活动">展会活动</SelectItem>
                  <SelectItem value="广告投放">广告投放</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-slate-300">
                备注信息
              </Label>
              <Textarea
                id="notes"
                value={customerData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="记录客户特殊需求、偏好等信息..."
                className="bg-slate-800/50 border-slate-700/50 min-h-[80px]"
              />
            </div>

            <Button
              onClick={performAIAnalysis}
              disabled={!customerData.name || !customerData.phone || !customerData.company || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  AI智能分析中...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  开始AI智能分析
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 右侧：AI分析结果 */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
              AI智能分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!aiAnalysis && !isAnalyzing && (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">等待AI分析</p>
                <p className="text-sm text-slate-500">完成基础信息录入后，AI将自动分析客户特征</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-purple-400 mb-2">AI正在分析客户信息...</p>
                <p className="text-sm text-slate-500">分析客户类型、价值评估、成交概率</p>
              </div>
            )}

            {aiAnalysis && (
              <div className="space-y-6">
                {/* 客户分类 */}
                <div className="text-center pb-4 border-b border-slate-700/50">
                  <Badge className={`text-lg px-4 py-2 ${getCustomerTypeColor(aiAnalysis.customerType)}`}>
                    {aiAnalysis.customerType}
                  </Badge>
                  <p className="text-sm text-slate-400 mt-2">基于职位、公司规模等因素智能判定</p>
                </div>

                {/* 关键指标 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      ¥{aiAnalysis.potentialValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">预估客户价值</div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{aiAnalysis.successProbability}%</div>
                    <div className="text-xs text-slate-400">成交概率</div>
                  </div>
                </div>

                {/* 成交概率进度条 */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">成交概率评估</span>
                    <span className="text-slate-300">{aiAnalysis.successProbability}%</span>
                  </div>
                  <Progress value={aiAnalysis.successProbability} className="h-2" />
                </div>

                {/* 智能标签 */}
                <div>
                  <Label className="text-slate-300 block mb-2">AI推荐标签</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.recommendedTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-800/50 text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 跟进策略 */}
                <div>
                  <Label className="text-slate-300 block mb-2">推荐跟进策略</Label>
                  <div className="bg-slate-800/30 rounded-lg p-3">
                    <p className="text-sm text-slate-300">{aiAnalysis.followUpStrategy}</p>
                  </div>
                </div>

                {/* 最佳联系时间 */}
                <div>
                  <Label className="text-slate-300 block mb-2">最佳联系时间</Label>
                  <div className="bg-slate-800/30 rounded-lg p-3">
                    <p className="text-sm text-slate-300">{aiAnalysis.bestContactTime}</p>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <User className="h-4 w-4 mr-2" />
                    创建客户档案
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-700 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    立即联系
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
