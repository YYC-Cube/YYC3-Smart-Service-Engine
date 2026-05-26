"use client"

import { useState, useEffect } from "react"
import { FileText, Brain, CheckCircle, AlertCircle, Tag, Send, Settings, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// 智能表单字段类型
interface FormField {
  id: string
  type: "text" | "select" | "textarea" | "checkbox" | "radio" | "number" | "date" | "phone" | "email"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  aiSuggestion?: boolean
  dependsOn?: string
  conditionalLogic?: {
    field: string
    value: string
    action: "show" | "hide" | "require"
  }[]
}

// 表单模板
interface FormTemplate {
  id: string
  name: string
  description: string
  category: "customer" | "survey" | "feedback" | "consultation" | "custom"
  fields: FormField[]
  aiFeatures: {
    autoFill: boolean
    smartValidation: boolean
    predictiveText: boolean
    sentimentAnalysis: boolean
  }
  integrations: string[]
}

// 表单提交数据
interface FormSubmission {
  id: string
  templateId: string
  data: Record<string, any>
  submittedAt: Date
  source: string
  aiAnalysis?: {
    sentiment: "positive" | "neutral" | "negative"
    intent: string
    priority: "high" | "medium" | "low"
    tags: string[]
    recommendations: string[]
  }
}

export default function SmartFormSystem() {
  const [activeTab, setActiveTab] = useState("templates")
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  // 初始化数据
  useEffect(() => {
    initializeFormData()
  }, [])

  const initializeFormData = () => {
    // 预设表单模板
    const templates: FormTemplate[] = [
      {
        id: "customer-intake",
        name: "客户信息采集表",
        description: "新客户基础信息收集，支持AI智能分析客户价值",
        category: "customer",
        fields: [
          {
            id: "name",
            type: "text",
            label: "客户姓名",
            placeholder: "请输入客户姓名",
            required: true,
            aiSuggestion: false,
          },
          {
            id: "phone",
            type: "phone",
            label: "联系电话",
            placeholder: "138****1234",
            required: true,
            validation: {
              pattern: "^1[3-9]\\d{9}$",
              message: "请输入正确的手机号码",
            },
          },
          {
            id: "houseType",
            type: "select",
            label: "房屋户型",
            required: true,
            options: ["一室一厅", "两室一厅", "两室两厅", "三室两厅", "四室两厅", "别墅", "其他"],
          },
          {
            id: "budget",
            type: "number",
            label: "装修预算",
            placeholder: "请输入预算金额",
            required: true,
            validation: {
              min: 50000,
              max: 2000000,
              message: "预算范围应在5万-200万之间",
            },
          },
          {
            id: "style",
            type: "select",
            label: "偏好风格",
            required: true,
            options: ["现代简约", "北欧风格", "中式风格", "欧式风格", "美式风格", "工业风格", "其他"],
          },
          {
            id: "familyStructure",
            type: "select",
            label: "家庭结构",
            required: true,
            options: ["独居", "夫妻二人", "三口之家", "四口之家", "三代同堂", "其他"],
          },
          {
            id: "urgency",
            type: "radio",
            label: "装修紧急程度",
            required: true,
            options: ["非常紧急（1个月内）", "比较紧急（3个月内）", "不太紧急（半年内）", "暂无时间要求"],
          },
          {
            id: "specialNeeds",
            type: "textarea",
            label: "特殊需求",
            placeholder: "如老人无障碍设计、儿童安全需求等",
            required: false,
            aiSuggestion: true,
          },
          {
            id: "source",
            type: "select",
            label: "客户来源",
            required: true,
            options: ["官网咨询", "电话营销", "朋友推荐", "展会活动", "广告投放", "其他"],
          },
        ],
        aiFeatures: {
          autoFill: true,
          smartValidation: true,
          predictiveText: true,
          sentimentAnalysis: true,
        },
        integrations: ["CRM", "ERP", "微信"],
      },
      {
        id: "satisfaction-survey",
        name: "客户满意度调查",
        description: "服务完成后的客户满意度评估，AI分析服务质量",
        category: "survey",
        fields: [
          {
            id: "customerName",
            type: "text",
            label: "客户姓名",
            required: true,
          },
          {
            id: "serviceType",
            type: "select",
            label: "服务类型",
            required: true,
            options: ["设计咨询", "产品安装", "售后维修", "其他服务"],
          },
          {
            id: "overallSatisfaction",
            type: "radio",
            label: "总体满意度",
            required: true,
            options: ["非常满意", "满意", "一般", "不满意", "非常不满意"],
          },
          {
            id: "serviceQuality",
            type: "radio",
            label: "服务质量评价",
            required: true,
            options: ["优秀", "良好", "一般", "较差", "很差"],
          },
          {
            id: "responseTime",
            type: "radio",
            label: "响应速度评价",
            required: true,
            options: ["非常及时", "比较及时", "一般", "较慢", "很慢"],
          },
          {
            id: "staffAttitude",
            type: "radio",
            label: "服务人员态度",
            required: true,
            options: ["非常好", "比较好", "一般", "较差", "很差"],
          },
          {
            id: "suggestions",
            type: "textarea",
            label: "改进建议",
            placeholder: "请提出您的宝贵建议...",
            required: false,
            aiSuggestion: true,
          },
          {
            id: "recommendation",
            type: "radio",
            label: "是否愿意推荐给朋友",
            required: true,
            options: ["非常愿意", "比较愿意", "一般", "不太愿意", "完全不愿意"],
          },
        ],
        aiFeatures: {
          autoFill: false,
          smartValidation: true,
          predictiveText: false,
          sentimentAnalysis: true,
        },
        integrations: ["CRM", "数据分析"],
      },
      {
        id: "design-consultation",
        name: "设计咨询需求表",
        description: "客户设计需求详细收集，AI匹配最佳设计师",
        category: "consultation",
        fields: [
          {
            id: "projectType",
            type: "select",
            label: "项目类型",
            required: true,
            options: ["新房装修", "旧房改造", "局部装修", "软装设计"],
          },
          {
            id: "roomCount",
            type: "number",
            label: "房间数量",
            required: true,
            validation: {
              min: 1,
              max: 20,
            },
          },
          {
            id: "area",
            type: "number",
            label: "房屋面积（平方米）",
            required: true,
            validation: {
              min: 30,
              max: 1000,
            },
          },
          {
            id: "designStyle",
            type: "checkbox",
            label: "喜欢的设计风格（可多选）",
            required: true,
            options: ["现代简约", "北欧", "中式", "欧式", "美式", "日式", "工业风", "混搭"],
          },
          {
            id: "colorPreference",
            type: "checkbox",
            label: "色彩偏好（可多选）",
            required: false,
            options: ["白色系", "灰色系", "暖色系", "冷色系", "大地色系", "彩色系"],
          },
          {
            id: "functionalRequirements",
            type: "checkbox",
            label: "功能需求（可多选）",
            required: true,
            options: ["收纳空间", "办公区域", "娱乐区域", "儿童区域", "老人区域", "宠物区域"],
          },
          {
            id: "designBudget",
            type: "select",
            label: "设计预算范围",
            required: true,
            options: ["5万以下", "5-10万", "10-20万", "20-50万", "50万以上"],
          },
          {
            id: "timeline",
            type: "select",
            label: "期望完成时间",
            required: true,
            options: ["1个月内", "2-3个月", "3-6个月", "半年以上", "时间灵活"],
          },
          {
            id: "designerRequirement",
            type: "textarea",
            label: "对设计师的要求",
            placeholder: "如经验要求、沟通方式偏好等",
            required: false,
          },
        ],
        aiFeatures: {
          autoFill: true,
          smartValidation: true,
          predictiveText: true,
          sentimentAnalysis: false,
        },
        integrations: ["设计师匹配", "CRM", "项目管理"],
      },
    ]

    // 模拟表单提交数据
    const submissions: FormSubmission[] = [
      {
        id: "SUB_001",
        templateId: "customer-intake",
        data: {
          name: "张先生",
          phone: "13800138001",
          houseType: "三室两厅",
          budget: 250000,
          style: "现代简约",
          familyStructure: "三口之家",
          urgency: "比较紧急（3个月内）",
          specialNeeds: "需要考虑儿童房的安全设计，希望使用环保材料",
          source: "官网咨询",
        },
        submittedAt: new Date("2024-01-20T10:30:00"),
        source: "官网",
        aiAnalysis: {
          sentiment: "positive",
          intent: "高意向客户",
          priority: "high",
          tags: ["年轻家庭", "环保意识", "预算充足", "时间紧迫"],
          recommendations: ["优先安排资深设计师", "推荐环保材料套餐", "提供儿童房安全设计方案", "48小时内主动联系"],
        },
      },
      {
        id: "SUB_002",
        templateId: "satisfaction-survey",
        data: {
          customerName: "李女士",
          serviceType: "产品安装",
          overallSatisfaction: "非常满意",
          serviceQuality: "优秀",
          responseTime: "非常及时",
          staffAttitude: "非常好",
          suggestions: "服务很专业，安装师傅很细心，希望能提供更多的保养建议",
          recommendation: "非常愿意",
        },
        submittedAt: new Date("2024-01-19T16:45:00"),
        source: "微信小程序",
        aiAnalysis: {
          sentiment: "positive",
          intent: "满意客户",
          priority: "medium",
          tags: ["高满意度", "愿意推荐", "关注保养"],
          recommendations: ["发送保养指南", "邀请参与转介绍活动", "定期回访维护关系", "收集更多正面评价"],
        },
      },
    ]

    setFormTemplates(templates)
    setFormSubmissions(submissions)
    setSelectedTemplate(templates[0] || null)
  }

  // AI智能填充建议
  const getAISuggestion = (fieldId: string, currentValue: string) => {
    const suggestions: Record<string, string[]> = {
      specialNeeds: [
        "老人无障碍设计（扶手、防滑）",
        "儿童安全设计（圆角、防撞）",
        "宠物友好设计（易清洁材料）",
        "智能家居集成",
        "收纳空间最大化",
        "采光通风优化",
      ],
      suggestions: [
        "希望提供更详细的产品说明",
        "建议增加售后服务频次",
        "期望更快的响应速度",
        "希望提供更多设计方案选择",
        "建议优化预约流程",
      ],
    }

    return suggestions[fieldId] || []
  }

  // 表单验证
  const validateForm = (template: FormTemplate, data: Record<string, any>) => {
    const errors: Record<string, string> = {}

    template.fields.forEach((field) => {
      const value = data[field.id]

      // 必填验证
      if (field.required && (!value || value === "")) {
        errors[field.id] = `${field.label}为必填项`
        return
      }

      // 类型验证
      if (value && field.validation) {
        const { min, max, pattern, message } = field.validation

        if (field.type === "number") {
          const numValue = Number(value)
          if (min && numValue < min) {
            errors[field.id] = message || `${field.label}不能小于${min}`
          }
          if (max && numValue > max) {
            errors[field.id] = message || `${field.label}不能大于${max}`
          }
        }

        if (field.type === "phone" && pattern) {
          const regex = new RegExp(pattern)
          if (!regex.test(value)) {
            errors[field.id] = message || `${field.label}格式不正确`
          }
        }
      }
    })

    return errors
  }

  // AI分析表单提交
  const analyzeSubmission = (template: FormTemplate, data: Record<string, any>) => {
    // 模拟AI分析逻辑
    let sentiment: "positive" | "neutral" | "negative" = "neutral"
    let priority: "high" | "medium" | "low" = "medium"
    const tags: string[] = []
    const recommendations: string[] = []

    // 客户信息采集表分析
    if (template.id === "customer-intake") {
      const budget = Number(data.budget)
      const urgency = data.urgency

      // 预算分析
      if (budget > 300000) {
        tags.push("高预算客户")
        priority = "high"
        recommendations.push("安排资深设计师")
      } else if (budget > 150000) {
        tags.push("中等预算客户")
      } else {
        tags.push("预算敏感客户")
        recommendations.push("提供性价比方案")
      }

      // 紧急程度分析
      if (urgency.includes("非常紧急")) {
        priority = "high"
        tags.push("时间紧迫")
        recommendations.push("24小时内联系")
      } else if (urgency.includes("比较紧急")) {
        tags.push("有时间要求")
        recommendations.push("48小时内联系")
      }

      // 家庭结构分析
      if (data.familyStructure.includes("三口之家")) {
        tags.push("年轻家庭")
        recommendations.push("推荐儿童友好设计")
      } else if (data.familyStructure.includes("三代同堂")) {
        tags.push("多代家庭")
        recommendations.push("考虑适老化设计")
      }

      sentiment = "positive"
    }

    // 满意度调查分析
    if (template.id === "satisfaction-survey") {
      const satisfaction = data.overallSatisfaction
      const recommendation = data.recommendation

      if (satisfaction === "非常满意" || satisfaction === "满意") {
        sentiment = "positive"
        tags.push("高满意度")
        if (recommendation === "非常愿意" || recommendation === "比较愿意") {
          recommendations.push("邀请参与转介绍活动")
        }
      } else if (satisfaction === "不满意" || satisfaction === "非常不满意") {
        sentiment = "negative"
        priority = "high"
        tags.push("不满意客户")
        recommendations.push("立即跟进处理")
      }
    }

    return {
      sentiment,
      intent: priority === "high" ? "重点关注" : "常规跟进",
      priority,
      tags,
      recommendations,
    }
  }

  // 渲染表单字段
  const renderFormField = (field: FormField, value: any, onChange: (value: any) => void, error?: string) => {
    const commonProps = {
      id: field.id,
      className: `${error ? "border-red-500" : ""} bg-slate-800/50 border-slate-700/50`,
    }

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <div>
            <Input
              {...commonProps}
              type={field.type}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
            {field.aiSuggestion && value && (
              <div className="mt-2 space-y-1">
                {getAISuggestion(field.id, value)
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-blue-400 hover:text-blue-300"
                      onClick={() => onChange(suggestion)}
                    >
                      💡 {suggestion}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )

      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )

      case "textarea":
        return (
          <div>
            <Textarea
              {...commonProps}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
            />
            {field.aiSuggestion && (
              <div className="mt-2 space-y-1">
                {getAISuggestion(field.id, value || "")
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-blue-400 hover:text-blue-300"
                      onClick={() => onChange(value ? `${value}\n${suggestion}` : suggestion)}
                    >
                      💡 {suggestion}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={commonProps.className}>
              <SelectValue placeholder={field.placeholder || `请选择${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup value={value || ""} onValueChange={onChange}>
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`} className="text-sm text-slate-300">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || []
                    if (checked) {
                      onChange([...currentValues, option])
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option))
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${option}`} className="text-sm text-slate-300">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  // 提交表单
  const handleSubmitForm = () => {
    if (!selectedTemplate) return

    const errors = validateForm(selectedTemplate, formData)
    if (Object.keys(errors).length > 0) {
      return
    }

    const aiAnalysis = analyzeSubmission(selectedTemplate, formData)
    const newSubmission: FormSubmission = {
      id: `SUB_${Date.now()}`,
      templateId: selectedTemplate.id,
      data: formData,
      submittedAt: new Date(),
      source: "系统测试",
      aiAnalysis,
    }

    setFormSubmissions((prev) => [newSubmission, ...prev])
    setFormData({})
    alert("表单提交成功！AI分析已完成。")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  智能表单系统
                </h1>
                <p className="text-slate-400">AI驱动的智能表单创建、分析与管理平台</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <Brain className="h-3 w-3 mr-1" />
                AI分析
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                表单模板: {formTemplates.length}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                提交数据: {formSubmissions.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border-slate-700/50">
            <TabsTrigger value="templates" className="data-[state=active]:bg-green-600/20">
              表单模板
            </TabsTrigger>
            <TabsTrigger value="builder" className="data-[state=active]:bg-green-600/20">
              表单构建
            </TabsTrigger>
            <TabsTrigger value="submissions" className="data-[state=active]:bg-green-600/20">
              提交数据
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600/20">
              数据分析
            </TabsTrigger>
          </TabsList>

          {/* 表单模板页面 */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {formTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-green-500/50 bg-green-500/10"
                      : "hover:border-slate-600/50"
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-200">{template.name}</CardTitle>
                      <Badge
                        className={
                          template.category === "customer"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                            : template.category === "survey"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                        }
                      >
                        {template.category === "customer"
                          ? "客户管理"
                          : template.category === "survey"
                            ? "满意度调查"
                            : "咨询服务"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 mb-4">{template.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">字段数量:</span>
                        <span className="text-slate-200">{template.fields.length}个</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">AI功能:</span>
                        <div className="flex space-x-1">
                          {template.aiFeatures.autoFill && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                              智能填充
                            </Badge>
                          )}
                          {template.aiFeatures.sentimentAnalysis && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                              情感分析
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">集成系统:</span>
                        <span className="text-slate-200">{template.integrations.join(", ")}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsPreviewMode(true)
                          setActiveTab("builder")
                        }}
                      >
                        预览表单
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          // 复制表单逻辑
                        }}
                      >
                        复制
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 表单构建页面 */}
          <TabsContent value="builder" className="space-y-6">
            {selectedTemplate && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 表单预览/编辑 */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-green-500" />
                        {selectedTemplate.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={isPreviewMode ? "default" : "outline"}
                          onClick={() => setIsPreviewMode(!isPreviewMode)}
                        >
                          {isPreviewMode ? "编辑模式" : "预览模式"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedTemplate.fields.map((field) => {
                        const value = formData[field.id]
                        const error = validateForm(selectedTemplate, formData)[field.id]

                        return (
                          <div key={field.id} className="space-y-2">
                            <Label htmlFor={field.id} className="text-slate-300 flex items-center">
                              {field.label}
                              {field.required && <span className="text-red-400 ml-1">*</span>}
                              {field.aiSuggestion && (
                                <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </Label>

                            {renderFormField(
                              field,
                              value,
                              (newValue) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  [field.id]: newValue,
                                }))
                              },
                              error,
                            )}

                            {error && (
                              <p className="text-xs text-red-400 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {error}
                              </p>
                            )}
                          </div>
                        )
                      })}

                      <div className="flex space-x-3 pt-4">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSubmitForm}>
                          <Send className="h-4 w-4 mr-2" />
                          提交表单
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-700 bg-transparent"
                          onClick={() => setFormData({})}
                        >
                          重置
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 表单配置 */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-blue-500" />
                      表单配置
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* AI功能配置 */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3">AI功能</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div>
                              <p className="text-sm text-slate-200">智能填充</p>
                              <p className="text-xs text-slate-400">AI建议填充内容</p>
                            </div>
                            <Badge
                              className={
                                selectedTemplate.aiFeatures.autoFill
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                              }
                            >
                              {selectedTemplate.aiFeatures.autoFill ? "已启用" : "未启用"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div>
                              <p className="text-sm text-slate-200">智能验证</p>
                              <p className="text-xs text-slate-400">AI辅助数据验证</p>
                            </div>
                            <Badge
                              className={
                                selectedTemplate.aiFeatures.smartValidation
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                              }
                            >
                              {selectedTemplate.aiFeatures.smartValidation ? "已启用" : "未启用"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div>
                              <p className="text-sm text-slate-200">情感分析</p>
                              <p className="text-xs text-slate-400">分析用户情感倾向</p>
                            </div>
                            <Badge
                              className={
                                selectedTemplate.aiFeatures.sentimentAnalysis
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                              }
                            >
                              {selectedTemplate.aiFeatures.sentimentAnalysis ? "已启用" : "未启用"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* 集成配置 */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3">系统集成</h4>
                        <div className="space-y-2">
                          {selectedTemplate.integrations.map((integration) => (
                            <div
                              key={integration}
                              className="flex items-center justify-between p-2 bg-slate-800/30 rounded"
                            >
                              <span className="text-sm text-slate-200">{integration}</span>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">已连接</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 表单统计 */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3">使用统计</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                            <p className="text-lg font-bold text-blue-400">
                              {formSubmissions.filter((s) => s.templateId === selectedTemplate.id).length}
                            </p>
                            <p className="text-xs text-slate-400">总提交数</p>
                          </div>
                          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                            <p className="text-lg font-bold text-green-400">
                              {Math.round(
                                (formSubmissions.filter(
                                  (s) => s.templateId === selectedTemplate.id && s.aiAnalysis?.sentiment === "positive",
                                ).length /
                                  Math.max(
                                    formSubmissions.filter((s) => s.templateId === selectedTemplate.id).length,
                                    1,
                                  )) *
                                  100,
                              )}
                              %
                            </p>
                            <p className="text-xs text-slate-400">正面情感</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* 提交数据页面 */}
          <TabsContent value="submissions" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {formSubmissions.map((submission) => {
                const template = formTemplates.find((t) => t.id === submission.templateId)
                return (
                  <Card key={submission.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg text-slate-200">
                            {template?.name} - {submission.id}
                          </CardTitle>
                          <p className="text-sm text-slate-400">
                            提交时间: {submission.submittedAt.toLocaleString()} | 来源: {submission.source}
                          </p>
                        </div>
                        {submission.aiAnalysis && (
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={
                                submission.aiAnalysis.sentiment === "positive"
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : submission.aiAnalysis.sentiment === "negative"
                                    ? "bg-red-500/20 text-red-400 border-red-500/50"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                              }
                            >
                              {submission.aiAnalysis.sentiment === "positive"
                                ? "正面"
                                : submission.aiAnalysis.sentiment === "negative"
                                  ? "负面"
                                  : "中性"}
                            </Badge>
                            <Badge
                              className={
                                submission.aiAnalysis.priority === "high"
                                  ? "bg-red-500/20 text-red-400 border-red-500/50"
                                  : submission.aiAnalysis.priority === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                    : "bg-green-500/20 text-green-400 border-green-500/50"
                              }
                            >
                              {submission.aiAnalysis.priority === "high"
                                ? "高优先级"
                                : submission.aiAnalysis.priority === "medium"
                                  ? "中优先级"
                                  : "低优先级"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 提交数据 */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-3">提交数据</h4>
                          <div className="space-y-2">
                            {Object.entries(submission.data).map(([key, value]) => {
                              const field = template?.fields.find((f) => f.id === key)
                              return (
                                <div key={key} className="flex justify-between p-2 bg-slate-800/30 rounded">
                                  <span className="text-sm text-slate-400">{field?.label || key}:</span>
                                  <span className="text-sm text-slate-200 text-right max-w-xs">
                                    {Array.isArray(value) ? value.join(", ") : String(value)}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* AI分析结果 */}
                        {submission.aiAnalysis && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-3">AI分析结果</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs text-slate-400 mb-1">客户标签</p>
                                <div className="flex flex-wrap gap-1">
                                  {submission.aiAnalysis.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs bg-slate-800/50">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400 mb-1">AI建议</p>
                                <div className="space-y-1">
                                  {submission.aiAnalysis.recommendations.map((rec, index) => (
                                    <div key={index} className="text-xs text-slate-300 flex items-start">
                                      <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                      {rec}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* 数据分析页面 */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 提交统计 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-orange-500" />
                    提交统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">{formSubmissions.length}</p>
                      <p className="text-sm text-slate-400">总提交数</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">
                        {formSubmissions.filter((s) => s.aiAnalysis?.sentiment === "positive").length}
                      </p>
                      <p className="text-sm text-slate-400">正面反馈</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-2xl font-bold text-red-400">
                        {formSubmissions.filter((s) => s.aiAnalysis?.priority === "high").length}
                      </p>
                      <p className="text-sm text-slate-400">高优先级</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">
                        {Math.round(
                          (formSubmissions.filter((s) => s.aiAnalysis?.sentiment === "positive").length /
                            Math.max(formSubmissions.length, 1)) *
                            100,
                        )}
                        %
                      </p>
                      <p className="text-sm text-slate-400">满意度</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 情感分析 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-purple-500" />
                    情感分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["positive", "neutral", "negative"].map((sentiment) => {
                      const count = formSubmissions.filter((s) => s.aiAnalysis?.sentiment === sentiment).length
                      const percentage = Math.round((count / Math.max(formSubmissions.length, 1)) * 100)

                      return (
                        <div key={sentiment}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">
                              {sentiment === "positive" ? "正面" : sentiment === "negative" ? "负面" : "中性"}
                            </span>
                            <span className="text-slate-200">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <Progress
                            value={percentage}
                            className={`h-2 ${
                              sentiment === "positive"
                                ? "[&>div]:bg-green-500"
                                : sentiment === "negative"
                                  ? "[&>div]:bg-red-500"
                                  : "[&>div]:bg-yellow-500"
                            }`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 热门标签 */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-cyan-500" />
                    热门标签分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      formSubmissions
                        .flatMap((s) => s.aiAnalysis?.tags || [])
                        .reduce((acc, tag) => {
                          acc.set(tag, (acc.get(tag) || 0) + 1)
                          return acc
                        }, new Map<string, number>())
                        .entries(),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 20)
                      .map(([tag, count]) => (
                        <Badge key={tag} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                          {tag} ({count})
                        </Badge>
                      ))}
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
