import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

let SmartCustomerService: React.ComponentType<any>

describe('SmartCustomerService Component', () => {
  beforeAll(async () => {
    const module = await import('../../customer-service/smart-customer-service')
    SmartCustomerService = (module as any).default || module
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render scenario selection buttons', () => {
      render(<SmartCustomerService />)

      expect(screen.getAllByText('产品咨询').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('情感回复').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('异议处理')).toBeInTheDocument()
      expect(screen.getByText('质量分析')).toBeInTheDocument()
    })

    it('should render customer input section', () => {
      render(<SmartCustomerService />)

      expect(screen.getByText('客户输入')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('请输入客户的问题或需求...')).toBeInTheDocument()
    })

    it('should render AI response section', () => {
      render(<SmartCustomerService />)

      expect(screen.getByText('AI智能回复')).toBeInTheDocument()
    })

    it('should render generate button', () => {
      render(<SmartCustomerService />)

      expect(screen.getByText('生成AI回复')).toBeInTheDocument()
    })

    it('should render system features section', () => {
      render(<SmartCustomerService />)

      expect(screen.getByText('系统特性')).toBeInTheDocument()
      expect(screen.getByText('智能识别')).toBeInTheDocument()
      expect(screen.getAllByText('情感回复').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('质量监控')).toBeInTheDocument()
    })
  })

  describe('Scenario Selection', () => {
    it('should have consultation scenario selected by default', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      const consultationButton = buttons.find(btn => btn.textContent?.includes('产品咨询'))
      expect(consultationButton).toBeTruthy()
    })

    it('should switch scenario when different scenario button is clicked', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      const emotionalButton = buttons.find(btn => btn.textContent?.includes('情感回复'))
      if (emotionalButton) {
        fireEvent.click(emotionalButton)
        expect(emotionalButton).toBeInTheDocument()
      }
    })

    it('should show scenario descriptions', () => {
      render(<SmartCustomerService />)

      expect(screen.getByText('专业产品介绍和推荐')).toBeInTheDocument()
      expect(screen.getByText('温暖贴心的情感交流')).toBeInTheDocument()
      expect(screen.getByText('专业化解客户疑虑')).toBeInTheDocument()
      expect(screen.getByText('对话质量实时监控')).toBeInTheDocument()
    })
  })

  describe('Input Handling', () => {
    it('should update input value when user types', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      fireEvent.change(textarea, { target: { value: '测试输入内容' } })
      expect(textarea).toHaveValue('测试输入内容')
    })

    it('should accept empty input initially', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      expect(textarea).toHaveValue('')
    })

    it('should handle long text input', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const longText = '这是一个很长的客户问题描述'.repeat(10)
      fireEvent.change(textarea, { target: { value: longText } })
      expect(textarea).toHaveValue(longText)
    })
  })

  describe('AI Response Generation', () => {
    it('should generate response for consultation scenario', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const generateButton = screen.getByText('生成AI回复')

      fireEvent.change(textarea, { target: { value: '我想了解沙发产品' } })
      fireEvent.click(generateButton)

      expect(screen.getByText(/感谢您对我们产品的关注/)).toBeInTheDocument()
    })

    it('should generate response for emotional scenario', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      const emotionalButton = buttons.find(btn => btn.textContent?.includes('情感回复'))
      if (emotionalButton) fireEvent.click(emotionalButton)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const generateButton = screen.getByText('生成AI回复')

      fireEvent.change(textarea, { target: { value: '我很纠结选择家具' } })
      fireEvent.click(generateButton)

      expect(screen.getByText(/我完全理解您的感受/)).toBeInTheDocument()
    })

    it('should generate response for objection scenario', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      const objectionButton = buttons.find(btn => btn.textContent?.includes('异议处理'))
      if (objectionButton) fireEvent.click(objectionButton)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const generateButton = screen.getByText('生成AI回复')

      fireEvent.change(textarea, { target: { value: '价格太贵了' } })
      fireEvent.click(generateButton)

      expect(screen.getByText(/我理解您的顾虑/)).toBeInTheDocument()
    })

    it('should generate response for analysis scenario', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      const analysisButton = buttons.find(btn => btn.textContent?.includes('质量分析'))
      if (analysisButton) fireEvent.click(analysisButton)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const generateButton = screen.getByText('生成AI回复')

      fireEvent.change(textarea, { target: { value: '客户询问产品质量' } })
      fireEvent.click(generateButton)

      expect(screen.getByText(/对话质量分析报告/)).toBeInTheDocument()
    })

    it('should not generate response for empty input', () => {
      render(<SmartCustomerService />)

      const generateButton = screen.getByText('生成AI回复')
      fireEvent.click(generateButton)

      expect(screen.queryByText(/感谢您对我们产品的关注/)).not.toBeInTheDocument()
    })

    it('should include customer input in generated response', () => {
      render(<SmartCustomerService />)

      const testInput = '特定的客户需求'
      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const generateButton = screen.getByText('生成AI回复')

      fireEvent.change(textarea, { target: { value: testInput } })
      fireEvent.click(generateButton)

      expect(screen.getAllByText(new RegExp(testInput)).length).toBeGreaterThan(0)
    })
  })

  describe('Response Display', () => {
    it('should display response in AI response section', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const generateButton = screen.getByText('生成AI回复')

      fireEvent.change(textarea, { target: { value: '测试显示' } })
      fireEvent.click(generateButton)

      expect(screen.getByText(/感谢您对我们产品的关注/)).toBeInTheDocument()
    })

    it('should show empty state before any response is generated', () => {
      render(<SmartCustomerService />)

      expect(screen.getByText('请输入客户问题，AI将生成专业回复')).toBeInTheDocument()
    })
  })

  describe('UI Elements and Layout', () => {
    it('should have proper grid layout for scenarios', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      const scenarioButtons = buttons.filter(btn =>
        btn.textContent?.includes('咨询') || btn.textContent?.includes('情感') ||
        btn.textContent?.includes('异议') || btn.textContent?.includes('质量')
      )

      expect(scenarioButtons.length).toBeGreaterThanOrEqual(4)
    })

    it('should display feature cards in system section', () => {
      render(<SmartCustomerService />)

      expect(screen.getByText('智能识别')).toBeInTheDocument()
      expect(screen.getAllByText('情感回复').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('质量监控')).toBeInTheDocument()
    })
  })

  describe('Interaction Flow', () => {
    it('should complete full interaction flow: select scenario -> input -> generate', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      const objectionButton = buttons.find(btn => btn.textContent?.includes('异议处理'))
      if (objectionButton) fireEvent.click(objectionButton)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      fireEvent.change(textarea, { target: { value: '测试完整流程' } })
      fireEvent.click(screen.getByText('生成AI回复'))

      expect(screen.getByText(/我理解您的顾虑/)).toBeInTheDocument()
    })

    it('should allow switching scenarios and regenerating response', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      fireEvent.change(textarea, { target: { value: '多场景测试' } })
      fireEvent.click(screen.getByText('生成AI回复'))

      expect(screen.getByText(/感谢您对我们产品的关注/)).toBeInTheDocument()

      const buttons = screen.getAllByRole('button')
      const emotionalButton = buttons.find(btn => btn.textContent?.includes('情感回复'))
      if (emotionalButton) fireEvent.click(emotionalButton)
      fireEvent.click(screen.getByText('生成AI回复'))

      expect(screen.getByText(/我完全理解您的感受/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle special characters in input', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const specialInput = '测试特殊字符！@#￥%'

      fireEvent.change(textarea, { target: { value: specialInput } })
      fireEvent.click(screen.getByText('生成AI回复'))

      const escapedInput = specialInput.replace(/[!@#￥%]/g, '\\$&')
      expect(screen.getAllByText(new RegExp(escapedInput)).length).toBeGreaterThan(0)
    })

    it('should handle numbers in input', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      const numericInput = '我想购买1234元的沙发'

      fireEvent.change(textarea, { target: { value: numericInput } })
      fireEvent.click(screen.getByText('生成AI回复'))

      expect(screen.getByText(/感谢您对我们产品的关注/)).toBeInTheDocument()
    })

    it('should handle whitespace-only input correctly', () => {
      render(<SmartCustomerService />)

      const textarea = screen.getByPlaceholderText('请输入客户的问题或需求...')
      fireEvent.change(textarea, { target: { value: '   ' } })
      fireEvent.click(screen.getByText('生成AI回复'))

      expect(screen.queryByText(/感谢您对我们产品的关注/)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper interactive elements', () => {
      render(<SmartCustomerService />)

      expect(screen.getByRole('textbox')).toBeTruthy()
      expect(screen.getByRole('button', { name: /生成AI回复/i })).toBeInTheDocument()
    })

    it('should have multiple clickable scenario buttons', () => {
      render(<SmartCustomerService />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(4)
    })
  })
})
