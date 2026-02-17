"use client"

import { useState, useEffect } from "react"
import {
  Sofa,
  Phone,
  Target,
  TrendingUp,
  BarChart3,
  Award,
  Clock,
  Star,
  Zap,
  MessageSquare,
  FileText,
  Settings,
  Play,
  Pause,
  Volume2,
  Download,
  Upload,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Customer {
  id: string
  name: string
  phone: string
  type: "A类客户" | "B类客户" | "C类客户"
  intentLevel: number
  stage: "装修前期" | "装修中期" | "装修后期" | "软装配置期"
  budget: string
  area: string
  lastContact: Date
  nextFollowUp: Date
  notes: string
  tags: string[]
}

interface CallRecord {
  id: string
  customerId: string
  customerName: string
  duration: number
  script: string
  result: "成功" | "跟进" | "拒绝"
  intentBefore: number
  intentAfter: number
  nextAction: string
  timestamp: Date
}

export default function SofaSalesSystem() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "张先生",
      phone: "138****8888",
      type: "A类客户",
      intentLevel: 85,
      stage: "装修中期",
      budget: "2-3万",
      area: "北京朝阳区",
      lastContact: new Date("2024-01-15"),
      nextFollowUp: new Date("2024-01-18"),
      notes: "新房装修，注重品质，有购买意向",
      tags: ["高端客户", "新房装修", "品质导向"],
    },
    {
      id: "2",
      name: "李女士",
      phone: "139****6666",
      type: "B类客户",
      intentLevel: 65,
      stage: "装修前期",
      budget: "1-2万",
      area: "上海浦东区",
      lastContact: new Date("2024-01-14"),
      nextFollowUp: new Date("2024-01-20"),
      notes: "年轻夫妻，首次购房，价格敏感",
      tags: ["年轻夫妻", "首次购房", "价格敏感"],
    },
    {
      id: "3",
      name: "王总",
      phone: "136****9999",
      type: "A类客户",
      intentLevel: 92,
      stage: "装修后期",
      budget: "3万以上",
      area: "深圳南山区",
      lastContact: new Date("2024-01-16"),
      nextFollowUp: new Date("2024-01-17"),
      notes: "企业高管，追求品味，决策快",
      tags: ["企业高管", "高端定制", "决策快"],
    },
  ])

  const [callRecords, setCallRecords] = useState<CallRecord[]>([
    {
      id: "1",
      customerId: "1",
      customerName: "张先生",
      duration: 8,
      script: "权威专业型开场",
      result: "成功",
      intentBefore: 70,
      intentAfter: 85,
      nextAction: "预约门店体验",
      timestamp: new Date("2024-01-15 14:30"),
    },
    {
      id: "2",
      customerId: "2",
      customerName: "李女士",
      duration: 5,
      script: "利益驱动型开场",
      result: "跟进",
      intentBefore: 50,
      intentAfter: 65,
      nextAction: "发送产品资料",
      timestamp: new Date("2024-01-14 16:20"),
    },
  ])

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedScript, setSelectedScript] = useState("authorityProfessional")
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [currentInput, setCurrentInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  // 左右沙发专业话术库
  const sofaScripts = {
    opening: {
      authorityProfessional: {
        name: "权威专业型开场",
        suitable: "A类客户",
        content: `您好，请问是[客户姓名]先生/女士吗？我是左右沙发的家居顾问[姓名]。

我们是中国沙发行业的领导品牌，37年专业制造经验，服务过全国100万+家庭。我注意到您最近在关注家居产品，我们正在为您所在的[区域]提供免费的家居设计咨询服务。

作为专业的家居顾问，我想了解一下您现在的装修进度，看看我们能为您提供什么专业建议，这个电话大概占用您3-5分钟时间，方便吗？`,
        successRate: "65%+",
      },
      benefitDriven: {
        name: "利益驱动型开场",
        suitable: "B类客户",
        content: `您好，是[客户姓名]吗？我是左右沙发的客户顾问[姓名]。

恭喜您！您被我们系统随机抽选为本月的VIP体验客户，可以享受我们价值3000元的免费家居设计服务，还有机会获得最高5000元的装修补贴。

我想简单了解一下您的装修情况，为您匹配最合适的优惠方案，只需要2-3分钟，您现在方便接电话吗？`,
        successRate: "55%+",
      },
      emotionalResonance: {
        name: "情感共鸣型开场",
        suitable: "C类客户",
        content: `您好，请问是[客户姓名]吗？我是左右沙发的小[姓名]。

我看到您在网上关注过我们的产品，作为一个也经历过装修的过来人，我特别理解选择家具时的纠结心情。左右沙发37年来就专注做一件事——让每个家庭都能拥有舒适的沙发。

我想分享一些我们客户的真实经验给您，也许对您的选择有帮助，您现在有2分钟时间吗？`,
        successRate: "45%+",
      },
    },
    objectionHandling: {
      price: `我完全理解您对价格的考虑，这确实是个重要因素！💰

📊 **让我为您分析价值：**
• 产品质量 - 使用优质材料和工艺
• 技术含量 - 投入大量研发成本
• 服务保障 - 完善的售后服务体系
• 品牌价值 - 37年积累的品牌信誉

💡 **让价格更友好的方案：**
• 分期付款 - 减轻支付压力
• 优惠活动 - 限时特价优惠
• 套餐组合 - 组合购买更划算
• 以旧换新 - 旧产品抵扣费用

您的预算大概在什么范围？我帮您找到最合适的选择！`,
      quality: `质量是我们最引以为豪的核心优势！让我用数据为您证明：📊

🏆 **质量保证：**
• 合格率：99.8%（行业领先）
• 客户满意度：96.5%
• 故障率：0.2%（行业最低）
• 使用寿命：平均15年以上

🔬 **质量标准：**
• ISO9001质量管理体系
• 每道工序质检把关
• 出厂前100%检测
• 严格的质量控制流程

🛡️ **质保承诺：**
• 核心部件5年质保
• 整机3年质保
• 终身技术支持
• 全国联保服务

真实案例：李先生2018年购买的产品，至今使用5年，除了正常维护外没有任何问题！`,
    },
    closing: {
      urgency: `我必须告诉您一个重要信息：

⏰ **限时优惠：**
我们现在的这个优惠活动，是今年力度最大的一次：
• 全系列产品8.5折
• 满2万送价值3000元软装礼包
• 12期0利息分期
• 免费3D设计+上门测量

但是这个活动只到本月底，还有3天就结束了。

📦 **库存紧张：**
您看中的这款产品，全国只剩下不到50套库存，按照现在的销售速度，可能这周就会售完。

我建议您现在就预留一套，您有24小时的考虑时间。`,
      emotional: `通过我们今天的沟通，我能感受到您是一个很有品味、很爱家的人。

💝 **情感升华：**
选择左右沙发，您选择的不仅仅是一件家具，更是一种生活方式，一种对家庭的爱。

我相信，当您和家人坐在这款沙发上，享受温馨时光的时候，您会为今天的决定感到骄傲。

而且我们有完善的售后保障，您完全不用担心任何问题。

您还有什么顾虑吗？如果没有的话，我们现在就确定下来。`,
    },
  }

  // 客户意向度颜色
  const getIntentColor = (level: number) => {
    if (level >= 90) return "text-red-400 bg-red-500/20 border-red-500/50"
    if (level >= 70) return "text-orange-400 bg-orange-500/20 border-orange-500/50"
    if (level >= 50) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
    return "text-green-400 bg-green-500/20 border-green-500/50"
  }

  // 客户类型颜色
  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "A类客户":
        return "text-red-400 bg-red-500/20 border-red-500/50"
      case "B类客户":
        return "text-orange-400 bg-orange-500/20 border-orange-500/50"
      case "C类客户":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/50"
    }
  }

  // 模拟通话计时
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  // 格式化通话时长
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // 开始通话
  const startCall = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsCallActive(true)
    setCallDuration(0)
  }

  // 结束通话
  const endCall = () => {
    if (selectedCustomer) {
      const newRecord: CallRecord = {
        id: Date.now().toString(),
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        duration: callDuration,
        script: selectedScript,
        result: "成功",
        intentBefore: selectedCustomer.intentLevel,
        intentAfter: selectedCustomer.intentLevel + 10,
        nextAction: "预约门店体验",
        timestamp: new Date(),
      }
      setCallRecords((prev) => [newRecord, ...prev])
    }
    setIsCallActive(false)
    setCallDuration(0)
    setSelectedCustomer(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Sofa className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  左右沙发电销系统
                </h1>
                <p className="text-slate-400">基于建材家居行业大数据的精准拓客与情感化销售</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                系统在线
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">今日通话: 28次</Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">成交率: 12.5%</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左侧数据面板 */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* 今日数据 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                  今日数据
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-slate-400">拨打电话</span>
                    </div>
                    <span className="text-lg font-bold text-green-400">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-slate-400">接通率</span>
                    </div>
                    <span className="text-lg font-bold text-blue-400">52.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-sm text-slate-400">意向客户</span>
                    </div>
                    <span className="text-lg font-bold text-purple-400">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-slate-400">成交客户</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 转化漏斗 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-orange-500" />
                  转化漏斗
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">电话接通</span>
                      <span className="text-slate-200">52.3%</span>
                    </div>
                    <Progress value={52.3} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">初次沟通</span>
                      <span className="text-slate-200">28.6%</span>
                    </div>
                    <Progress value={28.6} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">深度沟通</span>
                      <span className="text-slate-200">18.9%</span>
                    </div>
                    <Progress value={18.9} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">到店体验</span>
                      <span className="text-slate-200">15.2%</span>
                    </div>
                    <Progress value={15.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">最终成交</span>
                      <span className="text-slate-200">12.5%</span>
                    </div>
                    <Progress value={12.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 话术效果排行 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  话术效果排行
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "权威专业型", rate: "65.2%", color: "text-green-400" },
                    { name: "利益驱动型", rate: "58.7%", color: "text-blue-400" },
                    { name: "情感共鸣型", rate: "52.3%", color: "text-purple-400" },
                  ].map((script, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                                ? "bg-slate-400 text-black"
                                : "bg-orange-500 text-black"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-sm text-slate-300">{script.name}</span>
                      </div>
                      <span className={`text-sm font-bold ${script.color}`}>{script.rate}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 中间主要内容 */}
          <div className="col-span-12 lg:col-span-6">
            <Tabs defaultValue="customers" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700/50">
                <TabsTrigger value="customers">客户管理</TabsTrigger>
                <TabsTrigger value="scripts">话术库</TabsTrigger>
                <TabsTrigger value="calling">通话中心</TabsTrigger>
              </TabsList>

              <TabsContent value="customers" className="mt-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-700/50 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">客户列表</CardTitle>
                      <div className="flex items-center space-x-3">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部客户</SelectItem>
                            <SelectItem value="A">A类客户</SelectItem>
                            <SelectItem value="B">B类客户</SelectItem>
                            <SelectItem value="C">C类客户</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Phone className="mr-2 h-4 w-4" />
                          批量拨打
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-700/30">
                      {customers.map((customer) => (
                        <div key={customer.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-medium text-slate-200">{customer.name}</h3>
                                <Badge className={`text-xs ${getCustomerTypeColor(customer.type)}`}>
                                  {customer.type}
                                </Badge>
                                <Badge className={`text-xs ${getIntentColor(customer.intentLevel)}`}>
                                  意向度 {customer.intentLevel}%
                                </Badge>
                                <Badge variant="outline" className="bg-slate-800/50 text-xs">
                                  {customer.stage}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-slate-400 mb-3">
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {customer.phone}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {customer.area}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  预算: {customer.budget}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  下次跟进: {customer.nextFollowUp.toLocaleDateString()}
                                </div>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">{customer.notes}</p>
                              <div className="flex flex-wrap gap-1">
                                {customer.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-slate-800/30">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => startCall(customer)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800/50">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scripts" className="mt-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-700/50 pb-4">
                    <CardTitle className="text-xl">专业话术库</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Tabs defaultValue="opening" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                        <TabsTrigger value="opening">开场话术</TabsTrigger>
                        <TabsTrigger value="objection">异议处理</TabsTrigger>
                        <TabsTrigger value="closing">成交话术</TabsTrigger>
                      </TabsList>

                      <TabsContent value="opening" className="mt-4">
                        <div className="space-y-4">
                          {Object.entries(sofaScripts.opening).map(([key, script]) => (
                            <Card key={key} className="bg-slate-800/50 border-slate-700/50">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{script.name}</CardTitle>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                                      {script.suitable}
                                    </Badge>
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                                      成功率 {script.successRate}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                                    {script.content}
                                  </pre>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800/50">
                                    <Volume2 className="mr-2 h-3 w-3" />
                                    语音播放
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800/50">
                                    <Download className="mr-2 h-3 w-3" />
                                    复制话术
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="objection" className="mt-4">
                        <div className="space-y-4">
                          {Object.entries(sofaScripts.objectionHandling).map(([key, content]) => (
                            <Card key={key} className="bg-slate-800/50 border-slate-700/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base capitalize">
                                  {key === "price" ? "价格异议处理" : "质量异议处理"}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{content}</pre>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800/50">
                                    <Volume2 className="mr-2 h-3 w-3" />
                                    语音播放
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800/50">
                                    <Download className="mr-2 h-3 w-3" />
                                    复制话术
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="closing" className="mt-4">
                        <div className="space-y-4">
                          {Object.entries(sofaScripts.closing).map(([key, content]) => (
                            <Card key={key} className="bg-slate-800/50 border-slate-700/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base capitalize">
                                  {key === "urgency" ? "紧迫感成交" : "情感化成交"}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{content}</pre>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800/50">
                                    <Volume2 className="mr-2 h-3 w-3" />
                                    语音播放
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800/50">
                                    <Download className="mr-2 h-3 w-3" />
                                    复制话术
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calling" className="mt-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-700/50 pb-4">
                    <CardTitle className="text-xl flex items-center">
                      <Phone className="mr-2 h-5 w-5" />
                      通话中心
                      {isCallActive && (
                        <Badge className="ml-3 bg-green-500/20 text-green-400 border-green-500/50">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                          通话中 {formatDuration(callDuration)}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isCallActive && selectedCustomer ? (
                      <div className="space-y-6">
                        {/* 客户信息 */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-slate-200">{selectedCustomer.name}</h3>
                              <p className="text-sm text-slate-400">{selectedCustomer.phone}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={`${getCustomerTypeColor(selectedCustomer.type)} mb-2`}>
                                {selectedCustomer.type}
                              </Badge>
                              <div className="text-sm text-slate-400">意向度: {selectedCustomer.intentLevel}%</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">装修阶段:</span>
                              <span className="text-slate-200 ml-2">{selectedCustomer.stage}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">预算范围:</span>
                              <span className="text-slate-200 ml-2">{selectedCustomer.budget}</span>
                            </div>
                          </div>
                        </div>

                        {/* 推荐话术 */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="text-base font-medium text-slate-200 mb-3">推荐话术</h4>
                          <Select value={selectedScript} onValueChange={setSelectedScript}>
                            <SelectTrigger className="bg-slate-700/50 border-slate-600/50 mb-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="authorityProfessional">权威专业型开场</SelectItem>
                              <SelectItem value="benefitDriven">利益驱动型开场</SelectItem>
                              <SelectItem value="emotionalResonance">情感共鸣型开场</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="bg-slate-900/50 rounded-lg p-3 text-sm text-slate-300">
                            {sofaScripts.opening[selectedScript as keyof typeof sofaScripts.opening]?.content}
                          </div>
                        </div>

                        {/* 通话记录 */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="text-base font-medium text-slate-200 mb-3">通话记录</h4>
                          <Textarea
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            placeholder="记录客户反馈、关键信息..."
                            className="bg-slate-700/50 border-slate-600/50 min-h-[100px]"
                          />
                        </div>

                        {/* 通话控制 */}
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            size="lg"
                            variant="outline"
                            className="border-slate-700 bg-slate-800/50"
                            onClick={() => setIsRecording(!isRecording)}
                          >
                            {isRecording ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            {isRecording ? "暂停录音" : "开始录音"}
                          </Button>
                          <Button size="lg" onClick={endCall} className="bg-red-600 hover:bg-red-700">
                            结束通话
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Phone className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400 mb-2">暂无通话</h3>
                        <p className="text-sm text-slate-500">选择客户开始通话</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧通话记录 */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* 通话记录 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-green-500" />
                  通话记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {callRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="bg-slate-800/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-200">{record.customerName}</span>
                        <Badge
                          className={`text-xs ${
                            record.result === "成功"
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : record.result === "跟进"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                : "bg-red-500/20 text-red-400 border-red-500/50"
                          }`}
                        >
                          {record.result}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>时长: {record.duration}分钟</div>
                        <div>话术: {record.script}</div>
                        <div>
                          意向度: {record.intentBefore}% → {record.intentAfter}%
                        </div>
                        <div>下步: {record.nextAction}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 今日目标 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-5 w-5 text-purple-500" />
                  今日目标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">拨打电话</span>
                      <span className="text-slate-200">156/200</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">意向客户</span>
                      <span className="text-slate-200">23/30</span>
                    </div>
                    <Progress value={76.7} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">成交客户</span>
                      <span className="text-slate-200">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 快捷操作 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  快捷操作
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start border-slate-700 bg-slate-800/50">
                    <Download className="mr-2 h-4 w-4" />
                    导出通话记录
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start border-slate-700 bg-slate-800/50">
                    <Upload className="mr-2 h-4 w-4" />
                    导入客户名单
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start border-slate-700 bg-slate-800/50">
                    <FileText className="mr-2 h-4 w-4" />
                    生成日报
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start border-slate-700 bg-slate-800/50">
                    <Settings className="mr-2 h-4 w-4" />
                    系统设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
