"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Edit, Trash2, Search, Copy, Play, Pause } from "lucide-react"

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

const SCRIPT_CATEGORIES: ScriptCategory[] = [
  { id: "greeting", name: "问候语", description: "客户接待和问候", color: "bg-blue-500" },
  { id: "product-intro", name: "产品介绍", description: "产品特点和优势介绍", color: "bg-green-500" },
  { id: "objection-handling", name: "异议处理", description: "处理客户疑虑和异议", color: "bg-yellow-500" },
  { id: "closing", name: "成交话术", description: "促成交易的话术", color: "bg-red-500" },
  { id: "after-sales", name: "售后服务", description: "售后跟进和服务", color: "bg-purple-500" },
  { id: "complaint", name: "投诉处理", description: "客户投诉和问题解决", color: "bg-orange-500" },
]

function ScriptManagement() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isPlaying, setIsPlaying] = useState(false)

  // 模拟数据
  useEffect(() => {
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
    ]
    setScripts(mockScripts)
  }, [])

  const filteredScripts = scripts.filter((script) => {
    const matchesSearch =
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || script.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCreateScript = () => {
    const newScript: Script = {
      id: Date.now().toString(),
      title: "新话术",
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
  }

  const handleSaveScript = (script: Script) => {
    if (scripts.find((s) => s.id === script.id)) {
      setScripts((prev) => prev.map((s) => (s.id === script.id ? { ...script, updatedAt: new Date() } : s)))
    } else {
      setScripts((prev) => [...prev, script])
    }
    setIsEditing(false)
    setSelectedScript(script)
  }

  const handleDeleteScript = (scriptId: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== scriptId))
    if (selectedScript?.id === scriptId) {
      setSelectedScript(null)
    }
  }

  const handleCopyScript = (script: Script) => {
    navigator.clipboard.writeText(script.content)
  }

  const handlePlayScript = () => {
    setIsPlaying(!isPlaying)
    // 这里可以集成语音合成API
  }

  const getCategoryInfo = (categoryId: string) => {
    return SCRIPT_CATEGORIES.find((cat) => cat.id === categoryId) || SCRIPT_CATEGORIES[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">话术管理</h2>
          <p className="text-slate-400">管理和优化客服话术模板</p>
        </div>
        <Button onClick={handleCreateScript} className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          新建话术
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 话术列表 */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                  placeholder="搜索话术..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">
                    全部分类
                  </SelectItem>
                  {SCRIPT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-white">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredScripts.map((script) => {
                  const categoryInfo = getCategoryInfo(script.category)
                  return (
                    <div
                      key={script.id}
                      onClick={() => setSelectedScript(script)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedScript?.id === script.id
                          ? "bg-slate-700/70 border border-cyan-500/50"
                          : "bg-slate-700/30 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{script.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className={`${categoryInfo.color} text-white text-xs`}>
                              {categoryInfo.name}
                            </Badge>
                            <span className="text-xs text-slate-400">使用 {script.usage} 次</span>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${script.isActive ? "bg-green-500" : "bg-slate-500"}`} />
                      </div>
                    </div>
                  )
                })}
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
              onEdit={() => setIsEditing(true)}
              onCancel={() => setIsEditing(false)}
              onDelete={() => handleDeleteScript(selectedScript.id)}
              onCopy={() => handleCopyScript(selectedScript)}
              onPlay={handlePlayScript}
              isPlaying={isPlaying}
            />
          ) : (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>选择一个话术查看详情</p>
                </div>
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
}: ScriptEditorProps) {
  const [editedScript, setEditedScript] = useState<Script>(script)

  useEffect(() => {
    setEditedScript(script)
  }, [script])

  const handleSave = () => {
    onSave(editedScript)
  }

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{([^}]+)\}/g)
    return matches ? matches.map((match) => match.slice(1, -1)) : []
  }

  const handleContentChange = (content: string) => {
    const variables = extractVariables(content)
    setEditedScript((prev) => ({ ...prev, content, variables }))
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <Input
                value={editedScript.title}
                onChange={(e) => setEditedScript((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-slate-700/50 border-slate-600/50 text-white font-semibold"
              />
            ) : (
              <CardTitle className="text-white">{script.title}</CardTitle>
            )}
            <Badge variant="secondary" className={`${getCategoryInfo(script.category).color} text-white`}>
              {getCategoryInfo(script.category).name}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={onPlay} className="border-slate-600/50 bg-transparent">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={onCopy} className="border-slate-600/50 bg-transparent">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={onEdit} className="border-slate-600/50 bg-transparent">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="border-red-500/50 text-red-400 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}

            {isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={onCancel} className="border-slate-600/50 bg-transparent">
                  取消
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                  保存
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing && (
          <div className="space-y-2">
            <Label className="text-slate-300">分类</Label>
            <Select
              value={editedScript.category}
              onValueChange={(value) => setEditedScript((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {SCRIPT_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-white">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-slate-300">话术内容</Label>
          {isEditing ? (
            <Textarea
              value={editedScript.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="输入话术内容，使用 {变量名} 来定义变量..."
              className="min-h-[200px] bg-slate-700/50 border-slate-600/50 text-white"
            />
          ) : (
            <div className="p-4 bg-slate-700/30 rounded-lg text-slate-100 whitespace-pre-wrap">{script.content}</div>
          )}
        </div>

        {script.variables.length > 0 && (
          <div className="space-y-2">
            <Label className="text-slate-300">变量列表</Label>
            <div className="flex flex-wrap gap-2">
              {script.variables.map((variable) => (
                <Badge key={variable} variant="outline" className="border-slate-600/50 text-slate-300">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isEditing && (
          <div className="space-y-2">
            <Label className="text-slate-300">标签</Label>
            <Input
              value={editedScript.tags.join(", ")}
              onChange={(e) =>
                setEditedScript((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="输入标签，用逗号分隔"
              className="bg-slate-700/50 border-slate-600/50 text-white"
            />
          </div>
        )}

        {!isEditing && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
            <div>
              <Label className="text-slate-400 text-sm">创建时间</Label>
              <p className="text-slate-300">{script.createdAt.toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">使用次数</Label>
              <p className="text-slate-300">{script.usage} 次</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getCategoryInfo(categoryId: string) {
  return SCRIPT_CATEGORIES.find((cat) => cat.id === categoryId) || SCRIPT_CATEGORIES[0]
}

export default ScriptManagement
