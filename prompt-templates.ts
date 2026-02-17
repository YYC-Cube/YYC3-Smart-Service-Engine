export interface PromptTemplate {
  id: string
  name: string
  category: string
  description: string
  template: string
  variables: string[]
  examples: string[]
}

export interface ImagePromptTemplate {
  id: string
  name: string
  category: string
  description: string
  prompt: string
  style: string
  tags: string[]
}

export const CHAT_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "customer-inquiry",
    name: "客户咨询处理",
    category: "客服",
    description: "处理客户产品咨询和问题",
    template: `作为专业的家居客服助手，请根据以下客户咨询提供准确、友好的回复：

客户问题：{question}
产品类型：{product_type}
客户背景：{customer_background}

请提供：
1. 直接回答客户问题
2. 相关产品推荐
3. 后续服务建议

回复风格：专业、友好、详细`,
    variables: ["question", "product_type", "customer_background"],
    examples: ["客户询问沙发材质和保养方法", "客户咨询定制家具的流程和价格", "客户反馈产品质量问题"],
  },
  {
    id: "product-recommendation",
    name: "产品推荐",
    category: "销售",
    description: "基于客户需求推荐合适产品",
    template: `作为家居产品专家，请根据客户需求推荐最合适的产品：

客户需求：{requirements}
预算范围：{budget}
空间大小：{space_size}
风格偏好：{style_preference}

请提供：
1. 3个最佳产品推荐
2. 每个产品的特点和优势
3. 价格和性价比分析
4. 购买建议

推荐理由要充分，考虑实用性和美观性。`,
    variables: ["requirements", "budget", "space_size", "style_preference"],
    examples: ["小户型客厅沙发推荐", "现代简约风格餐桌椅推荐", "儿童房家具套装推荐"],
  },
  {
    id: "problem-solving",
    name: "问题解决",
    category: "技术支持",
    description: "解决客户使用中遇到的问题",
    template: `作为技术支持专家，请帮助客户解决以下问题：

问题描述：{problem_description}
产品型号：{product_model}
使用环境：{usage_environment}
问题发生时间：{occurrence_time}

请提供：
1. 问题原因分析
2. 详细解决步骤
3. 预防措施
4. 是否需要专业维修

解决方案要清晰易懂，考虑客户的操作能力。`,
    variables: ["problem_description", "product_model", "usage_environment", "occurrence_time"],
    examples: ["沙发皮革开裂处理", "餐桌摇晃修复", "衣柜门关不严调整"],
  },
  {
    id: "order-tracking",
    name: "订单跟踪",
    category: "订单管理",
    description: "帮助客户查询和跟踪订单状态",
    template: `作为订单管理助手，请为客户提供订单信息：

订单号：{order_number}
客户姓名：{customer_name}
查询类型：{inquiry_type}

请提供：
1. 当前订单状态
2. 预计交付时间
3. 物流跟踪信息
4. 注意事项

信息要准确及时，如有延误要说明原因和解决方案。`,
    variables: ["order_number", "customer_name", "inquiry_type"],
    examples: ["查询沙发定制进度", "确认送货时间安排", "了解安装服务详情"],
  },
]

export const IMAGE_PROMPT_TEMPLATES: ImagePromptTemplate[] = [
  {
    id: "modern-living-room",
    name: "现代客厅",
    category: "室内设计",
    description: "现代简约风格客厅设计",
    prompt: "现代简约风格客厅，大落地窗，自然光线充足，米色沙发，玻璃茶几，绿植装饰，木质地板，简洁线条",
    style: "realistic",
    tags: ["现代", "简约", "客厅", "自然光", "米色"],
  },
  {
    id: "luxury-bedroom",
    name: "豪华卧室",
    category: "室内设计",
    description: "奢华风格主卧室设计",
    prompt: "豪华主卧室，大床带软包床头，丝绸床品，水晶吊灯，厚重窗帘，地毯，暖色调灯光，高端家具",
    style: "realistic",
    tags: ["豪华", "卧室", "丝绸", "水晶", "暖色调"],
  },
  {
    id: "minimalist-kitchen",
    name: "极简厨房",
    category: "室内设计",
    description: "极简主义风格厨房设计",
    prompt: "极简主义厨房，白色橱柜，石英石台面，不锈钢电器，隐藏式收纳，LED灯带，干净整洁",
    style: "realistic",
    tags: ["极简", "厨房", "白色", "石英石", "整洁"],
  },
  {
    id: "cozy-study",
    name: "温馨书房",
    category: "室内设计",
    description: "温馨舒适的书房设计",
    prompt: "温馨书房，实木书桌，舒适座椅，满墙书架，台灯，绿植，咖啡杯，温暖灯光，学习氛围",
    style: "realistic",
    tags: ["温馨", "书房", "实木", "书架", "学习"],
  },
  {
    id: "scandinavian-dining",
    name: "北欧餐厅",
    category: "室内设计",
    description: "北欧风格餐厅设计",
    prompt: "北欧风格餐厅，原木餐桌，白色餐椅，吊灯，简洁装饰，自然材质，明亮空间，植物装饰",
    style: "realistic",
    tags: ["北欧", "餐厅", "原木", "简洁", "自然"],
  },
  {
    id: "industrial-loft",
    name: "工业风阁楼",
    category: "室内设计",
    description: "工业风格阁楼空间设计",
    prompt: "工业风阁楼，裸露砖墙，金属管道，皮质沙发，复古家具，暖黄灯光，开放空间，个性装饰",
    style: "realistic",
    tags: ["工业风", "阁楼", "砖墙", "金属", "复古"],
  },
  {
    id: "sofa-product",
    name: "沙发产品展示",
    category: "产品展示",
    description: "专业沙发产品摄影",
    prompt: "高端沙发产品摄影，纯白背景，专业打光，细节清晰，材质纹理，商业摄影风格，4K高清",
    style: "realistic",
    tags: ["沙发", "产品", "摄影", "高清", "商业"],
  },
  {
    id: "furniture-catalog",
    name: "家具目录",
    category: "产品展示",
    description: "家具产品目录展示",
    prompt: "家具产品目录页面，多个产品展示，统一背景，专业布光，产品细节，目录排版，商业用途",
    style: "realistic",
    tags: ["家具", "目录", "产品", "排版", "商业"],
  },
]

export const getPromptTemplate = (id: string): PromptTemplate | undefined => {
  return CHAT_PROMPT_TEMPLATES.find((template) => template.id === id)
}

export const getImagePromptTemplate = (id: string): ImagePromptTemplate | undefined => {
  return IMAGE_PROMPT_TEMPLATES.find((template) => template.id === id)
}

export const getTemplatesByCategory = (category: string): PromptTemplate[] => {
  return CHAT_PROMPT_TEMPLATES.filter((template) => template.category === category)
}

export const getImageTemplatesByCategory = (category: string): ImagePromptTemplate[] => {
  return IMAGE_PROMPT_TEMPLATES.filter((template) => template.category === category)
}

export const fillTemplate = (template: PromptTemplate, variables: Record<string, string>): string => {
  let filledTemplate = template.template

  template.variables.forEach((variable) => {
    const value = variables[variable] || `[${variable}]`
    filledTemplate = filledTemplate.replace(new RegExp(`{${variable}}`, "g"), value)
  })

  return filledTemplate
}

export const PROMPT_CATEGORIES = [
  { id: "customer-service", name: "客服", description: "客户服务相关提示词" },
  { id: "sales", name: "销售", description: "销售推荐相关提示词" },
  { id: "technical-support", name: "技术支持", description: "技术问题解决提示词" },
  { id: "order-management", name: "订单管理", description: "订单处理相关提示词" },
  { id: "interior-design", name: "室内设计", description: "室内设计相关图像提示词" },
  { id: "product-display", name: "产品展示", description: "产品摄影展示提示词" },
]
