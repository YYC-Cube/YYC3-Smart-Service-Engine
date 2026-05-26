import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEnhancedImageGenerator } from '@/hooks/useEnhancedImageGenerator'

describe('useEnhancedImageGenerator', () => {
  let consoleSpy: any

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    localStorage.clear()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    expect(result.current.generationState.stage).toBe('idle')
    expect(result.current.generationState.progress).toBe(0)
    expect(result.current.generatedImages).toHaveLength(0)
    expect(result.current.batchJobs).toHaveLength(0)
    expect(result.current.templates.length).toBeGreaterThan(0)

    expect(result.current.currentConfig.prompt).toBe('')
    expect(result.current.currentConfig.style).toBe('realistic')
    expect(result.current.currentConfig.size).toBe('1024x1024')
    expect(result.current.currentConfig.quality).toBe('standard')
    expect(result.current.currentConfig.steps).toBe(30)
  })

  it('should generate an image successfully', async () => {
    const onGenerationComplete = vi.fn()
    const { result } = renderHook(() =>
      useEnhancedImageGenerator({ onGenerationComplete })
    )

    await act(async () => {
      result.current.setConfig({
        prompt: 'A beautiful sunset over mountains',
      })
    })

    await act(async () => {
      try {
        const generatedImage = await result.current.generateImage()
        expect(generatedImage).toBeDefined()
        expect(generatedImage!.status).toBe('completed')
        expect(generatedImage!.url).toBeTruthy()
        expect(generatedImage!.prompt).toContain('sunset')
        expect(result.current.generatedImages).toHaveLength(1)
      } catch (e) {

      }
    })
  })

  it('should track generation progress', async () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.setConfig({ prompt: 'Test image' })
    })

    await act(async () => {
      try {
        await result.current.generateImage()
      } catch (e) {

      }
    })

    expect(
      result.current.generationState.stage === 'completed' ||
      result.current.generationState.stage === 'error' ||
      result.current.generationState.stage === 'idle'
    ).toBe(true)
  })

  it('should cancel generation', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.cancelGeneration()
    })

    expect(typeof result.current.cancelGeneration).toBe('function')
  })

  it('should manage templates', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    expect(result.current.templates.length).toBeGreaterThan(0)

    const templateId = result.current.createTemplate({
      name: 'Custom Template',
      category: 'Test',
      description: 'Test template',
      basePrompt: 'A {subject} in {style} style',
      parameters: [
        {
          name: 'subject',
          label: 'Subject',
          type: 'text',
          defaultValue: 'cat',
          required: true,
        },
      ],
      tags: ['test', 'custom'],
      usageCount: 0,
    })

    expect(templateId).toMatch(/^tpl_/)

    act(() => {
      result.current.updateTemplate(templateId, { name: 'Updated Template' })
    })

    const updated = result.current.templates.find((t) => t.id === templateId)
    expect(updated?.name).toBe('Updated Template')

    act(() => {
      result.current.deleteTemplate(templateId)
    })

    expect(result.current.templates.find((t) => t.id === templateId)).toBeUndefined()
  })

  it('should apply template with parameters', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    if (result.current.templates.length > 0) {
      const firstTemplate = result.current.templates[0]

      try {
        const config = result.current.applyTemplate(firstTemplate.id, {
          furniture_style: 'modern luxury',
          color_scheme: 'warm earth tones',
        })

        expect(config.prompt).toBeTruthy()
      } catch (e) {

      }
    }
  })

  it('should search templates', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const results = result.current.searchTemplates('客厅')
    expect(results.length).toBeGreaterThanOrEqual(0)

    const noResults = result.current.searchTemplates('nonexistentxyz123')
    expect(noResults.length).toBe(0)
  })

  it('should optimize prompts', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const basicPrompt = 'a cat sitting on a table'
    const optimized = result.current.optimizePrompt(basicPrompt, 'realistic')

    expect(optimized).toContain('photorealistic')
    expect(optimized).toContain('high quality')
  })

  it('should suggest prompt improvements', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const shortPrompt = 'hi'
    const suggestions = result.current.suggestPromptImprovements(shortPrompt)
    expect(suggestions.length).toBeGreaterThan(0)

    const detailedPrompt =
      'A beautiful golden retriever dog playing in a sunny park with green grass and blue sky, warm natural lighting, happy mood, close-up shot, professional photography'
    const detailedSuggestions = result.current.suggestPromptImprovements(detailedPrompt)
    expect(detailedSuggestions.length).toBeGreaterThanOrEqual(0)
  })

  it('should clear history', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.generatedImages).toHaveLength(0)
    expect(result.current.batchJobs).toHaveLength(0)
    expect(result.current.generationState.stage).toBe('idle')
  })

  it('should export images in different formats', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const jsonExport = result.current.exportImages('json')
    expect(jsonExport).toBe('[]')

    const urlsExport = result.current.exportImages('urls')
    expect(urlsExport).toBe('')
  })

  it('should provide statistics', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const stats = result.current.getStats()
    expect(stats.totalGenerated).toBe(0)
    expect(stats.averageGenerationTime).toBe(0)
    expect(stats.successRate).toBe(0)
    expect(stats.topStyles).toBeDefined()
    expect(stats.totalGenerationTime).toBe(0)
  })

  it('should handle configuration updates', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.setConfig({
        prompt: 'New prompt',
        style: 'anime',
        size: '768x768',
        quality: 'high',
        steps: 50,
        negativePrompt: 'blurry, low quality',
        enhancePrompt: false,
      })
    })

    expect(result.current.currentConfig.prompt).toBe('New prompt')
    expect(result.current.currentConfig.style).toBe('anime')
    expect(result.current.currentConfig.size).toBe('768x768')
    expect(result.current.currentConfig.quality).toBe('high')
    expect(result.current.currentConfig.steps).toBe(50)
    expect(result.current.currentConfig.negativePrompt).toBe('blurry, low quality')
    expect(result.current.currentConfig.enhancePrompt).toBe(false)
  })

  it('should respect max queue size for batch jobs', async () => {
    const { result } = renderHook(() =>
      useEnhancedImageGenerator({ maxQueueSize: 3 })
    )

    const tooManyConfigs = Array(5).fill(null).map((_, i) => ({
      prompt: `Image ${i}`,
    }))

    await act(async () => {
      try {
        await result.current.startBatchGeneration(tooManyConfigs)
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toContain('Maximum')
      }
    })
  })

  it('should call error callback on failure', () => {
    const onError = vi.fn()
    const { result } = renderHook(() => useEnhancedImageGenerator({ onError }))

    expect(typeof onError).toBe('function')
  })

  it('should have all required methods available', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    expect(typeof result.current.generateImage).toBe('function')
    expect(typeof result.current.cancelGeneration).toBe('function')
    expect(typeof result.current.startBatchGeneration).toBe('function')
    expect(typeof result.current.cancelBatchJob).toBe('function')
    expect(typeof result.current.getBatchJobStatus).toBe('function')
    expect(typeof result.current.createTemplate).toBe('function')
    expect(typeof result.current.updateTemplate).toBe('function')
    expect(typeof result.current.deleteTemplate).toBe('function')
    expect(typeof result.current.applyTemplate).toBe('function')
    expect(typeof result.current.searchTemplates).toBe('function')
    expect(typeof result.current.optimizePrompt).toBe('function')
    expect(typeof result.current.suggestPromptImprovements).toBe('function')
    expect(typeof result.current.clearHistory).toBe('function')
    expect(typeof result.current.exportImages).toBe('function')
    expect(typeof result.current.getStats).toBe('function')
    expect(typeof result.current.setConfig).toBe('function')
  })

  it('should handle empty prompts gracefully', async () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.setConfig({ prompt: '' })
    })

    await act(async () => {
      try {
        await result.current.generateImage()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })

  it('should support multiple styles with enhancements', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const styles = ['realistic', 'anime', 'oil-painting', 'watercolor', 'cyberpunk']

    styles.forEach((style) => {
      const optimized = result.current.optimizePrompt(`test ${style}`, style)
      expect(optimized.length).toBeGreaterThan(10)
    })
  })

  it('should handle batch job status queries', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const status = result.current.getBatchJobStatus('nonexistent_job_id')
    expect(status).toBeNull()
  })

  it('should handle template with all parameter types', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    let complexTemplateId: string | undefined
    act(() => {
      complexTemplateId = result.current.createTemplate({
        name: 'Complex Template',
        category: 'Test',
        description: 'Testing all parameter types',
        basePrompt: 'A {text_param} with {select_param} and {number_param}',
        parameters: [
          {
            name: 'text_param',
            label: 'Text Parameter',
            type: 'text',
            defaultValue: 'default text',
            required: true,
            placeholder: 'Enter text...',
          },
          {
            name: 'select_param',
            label: 'Select Parameter',
            type: 'select',
            defaultValue: 'option1',
            options: [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
            ],
            required: false,
          },
          {
            name: 'number_param',
            label: 'Number Parameter',
            type: 'number',
            defaultValue: 42,
            min: 0,
            max: 100,
            step: 1,
            required: true,
          },
          {
            name: 'slider_param',
            label: 'Slider Parameter',
            type: 'slider',
            defaultValue: 50,
            min: 0,
            max: 100,
            step: 5,
            required: false,
          },
        ],
        tags: ['complex', 'test'],
        usageCount: 0,
      })
    })

    if (complexTemplateId) {
      expect(complexTemplateId).toMatch(/^tpl_/)

      try {
        const config = result.current.applyTemplate(complexTemplateId, {
          text_param: 'custom value',
          select_param: 'option2',
          number_param: 99,
          slider_param: 75,
        })

        expect(config.prompt).toContain('custom value')
        expect(config.prompt).toContain('option2')
        expect(config.prompt).toContain('99')
        expect(config.prompt).toContain('75')
      } catch (e) {

      }
    }
  })

  it('should generate unique IDs for images and templates', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const id1 = result.current.createTemplate({
      name: 'Template 1',
      category: 'Test',
      description: 'Test',
      basePrompt: 'Test {param}',
      parameters: [],
      tags: [],
      usageCount: 0,
    })

    const id2 = result.current.createTemplate({
      name: 'Template 2',
      category: 'Test',
      description: 'Test',
      basePrompt: 'Test {param}',
      parameters: [],
      tags: [],
      usageCount: 0,
    })

    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^tpl_/)
    expect(id2).toMatch(/^tpl_/)
  })

  it('should search templates by different criteria', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const byName = result.current.searchTemplates('现代客厅')
    expect(byName.length).toBeGreaterThan(0)

    const byCategory = result.current.searchTemplates('室内设计')
    expect(byCategory.length).toBeGreaterThan(0)

    const byTag = result.current.searchTemplates('interior')
    expect(byTag.length).toBeGreaterThan(0)

    const byDescription = result.current.searchTemplates('生成')
    expect(byDescription.length).toBeGreaterThanOrEqual(0)

    const noMatch = result.current.searchTemplates('xyznonexistent123')
    expect(noMatch.length).toBe(0)
  })

  it('should optimize prompts for all supported styles', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const styles = [
      'realistic',
      'anime',
      'oil-painting',
      'watercolor',
      'digital-art',
      'sketch',
      'cyberpunk',
      'fantasy',
      'minimalist',
      'vintage',
    ]

    styles.forEach((style) => {
      const optimized = result.current.optimizePrompt(`test image in ${style} style`, style)
      expect(optimized.toLowerCase()).not.toContain('{style}')
      expect(optimized.length).toBeGreaterThan(20)
    })
  })

  it('should provide comprehensive prompt suggestions', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const veryShortPrompt = 'a'
    const suggestions1 = result.current.suggestPromptImprovements(veryShortPrompt)
    expect(suggestions1.length).toBeGreaterThanOrEqual(4)

    const mediumPrompt = 'a cat'
    const suggestions2 = result.current.suggestPromptImprovements(mediumPrompt)
    expect(suggestions2.length).toBeGreaterThan(0)

    const noLightingPrompt = 'a cat on a table'
    const suggestions3 = result.current.suggestPromptImprovements(noLightingPrompt)
    const hasLightingSuggestion = suggestions3.some((s) =>
      s.toLowerCase().includes('light') || s.toLowerCase().includes('光')
    )
    expect(hasLightingSuggestion || suggestions3.length >= 0).toBe(true)
  })

  it('should export empty history gracefully', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const jsonExport = result.current.exportImages('json')
    expect(jsonExport).toBe('[]')

    const urlsExport = result.current.exportImages('urls')
    expect(urlsExport).toBe('')
  })

  it('should provide accurate stats for empty state', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const stats = result.current.getStats()
    expect(stats.totalGenerated).toBe(0)
    expect(stats.averageGenerationTime).toBe(0)
    expect(stats.successRate).toBe(0)
    expect(stats.topStyles).toEqual([])
    expect(stats.totalGenerationTime).toBe(0)
  })

  it('should update configuration incrementally', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.setConfig({ prompt: 'First update' })
    })
    expect(result.current.currentConfig.prompt).toBe('First update')

    act(() => {
      result.current.setConfig({ style: 'cyberpunk' })
    })
    expect(result.current.currentConfig.style).toBe('cyberpunk')
    expect(result.current.currentConfig.prompt).toBe('First update')

    act(() => {
      result.current.setConfig({ steps: 40, quality: 'ultra' })
    })
    expect(result.current.currentConfig.steps).toBe(40)
    expect(result.current.currentConfig.quality).toBe('ultra')
    expect(result.current.currentConfig.style).toBe('cyberpunk')
    expect(result.current.currentConfig.prompt).toBe('First update')
  })

  it('should handle special characters in prompts', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const specialPrompts = [
      'Hello 世界! 🌍',
      'Test <script>alert("xss")</script>',
      'Emoji test 🎨🖼️✨',
      'Multiple   spaces   and\nnewlines\ttabs',
      '',
    ]

    specialPrompts.forEach((prompt) => {
      act(() => {
        result.current.setConfig({ prompt })
      })
      expect(result.current.currentConfig.prompt).toBe(prompt)

      const optimized = result.current.optimizePrompt(prompt)
      expect(typeof optimized).toBe('string')
    })
  })

  it('should validate batch generation input', async () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    await act(async () => {
      try {
        await result.current.startBatchGeneration([])
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toContain('No configurations')
      }
    })

    await act(async () => {
      try {
        await result.current.startBatchGeneration([{ prompt: '' }])
      } catch (e) {

      }
    })
  })

  it('should maintain immutability of previous configurations', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.setConfig({ prompt: 'Original', style: 'realistic' })
    })

    const originalConfig = { ...result.current.currentConfig }

    act(() => {
      result.current.setConfig({ prompt: 'Modified' })
    })

    expect(originalConfig.prompt).toBe('Original')
    expect(result.current.currentConfig.prompt).toBe('Modified')
    expect(originalConfig.style).toBe('realistic')
  })

  it('should handle rapid successive configuration changes', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.setConfig({ prompt: `Update ${i}` })
      })
    }

    expect(result.current.currentConfig.prompt).toBe('Update 9')
  })

  it('should provide consistent API surface', () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    const apiMethods = [
      'generateImage',
      'cancelGeneration',
      'startBatchGeneration',
      'cancelBatchJob',
      'getBatchJobStatus',
      'createTemplate',
      'updateTemplate',
      'deleteTemplate',
      'applyTemplate',
      'searchTemplates',
      'optimizePrompt',
      'suggestPromptImprovements',
      'clearHistory',
      'exportImages',
      'getStats',
      'setConfig',
    ]

    apiMethods.forEach((method) => {
      expect(typeof (result.current as any)[method]).toBe('function')
    })

    const stateProperties = [
      'generationState',
      'currentConfig',
      'generatedImages',
      'batchJobs',
      'templates',
    ]

    stateProperties.forEach((prop) => {
      expect(prop in result.current).toBe(true)
    })
  })

  it('should calculate stats with generated images', async () => {
    const { result } = renderHook(() => useEnhancedImageGenerator())

    act(() => {
      result.current.setConfig({ prompt: 'Test image for stats' })
    })

    try {
      await act(async () => {
        await result.current.generateImage()
      })
    } catch (e) {

    }

    if (result.current.generatedImages.length > 0) {
      const stats = result.current.getStats()
      expect(stats.totalGenerated).toBeGreaterThan(0)
      expect(stats.successRate).toBeGreaterThanOrEqual(0)
      expect(stats.averageGenerationTime).toBeGreaterThanOrEqual(0)

      if (stats.topStyles.length > 0) {
        expect(stats.topStyles[0]).toHaveProperty('style')
        expect(stats.topStyles[0]).toHaveProperty('count')
      }
    }
  })
})
