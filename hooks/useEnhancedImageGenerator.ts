import { useState, useCallback, useRef, useEffect } from "react"

export interface ImageGenerationConfig {
  prompt: string
  negativePrompt?: string
  style: string
  size: string
  quality: string
  steps: number
  seed: number | "random"
  enhancePrompt: boolean
}

export interface GenerationProgress {
  stage: "idle" | "preparing" | "generating" | "post-processing" | "completed" | "error"
  progress: number
  currentStep: number
  totalSteps: number
  estimatedTimeRemaining: number
  message: string
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  config: ImageGenerationConfig
  metadata: {
    generatedAt: Date
    generationTime: number
    model: string
    tokenCount: number
  }
  thumbnailUrl?: string
  status: "pending" | "generating" | "completed" | "failed"
  error?: string
}

export interface PromptTemplate {
  id: string
  name: string
  category: string
  description: string
  basePrompt: string
  parameters: TemplateParameter[]
  tags: string[]
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface TemplateParameter {
  name: string
  label: string
  type: "text" | "select" | "number" | "slider"
  defaultValue: any
  options?: { label: string; value: string }[]
  min?: number
  max?: number
  step?: number
  required: boolean
  placeholder?: string
}

export interface BatchGenerationJob {
  id: string
  items: Array<{
    config: ImageGenerationConfig
    priority: number
  }>
  status: "queued" | "processing" | "completed" | "cancelled" | "failed"
  progress: number
  completedItems: number
  totalItems: number
  results: GeneratedImage[]
  errors: Array<{ index: number; error: string }>
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
}

export interface UseEnhancedImageGeneratorConfig {
  maxConcurrentGenerations?: number
  maxQueueSize?: number
  defaultQuality?: string
  defaultSteps?: number
  autoSaveTemplates?: boolean
  onGenerationStart?: (config: ImageGenerationConfig) => void
  onGenerationComplete?: (image: GeneratedImage) => void
  onBatchComplete?: (job: BatchGenerationJob) => void
  onError?: (error: Error, context?: string) => void
}

interface UseEnhancedImageGeneratorReturn {
  generationState: GenerationProgress
  currentConfig: ImageGenerationConfig
  generatedImages: GeneratedImage[]
  batchJobs: BatchGenerationJob[]
  templates: PromptTemplate[]

  setConfig: (config: Partial<ImageGenerationConfig>) => void
  generateImage: (config?: Partial<ImageGenerationConfig>) => Promise<GeneratedImage>
  cancelGeneration: () => void

  startBatchGeneration: (
    configs: Array<Partial<ImageGenerationConfig>>
  ) => Promise<string>
  cancelBatchJob: (jobId: string) => void
  getBatchJobStatus: (jobId: string) => BatchGenerationJob | null

  createTemplate: (template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">) => string
  updateTemplate: (id: string, updates: Partial<PromptTemplate>) => void
  deleteTemplate: (id: string) => void
  applyTemplate: (templateId: string, params?: Record<string, any>) => ImageGenerationConfig
  searchTemplates: (query: string) => PromptTemplate[]

  optimizePrompt: (prompt: string, style?: string) => string
  suggestPromptImprovements: (prompt: string) => string[]

  clearHistory: () => void
  exportImages: (format?: "json" | "urls") => string
  getStats: () => GenerationStats
}

interface GenerationStats {
  totalGenerated: number
  averageGenerationTime: number
  successRate: number
  topStyles: Array<{ style: string; count: number }>
  totalGenerationTime: number
}

const DEFAULT_CONFIG: ImageGenerationConfig = {
  prompt: "",
  negativePrompt: "",
  style: "realistic",
  size: "1024x1024",
  quality: "standard",
  steps: 30,
  seed: "random",
  enhancePrompt: true,
}

const STYLE_ENHANCEMENTS: Record<string, string> = {
  realistic:
    "photorealistic, highly detailed, professional photography, sharp focus, natural lighting, 8k resolution",
  anime:
    "anime style, manga, vibrant colors, cel shading, Japanese animation, detailed background",
  "oil-painting":
    "oil painting, classical art, brush strokes, rich textures, artistic masterpiece, museum quality",
  watercolor:
    "watercolor painting, soft colors, flowing paint, artistic, delicate brushwork, translucent",
  "digital-art":
    "digital art, concept art, modern illustration, clean lines, professional artwork, trending on artstation",
  sketch:
    "pencil sketch, black and white, hand drawn, artistic lines, detailed shading, crosshatching",
  cyberpunk:
    "cyberpunk, neon lights, futuristic, sci-fi, dark atmosphere, high tech, holographic displays",
  fantasy:
    "fantasy art, magical, mystical, epic scene, detailed fantasy world, cinematic lighting, dramatic",
  minimalist:
    "minimalist design, clean, simple, modern, elegant composition, negative space, sophisticated",
  vintage:
    "vintage style, retro, nostalgic, aged look, classic aesthetic, film grain, sepia tones",
}

const PRESET_TEMPLATES: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "现代客厅设计",
    category: "室内设计",
    description: "生成现代简约风格的客厅场景",
    basePrompt:
      "Modern living room design with {furniture_style} furniture, {color_scheme} color palette, {lighting_type} lighting, large windows, {decoration_style} decorations",
    parameters: [
      {
        name: "furniture_style",
        label: "家具风格",
        type: "select",
        defaultValue: "minimalist Scandinavian",
        options: [
          { label: "北欧极简", value: "minimalist Scandinavian" },
          { label: "现代奢华", value: "modern luxury" },
          { label: "工业风格", value: "industrial" },
          { label: "中式古典", value: "Chinese classical" },
          { label: "日式禅意", value: "Japanese zen" },
        ],
        required: true,
      },
      {
        name: "color_scheme",
        label: "配色方案",
        type: "select",
        defaultValue: "white and beige",
        options: [
          { label: "白色米色系", value: "white and beige" },
          { label: "灰色蓝色调", value: "gray and blue tones" },
          { label: "暖色调", value: "warm earth tones" },
          { label: "黑白极简", value: "black and white monochrome" },
          { label: "自然绿色", value: "natural green palette" },
        ],
        required: true,
      },
      {
        name: "lighting_type",
        label: "光线类型",
        type: "select",
        defaultValue: "natural light",
        options: [
          { label: "自然光", value: "natural light" },
          { label: "柔和灯光", value: "soft ambient lighting" },
          { label: "聚光灯效果", value: "spotlight effect" },
          { label: "黄昏氛围", value: "golden hour atmosphere" },
        ],
        required: false,
      },
      {
        name: "decoration_style",
        label: "装饰风格",
        type: "text",
        defaultValue: "modern art pieces and plants",
        placeholder: "描述装饰元素...",
        required: false,
      },
    ],
    tags: ["interior", "living room", "modern", "design"],
    usageCount: 0,
  },
  {
    name: "产品展示场景",
    category: "商业摄影",
    description: "专业级产品展示图像生成",
    basePrompt:
      "Professional product photography of {product_type}, {background_type} background, {lighting_setup}, studio quality, commercial advertising, {mood} mood",
    parameters: [
      {
        name: "product_type",
        label: "产品类型",
        type: "text",
        defaultValue: "luxury watch",
        required: true,
        placeholder: "描述您的产品...",
      },
      {
        name: "background_type",
        label: "背景类型",
        type: "select",
        defaultValue: "clean gradient",
        options: [
          { label: "渐变背景", value: "clean gradient" },
          { label: "纯色背景", value: "solid color" },
          { label: "自然环境", value: "natural environment" },
          { label: "生活方式场景", value: "lifestyle setting" },
          { label: "抽象艺术", value: "abstract artistic" },
        ],
        required: true,
      },
      {
        name: "lighting_setup",
        label: "灯光设置",
        type: "select",
        defaultValue: "soft box lighting",
        options: [
          { label: "柔光箱", value: "soft box lighting" },
          { label: "环形灯", value: "ring light" },
          { label: "自然光", value: "natural window light" },
          { label: "戏剧性光影", value: "dramatic side lighting" },
          { label: "背光效果", value: "backlit silhouette" },
        ],
        required: false,
      },
      {
        name: "mood",
        label: "氛围感",
        type: "select",
        defaultValue: "elegant premium",
        options: [
          { label: "优雅高级", value: "elegant premium" },
          { label: "活力动感", value: "energetic dynamic" },
          { label: "温馨舒适", value: "warm cozy" },
          { label: "科技未来", value: "tech futuristic" },
          { label: "复古怀旧", value: "nostalgic vintage" },
        ],
        required: false,
      },
    ],
    tags: ["product", "commercial", "photography", "advertising"],
    usageCount: 0,
  },
  {
    name: "风景画创作",
    category: "艺术创作",
    description: "各种风格的风景画生成",
    basePrompt:
      "{landscape_type} landscape, {time_of_day}, {weather_condition}, {artistic_style} style, {composition_type} composition, dramatic sky, highly detailed, masterpiece",
    parameters: [
      {
        name: "landscape_type",
        label: "景观类型",
        type: "select",
        defaultValue: "mountain range",
        options: [
          { label: "山脉", value: "mountain range" },
          { label: "海洋海滩", value: "ocean beach" },
          { label: "森林", value: "forest" },
          { label: "沙漠", value: "desert" },
          { label: "城市天际线", value: "city skyline" },
          { label: "田园乡村", value: "countryside" },
        ],
        required: true,
      },
      {
        name: "time_of_day",
        label: "时间段",
        type: "select",
        defaultValue: "golden hour sunset",
        options: [
          { label: "日出", value: "sunrise dawn" },
          { label: "正午阳光", value: "midday bright sun" },
          { label: "日落黄金时刻", value: "golden hour sunset" },
          { label: "蓝调时刻", value: "blue hour twilight" },
          { label: "星空夜晚", value: "starry night" },
          { label: "雾气清晨", value: "foggy morning" },
        ],
        required: true,
      },
      {
        name: "weather_condition",
        label: "天气状况",
        type: "select",
        defaultValue: "clear sky",
        options: [
          { label: "晴朗天空", value: "clear sky" },
          { label: "多云", value: "cloudy overcast" },
          { label: "雨后彩虹", value: "after rain rainbow" },
          { label: "暴风雨", value: "stormy dramatic" },
          { label: "雪景", value: "snowy winter" },
          { label: "雾气缭绕", value: "misty foggy" },
        ],
        required: false,
      },
      {
        name: "artistic_style",
        label: "艺术风格",
        type: "select",
        defaultValue: "photorealistic",
        options: [
          { label: "超写实", value: "photorealistic" },
          { label: "印象派", value: "impressionist" },
          { label: "油画", value: "oil painting" },
          { label: "水彩", value: "watercolor" },
          { label: "数字艺术", value: "digital art concept" },
          { label: "电影质感", value: "cinematic" },
        ],
        required: false,
      },
      {
        name: "composition_type",
        label: "构图方式",
        type: "select",
        defaultValue: "rule of thirds",
        options: [
          { label: "三分法", value: "rule of thirds" },
          { label: "中心对称", value: "centered symmetrical" },
          { label: "引导线", value: "leading lines" },
          { label: "框架构图", value: "framing" },
          { label: "俯视鸟瞰", value: "bird's eye view" },
        ],
        required: false,
      },
    ],
    tags: ["landscape", "nature", "art", "scenic"],
    usageCount: 0,
  },
]

export function useEnhancedImageGenerator(
  config: UseEnhancedImageGeneratorConfig = {}
): UseEnhancedImageGeneratorReturn {
  const {
    maxConcurrentGenerations = 3,
    maxQueueSize = 20,
    defaultQuality = "standard",
    defaultSteps = 30,
    autoSaveTemplates = true,
    onGenerationStart,
    onGenerationComplete,
    onBatchComplete,
    onError,
  } = config

  const [currentConfig, setCurrentConfig] =
    useState<ImageGenerationConfig>(DEFAULT_CONFIG)
  const [generationState, setGenerationState] = useState<GenerationProgress>({
    stage: "idle",
    progress: 0,
    currentStep: 0,
    totalSteps: 0,
    estimatedTimeRemaining: 0,
    message: "",
  })
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [batchJobs, setBatchJobs] = useState<BatchGenerationJob[]>([])
  const [templates, setTemplates] = useState<PromptTemplate[]>(() =>
    PRESET_TEMPLATES.map((t) => ({
      ...t,
      id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )

  const abortControllerRef = useRef<AbortController | null>(null)
  const generationStartTimeRef = useRef<number>(0)
  const isGeneratingRef = useRef(false)

  useEffect(() => {
    if (autoSaveTemplates) {
      try {
        localStorage.setItem("yyc3_image_templates", JSON.stringify(templates))
      } catch (e) {

      }
    }
  }, [templates, autoSaveTemplates])

  const updateProgress = useCallback((update: Partial<GenerationProgress>) => {
    setGenerationState((prev) => ({ ...prev, ...update }))
  }, [])

  const simulateGeneration = useCallback(
    async (
      imageConfig: ImageGenerationConfig,
      abortSignal: AbortSignal
    ): Promise<{ url: string; generationTime: number }> => {
      generationStartTimeRef.current = Date.now()

      let enhancedPrompt = imageConfig.prompt
      if (imageConfig.enhancePrompt && imageConfig.style) {
        const styleEnhancement =
          STYLE_ENHANCEMENTS[imageConfig.style] || ""
        enhancedPrompt = `${imageConfig.prompt}, ${styleEnhancement}, high quality, masterpiece`
      }

      if (imageConfig.negativePrompt) {
        enhancedPrompt += `, negative prompt: ${imageConfig.negativePrompt}`
      }

      const steps = imageConfig.steps || defaultSteps
      const totalTime = steps * 100

      for (let i = 0; i <= steps; i++) {
        if (abortSignal.aborted) {
          throw new Error("Generation cancelled by user")
        }

        await new Promise((resolve) => setTimeout(resolve, 100))

        const progress = (i / steps) * 100
        const elapsed = Date.now() - generationStartTimeRef.current
        const estimatedTotal = (elapsed / Math.max(i, 1)) * steps
        const remaining = Math.max(0, estimatedTotal - elapsed)

        let stage: GenerationProgress["stage"] = "preparing"
        let message = ""

        if (i < steps * 0.1) {
          stage = "preparing"
          message = "准备生成环境..."
        } else if (i < steps * 0.7) {
          stage = "generating"
          message = `正在生成图像... (${Math.round(progress)}%)`
        } else if (i < steps * 0.9) {
          stage = "post-processing"
          message = "后处理优化..."
        } else {
          stage = "completed"
          message = "生成完成！"
        }

        updateProgress({
          stage,
          progress,
          currentStep: i,
          totalSteps: steps,
          estimatedTimeRemaining: remaining,
          message,
        })
      }

      const generationTime = Date.now() - generationStartTimeRef.current
      const imageQuery = encodeURIComponent(enhancedPrompt.substring(0, 150))
      const url = `/placeholder.svg?height=1024&width=1024&query=${imageQuery}`

      return { url, generationTime }
    }, [defaultSteps, updateProgress]
  )

  const generateImage = useCallback(
    async (
      configOverride?: Partial<ImageGenerationConfig>
    ): Promise<GeneratedImage> => {
      if (isGeneratingRef.current) {
        throw new Error("Already generating an image")
      }

      const finalConfig = { ...currentConfig, ...configOverride }
      setCurrentConfig(finalConfig)

      isGeneratingRef.current = true
      abortControllerRef.current = new AbortController()

      onGenerationStart?.(finalConfig)

      updateProgress({
        stage: "preparing",
        progress: 0,
        currentStep: 0,
        totalSteps: finalConfig.steps,
        estimatedTimeRemaining: 0,
        message: "初始化...",
      })

      const image: GeneratedImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: "",
        prompt: finalConfig.prompt,
        config: finalConfig,
        metadata: {
          generatedAt: new Date(),
          generationTime: 0,
          model: "YYC³-Image-v2",
          tokenCount: Math.ceil(finalConfig.prompt.length / 4),
        },
        status: "generating",
      }

      setGeneratedImages((prev) => [...prev, image])

      try {
        const result = await simulateGeneration(
          finalConfig,
          abortControllerRef.current.signal
        )

        const completedImage: GeneratedImage = {
          ...image,
          url: result.url,
          thumbnailUrl: `${result.url}&thumbnail=true`,
          metadata: {
            ...image.metadata,
            generationTime: result.generationTime,
          },
          status: "completed",
        }

        setGeneratedImages((prev) =>
          prev.map((img) => (img.id === image.id ? completedImage : img))
        )

        updateProgress({
          stage: "completed",
          progress: 100,
          message: "✅ 图像生成完成",
        })

        onGenerationComplete?.(completedImage)
        return completedImage
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        const failedImage: GeneratedImage = {
          ...image,
          status: "failed",
          error: err.message,
        }

        setGeneratedImages((prev) =>
          prev.map((img) => (img.id === image.id ? failedImage : img))
        )

        updateProgress({
          stage: "error",
          message: `❌ ${err.message}`,
        })

        onError?.(err, "image_generation")
        throw err
      } finally {
        isGeneratingRef.current = false
        abortControllerRef.current = null
      }
    },
    [currentConfig, onGenerationStart, onGenerationComplete, onError, simulateGeneration, updateProgress]
  )

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      updateProgress({
        stage: "idle",
        progress: 0,
        message: "已取消生成",
      })
    }
    isGeneratingRef.current = false
  }, [updateProgress])

  const startBatchGeneration = useCallback(
    async (
      configs: Array<Partial<ImageGenerationConfig>>
    ): Promise<string> => {
      if (configs.length === 0) {
        throw new Error("No configurations provided")
      }

      if (configs.length > maxQueueSize) {
        throw new Error(`Maximum ${maxQueueSize} configurations allowed`)
      }

      const jobId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const job: BatchGenerationJob = {
        id: jobId,
        items: configs.map((cfg, idx) => ({
          config: { ...DEFAULT_CONFIG, ...cfg },
          priority: maxQueueSize - idx,
        })),
        status: "queued",
        progress: 0,
        completedItems: 0,
        totalItems: configs.length,
        results: [],
        errors: [],
        createdAt: new Date(),
      }

      setBatchJobs((prev) => [...prev, job])

      setTimeout(async () => {
        setBatchJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? { ...j, status: "processing" as const, startedAt: new Date() }
              : j
          )
        )

        const results: GeneratedImage[] = []
        const errors: Array<{ index: number; error: string }> = []

        for (let i = 0; i < configs.length; i++) {
          try {
            const image = await generateImage(configs[i])
            results.push(image)

            setBatchJobs((prev) =>
              prev.map((j) =>
                j.id === jobId
                  ? {
                      ...j,
                      completedItems: i + 1,
                      progress: ((i + 1) / configs.length) * 100,
                      results: [...results],
                    }
                  : j
              )
            )
          } catch (error) {
            const errMsg =
              error instanceof Error ? error.message : String(error)
            errors.push({ index: i, error: errMsg })

            setBatchJobs((prev) =>
              prev.map((j) =>
                j.id === jobId
                  ? {
                      ...j,
                      completedItems: i + 1,
                      progress: ((i + 1) / configs.length) * 100,
                      errors: [...errors],
                    }
                  : j
              )
            )
          }
        }

        const finalJob: BatchGenerationJob = {
          ...job,
          status: errors.length === configs.length ? "failed" : "completed",
          progress: 100,
          completedItems: configs.length,
          results,
          errors,
          completedAt: new Date(),
        }

        setBatchJobs((prev) =>
          prev.map((j) => (j.id === jobId ? finalJob : j))
        )

        onBatchComplete?.(finalJob)
      }, 100)

      return jobId
    },
    [generateImage, maxQueueSize, onBatchComplete]
  )

  const cancelBatchJob = useCallback((jobId: string) => {
    setBatchJobs((prev) =>
      prev.map((j) =>
        j.id === jobId && (j.status === "queued" || j.status === "processing")
          ? { ...j, status: "cancelled" as const }
          : j
      )
    )
  }, [])

  const getBatchJobStatus = useCallback(
    (jobId: string): BatchGenerationJob | null => {
      return batchJobs.find((job) => job.id === jobId) || null
    },
    [batchJobs]
  )

  const createTemplate = useCallback(
    (
      templateData: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">
    ): string => {
      const template: PromptTemplate = {
        ...templateData,
        id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setTemplates((prev) => [...prev, template])
      return template.id
    },
    []
  )

  const updateTemplate = useCallback(
    (id: string, updates: Partial<PromptTemplate>) => {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
        )
      )
    },
    []
  )

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const applyTemplate = useCallback(
    (templateId: string, params: Record<string, any> = {}): ImageGenerationConfig => {
      const template = templates.find((t) => t.id === templateId)
      if (!template) {
        throw new Error("Template not found")
      }

      let resolvedPrompt = template.basePrompt

      template.parameters.forEach((param) => {
        const value = params[param.name] ?? param.defaultValue
        resolvedPrompt = resolvedPrompt.replace(new RegExp(`\\{${param.name}\\}`, "g"), String(value))
      })

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
        )
      )

      return {
        ...DEFAULT_CONFIG,
        prompt: resolvedPrompt,
      }
    },
    [templates]
  )

  const searchTemplates = useCallback(
    (query: string): PromptTemplate[] => {
      const lowerQuery = query.toLowerCase()
      return templates.filter(
        (t) =>
          t.name.toLowerCase().includes(lowerQuery) ||
          t.description.toLowerCase().includes(lowerQuery) ||
          t.category.toLowerCase().includes(lowerQuery) ||
          t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
    },
    [templates]
  )

  const optimizePrompt = useCallback(
    (prompt: string, style?: string): string => {
      if (!prompt.trim()) return prompt

      let optimized = prompt.trim()

      optimized = optimized.replace(/\s+/g, " ")

      if (style && STYLE_ENHANCEMENTS[style]) {
        optimized += `, ${STYLE_ENHANCEMENTS[style]}`
      }

      const qualityKeywords = [
        "high quality",
        "detailed",
        "professional",
        "masterpiece",
        "best quality",
      ]
      qualityKeywords.forEach((keyword) => {
        if (!optimized.toLowerCase().includes(keyword)) {
          optimized += `, ${keyword}`
        }
      })

      return optimized
    },
    []
  )

  const suggestPromptImprovements = useCallback(
    (prompt: string): string[] => {
      const suggestions: string[] = []

      if (prompt.length < 20) {
        suggestions.push("建议增加更多细节描述以获得更好的生成结果")
      }

      if (!/\d+/.test(prompt)) {
        suggestions.push("考虑添加具体的数量或尺寸信息（如：'3个窗户', '2米高的吊灯'）")
      }

      const hasLighting = /light|光照|光线|bright|dark|shadow/i.test(prompt)
      if (!hasLighting) {
        suggestions.push("添加光线描述可以显著提升画面质量（如：'自然光照射', '温暖的灯光'）")
      }

      const hasColor = /(red|blue|green|warm|cool|颜色|色彩|色调)/i.test(prompt)
      if (!hasColor) {
        suggestions.push("指定配色方案可以帮助AI更好地理解您的意图")
      }

      const hasMood = /(mood|atmosphere|情绪|氛围|感觉|feeling)/i.test(prompt)
      if (!hasMood) {
        suggestions.push("描述期望的氛围或情感可以让图像更有感染力")
      }

      const hasComposition =
        /(foreground|background|前景|背景|center|中心|angle|角度|view|视角)/i.test(
          prompt
        )
      if (!hasComposition) {
        suggestions.push("添加构图指示（如：'特写镜头', '全景视角', '低角度拍摄'）")
      }

      if (suggestions.length === 0) {
        suggestions.push("提示词质量良好！可以考虑尝试不同的艺术风格以获得更多样化的结果")
      }

      return suggestions
    },
    []
  )

  const clearHistory = useCallback(() => {
    setGeneratedImages([])
    setBatchJobs([])
    updateProgress({
      stage: "idle",
      progress: 0,
      message: "",
    })
  }, [updateProgress])

  const exportImages = useCallback(
    (format: "json" | "urls" = "json"): string => {
      if (format === "json") {
        return JSON.stringify(generatedImages, null, 2)
      } else {
        return generatedImages.map((img) => img.url).join("\n")
      }
    },
    [generatedImages]
  )

  const getStats = useCallback((): GenerationStats => {
    const completed = generatedImages.filter(
      (img) => img.status === "completed"
    )
    const failed = generatedImages.filter((img) => img.status === "failed")

    const totalGenerated = completed.length
    const averageGenerationTime =
      completed.length > 0
        ? completed.reduce((sum, img) => sum + img.metadata.generationTime, 0) /
          completed.length
        : 0
    const successRate =
      generatedImages.length > 0
        ? (completed.length / generatedImages.length) * 100
        : 0
    const totalGenerationTime = completed.reduce(
      (sum, img) => sum + img.metadata.generationTime,
      0
    )

    const styleCounts: Record<string, number> = {}
    completed.forEach((img) => {
      styleCounts[img.config.style] = (styleCounts[img.config.style] || 0) + 1
    })
    const topStyles = Object.entries(styleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([style, count]) => ({ style, count }))

    return {
      totalGenerated,
      averageGenerationTime,
      successRate,
      topStyles,
      totalGenerationTime,
    }
  }, [generatedImages])

  const setConfig = useCallback((updates: Partial<ImageGenerationConfig>) => {
    setCurrentConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    generationState,
    currentConfig,
    generatedImages,
    batchJobs,
    templates,

    setConfig,
    generateImage,
    cancelGeneration,

    startBatchGeneration,
    cancelBatchJob,
    getBatchJobStatus,

    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
    searchTemplates,

    optimizePrompt,
    suggestPromptImprovements,

    clearHistory,
    exportImages,
    getStats,
  }
}
