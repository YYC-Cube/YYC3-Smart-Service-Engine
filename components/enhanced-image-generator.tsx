'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ImageGenerationResult {
  url: string;
  prompt: string;
  style: string;
  metadata: {
    size: string;
    quality: string;
    steps: number;
    seed: number;
    model: string;
    timestamp: Date;
  };
}

interface EnhancedImageGeneratorProps {
  onImageGenerated: (result: ImageGenerationResult) => void;
  onProgressUpdate: (progress: number) => void;
}

export function EnhancedImageGenerator({
  onImageGenerated,
  onProgressUpdate,
}: EnhancedImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [steps, setSteps] = useState([30]);
  const [seed, setSeed] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<ImageGenerationResult[]>([]);
  const [batchCount, setBatchCount] = useState(1);
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  const [enhancePrompt, setEnhancePrompt] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 艺术风格选项
  const styleOptions = [
    { value: 'realistic', label: '🎯 写实风格', description: '真实感强，细节丰富' },
    { value: 'anime', label: '🎌 动漫风格', description: '日式动漫，色彩鲜艳' },
    { value: 'oil-painting', label: '🎨 油画风格', description: '经典油画质感' },
    { value: 'watercolor', label: '🌊 水彩风格', description: '柔和水彩效果' },
    { value: 'digital-art', label: '💻 数字艺术', description: '现代数字创作' },
    { value: 'sketch', label: '✏️ 素描风格', description: '黑白素描效果' },
    { value: 'cyberpunk', label: '🌃 赛博朋克', description: '未来科技感' },
    { value: 'fantasy', label: '🧙 奇幻风格', description: '魔幻世界场景' },
    { value: 'minimalist', label: '⚪ 极简风格', description: '简约现代设计' },
    { value: 'vintage', label: '📸 复古风格', description: '怀旧复古感觉' },
  ];

  // 尺寸选项
  const sizeOptions = [
    { value: '512x512', label: '512×512', description: '正方形 - 快速生成' },
    { value: '768x768', label: '768×768', description: '正方形 - 标准质量' },
    { value: '1024x1024', label: '1024×1024', description: '正方形 - 高质量' },
    { value: '1024x768', label: '1024×768', description: '横向 - 风景适用' },
    { value: '768x1024', label: '768×1024', description: '纵向 - 人像适用' },
    { value: '1536x1024', label: '1536×1024', description: '宽屏 - 全景适用' },
  ];

  // 质量选项
  const qualityOptions = [
    { value: 'draft', label: '草图', description: '快速预览，低质量' },
    { value: 'standard', label: '标准', description: '平衡质量和速度' },
    { value: 'high', label: '高质量', description: '精细细节，较慢' },
    { value: 'ultra', label: '超高质量', description: '最佳质量，最慢' },
  ];

  // 提示词增强
  const enhancePromptText = useCallback(
    (originalPrompt: string, selectedStyle: string): string => {
      if (!enhancePrompt) return originalPrompt;

      const styleEnhancements = {
        realistic:
          'photorealistic, highly detailed, professional photography, sharp focus, natural lighting',
        anime: 'anime style, manga, vibrant colors, cel shading, Japanese animation',
        'oil-painting':
          'oil painting, classical art, brush strokes, rich textures, artistic masterpiece',
        watercolor: 'watercolor painting, soft colors, flowing paint, artistic, delicate brushwork',
        'digital-art':
          'digital art, concept art, modern illustration, clean lines, professional artwork',
        sketch: 'pencil sketch, black and white, hand drawn, artistic lines, detailed shading',
        cyberpunk: 'cyberpunk, neon lights, futuristic, sci-fi, dark atmosphere, high tech',
        fantasy: 'fantasy art, magical, mystical, epic scene, detailed fantasy world',
        minimalist: 'minimalist design, clean, simple, modern, elegant composition',
        vintage: 'vintage style, retro, nostalgic, aged look, classic aesthetic',
      };

      const enhancement = styleEnhancements[selectedStyle as keyof typeof styleEnhancements] || '';
      return `${originalPrompt}, ${enhancement}, high quality, masterpiece, best quality`;
    },
    [enhancePrompt]
  );

  // 生成随机种子
  const generateRandomSeed = useCallback(() => {
    return Math.floor(Math.random() * 1000000);
  }, []);

  // 模拟图像生成
  const simulateImageGeneration = useCallback(
    async (
      enhancedPrompt: string,
      currentSeed: number,
      abortSignal: AbortSignal
    ): Promise<string> => {
      // 模拟生成进度
      for (let i = 0; i <= 100; i += 5) {
        if (abortSignal.aborted) {
          throw new Error('Generation cancelled');
        }

        onProgressUpdate(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 生成占位符图像URL（实际应用中这里会调用真实的AI图像生成API）
      const imageQuery = encodeURIComponent(enhancedPrompt.substring(0, 100));
      return `/placeholder.svg?height=1024&width=1024&query=${imageQuery}`;
    },
    [onProgressUpdate]
  );

  // 生成图像
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert('请输入图像描述');
      return;
    }

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      const results: ImageGenerationResult[] = [];

      for (let i = 0; i < batchCount; i++) {
        const currentSeed = useRandomSeed
          ? generateRandomSeed()
          : Number.parseInt(seed) || generateRandomSeed();
        const enhancedPrompt = enhancePromptText(prompt, style);

        const imageUrl = await simulateImageGeneration(
          enhancedPrompt,
          currentSeed,
          abortControllerRef.current.signal
        );

        const result: ImageGenerationResult = {
          url: imageUrl,
          prompt: enhancedPrompt,
          style,
          metadata: {
            size,
            quality,
            steps: steps[0] || 20,
            seed: currentSeed,
            model: 'YYC³-ImageGen-v2.0',
            timestamp: new Date(),
          },
        };

        results.push(result);
        setGeneratedImages((prev) => [...prev, result]);
        onImageGenerated(result);

        // 批量生成时的间隔
        if (i < batchCount - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message !== 'Generation cancelled') {
        console.error('图像生成失败:', error);
        alert('图像生成失败，请重试');
      }
    } finally {
      setIsGenerating(false);
      onProgressUpdate(0);
      abortControllerRef.current = null;
    }
  }, [
    prompt,
    negativePrompt,
    style,
    size,
    quality,
    steps,
    seed,
    batchCount,
    useRandomSeed,
    enhancePromptText,
    generateRandomSeed,
    simulateImageGeneration,
    onImageGenerated,
  ]);

  // 取消生成
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // 清空历史
  const handleClearHistory = useCallback(() => {
    setGeneratedImages([]);
  }, []);

  // 下载图像
  const handleDownload = useCallback((result: ImageGenerationResult) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `YYC3_${result.style}_${result.metadata.seed}_${Date.now()}.png`;
    link.click();
  }, []);

  // 使用为新提示词
  const handleUseAsPrompt = useCallback((result: ImageGenerationResult) => {
    setPrompt(result.prompt);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">🎨 图像生成</TabsTrigger>
          <TabsTrigger value="history">📚 生成历史</TabsTrigger>
          <TabsTrigger value="settings">⚙️ 高级设置</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* 主要生成界面 */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span className="text-2xl">🎨</span>
                  <span>AI文生图创作引擎</span>
                </span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  YYC³ ImageGen v2.0
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 提示词输入 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="prompt" className="text-slate-200 font-medium">
                    图像描述 *
                  </Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="详细描述您想要生成的图像，例如：一个现代简约风格的客厅，白色沙发，绿色植物，自然光线..."
                    className="mt-2 bg-slate-900/50 border-slate-600/50 text-slate-100 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="negative-prompt" className="text-slate-200 font-medium">
                    负面提示词（可选）
                  </Label>
                  <Textarea
                    id="negative-prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="描述您不希望在图像中出现的元素，例如：模糊，低质量，变形..."
                    className="mt-2 bg-slate-900/50 border-slate-600/50 text-slate-100 min-h-[80px]"
                  />
                </div>
              </div>

              {/* 快速设置 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-200 font-medium">艺术风格</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="mt-2 bg-slate-900/50 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {styleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-slate-400">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-200 font-medium">图像尺寸</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="mt-2 bg-slate-900/50 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {sizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-slate-400">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-200 font-medium">生成质量</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger className="mt-2 bg-slate-900/50 border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {qualityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-slate-400">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 生成控制 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enhance-prompt"
                      checked={enhancePrompt}
                      onCheckedChange={setEnhancePrompt}
                    />
                    <Label htmlFor="enhance-prompt" className="text-slate-300">
                      智能提示词增强
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-slate-300">批量生成:</Label>
                    <Input
                      type="number"
                      min="1"
                      max="4"
                      value={batchCount}
                      onChange={(e) =>
                        setBatchCount(
                          Math.max(1, Math.min(4, Number.parseInt(e.target.value) || 1))
                        )
                      }
                      className="w-16 bg-slate-900/50 border-slate-600/50 text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  {isGenerating && (
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                    >
                      ⏹️ 取消生成
                    </Button>
                  )}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        生成中...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        开始生成
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* 生成历史 */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>生成历史</span>
                <Button
                  onClick={handleClearHistory}
                  variant="outline"
                  size="sm"
                  className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50"
                >
                  清空历史
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedImages.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-6xl mb-4">🎨</div>
                  <p>还没有生成任何图像</p>
                  <p className="text-sm mt-2">开始创作您的第一张AI艺术作品吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedImages.map((result, index) => (
                    <div
                      key={index}
                      className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50"
                    >
                      <img
                        src={result.url || '/placeholder.svg'}
                        alt={`生成的图像 ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg mb-4"
                      />
                      <div className="space-y-3">
                        <div>
                          <p className="text-slate-300 text-sm line-clamp-2">{result.prompt}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs">
                            {result.style}
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                            {result.metadata.size}
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                            {result.metadata.quality}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleDownload(result)}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50"
                          >
                            📥 下载
                          </Button>
                          <Button
                            onClick={() => handleUseAsPrompt(result)}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50"
                          >
                            🔄 复用
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* 高级设置 */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>高级生成设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-200 font-medium">生成步数: {steps[0]}</Label>
                  <Slider
                    value={steps}
                    onValueChange={setSteps}
                    min={10}
                    max={100}
                    step={5}
                    className="mt-3"
                  />
                  <p className="text-xs text-slate-400 mt-2">更多步数 = 更高质量，但生成时间更长</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      id="random-seed"
                      checked={useRandomSeed}
                      onCheckedChange={setUseRandomSeed}
                    />
                    <Label htmlFor="random-seed" className="text-slate-200 font-medium">
                      随机种子
                    </Label>
                  </div>
                  {!useRandomSeed && (
                    <Input
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder="输入种子数字（可选）"
                      className="bg-slate-900/50 border-slate-600/50 text-slate-100"
                    />
                  )}
                  <p className="text-xs text-slate-400 mt-2">相同种子和参数会生成相似的图像</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                <h4 className="font-semibold text-slate-200 mb-3">💡 生成技巧</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>
                    • <strong>详细描述：</strong>提供具体的细节描述，如颜色、材质、光线等
                  </p>
                  <p>
                    • <strong>风格关键词：</strong>使用"写实"、"动漫"、"油画"等风格词汇
                  </p>
                  <p>
                    • <strong>构图描述：</strong>说明视角，如"特写"、"全景"、"俯视"等
                  </p>
                  <p>
                    • <strong>负面提示：</strong>使用负面提示词排除不想要的元素
                  </p>
                  <p>
                    • <strong>批量生成：</strong>一次生成多张图片，选择最满意的结果
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
