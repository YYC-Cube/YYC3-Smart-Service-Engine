'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useEnhancedImageGenerator } from '@/hooks/useEnhancedImageGenerator'
import { ImageIcon, Wand2, Loader2, CheckCircle2, XCircle, Clock, Zap, FileText, Lightbulb } from 'lucide-react'

export function EnhancedImageGeneratorV2() {
  const imageGen = useEnhancedImageGenerator({
    onGenerationStart: (config) => {
      console.log('🎨 Generation started:', config.prompt)
    },
    onGenerationComplete: (image) => {
      console.log('✅ Image generated:', image.id)
    },
    onError: (error, context) => {
      console.error(`❌ Error in ${context}:`, error.message)
    },
  })

  const [activeTab, setActiveTab] = useState('generate')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [templateParams, setTemplateParams] = useState<Record<string, any>>({})

  const handleGenerate = useCallback(async () => {
    if (!imageGen.currentConfig.prompt.trim()) return

    try {
      await imageGen.generateImage()
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }, [imageGen])

  const handleBatchGenerate = useCallback(async () => {
    if (!imageGen.currentConfig.prompt.trim()) return

    try {
      await imageGen.startBatchGeneration([
        { prompt: `${imageGen.currentConfig.prompt} - 风格1` },
        { prompt: `${imageGen.currentConfig.prompt} - 风格2`, style: 'anime' },
        { prompt: `${imageGen.currentConfig.prompt} - 风格3`, style: 'oil-painting' },
      ])
    } catch (error) {
      console.error('Batch generation failed:', error)
    }
  }, [imageGen])

  const handleApplyTemplate = useCallback(() => {
    if (!selectedTemplateId) return

    try {
      const config = imageGen.applyTemplate(selectedTemplateId, templateParams)
      imageGen.setConfig(config)
      setActiveTab('generate')
    } catch (error) {
      console.error('Failed to apply template:', error)
    }
  }, [imageGen, selectedTemplateId, templateParams])

  const handleOptimizePrompt = useCallback(() => {
    const optimized = imageGen.optimizePrompt(
      imageGen.currentConfig.prompt,
      imageGen.currentConfig.style
    )
    imageGen.setConfig({ prompt: optimized })
  }, [imageGen])

  const suggestions = imageGen.suggestPromptImprovements(imageGen.currentConfig.prompt)

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <ImageIcon className="h-5 w-5 text-cyan-400" />
            <span>YYC³ AI 文生图引擎 V2</span>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              增强版
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
              <TabsTrigger value="generate" className="text-slate-300">
                🎨 生成
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-slate-300">
                <FileText className="w-4 h-4 mr-1" />
                模板
              </TabsTrigger>
              <TabsTrigger value="batch" className="text-slate-300">
                <Zap className="w-4 h-4 mr-1" />
                批量
              </TabsTrigger>
              <TabsTrigger value="history" className="text-slate-300">
                📚 历史
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4 mt-4">
              {/* 提示词输入 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                  图像描述
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOptimizePrompt}
                    disabled={!imageGen.currentConfig.prompt.trim()}
                    className="text-xs h-6 px-2 text-cyan-400 hover:text-cyan-300"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    智能优化
                  </Button>
                </Label>
                <Textarea
                  value={imageGen.currentConfig.prompt}
                  onChange={(e) => imageGen.setConfig({ prompt: e.target.value })}
                  placeholder="描述您想要生成的图像..."
                  className="min-h-[100px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400"
                />

                {/* Prompt建议 */}
                {suggestions.length > 0 && (
                  <div className="bg-slate-700/30 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-medium text-cyan-400 mb-2">💡 改进建议：</p>
                    {suggestions.map((suggestion, idx) => (
                      <p key={idx} className="text-xs text-slate-400">• {suggestion}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* 参数配置 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 艺术风格 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">艺术风格</Label>
                  <Select
                    value={imageGen.currentConfig.style}
                    onValueChange={(value) => imageGen.setConfig({ style: value })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                      <SelectValue placeholder="选择风格" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="realistic">🎯 写实风格</SelectItem>
                      <SelectItem value="anime">🎌 动漫风格</SelectItem>
                      <SelectItem value="oil-painting">🎨 油画风格</SelectItem>
                      <SelectItem value="watercolor">🌊 水彩风格</SelectItem>
                      <SelectItem value="digital-art">💻 数字艺术</SelectItem>
                      <SelectItem value="cyberpunk">🌃 赛博朋克</SelectItem>
                      <SelectItem value="fantasy">🧙 奇幻风格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 尺寸 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">图像尺寸</Label>
                  <Select
                    value={imageGen.currentConfig.size}
                    onValueChange={(value) => imageGen.setConfig({ size: value })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                      <SelectValue placeholder="选择尺寸" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="512x512">512×512</SelectItem>
                      <SelectItem value="768x768">768×768</SelectItem>
                      <SelectItem value="1024x1024">1024×1024</SelectItem>
                      <SelectItem value="1536x1024">1536×1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 质量 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">质量等级</Label>
                  <Select
                    value={imageGen.currentConfig.quality}
                    onValueChange={(value) => imageGen.setConfig({ quality: value })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                      <SelectValue placeholder="选择质量" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="draft">草图（快速）</SelectItem>
                      <SelectItem value="standard">标准（平衡）</SelectItem>
                      <SelectItem value="high">高质量</SelectItem>
                      <SelectItem value="ultra">超高质量</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 步数 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">
                    生成步数：{imageGen.currentConfig.steps}
                  </Label>
                  <Slider
                    value={[imageGen.currentConfig.steps]}
                    onValueChange={(value) =>
                      imageGen.setConfig({ steps: value[0] })
                    }
                    min={10}
                    max={50}
                    step={5}
                    className="py-2"
                  />
                </div>
              </div>

              {/* 高级选项 */}
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={imageGen.currentConfig.enhancePrompt}
                    onCheckedChange={(checked) =>
                      imageGen.setConfig({ enhancePrompt: checked })
                    }
                  />
                  <Label className="text-sm text-slate-300">自动增强提示词</Label>
                </div>
                <span className="text-xs text-slate-500">
                  添加风格关键词和质量提升词
                </span>
              </div>

              {/* 进度显示 */}
              {(imageGen.generationState.stage !== 'idle') && (
                <div className="space-y-2 p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      {imageGen.generationState.stage === 'preparing' && '⏳ 准备中...'}
                      {imageGen.generationState.stage === 'generating' && '🎨 正在生成...'}
                      {imageGen.generationState.stage === 'post-processing' && '✨ 后处理...'}
                      {imageGen.generationState.stage === 'completed' && '✅ 完成！'}
                      {imageGen.generationState.stage === 'error' && '❌ 错误'}
                    </span>
                    <span className="text-sm text-cyan-400">
                      {Math.round(imageGen.generationState.progress)}%
                    </span>
                  </div>
                  <Progress value={imageGen.generationState.progress} className="h-2" />
                  <p className="text-xs text-slate-400 mt-1">
                    {imageGen.generationState.message}
                  </p>
                  {imageGen.generationState.estimatedTimeRemaining > 0 && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      预计剩余：{Math.round(imageGen.generationState.estimatedTimeRemaining / 1000)}秒
                    </p>
                  )}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleGenerate}
                  disabled={
                    !imageGen.currentConfig.prompt.trim() ||
                    imageGen.generationState.stage === 'generating' ||
                    imageGen.generationState.stage === 'preparing'
                  }
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  {imageGen.generationState.stage === 'generating' || imageGen.generationState.stage === 'preparing' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      开始生成
                    </>
                  )}
                </Button>

                {imageGen.generationState.stage !== 'idle' && (
                  <Button
                    variant="outline"
                    onClick={() => imageGen.cancelGeneration()}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    取消
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {imageGen.templates.map((template) => (
                  <Card key={template.id} className="bg-slate-700/30 border-slate-600/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-slate-200">{template.name}</h3>
                          <p className="text-xs text-slate-400">{template.description}</p>
                        </div>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {template.category}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {selectedTemplateId === template.id && template.parameters.length > 0 && (
                        <div className="space-y-2 mb-3 p-3 bg-slate-800/50 rounded">
                          <p className="text-xs font-medium text-cyan-400 mb-2">参数配置：</p>
                          {template.parameters.map((param) => (
                            <div key={param.name} className="space-y-1">
                              <Label className="text-xs text-slate-300">{param.label}</Label>
                              {param.type === 'select' && param.options ? (
                                <Select
                                  value={templateParams[param.name] || param.defaultValue}
                                  onValueChange={(value) =>
                                    setTemplateParams({ ...templateParams, [param.name]: value })
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs bg-slate-700/50 border-slate-600">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-600">
                                    {param.options.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={templateParams[param.name] || param.defaultValue || ''}
                                  onChange={(e) =>
                                    setTemplateParams({ ...templateParams, [param.name]: e.target.value })
                                  }
                                  placeholder={param.placeholder}
                                  className="h-8 text-xs bg-slate-700/50 border-slate-600"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant={selectedTemplateId === template.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedTemplateId(selectedTemplateId === template.id ? '' : template.id)
                          if (selectedTemplateId === template.id) {
                            setTemplateParams({})
                          }
                        }}
                        className="w-full text-xs"
                      >
                        {selectedTemplateId === template.id ? '取消选择' : '使用此模板'}
                      </Button>

                      {selectedTemplateId === template.id && (
                        <Button
                          size="sm"
                          onClick={handleApplyTemplate}
                          className="w-full mt-2 text-xs bg-green-600 hover:bg-green-700"
                        >
                          应用模板
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="batch" className="space-y-4 mt-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-medium text-slate-200 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  批量生成模式
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  使用当前配置快速生成多个变体版本，支持不同风格的批量输出。
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 bg-slate-800/50 rounded text-center">
                    <p className="text-xs text-slate-400">变体 1</p>
                    <p className="text-sm text-slate-200">当前风格</p>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded text-center">
                    <p className="text-xs text-slate-400">变体 2</p>
                    <p className="text-sm text-slate-200">动漫风格</p>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded text-center">
                    <p className="text-xs text-slate-400">变体 3</p>
                    <p className="text-sm text-slate-200">油画风格</p>
                  </div>
                </div>

                <Button
                  onClick={handleBatchGenerate}
                  disabled={!imageGen.currentConfig.prompt.trim()}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  开始批量生成
                </Button>
              </div>

              {/* 批量任务状态 */}
              {imageGen.batchJobs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-200">批量任务历史</h3>
                  {imageGen.batchJobs.map((job) => (
                    <Card key={job.id} className="bg-slate-700/30 border-slate-600/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400 font-mono">{job.id.slice(0, 12)}...</span>
                          <Badge
                            variant="secondary"
                            className={`${
                              job.status === 'completed'
                                ? 'bg-green-500/20 text-green-300'
                                : job.status === 'processing'
                                ? 'bg-blue-500/20 text-blue-300'
                                : job.status === 'failed'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-slate-500/20 text-slate-300'
                            }`}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <Progress value={job.progress} className="h-1.5 mb-1" />
                        <p className="text-xs text-slate-500">
                          {job.completedItems}/{job.totalItems} 已完成
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              {/* 统计信息 */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-slate-700/30 rounded text-center">
                  <p className="text-xl font-bold text-cyan-400">{imageGen.getStats().totalGenerated}</p>
                  <p className="text-xs text-slate-400">总生成数</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded text-center">
                  <p className="text-xl font-bold text-green-400">
                    {imageGen.getStats().successRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-400">成功率</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded text-center">
                  <p className="text-xl font-bold text-purple-400">
                    {Math.round(imageGen.getStats().averageGenerationTime / 1000)}s
                  </p>
                  <p className="text-xs text-slate-400">平均耗时</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded text-center">
                  <p className="text-xl font-bold text-yellow-400">
                    {imageGen.generatedImages.length}
                  </p>
                  <p className="text-xs text-slate-400">本次会话</p>
                </div>
              </div>

              {/* 生成历史 */}
              {imageGen.generatedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {imageGen.generatedImages.map((image) => (
                    <Card key={image.id} className="bg-slate-700/30 border-slate-600/50 overflow-hidden">
                      <div className="aspect-square bg-slate-800 relative">
                        {image.status === 'completed' && image.url ? (
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-full object-cover"
                          />
                        ) : image.status === 'generating' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-red-400" />
                          </div>
                        )}

                        <div className="absolute top-1 right-1">
                          {image.status === 'completed' && (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </div>
                      <CardContent className="p-2">
                        <p className="text-xs text-slate-300 truncate">{image.prompt}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                            {image.config.style}
                          </Badge>
                          <span className="text-[10px] text-slate-500">
                            {image.metadata.generationTime}ms
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>暂无生成记录</p>
                  <p className="text-sm">开始生成您的第一张AI图像吧！</p>
                </div>
              )}

              {/* 清除按钮 */}
              {imageGen.generatedImages.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => imageGen.clearHistory()}
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  清除所有历史记录
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
