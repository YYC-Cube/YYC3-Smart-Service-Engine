"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Copy,
  Play,
  Pause,
  Download,
  Upload,
  Filter,
  SortAsc,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Script {
  id: string
  title: string
  category: string
  content: string
  variables: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  usage: number
}

interface ScriptCategory {
  id: string
  name: string
  description: string
  color: string
}

interface ValidationErrors {
  title?: string
  content?: string
  category?: string
}

const SCRIPT_CATEGORIES: ScriptCategory[] = [
  { id: "greeting", name: "问候语", description: "客户接待和问候", color: "bg-blue-500" },
  { id: "product-intro", name: "产品介绍", description: "产品特点和优势介绍", color: "bg-green-500" },
  { id: "objection-handling", name: "异议处理", description: "处理客户疑虑和异议", color: "bg-yellow-500" },
  { id: "closing", name: "成交话术", description: "促成交易的话术", color: "bg-red-500" },
  { id: "after-sales", name: "售后服务", description: "售后跟进和服务", color: "bg-purple-500" },
  { id: "complaint", name: "投诉处理", description: "客户投诉和问题解决", color: "bg-orange-500" },
]

const STORAGE_KEY = "yyc3-script-management"
const AUTOSAVE_DELAY = 1000 // 1 second
const MAX_TAGS = 5
const MAX_TITLE_LENGTH = 100
const MAX_CONTENT_LENGTH = 2000

export default function ScriptManagement() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isPlaying, setIsPlaying] = useState(false)
  const [sortBy, setSortBy] = useState<"usage" | "updatedAt" | "title">("updatedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showInactive, setShowInactive] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadScriptsFromStorage()
  }, [])

  useEffect(() => {
    if (scripts.length > 0) {
      saveScriptsToStorage()
    }
  }, [scripts])

  const loadScriptsFromStorage = useCallback(() => {
    try {
      setIsLoading(true)
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const scriptsWithDates = parsed.map((script: any) => ({
            ...script,
            createdAt: new Date(script.createdAt),
            updatedAt: new Date(script.updatedAt),
          }))
          setScripts(scriptsWithDates)
        }
      } else {
        initializeMockData()
      }
    } catch (error) {
      console.error("Failed to load scripts:", error)
      initializeMockData()
      toast({
        title: "加载失败",
        description: "无法加载话术数据，已使用默认数据",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveScriptsToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts))
    } catch (error) {
      console.error("Failed to save scripts:", error)
      toast({
        title: "保存失败",
        description: "无法保存话术数据到本地存储",
        variant: "destructive",
      })
    }
  }, [scripts])

  const initializeMockData = () => {
    const mockScripts: Script[] = [
      {
        id: "1",
        title: "专业问候语",
        category: "greeting",
        content:
          "您好，欢迎来到{company_name}！我是您的专属顾问{agent_name}，很高兴为您服务。请问今天有什么可以帮助您的吗？",
        variables: ["company_name", "agent_name"],
        tags: ["问候", "专业", "热情"],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        isActive: true,
        usage: 156,
      },
      {
        id: "2",
        title: "沙发产品介绍",
        category: "product-intro",
        content:
          "这款{product_name}沙发采用{material}材质，具有{features}等特点。它的尺寸是{dimensions}，非常适合{space_type}空间。我们提供{warranty}年质保，让您购买无忧。",
        variables: ["product_name", "material", "features", "dimensions", "space_type", "warranty"],
        tags: ["沙发", "介绍", "特点"],
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-18"),
        isActive: true,
        usage: 89,
      },
      {
        id: "3",
        title: "价格异议处理",
        category: "objection-handling",
        content:
          "我理解您对价格的关注。让我为您分析一下这个价格的合理性：首先，我们使用的是{material_quality}材料；其次，{craftsmanship_details}；最重要的是，我们提供{service_guarantee}。从长远来看，这是一个非常划算的投资。",
        variables: ["material_quality", "craftsmanship_details", "service_guarantee"],
        tags: ["价格", "异议", "解释"],
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-22"),
        isActive: true,
        usage: 67,
      },
      {
        id: "4",
        title: "成交促单话术",
        category: "closing",
        content:
          "基于您的需求，我强烈推荐您现在就下单。因为{reason_1}，而且{reason_2}。现在下单还能享受{promotion}优惠，这个机会真的很难得！",
        variables: ["reason_1", "reason_2", "promotion"],
        tags: ["成交", "促单", "优惠"],
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-15"),
        isActive: true,
        usage: 45,
      },
      {
        id: "5",
        title: "投诉安抚话术",
        category: "complaint",
        content:
          "非常抱歉给您带来了不好的体验，我完全理解您的心情。关于{issue}问题，我们会立即{solution}。同时，为了表示我们的歉意，我们愿意为您提供{compensation}。",
        variables: ["issue", "solution", "compensation"],
        tags: ["投诉", "安抚", "售后"],
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-10"),
        isActive: false,
        usage: 23,
      },
    ]
    setScripts(mockScripts)
  }

  const validateScript = (script: Partial<Script>): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (!script.title?.trim()) {
      errors.title = "标题不能为空"
    } else if (script.title.length > MAX_TITLE_LENGTH) {
      errors.title = `标题长度不能超过 ${MAX_TITLE_LENGTH} 个字符`
    }

    if (!script.content?.trim()) {
      errors.content = "内容不能为空"
    } else if (script.content.length > MAX_CONTENT_LENGTH) {
      errors.content = `内容长度不能超过 ${MAX_CONTENT_LENGTH} 个字符`
    }

    if (!script.category) {
      errors.category = "请选择一个分类"
    }

    return errors
  }

  const filteredAndSortedScripts = useMemo(() => {
    let result = scripts.filter((script) => {
      const matchesSearch =
        script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || script.category === selectedCategory
      const matchesStatus = showInactive || script.isActive

      return matchesSearch && matchesCategory && matchesStatus
    })

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "usage":
          comparison = a.usage - b.usage
          break
        case "updatedAt":
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [scripts, searchTerm, selectedCategory, sortBy, sortOrder, showInactive])

  const handleCreateScript = () => {
    const newScript: Script = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: "",
      category: "greeting",
      content: "",
      variables: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      usage: 0,
    }
    setSelectedScript(newScript)
    setIsEditing(true)
    setValidationErrors({})
  }

  const handleSaveScript = useCallback(
    (script: Script) => {
      const errors = validateScript(script)
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        toast({
          title: "验证失败",
          description: "请检查表单中的错误",
          variant: "destructive",
        })
        return false
      }

      setValidationErrors({})

      if (scripts.find((s) => s.id === script.id)) {
        setScripts((prev) =>
          prev.map((s) => (s.id === script.id ? { ...script, updatedAt: new Date() } : s))
        )
        toast({
          title: "保存成功",
          description: `"${script.title}" 已更新`,
        })
      } else {
        setScripts((prev) => [...prev, script])
        toast({
          title: "创建成功",
          description: `"${script.title}" 已添加到话术库`,
        })
      }

      setIsEditing(false)
      setSelectedScript(script)
      return true
    },
    [scripts]
  )

  const handleDeleteScript = useCallback(
    (scriptId: string) => {
      const scriptToDelete = scripts.find((s) => s.id === scriptId)
      setScripts((prev) => prev.filter((s) => s.id !== scriptId))

      if (selectedScript?.id === scriptId) {
        setSelectedScript(null)
        setIsEditing(false)
      }

      setSelectedIds((prev) => prev.filter((id) => id !== scriptId))

      toast({
        title: "删除成功",
        description: `"${scriptToDelete?.title || "话术"}" 已删除`,
      })
    },
    [scripts, selectedScript]
  )

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return

    setScripts((prev) => prev.filter((s) => !selectedIds.includes(s.id)))
    setSelectedScript(null)
    setIsEditing(false)
    setSelectedIds([])

    toast({
      title: "批量删除成功",
      description: `已删除 ${selectedIds.length} 个话术`,
    })
  }

  const handleBatchToggleActive = (isActive: boolean) => {
    setScripts((prev) =>
      prev.map((s) => (selectedIds.includes(s.id) ? { ...s, isActive } : s))
    )
    setSelectedIds([])

    toast({
      title: "批量更新成功",
      description: `已${isActive ? "启用" : "禁用"} ${selectedIds.length} 个话术`,
    })
  }

  const handleCopyScript = async (script: Script) => {
    try {
      await navigator.clipboard.writeText(script.content)
      toast({
        title: "复制成功",
        description: `"${script.title}" 内容已复制到剪贴板`,
      })
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateScript = (script: Script) => {
    const duplicated: Script = {
      ...script,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${script.title} (副本)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usage: 0,
    }
    setScripts((prev) => [...prev, duplicated])
    setSelectedScript(duplicated)
    setIsEditing(true)

    toast({
      title: "复制成功",
      description: `已创建 "${script.title}" 的副本`,
    })
  }

  const handleExportScripts = () => {
    const dataStr = JSON.stringify(filteredAndSortedScripts, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    const exportFileDefaultName = `yyc3-scripts-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "导出成功",
      description: `已导出 ${filteredAndSortedScripts.length} 个话术`,
    })
  }

  const handleImportScripts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (!Array.isArray(imported)) throw new Error("Invalid format")

        const importedScripts: Script[] = imported.map((script: any) => ({
          ...script,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(script.createdAt),
          updatedAt: new Date(),
          usage: 0,
        }))

        setScripts((prev) => [...prev, ...importedScripts])

        toast({
          title: "导入成功",
          description: `已导入 ${importedScripts.length} 个话术`,
        })
      } catch (error) {
        toast({
          title: "导入失败",
          description: "文件格式无效，请上传有效的 JSON 文件",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const handleToggleSelect = (scriptId: string) => {
    setSelectedIds((prev) =>
      prev.includes(scriptId) ? prev.filter((id) => id !== scriptId) : [...prev, scriptId]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedScripts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredAndSortedScripts.map((s) => s.id))
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return SCRIPT_CATEGORIES.find((cat) => cat.id === categoryId) || SCRIPT_CATEGORIES[0]
  }

  const stats = useMemo(
    () => ({
      total: scripts.length,
      active: scripts.filter((s) => s.isActive).length,
      inactive: scripts.filter((s) => !s.isActive).length,
      totalUsage: scripts.reduce((sum, s) => sum + s.usage, 0),
    }),
    [scripts]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-slate-300">加载话术库...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">话术管理系统</h2>
          <p className="text-slate-400 mt-1">管理和优化客服话术模板 · 支持 CRUD 完整操作</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleExportScripts} variant="outline" size="sm" className="border-slate-600/50">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>

          <Label htmlFor="import-scripts" className="cursor-pointer">
            <Button variant="outline" size="sm" asChild className="border-slate-600/50">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                导入
              </span>
            </Button>
          </Label>
          <Input id="import-scripts" type="file" accept=".json" onChange={handleImportScripts} className="hidden" />

          <Button onClick={handleCreateScript} className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            新建话术
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xl font-bold text-cyan-400">{stats.total}</p>
              <p className="text-xs text-slate-400 mt-1">总话术数</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xl font-bold text-green-400">{stats.active}</p>
              <p className="text-xs text-slate-400 mt-1">启用中</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xl font-bold text-red-400">{stats.inactive}</p>
              <p className="text-xs text-slate-400 mt-1">已停用</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xl font-bold text-yellow-400">{stats.totalUsage}</p>
              <p className="text-xs text-slate-400 mt-1">总使用次数</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 话术列表 */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <Input
                    placeholder="搜索话术..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white flex-1">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-white">
                        全部分类 ({scripts.length})
                      </SelectItem>
                      {SCRIPT_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-white">
                          {category.name} ({scripts.filter((s) => s.category === category.id).length})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white text-sm w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="updatedAt">最近更新</SelectItem>
                        <SelectItem value="usage">使用频率</SelectItem>
                        <SelectItem value="title">标题排序</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="text-slate-400 hover:text-white"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant={showInactive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setShowInactive(!showInactive)}
                    className={`text-xs ${showInactive ? "" : "text-slate-400"}`}
                  >
                    {showInactive ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                    显示停用
                  </Button>

                  <span className="text-xs text-slate-500">
                    {filteredAndSortedScripts.length} / {stats.total}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {selectedIds.length > 0 && (
                <div className="flex items-center space-x-2 p-2 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAndSortedScripts.length}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                  <span className="text-sm text-cyan-300 flex-1">已选 {selectedIds.length} 项</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBatchDelete}
                    className="text-red-400 hover:text-red-300 h-6 px-2"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    删除
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBatchToggleActive(true)}
                    className="text-green-400 hover:text-green-300 h-6 px-2"
                  >
                    启用
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBatchToggleActive(false)}
                    className="text-yellow-400 hover:text-yellow-300 h-6 px-2"
                  >
                    禁用
                  </Button>
                </div>
              )}

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredAndSortedScripts.map((script) => {
                  const categoryInfo = getCategoryInfo(script.category)
                  const isSelected = selectedIds.includes(script.id)
                  return (
                    <div
                      key={script.id}
                      className={`group p-3 rounded-lg cursor-pointer transition-all ${
                        selectedScript?.id === script.id
                          ? "bg-slate-700/70 border border-cyan-500/50"
                          : "bg-slate-700/30 hover:bg-slate-700/50 border border-transparent"
                      } ${!script.isActive ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(script.id)}
                          className="mt-1 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div
                          className="flex-1 min-w-0"
                          onClick={() => {
                            setSelectedScript(script)
                            setIsEditing(false)
                          }}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-white text-sm truncate">{script.title}</h4>
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${
                                script.isActive ? "bg-green-500" : "bg-slate-500"
                              }`}
                            />
                          </div>

                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant="secondary"
                              className={`${categoryInfo?.color || 'bg-gray-500'} text-white text-xs px-1.5 py-0`}
                            >
                              {categoryInfo?.name || '未分类'}
                            </Badge>
                            <span className="text-xs text-slate-400">使用 {script.usage} 次</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {script.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-600/50 rounded text-slate-300">
                                {tag}
                              </span>
                            ))}
                            {script.tags.length > 2 && (
                              <span className="text-xs text-slate-500">+{script.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1.5 text-xs text-slate-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyScript(script)
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1.5 text-xs text-slate-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateScript(script)
                          }}
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1.5 text-xs text-red-400 hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteScript(script.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {filteredAndSortedScripts.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">没有找到匹配的话术</p>
                    <p className="text-xs mt-1">尝试调整搜索条件或筛选器</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 话术详情和编辑 */}
        <div className="lg:col-span-2">
          {selectedScript ? (
            <ScriptEditor
              script={selectedScript}
              isEditing={isEditing}
              onSave={handleSaveScript}
              onEdit={() => {
                setIsEditing(true)
                setValidationErrors({})
              }}
              onCancel={() => {
                setIsEditing(false)
                setValidationErrors({})
              }}
              onDelete={() => handleDeleteScript(selectedScript.id)}
              onCopy={() => handleCopyScript(selectedScript)}
              onPlay={() => setIsPlaying(!isPlaying)}
              isPlaying={isPlaying}
              validationErrors={validationErrors}
              onUpdateScript={(updatedScript) => {
                if (autosaveTimerRef.current) {
                  clearTimeout(autosaveTimerRef.current)
                }
                autosaveTimerRef.current = setTimeout(() => {
                  // Auto-save logic can be added here
                }, AUTOSAVE_DELAY)
              }}
            />
          ) : (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="flex flex-col items-center justify-center h-96">
                <FileText className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-slate-400 mb-2">选择或创建一个话术</p>
                <p className="text-sm text-slate-500">从左侧列表选择，或点击"新建话术"开始</p>
                <Button
                  onClick={handleCreateScript}
                  variant="outline"
                  className="mt-4 border-slate-600/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  创建第一个话术
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

interface ScriptEditorProps {
  script: Script
  isEditing: boolean
  onSave: (script: Script) => void
  onEdit: () => void
  onCancel: () => void
  onDelete: () => void
  onCopy: () => void
  onPlay: () => void
  isPlaying: boolean
  validationErrors: ValidationErrors
  onUpdateScript: (script: Script) => void
}

function ScriptEditor({
  script,
  isEditing,
  onSave,
  onEdit,
  onCancel,
  onDelete,
  onCopy,
  onPlay,
  isPlaying,
  validationErrors,
}: ScriptEditorProps) {
  const [editedScript, setEditedScript] = useState<Script>(script)
  const [newTag, setNewTag] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    setEditedScript(script)
  }, [script])

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{([^}]+)\}/g)
    return matches ? [...new Set(matches.map((match) => match.slice(1, -1)))] : []
  }

  const handleContentChange = (content: string) => {
    const variables = extractVariables(content)
    setEditedScript((prev) => ({ ...prev, content, variables }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && editedScript.tags.length < MAX_TAGS && !editedScript.tags.includes(newTag.trim())) {
      setEditedScript((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedScript((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }))
  }

  const handleSave = () => {
    onSave(editedScript)
    setPreviewMode(false)
  }

  const renderPreview = () => {
    let preview = editedScript.content
    editedScript.variables.forEach((variable) => {
      preview = preview.replace(`{variable}`, `[${variable}]`)
    })
    return preview
  }

  const getCategoryInfo = (categoryId: string) => {
    return SCRIPT_CATEGORIES.find((cat) => cat.id === categoryId) || SCRIPT_CATEGORIES[0]
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {isEditing ? (
              <div className="flex-1 max-w-md">
                <Input
                  value={editedScript.title}
                  onChange={(e) => setEditedScript((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="输入话术标题..."
                  className={`bg-slate-700/50 border-slate-600/50 text-white font-semibold ${
                    validationErrors.title ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.title}</p>
                )}
              </div>
            ) : (
              <CardTitle className="text-white truncate">{script.title}</CardTitle>
            )}

            <Badge variant="secondary" className={`${getCategoryInfo(script.category)?.color || 'bg-gray-500'} text-white`}>
              {getCategoryInfo(script.category)?.name || '未分类'}
            </Badge>

            <Badge variant="outline" className={`${script.isActive ? "text-green-400 border-green-500/50" : "text-red-400 border-red-500/50"}`}>
              {script.isActive ? "启用" : "停用"}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="border-slate-600/50"
                >
                  {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={onPlay} className="border-slate-600/50">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={onCopy} className="border-slate-600/50">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={onEdit} className="border-slate-600/50">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="border-red-500/50 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}

            {isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={onCancel} className="border-slate-600/50">
                  <X className="w-4 h-4 mr-1" />
                  取消
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">分类</Label>
              <Select
                value={editedScript.category}
                onValueChange={(v) => setEditedScript((prev) => ({ ...prev, category: v }))}
              >
                <SelectTrigger
                  className={`bg-slate-700/50 border-slate-600/50 ${
                    validationErrors.category ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {SCRIPT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.category && (
                <p className="text-red-400 text-xs">{validationErrors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">话术内容</Label>
                <span className="text-xs text-slate-500">
                  {editedScript.content.length}/{MAX_CONTENT_LENGTH}
                </span>
              </div>
              <Textarea
                value={editedScript.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="输入话术内容，使用 {变量名} 格式插入变量..."
                className={`min-h-[200px] bg-slate-700/50 border-slate-600/50 text-slate-200 resize-none ${
                  validationErrors.content ? "border-red-500" : ""
                }`}
              />
              {validationErrors.content && (
                <p className="text-red-400 text-xs">{validationErrors.content}</p>
              )}

              {editedScript.variables.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-slate-400">识别到的变量：</span>
                  {editedScript.variables.map((variable) => (
                    <Badge key={variable} variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">
                标签 ({editedScript.tags.length}/{MAX_TAGS})
              </Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="添加标签..."
                  className="bg-slate-700/50 border-slate-600/50 text-white flex-1"
                  disabled={editedScript.tags.length >= MAX_TAGS}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || editedScript.tags.length >= MAX_TAGS}
                  className="border-slate-600/50"
                >
                  添加
                </Button>
              </div>

              {editedScript.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedScript.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-slate-600/50 text-slate-200 cursor-pointer hover:bg-red-500/20"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : previewMode ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="text-sm font-medium text-slate-300 mb-2">预览效果</h4>
              <div className="text-slate-200 whitespace-pre-line text-sm leading-relaxed">
                {renderPreview()}
              </div>
            </div>

            {editedScript.variables.length > 0 && (
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-sm font-medium text-slate-300 mb-2">变量替换测试</h4>
                <div className="space-y-2">
                  {editedScript.variables.map((variable) => (
                    <div key={variable} className="flex items-center space-x-2">
                      <code className="text-xs bg-slate-600 px-2 py-1 rounded text-cyan-300">
                        {`{${variable}}`}
                      </code>
                      <Input
                        placeholder="输入测试值..."
                        className="bg-slate-600/50 border-slate-500/50 text-white text-sm h-8"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="text-sm font-medium text-slate-300 mb-2">话术内容</h4>
              <div className="text-slate-200 whitespace-pre-line text-sm leading-relaxed max-h-[300px] overflow-y-auto">
                {script.content}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <h5 className="text-xs font-medium text-slate-400 mb-2">变量列表</h5>
                <div className="flex flex-wrap gap-1">
                  {script.variables.length > 0 ? (
                    script.variables.map((v) => (
                      <code key={v} className="text-xs bg-slate-600 px-1.5 py-0.5 rounded text-cyan-300">
                        {`{${v}}`}
                      </code>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">无变量</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-700/30 rounded-lg">
                <h5 className="text-xs font-medium text-slate-400 mb-2">标签</h5>
                <div className="flex flex-wrap gap-1">
                  {script.tags.length > 0 ? (
                    script.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-slate-600/50">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">无标签</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-3 bg-slate-700/20 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400">{script.usage}</p>
                <p className="text-xs text-slate-500">使用次数</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-300">
                  {new Date(script.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500">创建时间</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-300">
                  {new Date(script.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500">最后更新</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
