"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, Wand2 } from "lucide-react"

interface TextToImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void
}

export function TextToImageGenerator({ onImageGenerated }: TextToImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [style, setStyle] = useState("realistic")
  const [size, setSize] = useState("512x512")
  const [steps, setSteps] = useState([20])
  const [guidance, setGuidance] = useState([7.5])

  const styles = [
    { value: "realistic", label: "写实风格", description: "真实感强，细节丰富" },
    { value: "anime", label: "动漫风格", description: "日式动漫，色彩鲜艳" },
    { value: "oil-painting", label: "油画风格", description: "古典油画质感" },
    { value: "watercolor", label: "水彩风格", description: "柔和渐变效果" },
    { value: "sketch", label: "素描风格", description: "黑白线条艺术" },
    { value: "cyberpunk", label: "赛博朋克", description: "未来科技感" },
  ]

  const sizes = [
    { value: "512x512", label: "正方形 (512×512)" },
    { value: "768x512", label: "横向 (768×512)" },
    { value: "512x768", label: "纵向 (512×768)" },
    { value: "1024x1024", label: "高清正方形 (1024×1024)" },
  ]

  const quickPrompts = [
    "现代简约客厅设计，白色沙发，落地窗",
    "温馨卧室，暖色调，柔和灯光",
    "开放式厨房，大理石台面，现代家电",
    "工业风办公室，裸露砖墙，金属家具",
    "北欧风餐厅，木质餐桌，绿植装饰",
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // 生成图片URL（实际应用中这里会调用真实的AI图像生成API）
      const imageUrl = `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(prompt + " - " + style)}`

      onImageGenerated(imageUrl)
    } catch (error) {
      console.error("图像生成失败:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-200">
          <ImageIcon className="h-5 w-5 text-cyan-400" />
          <span>AI文生图引擎</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 提示词输入 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">描述您想要生成的图像</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：现代简约风格的客厅，白色沙发，大落地窗，自然光线..."
            className="min-h-[80px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400"
          />
        </div>

        {/* 快速提示词 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">快速模板</label>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(quickPrompt)}
                className="text-xs border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50"
              >
                {quickPrompt}
              </Button>
            ))}
          </div>
        </div>

        {/* 风格选择 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">艺术风格</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {styles.map((styleOption) => (
                  <SelectItem key={styleOption.value} value={styleOption.value} className="text-slate-200">
                    <div>
                      <div className="font-medium">{styleOption.label}</div>
                      <div className="text-xs text-slate-400">{styleOption.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">图像尺寸</label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {sizes.map((sizeOption) => (
                  <SelectItem key={sizeOption.value} value={sizeOption.value} className="text-slate-200">
                    {sizeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 高级参数 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">生成步数: {steps[0]}</label>
            <Slider value={steps} onValueChange={setSteps} max={50} min={10} step={5} className="w-full" />
            <div className="text-xs text-slate-400">更多步数 = 更高质量，但生成时间更长</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">引导强度: {guidance[0]}</label>
            <Slider value={guidance} onValueChange={setGuidance} max={20} min={1} step={0.5} className="w-full" />
            <div className="text-xs text-slate-400">更高强度 = 更贴近提示词</div>
          </div>
        </div>

        {/* 生成按钮 */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>正在生成图像...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>生成图像</span>
            </div>
          )}
        </Button>

        {/* 当前设置预览 */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700/50">
          <Badge variant="outline" className="bg-slate-700/30 text-slate-300 border-slate-600/50">
            {styles.find((s) => s.value === style)?.label}
          </Badge>
          <Badge variant="outline" className="bg-slate-700/30 text-slate-300 border-slate-600/50">
            {size}
          </Badge>
          <Badge variant="outline" className="bg-slate-700/30 text-slate-300 border-slate-600/50">
            {steps[0]} 步
          </Badge>
          <Badge variant="outline" className="bg-slate-700/30 text-slate-300 border-slate-600/50">
            引导 {guidance[0]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
