"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  AlertTriangle,
  Star,
  Phone,
  MessageSquare,
  Gift,
  FileText,
  Zap,
  Bell,
  User,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"

interface Customer {
  id: string
  name: string
  stage: string
  value: number
  lastContact: string
  nextAction: string
  progress: number
  tags: string[]
}

// 客户数据接口定义
interface CustomerProfile {
  id: string
  name: string
  phone: string
  address: string
  houseType: string // 户型：三室两厅、两室一厅等
  budget: number
  source: string // 客户来源
  status: "new" | "following" | "signed" | "completed"
  level: "A" | "B" | "C"
  tags: string[]
  createdAt: Date
  lastContact?: Date
  nextContact?: Date

  // 家居行业特有字段
  preferredStyle: string // 偏好风格：现代简约、北欧、中式等
  familyStructure: string // 家庭结构：三口之家、独居、老人同住等
  specialNeeds: string // 特殊需求：老人无障碍、儿童安全等
  urgencyLevel: "low" | "medium" | "high" // 装修紧急度

  // 价值评估
  valueScore: number
  conversionProbability: number
}

// 任务管理接口
interface CustomerTask {
  id: string
  title: string
  description: string
  customerId: string
  userId: string
  dueDate: Date
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  stage: "initial_contact" | "requirement_analysis" | "design_proposal" | "decision_making"
  createdAt: Date
  completedAt?: Date
}

// 客户孵化计划
interface IncubationPlan {
  customerId: string
  stages: {
    name: string
    duration: number // 天数
    actions: string[]
    status: "pending" | "active" | "completed"
  }[]
  currentStage: number
  startDate: Date
}

// 日报数据
interface DailyReport {
  date: string
  userId: string
  newCustomers: number
  followUps: number
  signed: number
  revenue: number
  taskCompleted: number
  performance: {
    target: number
    achievement: number
    rate: string
  }
  keyCustomers: CustomerProfile[]
  tomorrowPlan: string[]
}

export function CustomerLifecycleManager() {
  const [activeTab, setActiveTab] = useState("overview")
  const [customers, setCustomers] = useState<CustomerProfile[]>([])
  const [tasks, setTasks] = useState<CustomerTask[]>([])
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null)

  const [customerData] = useState<Customer[]>([
    {
      id: "1",
      name: "张先生",
      stage: "意向客户",
      value: 25000,
      lastContact: "2024-01-15",
      nextAction: "产品演示",
      progress: 35,
      tags: ["现代简约", "三居室", "预算充足"],
    },
    {
      id: "2",
      name: "李女士",
      stage: "深度跟进",
      value: 18000,
      lastContact: "2024-01-14",
      nextAction: "方案确认",
      progress: 65,
      tags: ["北欧风", "二居室", "价格敏感"],
    },
    {
      id: "3",
      name: "王总",
      stage: "即将成交",
      value: 45000,
      lastContact: "2024-01-16",
      nextAction: "合同签署",
      progress: 85,
      tags: ["豪华定制", "别墅", "高端客户"],
    },
  ])

  const stages = [
    { name: "潜在客户", count: 45, color: "bg-gray-500" },
    { name: "意向客户", count: 23, color: "bg-blue-500" },
    { name: "深度跟进", count: 12, color: "bg-yellow-500" },
    { name: "即将成交", count: 8, color: "bg-orange-500" },
    { name: "已成交", count: 156, color: "bg-green-500" },
  ]

  // 模拟数据初始化
  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = () => {
    // 模拟客户数据
    const mockCustomers: CustomerProfile[] = [
      {
        id: "CUST_001",
        name: "张先生",
        phone: "13800138001",
        address: "北京市朝阳区望京SOHO",
        houseType: "三室两厅",
        budget: 250000,
        source: "官网咨询",
        status: "following",
        level: "A",
        tags: ["年轻夫妻", "首次装修", "预算充足", "关注环保"],
        createdAt: new Date("2024-01-15"),
        lastContact: new Date("2024-01-20"),
        nextContact: new Date("2024-01-22"),
        preferredStyle: "现代简约",
        familyStructure: "三口之家",
        specialNeeds: "儿童房安全设计",
        urgencyLevel: "high",
        valueScore: 85,
        conversionProbability: 78,
      },
      {
        id: "CUST_002",
        name: "李女士",
        phone: "13900139002",
        address: "上海市浦东新区陆家嘴",
        houseType: "四室两厅",
        budget: 380000,
        source: "朋友推荐",
        status: "new",
        level: "A",
        tags: ["高端客户", "品质要求高", "时间紧迫"],
        createdAt: new Date("2024-01-18"),
        preferredStyle: "轻奢风格",
        familyStructure: "夫妻+老人",
        specialNeeds: "老人无障碍设计",
        urgencyLevel: "high",
        valueScore: 92,
        conversionProbability: 85,
      },
      {
        id: "CUST_003",
        name: "王总",
        phone: "13700137003",
        address: "深圳市南山区科技园",
        houseType: "两室一厅",
        budget: 150000,
        source: "广告投放",
        status: "signed",
        level: "B",
        tags: ["单身贵族", "简约风格", "智能家居"],
        createdAt: new Date("2024-01-10"),
        lastContact: new Date("2024-01-19"),
        preferredStyle: "北欧风格",
        familyStructure: "独居",
        specialNeeds: "智能家居集成",
        urgencyLevel: "medium",
        valueScore: 72,
        conversionProbability: 95,
      },
    ]

    // 模拟任务数据
    const mockTasks: CustomerTask[] = [
      {
        id: "TASK_001",
        title: "张先生量房预约",
        description: "联系张先生确认量房时间，重点了解儿童房需求",
        customerId: "CUST_001",
        userId: "USER_001",
        dueDate: new Date("2024-01-22T10:30:00"),
        priority: "high",
        status: "pending",
        stage: "requirement_analysis",
        createdAt: new Date("2024-01-20"),
      },
      {
        id: "TASK_002",
        title: "李女士方案设计",
        description: "完成轻奢风格设计方案，考虑老人无障碍需求",
        customerId: "CUST_002",
        userId: "USER_001",
        dueDate: new Date("2024-01-23T14:00:00"),
        priority: "high",
        status: "in_progress",
        stage: "design_proposal",
        createdAt: new Date("2024-01-19"),
      },
      {
        id: "TASK_003",
        title: "王总合同签署跟进",
        description: "确认合同细节，安排施工时间",
        customerId: "CUST_003",
        userId: "USER_001",
        dueDate: new Date("2024-01-21T16:00:00"),
        priority: "medium",
        status: "completed",
        stage: "decision_making",
        createdAt: new Date("2024-01-18"),
        completedAt: new Date("2024-01-21"),
      },
    ]

    // 模拟日报数据
    const mockDailyReport: DailyReport = {
      date: "2024-01-21",
      userId: "USER_001",
      newCustomers: 3,
      followUps: 8,
      signed: 2,
      revenue: 530000,
      taskCompleted: 6,
      performance: {
        target: 5,
        achievement: 2,
        rate: "40%",
      },
      keyCustomers: mockCustomers.slice(0, 2),
      tomorrowPlan: ["跟进张先生量房安排", "完成李女士设计方案", "参加10:00产品培训会", "整理本周客户回访计划"],
    }

    setCustomers(mockCustomers)
    setTasks(mockTasks)
    setDailyReport(mockDailyReport)
  }

  // 自动提档功能
  const autoUpgradeCustomer = (customer: CustomerProfile) => {
    const valueScore = customer.budget * 0.5 + customer.tags.length * 10000

    let newLevel: "A" | "B" | "C" = customer.level
    if (valueScore > 50000 && customer.level !== "A") {
      newLevel = "A"
    } else if (valueScore > 30000 && customer.level !== "B") {
      newLevel = "B"
    }

    if (newLevel !== customer.level) {
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, level: newLevel } : c)))
      return true
    }
    return false
  }

  // 生成客户孵化计划
  const generateIncubationPlan = (customer: CustomerProfile): IncubationPlan => {
    const baseStages = [
      {
        name: "初步接触",
        duration: 1,
        actions: ["发送欢迎信息", "分享设计案例", "了解基本需求"],
        status: "completed" as const,
      },
      {
        name: "需求了解",
        duration: 3,
        actions: ["发送需求问卷", "预约量房", "风格偏好确认"],
        status: "active" as const,
      },
      {
        name: "方案设计",
        duration: 7,
        actions: ["提供设计方案", "预算规划", "材料选型建议"],
        status: "pending" as const,
      },
      {
        name: "决策促成",
        duration: 14,
        actions: ["限时优惠推送", "成功案例分享", "合同条款确认"],
        status: "pending" as const,
      },
    ]

    // 根据客户特征调整计划
    if (customer.urgencyLevel === "high") {
      baseStages.forEach((stage) => {
        stage.duration = Math.ceil(stage.duration * 0.7) // 紧急客户缩短30%时间
      })
    }

    if (customer.familyStructure === "三口之家") {
      baseStages[1].actions.push("儿童房设计需求确认")
      baseStages[2].actions.push("儿童安全材料推荐")
    }

    if (customer.familyStructure.includes("老人")) {
      baseStages[1].actions.push("无障碍设计需求调研")
      baseStages[2].actions.push("适老化改造方案")
    }

    return {
      customerId: customer.id,
      stages: baseStages,
      currentStage: 1,
      startDate: customer.createdAt,
    }
  }

  // 生成转介绍链接
  const generateReferralLink = (customerId: string) => {
    return `https://zuoyou-sofa.com/referral/${customerId}`
  }

  // 创建裂变活动
  const createFissionActivity = (customerId: string) => {
    const activityId = `fission_${Date.now()}`
    return {
      activityId,
      qrCode: `https://zuoyou-sofa.com/qrcode/${activityId}`,
      shareLink: `https://zuoyou-sofa.com/share/${customerId}`,
      description: "邀请好友成团，享受专属优惠",
    }
  }

  // 获取客户等级颜色
  const getCustomerLevelColor = (level: string) => {
    switch (level) {
      case "A":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "B":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "C":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  // 获取任务优先级颜色
  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  // 获取任务状态图标
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getStageColor = (stage: string) => {
    const colors = {
      潜在客户: "bg-gray-500/20 text-gray-400 border-gray-500/50",
      意向客户: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      深度跟进: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      即将成交: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      已成交: "bg-green-500/20 text-green-400 border-green-500/50",
    }
    return colors[stage as keyof typeof colors] || "bg-gray-500/20 text-gray-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  智能客户运维系统
                </h1>
                <p className="text-slate-400">家居整装行业 · 客户全生命周期管理 · 智能化运营</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                系统运行中
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">客户总数: {customers.length}</Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                今日任务: {tasks.filter((t) => t.status !== "completed").length}
              </Badge>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-900/50 border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/20">
              总览
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-purple-600/20">
              客户管理
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600/20">
              任务节点
            </TabsTrigger>
            <TabsTrigger value="lifecycle" className="data-[state=active]:bg-purple-600/20">
              生命周期
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-purple-600/20">
              数据报表
            </TabsTrigger>
            <TabsTrigger value="operations" className="data-[state=active]:bg-purple-600/20">
              运营工具
            </TabsTrigger>
          </TabsList>

          {/* 总览页面 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 核心指标卡片 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">总客户数</p>
                      <p className="text-2xl font-bold text-slate-100">{customers.length}</p>
                      <p className="text-xs text-green-400">+12% 本月</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">A级客户</p>
                      <p className="text-2xl font-bold text-slate-100">
                        {customers.filter((c) => c.level === "A").length}
                      </p>
                      <p className="text-xs text-red-400">高价值客户</p>
                    </div>
                    <Star className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">待办任务</p>
                      <p className="text-2xl font-bold text-slate-100">
                        {tasks.filter((t) => t.status !== "completed").length}
                      </p>
                      <p className="text-xs text-yellow-400">需要跟进</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">本月签约</p>
                      <p className="text-2xl font-bold text-slate-100">
                        {customers.filter((c) => c.status === "signed").length}
                      </p>
                      <p className="text-xs text-green-400">转化率 65%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 今日重点任务 */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-purple-500" />
                  今日重点任务
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.status !== "completed")
                    .slice(0, 3)
                    .map((task) => {
                      const customer = customers.find((c) => c.id === task.customerId)
                      return (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getTaskStatusIcon(task.status)}
                            <div>
                              <p className="text-sm font-medium text-slate-200">{task.title}</p>
                              <p className="text-xs text-slate-400">
                                客户: {customer?.name} | 截止: {task.dueDate.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={getTaskPriorityColor(task.priority)}>
                            {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                          </Badge>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 客户管理页面 */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 客户列表 */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-blue-500" />
                        客户列表
                      </span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        新增客户
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customers.map((customer) => (
                        <div
                          key={customer.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedCustomer?.id === customer.id
                              ? "bg-purple-600/20 border-purple-500/50"
                              : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                          }`}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {customer.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-200">{customer.name}</p>
                                <p className="text-sm text-slate-400">{customer.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getCustomerLevelColor(customer.level)}>{customer.level}级</Badge>
                              <Badge
                                className={
                                  customer.status === "signed"
                                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                                    : customer.status === "following"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                }
                              >
                                {customer.status === "new"
                                  ? "新客户"
                                  : customer.status === "following"
                                    ? "跟进中"
                                    : customer.status === "signed"
                                      ? "已签约"
                                      : "已完成"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">户型:</span>
                              <span className="ml-2 text-slate-200">{customer.houseType}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">预算:</span>
                              <span className="ml-2 text-slate-200">¥{customer.budget.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">风格:</span>
                              <span className="ml-2 text-slate-200">{customer.preferredStyle}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">家庭:</span>
                              <span className="ml-2 text-slate-200">{customer.familyStructure}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {customer.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-slate-800/50">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-slate-400">成交概率: {customer.conversionProbability}%</div>
                            <Progress value={customer.conversionProbability} className="w-24 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 客户详情 */}
              <div>
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-purple-500" />
                      客户详情
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCustomer ? (
                      <div className="space-y-6">
                        {/* 基本信息 */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-3">基本信息</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">姓名:</span>
                              <span className="text-slate-200">{selectedCustomer.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">电话:</span>
                              <span className="text-slate-200">{selectedCustomer.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">地址:</span>
                              <span className="text-slate-200 text-right">{selectedCustomer.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">来源:</span>
                              <span className="text-slate-200">{selectedCustomer.source}</span>
                            </div>
                          </div>
                        </div>

                        {/* 家居信息 */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-3">家居信息</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">户型:</span>
                              <span className="text-slate-200">{selectedCustomer.houseType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">预算:</span>
                              <span className="text-slate-200">¥{selectedCustomer.budget.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">风格:</span>
                              <span className="text-slate-200">{selectedCustomer.preferredStyle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">家庭结构:</span>
                              <span className="text-slate-200">{selectedCustomer.familyStructure}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">特殊需求:</span>
                              <span className="text-slate-200 text-right">{selectedCustomer.specialNeeds}</span>
                            </div>
                          </div>
                        </div>

                        {/* 价值评估 */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-3">价值评估</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">客户价值</span>
                                <span className="text-slate-200">{selectedCustomer.valueScore}分</span>
                              </div>
                              <Progress value={selectedCustomer.valueScore} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">成交概率</span>
                                <span className="text-slate-200">{selectedCustomer.conversionProbability}%</span>
                              </div>
                              <Progress value={selectedCustomer.conversionProbability} className="h-2" />
                            </div>
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => autoUpgradeCustomer(selectedCustomer)}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            智能提档
                          </Button>
                          <Button variant="outline" className="w-full border-slate-700 bg-transparent">
                            <Phone className="h-4 w-4 mr-2" />
                            立即联系
                          </Button>
                          <Button variant="outline" className="w-full border-slate-700 bg-transparent">
                            <Gift className="h-4 w-4 mr-2" />
                            创建裂变活动
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">选择客户查看详情</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 任务节点页面 */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 任务列表 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-green-500" />
                      任务管理
                    </span>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      新建任务
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => {
                      const customer = customers.find((c) => c.id === task.customerId)
                      return (
                        <div key={task.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getTaskStatusIcon(task.status)}
                              <h4 className="font-medium text-slate-200">{task.title}</h4>
                            </div>
                            <Badge className={getTaskPriorityColor(task.priority)}>
                              {task.priority === "high"
                                ? "高优先级"
                                : task.priority === "medium"
                                  ? "中优先级"
                                  : "低优先级"}
                            </Badge>
                          </div>

                          <p className="text-sm text-slate-400 mb-3">{task.description}</p>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-4">
                              <span className="text-slate-400">
                                客户: <span className="text-slate-200">{customer?.name}</span>
                              </span>
                              <span className="text-slate-400">
                                截止: <span className="text-slate-200">{task.dueDate.toLocaleDateString()}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {task.status === "completed" ? (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">已完成</Badge>
                              ) : (
                                <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                                  标记完成
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 今日提醒 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-yellow-500" />
                    今日提醒
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">紧急任务</span>
                      </div>
                      <p className="text-sm text-slate-200">张先生量房预约 - 今日10:30</p>
                      <p className="text-xs text-slate-400 mt-1">高价值客户，需重点跟进</p>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">即将到期</span>
                      </div>
                      <p className="text-sm text-slate-200">李女士方案设计 - 明日14:00</p>
                      <p className="text-xs text-slate-400 mt-1">轻奢风格设计，注意老人需求</p>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">跟进提醒</span>
                      </div>
                      <p className="text-sm text-slate-200">3位客户需要主动联系</p>
                      <p className="text-xs text-slate-400 mt-1">建议今日完成电话回访</p>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">已完成</span>
                      </div>
                      <p className="text-sm text-slate-200">王总合同签署跟进</p>
                      <p className="text-xs text-slate-400 mt-1">合同已确认，进入施工阶段</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 生命周期页面 */}
          <TabsContent value="lifecycle" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-cyan-500" />
                  客户生命周期管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* 各阶段统计 */}
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-400">新增客户</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          {customers.filter((c) => c.status === "new").length}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">初步接触阶段</p>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-400">跟进中</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                          {customers.filter((c) => c.status === "following").length}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">需求了解与方案设计</p>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-400">已签约</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          {customers.filter((c) => c.status === "signed").length}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">合同确认与施工</p>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-400">已完成</span>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                          {customers.filter((c) => c.status === "completed").length}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">交付与售后服务</p>
                    </div>
                  </div>

                  {/* 客户孵化计划示例 */}
                  <div className="lg:col-span-3">
                    <h4 className="text-sm font-medium text-slate-300 mb-4">客户孵化计划示例 - 张先生</h4>
                    <div className="space-y-4">
                      {generateIncubationPlan(customers[0]).stages.map((stage, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                stage.status === "completed"
                                  ? "bg-green-500 text-white"
                                  : stage.status === "active"
                                    ? "bg-blue-500 text-white"
                                    : "bg-slate-600 text-slate-300"
                              }`}
                            >
                              {index + 1}
                            </div>
                            {index < 3 && <div className="w-0.5 h-8 bg-slate-600 mt-2"></div>}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-slate-200">{stage.name}</h5>
                              <Badge
                                className={
                                  stage.status === "completed"
                                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                                    : stage.status === "active"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                      : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                                }
                              >
                                {stage.status === "completed"
                                  ? "已完成"
                                  : stage.status === "active"
                                    ? "进行中"
                                    : "待开始"}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">预计用时: {stage.duration}天</p>
                            <div className="flex flex-wrap gap-1">
                              {stage.actions.map((action, actionIndex) => (
                                <Badge key={actionIndex} variant="outline" className="text-xs bg-slate-800/50">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据报表页面 */}
          <TabsContent value="reports" className="space-y-6">
            {dailyReport && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 销售日报 */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5 text-orange-500" />
                        销售日报 - {dailyReport.date}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                          <p className="text-2xl font-bold text-blue-400">{dailyReport.newCustomers}</p>
                          <p className="text-sm text-slate-400">新增客户</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                          <p className="text-2xl font-bold text-green-400">{dailyReport.followUps}</p>
                          <p className="text-sm text-slate-400">跟进客户</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                          <p className="text-2xl font-bold text-purple-400">{dailyReport.signed}</p>
                          <p className="text-sm text-slate-400">签约客户</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-400">¥{dailyReport.revenue.toLocaleString()}</p>
                          <p className="text-sm text-slate-400">营收金额</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-slate-300 mb-3">目标完成情况</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">签约目标</span>
                          <span className="text-sm text-slate-200">
                            {dailyReport.performance.achievement}/{dailyReport.performance.target} (
                            {dailyReport.performance.rate})
                          </span>
                        </div>
                        <Progress
                          value={(dailyReport.performance.achievement / dailyReport.performance.target) * 100}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3">重点客户跟进</h4>
                        <div className="space-y-2">
                          {dailyReport.keyCustomers.map((customer) => (
                            <div
                              key={customer.id}
                              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-200">{customer.name}</p>
                                <p className="text-xs text-slate-400">
                                  {customer.phone} | {customer.preferredStyle}
                                </p>
                              </div>
                              <Badge className={getCustomerLevelColor(customer.level)}>{customer.level}级</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 明日计划 */}
                <div>
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-cyan-500" />
                        明日计划
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dailyReport.tomorrowPlan.map((plan, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <p className="text-sm text-slate-200 flex-1">{plan}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 工作计划模板 */}
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-green-500" />
                        工作计划模板
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">日计划目标</h4>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>• 新增3个潜在客户</li>
                            <li>• 完成5个客户跟进</li>
                            <li>• 签约1个新客户</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">重点任务</h4>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>• 重点客户方案设计</li>
                            <li>• 参加团队晨会</li>
                            <li>• 客户满意度回访</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* 运营工具页面 */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 客户裂变工具 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="mr-2 h-5 w-5 text-pink-500" />
                    客户裂变工具
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-lg">
                      <h4 className="font-medium text-pink-400 mb-2">转介绍活动</h4>
                      <p className="text-sm text-slate-300 mb-3">老客户推荐新客户，双方享受专属优惠</p>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="选择客户生成转介绍链接" className="bg-slate-800/50 border-slate-700/50" />
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                          生成链接
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
                      <h4 className="font-medium text-purple-400 mb-2">团购活动</h4>
                      <p className="text-sm text-slate-300 mb-3">3人成团享受团购价，激发社交裂变</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="border-purple-500/50 bg-transparent">
                          创建团购
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-500/50 bg-transparent">
                          生成海报
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
                      <h4 className="font-medium text-blue-400 mb-2">好友助力</h4>
                      <p className="text-sm text-slate-300 mb-3">邀请好友助力解锁专属优惠券</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="border-blue-500/50 bg-transparent">
                          设置助力
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-500/50 bg-transparent">
                          查看数据
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 智能提档工具 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                    智能提档工具
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                      <h4 className="font-medium text-yellow-400 mb-2">自动提档规则</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">A级客户:</span>
                          <span className="text-slate-200">价值分 {">"} 5万</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">B级客户:</span>
                          <span className="text-slate-200">价值分 {">"} 3万</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">C级客户:</span>
                          <span className="text-slate-200">价值分 {"<"} 3万</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
                      <h4 className="font-medium text-green-400 mb-2">价值评估算法</h4>
                      <p className="text-sm text-slate-300 mb-2">预算 × 0.5 + 标签数量 × 10000</p>
                      <div className="text-xs text-slate-400">
                        系统会根据客户预算、互动频率、标签数量等因素自动计算客户价值分数
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                        <Zap className="h-4 w-4 mr-2" />
                        批量智能提档
                      </Button>
                      <Button variant="outline" className="w-full border-slate-700 bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        提档规则设置
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 系统集成 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-slate-400" />
                    系统集成与API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-slate-200 mb-2">ERP系统集成</h4>
                      <p className="text-sm text-slate-400 mb-3">同步客户数据、订单信息、库存状态</p>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">已连接</Badge>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-slate-200 mb-2">微信生态</h4>
                      <p className="text-sm text-slate-400 mb-3">小程序、公众号、企业微信集成</p>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">配置中</Badge>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h4 className="font-medium text-slate-200 mb-2">第三方API</h4>
                      <p className="text-sm text-slate-400 mb-3">支付接口、短信服务、地图服务</p>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">待配置</Badge>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
                    \<h4 className="font-medium text-slate-200 mb-3">API使用统计</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-400">1,247</p>
                        <p className="text-xs text-slate-400">今日调用</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-400">99.8%</p>
                        <p className="text-xs text-slate-400">成功率</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-400">156ms</p>
                        <p className="text-xs text-slate-400">平均响应</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-400">24.5K</p>
                        <p className="text-xs text-slate-400">月度调用</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
