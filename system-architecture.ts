export interface SystemModule {
  id: string
  name: string
  description: string
  version: string
  status: "active" | "inactive" | "maintenance"
  dependencies: string[]
  capabilities: string[]
}

export interface AIModel {
  id: string
  name: string
  type: "text" | "image" | "multimodal"
  provider: string
  version: string
  capabilities: string[]
  parameters: Record<string, any>
}

export interface SystemArchitecture {
  core: {
    os: SystemModule
    ai_engine: SystemModule
    data_layer: SystemModule
    security: SystemModule
  }
  modules: {
    customer_service: SystemModule
    image_generation: SystemModule
    digital_human: SystemModule
    operations: SystemModule
  }
  models: AIModel[]
  integrations: {
    external_apis: string[]
    databases: string[]
    services: string[]
  }
}

export const NEXUS_ARCHITECTURE: SystemArchitecture = {
  core: {
    os: {
      id: "nexus-os-core",
      name: "NEXUS OS Core",
      description: "下一代智能操作系统核心",
      version: "1.0.0",
      status: "active",
      dependencies: [],
      capabilities: ["多模态交互", "实时响应", "自适应界面", "智能路由"],
    },
    ai_engine: {
      id: "nexus-ai-engine",
      name: "NEXUS AI Engine",
      description: "统一AI推理引擎",
      version: "1.0.0",
      status: "active",
      dependencies: ["nexus-os-core"],
      capabilities: ["自然语言处理", "图像生成", "对话管理", "上下文理解"],
    },
    data_layer: {
      id: "nexus-data-layer",
      name: "NEXUS Data Layer",
      description: "智能数据管理层",
      version: "1.0.0",
      status: "active",
      dependencies: ["nexus-os-core"],
      capabilities: ["实时数据同步", "智能缓存", "数据分析", "隐私保护"],
    },
    security: {
      id: "nexus-security",
      name: "NEXUS Security",
      description: "安全防护系统",
      version: "1.0.0",
      status: "active",
      dependencies: ["nexus-os-core"],
      capabilities: ["身份认证", "权限管理", "数据加密", "威胁检测"],
    },
  },
  modules: {
    customer_service: {
      id: "nexus-customer-service",
      name: "智能客服系统",
      description: "家居行业专业客服解决方案",
      version: "1.0.0",
      status: "active",
      dependencies: ["nexus-ai-engine", "nexus-data-layer"],
      capabilities: ["智能问答", "情感分析", "多轮对话", "知识库管理"],
    },
    image_generation: {
      id: "nexus-image-gen",
      name: "AI文生图系统",
      description: "高质量图像生成服务",
      version: "1.0.0",
      status: "active",
      dependencies: ["nexus-ai-engine"],
      capabilities: ["文本到图像", "风格转换", "图像编辑", "批量生成"],
    },
    digital_human: {
      id: "nexus-digital-human",
      name: "数字人系统",
      description: "沙发行业专业数字人助手",
      version: "1.0.0",
      status: "active",
      dependencies: ["nexus-ai-engine", "nexus-customer-service"],
      capabilities: ["语音合成", "表情动画", "个性化交互", "专业咨询"],
    },
    operations: {
      id: "nexus-operations",
      name: "智能客户运营",
      description: "客户生命周期管理系统",
      version: "1.0.0",
      status: "active",
      dependencies: ["nexus-ai-engine", "nexus-data-layer"],
      capabilities: ["客户分析", "生命周期管理", "智能表单", "运营自动化"],
    },
  },
  models: [
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      type: "text",
      provider: "OpenAI",
      version: "4.0",
      capabilities: ["对话", "文本生成", "代码生成", "分析"],
      parameters: {
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 1.0,
      },
    },
    {
      id: "dall-e-3",
      name: "DALL-E 3",
      type: "image",
      provider: "OpenAI",
      version: "3.0",
      capabilities: ["文生图", "图像编辑", "风格转换"],
      parameters: {
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
      },
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      type: "text",
      provider: "Anthropic",
      version: "3.0",
      capabilities: ["对话", "分析", "创作", "推理"],
      parameters: {
        max_tokens: 4096,
        temperature: 0.7,
      },
    },
  ],
  integrations: {
    external_apis: ["OpenAI API", "Anthropic API", "Stability AI API", "Google Cloud AI", "Azure Cognitive Services"],
    databases: ["PostgreSQL", "Redis", "Elasticsearch", "Vector Database"],
    services: ["Vercel", "Supabase", "Cloudflare", "AWS S3"],
  },
}

export const getModuleStatus = (moduleId: string): string => {
  const allModules = { ...NEXUS_ARCHITECTURE.core, ...NEXUS_ARCHITECTURE.modules }
  const module = allModules[moduleId as keyof typeof allModules]
  return module?.status || "unknown"
}

export const getModuleCapabilities = (moduleId: string): string[] => {
  const allModules = { ...NEXUS_ARCHITECTURE.core, ...NEXUS_ARCHITECTURE.modules }
  const module = allModules[moduleId as keyof typeof allModules]
  return module?.capabilities || []
}

export const getAvailableModels = (type?: "text" | "image" | "multimodal"): AIModel[] => {
  if (!type) return NEXUS_ARCHITECTURE.models
  return NEXUS_ARCHITECTURE.models.filter((model) => model.type === type)
}
