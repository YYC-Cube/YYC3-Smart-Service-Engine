"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface EnhancedImageGeneratorProps {
  onImageGenerated: (result: any) => void
  onProgressUpdate: (progress: number) => void
}

interface GenerationSettings {
  style: string
  size: string
  quality: string
  steps: number
  seed: number
  aspectRatio: string
}

export function EnhancedImageGenerator({ onImageGenerated, onProgressUpdate }: EnhancedImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<
    Array<{
      id: string
      url: string
      prompt: string
      settings: GenerationSettings
      timestamp: Date
    }>
  >([])

  const [settings, setSettings] = useState<GenerationSettings>({
    style: "realistic",
    size: "1024x1024",
    quality: "high",
    steps: 30,
    seed: -1,
    aspectRatio: "1:1",
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 预设提示词
  const promptPresets = [
    {
      category: "现代室内",
      prompts: [
        "现代简约客厅，大落地窗，自然光线，米色沙发，木质茶几",
        "北欧风格卧室，白色床品，原木家具，绿植装饰",
        "工业风厨房，黑色橱柜，不锈钢台面，吊灯照明",
        "日式和风书房，榻榻米，书架，温暖灯光",
      ],
    },
    {
      category: "商业空间",
      prompts: [
        "现代办公室，开放式工作区，玻璃隔断，绿植墙",
        "咖啡厅内景，暖色调，木质桌椅，吧台设计",
        "服装店展示，简约货架，射灯照明，镜面装饰",
        "餐厅包间，中式装修，圆桌，古典屏风",
      ],
    },
    {
      category: "艺术创意",
      prompts: [
        "抽象艺术，几何图形，渐变色彩，现代感",
        "水彩风景，山水画意境，淡雅色调",
        "科技感背景，蓝色光效，数字元素，未来风格",
        "复古海报设计，怀旧色调，装饰字体",
      ],
    },
  ]

  // 风格选项
  const styleOptions = [
    { value: "realistic", label: "写实风格", description: "照片级真实感" },
    { value: "artistic", label: "艺术风格", description: "绘画艺术感" },
    { value: "anime", label: "动漫风格", description: "日式动漫风" },
    { value: "sketch", label: "素描风格", description: "手绘素描感" },
    { value: "watercolor", label: "水彩风格", description: "水彩画效果" },
    { value: "oil-painting", label: "油画风格", description: "古典油画感" },
    { value: "digital-art", label: "数字艺术", description: "现代数字风" },
    { value: "cyberpunk", label: "赛博朋克", description: "未来科技风" },
  ]

  // 尺寸选项
  const sizeOptions = [
    { value: "512x512", label: "正方形 (512×512)", ratio: "1:1" },
    { value: "768x768", label: "正方形 (768×768)", ratio: "1:1" },
    { value: "1024x1024", label: "正方形 (1024×1024)", ratio: "1:1" },
    { value: "1024x768", label: "横向 (1024×768)", ratio: "4:3" },
    { value: "768x1024", label: "纵向 (768×1024)", ratio: "3:4" },
    { value: "1280x720", label: "宽屏 (1280×720)", ratio: "16:9" },
    { value: "720x1280", label: "竖屏 (720×1280)", ratio: "9:16" },
  ]

  // 模拟图像生成过程
  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setProgress(0)
    onProgressUpdate(0)

    try {
      // 模拟生成进度
      const progressSteps = [10, 25, 45, 65, 80, 95, 100]
      const stepMessages = [
        "正在分析提示词...",
        "初始化AI模型...",
        "生成图像草图...",
        "细化图像细节...",
        "优化色彩和光影...",
        "最终渲染处理...",
        "图像生成完成！",
      ]

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProgress(progressSteps[i])
        onProgressUpdate(progressSteps[i])
      }

      // 生成随机种子（如果设置为-1）
      const finalSeed = settings.seed === -1 ? Math.floor(Math.random() * 1000000) : settings.seed

      // 创建模拟图像
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const [width, height] = settings.size.split("x").map(Number)
          canvas.width = width
          canvas.height = height

          // 创建渐变背景
          const gradient = ctx.createLinearGradient(0, 0, width, height)
          gradient.addColorStop(0, `hsl(${Math.random() * 360}, 70%, 60%)`)
          gradient.addColorStop(0.5, `hsl(${Math.random() * 360}, 60%, 50%)`)
          gradient.addColorStop(1, `hsl(${Math.random() * 360}, 80%, 70%)`)

          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)

          // 添加一些装饰元素
          for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 80%, 0.3)`
            ctx.beginPath()
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 50 + 10, 0, Math.PI * 2)
            ctx.fill()
          }

          // 添加文字水印
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.font = "24px Arial"
          ctx.textAlign = "center"
          ctx.fillText("YYC³ AI Generated", width / 2, height / 2)
          ctx.font = "16px Arial"
          ctx.fillText(prompt.slice(0, 30) + "...", width / 2, height / 2 + 30)

          // 转换为图像URL
          const imageUrl = canvas.toDataURL("image/png")

          const newImage = {
            id: `img_${Date.now()}`,
            url: imageUrl,
            prompt,
            settings: { ...settings, seed: finalSeed },
            timestamp: new Date(),
          }

          setGeneratedImages((prev) => [newImage, ...prev])

          // 调用回调函数
          onImageGenerated({
            url: imageUrl,
            prompt,
            style: styleOptions.find((s) => s.value === settings.style)?.label || settings.style,
            metadata: {
              size: settings.size,
              quality: settings.quality,
              steps: settings.steps,
              seed: finalSeed,
              aspectRatio: settings.aspectRatio,
              negativePrompt,
              timestamp: new Date().toISOString(),
            },
          })
        }
      }
    } catch (error) {
      console.error("图像生成失败:", error)
    } finally {
      setIsGenerating(false)
      setProgress(0)
      onProgressUpdate(0)
    }
  }, [prompt, negativePrompt, settings, onImageGenerated, onProgressUpdate])

  // 使用预设提示词
  const usePreset = useCallback((presetPrompt: string) => {
    setPrompt(presetPrompt)
  }, [])

  // 随机生成种子
  const randomizeSeed = useCallback(() => {
    setSettings((prev) => ({ ...prev, seed: Math.floor(Math.random() * 1000000) }))
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* 隐藏的画布用于生成图像 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 主要生成界面 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：输入和设置 */}
        <div className="space-y-6">
          {/* 提示词输入 */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>🎨 创作描述</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">正向提示词</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="详细描述您想要生成的图像，例如：现代简约客厅，大落地窗，自然光线，米色沙发，木质茶几，绿植装饰，温馨氛围"
                  className="min-h-[120px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">负向提示词（可选）</label>
                <Textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="描述您不希望出现的元素，例如：模糊，低质量，变形，噪点"
                  className="min-h-[80px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400"
                />
              </div>

              <Button
                onClick={generateImage}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3"
              >
                {isGenerating ? (
                  <>
                    <span className="mr-2">⏳</span>
                    生成中... {progress}%
                  </>
                ) : (
                  <>
                    <span className="mr-2">🎨</span>
                    生成图像
                  </>
                )}
              </Button>

              {/* 生成进度 */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-400 text-center">AI正在创作您的专属图像...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 生成设置 */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>⚙️ 生成设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">艺术风格</label>
                  <Select
                    value={settings.style}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, style: value }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-slate-400">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">图像尺寸</label>
                  <Select
                    value={settings.size}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, size: value }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">生成步数: {settings.steps}</label>
                <Slider
                  value={[settings.steps]}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, steps: value[0] }))}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>快速 (10)</span>
                  <span>平衡 (30)</span>
                  <span>精细 (100)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-sm text-slate-300 mb-2 block">随机种子</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={settings.seed}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, seed: Number.parseInt(e.target.value) || -1 }))
                      }
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-slate-200"
                      placeholder="-1 (随机)"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={randomizeSeed}
                      className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50"
                    >
                      🎲
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：预设和历史 */}
        <div className="space-y-6">
          {/* 预设提示词 */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>💡 创意灵感</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promptPresets.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">{category.category}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {category.prompts.map((presetPrompt, promptIndex) => (
                        <Button
                          key={promptIndex}
                          variant="outline"
                          size="sm"
                          onClick={() => usePreset(presetPrompt)}
                          className="text-left h-auto p-3 border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 justify-start"
                        >
                          <div className="text-xs line-clamp-2">{presetPrompt}</div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 生成历史 */}
          {generatedImages.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🖼️ 生成历史</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGeneratedImages([])}
                    className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50"
                  >
                    清空历史
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generatedImages.map((image) => (
                    <div key={image.id} className="border border-slate-600/50 rounded-lg p-3 bg-slate-700/30">
                      <div className="flex space-x-3">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt="Generated"
                          className="w-16 h-16 rounded-lg object-cover border border-slate-600/50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 line-clamp-2 mb-1">{image.prompt}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                              {styleOptions.find((s) => s.value === image.settings.style)?.label}
                            </Badge>
                            <Badge className="bg-slate-600/50 text-slate-300 text-xs">{image.settings.size}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPrompt(image.prompt)}
                              className="text-xs text-slate-400 hover:text-slate-200 h-6 px-2"
                            >
                              🔄 复用
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement("a")
                                link.href = image.url
                                link.download = `YYC3_AI_${image.id}.png`
                                link.click()
                              }}
                              className="text-xs text-slate-400 hover:text-slate-200 h-6 px-2"
                            >
                              📥 下载
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle>📚 使用指南</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">✍️ 提示词技巧</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• 详细描述场景和物体</li>
                <li>• 指定风格和色调</li>
                <li>• 添加光线和氛围描述</li>
                <li>• 使用专业术语提高质量</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">⚙️ 参数调节</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• 步数越高质量越好</li>
                <li>• 种子控制随机性</li>
                <li>• 选择合适的尺寸比例</li>
                <li>• 风格影响整体效果</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">🎨 创作建议</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• 从预设灵感开始</li>
                <li>• 多次尝试不同参数</li>
                <li>• 保存满意的设置</li>
                <li>• 结合负向提示优化</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
