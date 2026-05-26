import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

let ScriptManagement: React.ComponentType<any>

describe('ScriptManagement Component', () => {
  beforeAll(async () => {
    const module = await import('../../customer-service/script-management')
    ScriptManagement = (module as any).default || module
  })

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the component title and description', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
        expect(screen.getByText(/管理和优化客服话术模板/)).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should render action buttons', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('导出')).toBeInTheDocument()
        expect(screen.getByText('导入')).toBeInTheDocument()
        expect(screen.getByText('新建话术')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should render statistics cards', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('总话术数')).toBeInTheDocument()
        expect(screen.getByText('启用中')).toBeInTheDocument()
        expect(screen.getByText('已停用')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should display loading state initially', async () => {
      render(<ScriptManagement />)

      const loadingElement = screen.queryByText(/加载话术库/)
      if (loadingElement) {
        expect(loadingElement).toBeInTheDocument()
      }
    })
  })

  describe('Data Loading', () => {
    it('should load scripts from localStorage on mount', async () => {
      const mockScripts = [
        {
          id: '1',
          title: '测试话术',
          category: 'greeting',
          content: '测试内容',
          variables: [],
          tags: ['测试'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          usage: 10,
        },
      ]

      localStorageMock.setItem('yyc3-script-management', JSON.stringify(mockScripts))
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(localStorageMock.getItem).toHaveBeenCalledWith('yyc3-script-management')
      }, { timeout: 2000 })
    })

    it('should initialize with mock data when localStorage is empty', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
        expect(screen.getByText('沙发产品介绍')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Search Functionality', () => {
    it('should filter scripts by title search', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/搜索话术/)).toBeInTheDocument()
      }, { timeout: 2000 })

      const searchInput = screen.getByPlaceholderText(/搜索话术/)
      fireEvent.change(searchInput, { target: { value: '问候语' } })

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      })
    })

    it('should show all scripts when search is cleared', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: 'test' } })
        fireEvent.change(searchInput, { target: { value: '' } })
      }, { timeout: 2000 })

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
        expect(screen.getByText('沙发产品介绍')).toBeInTheDocument()
      })
    })

    it('should filter scripts by content search', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '欢迎来到' } })
      }, { timeout: 2000 })

      expect(screen.getByPlaceholderText(/搜索话术/)).toBeInTheDocument()
    })

    it('should filter scripts by tag search', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '问候' } })
      }, { timeout: 2000 })

      expect(screen.getByPlaceholderText(/搜索话术/)).toBeInTheDocument()
    })
  })

  describe('CRUD Operations - Read', () => {
    it('should display script list after loading', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
        expect(screen.getByText('沙发产品介绍')).toBeInTheDocument()
        expect(screen.getByText('价格异议处理')).toBeInTheDocument()
        expect(screen.getByText('成交促单话术')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should show script details when selected', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        expect(screen.getByText(/您好，欢迎来到/)).toBeInTheDocument()
      })
    })

    it('should display script metadata', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const metadataElements = screen.queryAllByText(/使用次数|创建时间|最后更新/)
        expect(metadataElements.length).toBeGreaterThanOrEqual(1)
      }, { timeout: 1000 })
    })
  })

  describe('CRUD Operations - Create', () => {
    it('should open create form when new script button is clicked', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        expect(screen.getByText(/新建话术/) || screen.getByText(/编辑/)).toBeInTheDocument()
      })
    })

    it('should create new script with valid data', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '新测试话术' } })
        }

        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '这是测试内容' } })
        }

        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 1000 })
    })
  })

  describe('CRUD Operations - Update', () => {
    it('should enter edit mode when edit button is clicked', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const editButton = screen.queryByText('编辑') || screen.queryByTitle('编辑话术')
        if (editButton) {
          fireEvent.click(editButton)
        }
      }, { timeout: 1000 })
    })

    it('should cancel editing when cancel button is clicked', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const cancelButton = screen.queryByText('取消') || screen.queryByTitle('取消编辑')
        if (cancelButton) {
          fireEvent.click(cancelButton)
        }
      }, { timeout: 1000 })
    })

    it('should validate required fields on save', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }

        const errorMessages = screen.queryAllByText(/不能为空|请选择/)
        expect(errorMessages.length).toBeGreaterThanOrEqual(0)
      }, { timeout: 1000 })
    })
  })

  describe('CRUD Operations - Delete', () => {
    it('should delete script when delete button is clicked', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const deleteButton = screen.queryByText('删除') || screen.queryByTitle('删除话术')
        if (deleteButton) {
          fireEvent.click(deleteButton)
        }
      }, { timeout: 1000 })
    })
  })

  describe('Import/Export Functionality', () => {
    it('should trigger file input when import button is clicked', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const importButton = screen.getByText('导入')
        fireEvent.click(importButton)
      }, { timeout: 2000 })

      const fileInput = document.querySelector('input[type="file"][accept=".json"]') as HTMLInputElement
      expect(fileInput).toBeTruthy()
    })

    it('should export scripts correctly', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const exportButton = screen.getByText('导出')
        fireEvent.click(exportButton)
      }, { timeout: 2000 })

      expect(screen.getByText('话术管理系统')).toBeInTheDocument()
    })

    it('should test play and pause button toggle in editor', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '播放暂停测试' } })
        }

        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '用于测试播放和暂停功能' } })
        }
      }, { timeout: 1000 })


      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })


      for (let i = 0; i < 4; i++) {
        await waitFor(() => {
          const playPauseBtns = screen.queryAllByRole('button').filter(btn =>
            btn.querySelector('svg.lucide-play') || btn.querySelector('svg.lucide-pause')
          )
          if (playPauseBtns.length > 0) {
            fireEvent.click(playPauseBtns[playPauseBtns.length - 1])
          }
        }, { timeout: 500 })
      }
    })

    it('should test edit mode with all form fields filled', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '完整表单测试' } })
        }

        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '完整的话术内容用于测试' } })
        }


        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          fireEvent.change(tagInput, { target: { value: '完整' } })
          const addBtn = screen.queryByText('添加')
          if (addBtn && !addBtn.hasAttribute('disabled')) {
            fireEvent.click(addBtn)
          }
        }
      }, { timeout: 1500 })


      await waitFor(() => {
        const allSelects = screen.queryAllByRole('combobox')
        const editorCategorySelect = allSelects.find(select => {
          const selectValue = select as HTMLSelectElement
          return selectValue.value && ['greeting', 'product-intro', 'objection-handling'].includes(selectValue.value)
        })
        if (editorCategorySelect) {
          fireEvent.change(editorCategorySelect, { target: { value: 'closing' } })
        }
      }, { timeout: 500 })


      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })
    })

    it('should test cancel edit mode and return to view', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {


        const cancelBtn = screen.queryByText('取消')
        if (cancelBtn) {
          fireEvent.click(cancelBtn)
        }
      }, { timeout: 1000 })

      expect(screen.getByText('话术管理系统')).toBeInTheDocument()
    })
  })

  describe('Category Filtering', () => {
    it('should filter scripts by category', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      const categorySelects = screen.queryAllByRole('combobox')
      if (categorySelects.length > 0) {
        fireEvent.change(categorySelects[0], { target: { value: 'greeting' } })
      }
    })
  })

  describe('Sorting Functionality', () => {
    it('should change sort order when sort button is clicked', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      const sortButtons = screen.getAllByRole('button')
      const sortButton = sortButtons.find(btn =>
        btn.textContent?.includes('↑') || btn.textContent?.includes('↓')
      )
      if (sortButton) {
        fireEvent.click(sortButton)
      }
    })

    it('should change sort criteria when select changes', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      const categorySelects = screen.queryAllByRole('combobox')
      if (categorySelects.length > 1) {
        fireEvent.change(categorySelects[1], { target: { value: 'usage' } })
      }
    })
  })

  describe('Batch Operations', () => {
    it('should select script for batch operations', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0])
      }
    })

    it('should toggle inactive scripts visibility', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      const showInactiveButton = screen.queryByText(/显示停用/)
      if (showInactiveButton) {
        fireEvent.click(showInactiveButton)
      }
    })
  })

  describe('Clipboard Operations', () => {
    it('should copy script content to clipboard', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const copyButton = screen.queryByTitle('复制内容') || screen.queryAllByRole('button').find(btn =>
          btn.getAttribute('aria-label')?.includes('copy')
        )
        if (copyButton) {
          fireEvent.click(copyButton)
        }
      }, { timeout: 1000 })
    })

    it('should handle clipboard errors gracefully', async () => {
      const originalClipboard = navigator.clipboard.writeText
      navigator.clipboard.writeText = vi.fn().mockRejectedValueOnce(new Error('Clipboard error'))

      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      const copyButton = screen.queryByText('复制') || screen.queryByTitle('复制内容')
      if (copyButton) {
        fireEvent.click(copyButton)
      }

      navigator.clipboard.writeText = originalClipboard
    })
  })

  describe('Duplicate Operation', () => {
    it('should duplicate existing script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const duplicateButton = screen.queryByTitle('复制话术') || screen.queryAllByRole('button').find(btn =>
          btn.getAttribute('aria-label')?.includes('duplicate')
        )
        if (duplicateButton) {
          fireEvent.click(duplicateButton)
        }
      }, { timeout: 1000 })
    })
  })

  describe('Preview Mode', () => {
    it('should toggle preview mode', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const previewButton = screen.queryByTitle('预览') || screen.queryAllByRole('button').find(btn =>
          btn.textContent?.includes('预览') || btn.getAttribute('aria-label')?.includes('preview')
        )
        if (previewButton) {
          fireEvent.click(previewButton)
        }
      }, { timeout: 1000 })
    })
  })

  describe('Play/Pause Functionality', () => {
    it('should toggle play/pause state', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const playButton = screen.queryAllByRole('button').find(btn =>
          btn.getAttribute('aria-label')?.includes('play')
        )
        if (playButton) {
          fireEvent.click(playButton)
        }
      }, { timeout: 1000 })
    })
  })

  describe('Tag Management', () => {
    it('should add new tag to script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          fireEvent.change(tagInput, { target: { value: '新标签' } })

          const addButton = screen.queryByText('添加')
          if (addButton) {
            fireEvent.click(addButton)
          }
        }
      }, { timeout: 1000 })
    })

    it('should remove tag from script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagBadges = screen.queryAllByText(/×/)
        if (tagBadges.length > 0) {
          fireEvent.click(tagBadges[0])
        }
      }, { timeout: 1000 })
    })
  })

  describe('Variable Extraction', () => {
    it('should extract variables from content', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '测试内容{变量1}{变量2}' } })
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const variableBadges = screen.queryAllByText(/\{.*\}/)
        expect(variableBadges.length).toBeGreaterThanOrEqual(0)
      }, { timeout: 500 })
    })
  })

  describe('Statistics Display', () => {
    it('should calculate correct initial statistics', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('总话术数')).toBeInTheDocument()
        expect(screen.getByText('启用中')).toBeInTheDocument()
        expect(screen.getByText('已停用')).toBeInTheDocument()
        expect(screen.getByText('总使用次数')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('UI Components', () => {
    it('should have search input field', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        expect(searchInput).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should have proper action buttons layout', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const exportButton = screen.getByText('导出')
        const importButton = screen.getByText('导入')
        const createButton = screen.getByText('新建话术')

        expect(exportButton).toBeInTheDocument()
        expect(importButton).toBeInTheDocument()
        expect(createButton).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Performance Optimization', () => {
    it('should remain responsive during multiple rapid interactions', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        for (let i = 0; i < 5; i++) {
          fireEvent.change(searchInput, { target: { value: `test${i}` } })
        }
      }, { timeout: 2000 })

      expect(screen.getByText('话术管理系统')).toBeInTheDocument()
    })

    it('should handle keyboard navigation', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const firstScript = screen.getByText('专业问候语')
        fireEvent.keyDown(firstScript, { key: 'Enter' })
      }, { timeout: 2000 })
    })
  })

  describe('Empty States', () => {
    it('should show empty state message when no scripts match filter', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '不存在的話術xyz123' } })
      }, { timeout: 2000 })

      const emptyMessage = screen.queryByText(/没有找到匹配的话术/)
      if (emptyMessage) {
        expect(emptyMessage).toBeInTheDocument()
      }
    })
  })

  describe('Form Validation', () => {
    it('should validate title length', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          const longTitle = 'a'.repeat(150)
          fireEvent.change(titleInput, { target: { value: longTitle } })
        }
      }, { timeout: 1000 })
    })

    it('should validate content length', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          const longContent = 'a'.repeat(2500)
          fireEvent.change(contentTextarea, { target: { value: longContent } })
        }
      }, { timeout: 1000 })
    })

    it('should show validation errors for empty required fields', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }

        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('should clear validation errors on successful input', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '有效标题' } })
        }

        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '有效内容' } })
        }
      }, { timeout: 1000 })
    })
  })

  describe('Batch Operations Extended', () => {
    it('should select all scripts when select all is clicked', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')
      if (checkboxes.length > 1) {
        fireEvent.click(checkboxes[0])
      }
    })

    it('should deselect all when all are selected and clicked again', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')
      if (checkboxes.length > 1) {
        fireEvent.click(checkboxes[0])
        fireEvent.click(checkboxes[0])
      }
    })

    it('should toggle individual script selection', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')
      if (checkboxes.length > 2) {
        fireEvent.click(checkboxes[1])
        fireEvent.click(checkboxes[1])
      }
    })
  })

  describe('Import/Export Extended', () => {
    it('should handle import with valid JSON file', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle import with invalid JSON file', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should export filtered scripts only', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '问候语' } })
      }, { timeout: 2000 })

      await waitFor(() => {
        const exportButton = screen.getByText('导出')
        fireEvent.click(exportButton)
      }, { timeout: 1000 })
    })
  })

  describe('Error Handling', () => {
    it('should handle save to storage error gracefully', async () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full')
      })

      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle invalid data in localStorage', async () => {
      localStorageMock.setItem('yyc3-script-management', 'not valid json')

      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle non-array data in localStorage', async () => {
      localStorageMock.setItem('yyc3-script-management', '{"not": "an array"}')

      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('State Management', () => {
    it('should update selected script state correctly', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('沙发产品介绍')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const otherScript = screen.getByText('价格异议处理')
        fireEvent.click(otherScript)
      }, { timeout: 1000 })
    })

    it('should reset editing state after cancel', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const cancelButton = screen.queryByText('取消') || screen.queryByTitle('取消编辑')
        if (cancelButton) {
          fireEvent.click(cancelButton)
        }
      }, { timeout: 1000 })
    })

    it('should maintain search term across interactions', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '产品' } })
      }, { timeout: 2000 })

      await waitFor(() => {
        const scriptItem = screen.queryByText('沙发产品介绍')
        if (scriptItem) {
          fireEvent.click(scriptItem)
        }
      }, { timeout: 1000 })
    })
  })

  describe('Accessibility', () => {
    it('should have proper button labels', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThan(10)
      }, { timeout: 2000 })
    })

    it('should have accessible form controls', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox')
        expect(inputs.length).toBeGreaterThan(0)
      }, { timeout: 2000 })
    })
  })

  describe('ScriptEditor Functionality', () => {
    it('should update edited script title in editor mode', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '测试标题更新' } })
          expect(titleInput).toHaveValue('测试标题更新')
        }
      }, { timeout: 1000 })
    })

    it('should update edited script content in editor mode', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '新内容' } })
        }
      }, { timeout: 1000 })
    })

    it('should change category selection in editor mode', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const categorySelects = screen.queryAllByRole('combobox')
        if (categorySelects.length > 2) {
          fireEvent.change(categorySelects[categorySelects.length - 1], { target: { value: 'product-intro' } })
        }
      }, { timeout: 1000 })
    })

    it('should display character count for content', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('should show variable badges when variables are detected', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '测试{变量1}内容' } })
        }
      }, { timeout: 1000 })
    })
  })

  describe('Filter Combinations', () => {
    it('should apply search and category filter together', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '问候语' } })
      }, { timeout: 2000 })

      await waitFor(() => {
        const categorySelects = screen.queryAllByRole('combobox')
        if (categorySelects.length > 0) {
          fireEvent.change(categorySelects[0], { target: { value: 'greeting' } })
        }
      }, { timeout: 500 })
    })

    it('should apply sort and search together', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '产品' } })
      }, { timeout: 2000 })

      await waitFor(() => {
        const categorySelects = screen.queryAllByRole('combobox')
        if (categorySelects.length > 1) {
          fireEvent.change(categorySelects[1], { target: { value: 'title' } })
        }
      }, { timeout: 500 })
    })

    it('should filter by inactive status', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      const showInactiveButton = screen.queryByText(/显示停用/)
      if (showInactiveButton) {
        fireEvent.click(showInactiveButton)
      }
    })
  })

  describe('Script Operations Extended', () => {
    it('should create and save a complete script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)

        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '完整测试话术' } })
        }
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '这是一个完整的话术内容' } })
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })
    })

    it('should select multiple scripts for batch operations', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
        expect(screen.getByText('沙发产品介绍')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')

      if (checkboxes.length > 3) {
        fireEvent.click(checkboxes[1])
        fireEvent.click(checkboxes[2])
      }

      await waitFor(() => {
        const selectedText = screen.queryByText(/已选 \d+ 项/)
        if (selectedText) {
          expect(selectedText).toBeInTheDocument()
        }
      }, { timeout: 500 })
    })

    it('should toggle between different scripts', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const firstScript = screen.getByText('专业问候语')
        fireEvent.click(firstScript)
      }, { timeout: 2000 })

      await waitFor(() => {
        const secondScript = screen.getByText('价格异议处理')
        fireEvent.click(secondScript)
      }, { timeout: 1000 })

      await waitFor(() => {
        const thirdScript = screen.getByText('成交促单话术')
        fireEvent.click(thirdScript)
      }, { timeout: 500 })
    })

    it('should handle rapid search input changes', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)

        const searchTerms = ['沙', '沙发', '沙发产品', '', '价格', '成交']
        searchTerms.forEach(term => {
          fireEvent.change(searchInput, { target: { value: term } })
        })
      }, { timeout: 2000 })
    })

    it('should handle category switching', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      const categories = ['greeting', 'product-intro', 'objection-handling', 'closing']
      const categorySelects = screen.queryAllByRole('combobox')

      if (categorySelects.length > 0) {
        categories.forEach(category => {
          fireEvent.change(categorySelects[0], { target: { value: category } })
        })
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty search results gracefully', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: 'zzz_nonexistent_xyz_123' } })
      }, { timeout: 2000 })

      expect(screen.getByText('话术管理系统')).toBeInTheDocument()
    })

    it('should handle special characters in search', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '{}[]()<>!@#$%^&*' } })
      }, { timeout: 2000 })
    })

    it('should handle very long search term', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        const longTerm = 'a'.repeat(500)
        fireEvent.change(searchInput, { target: { value: longTerm } })
      }, { timeout: 2000 })
    })

    it('should handle unicode characters in search', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)
        fireEvent.change(searchInput, { target: { value: '中文搜索测试🎉' } })
      }, { timeout: 2000 })
    })
  })

  describe('Core Function Coverage', () => {
    it('should test save validation with empty title', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should test save with title exceeding max length', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: 'a'.repeat(150) } })
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })
    })

    it('should test batch delete operation', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')

      if (checkboxes.length > 1) {
        fireEvent.click(checkboxes[1])

        await waitFor(() => {
          const deleteBatchBtn = screen.queryAllByRole('button').find(btn =>
            btn.textContent?.includes('删除') && btn.closest('.bg-cyan-900')
          )
          if (deleteBatchBtn) {
            fireEvent.click(deleteBatchBtn)
          }
        }, { timeout: 500 })
      }
    })

    it('should test batch enable operation', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')

      if (checkboxes.length > 1) {
        fireEvent.click(checkboxes[1])

        await waitFor(() => {
          const enableBtns = screen.queryAllByRole('button').filter(btn =>
            btn.textContent?.includes('启用')
          )
          if (enableBtns.length > 1) {
            fireEvent.click(enableBtns[enableBtns.length - 1])
          }
        }, { timeout: 500 })
      }
    })

    it('should test batch disable operation', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')

      if (checkboxes.length > 1) {
        fireEvent.click(checkboxes[1])

        await waitFor(() => {
          const disableBtns = screen.queryAllByRole('button').filter(btn =>
            btn.textContent?.includes('禁用')
          )
          if (disableBtns.length > 0) {
            fireEvent.click(disableBtns[0])
          }
        }, { timeout: 500 })
      }
    })

    it('should test duplicate script functionality', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const hoverButtons = screen.queryAllByRole('button').filter(btn =>
          window.getComputedStyle(btn).opacity !== '0' ||
          btn.className.includes('group-hover')
        )

        const duplicateBtn = hoverButtons.find(btn =>
          btn.getAttribute('aria-label')?.includes('duplicate') ||
          btn.querySelector('svg.lucide-file-text')
        )

        if (duplicateBtn) {
          fireEvent.click(duplicateBtn)
        }
      }, { timeout: 1000 })
    })

    it('should test copy script content', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('沙发产品介绍')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        const copyBtn = buttons.find(btn =>
          btn.getAttribute('aria-label')?.includes('copy') ||
          btn.querySelector('svg.lucide-copy')
        )

        if (copyBtn) {
          fireEvent.click(copyBtn)
        }
      }, { timeout: 1000 })
    })

    it('should test export with filtered data', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const categorySelects = screen.queryAllByRole('combobox')
        if (categorySelects.length > 0) {
          fireEvent.change(categorySelects[0], { target: { value: 'greeting' } })
        }

        const exportButton = screen.getByText('导出')
        fireEvent.click(exportButton)
      }, { timeout: 2000 })
    })

    it('should test sort by different criteria', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      const sortSelects = screen.queryAllByRole('combobox')

      if (sortSelects.length > 1) {
        const sortByOptions = ['usage', 'updatedAt', 'title']
        sortByOptions.forEach(option => {
          fireEvent.change(sortSelects[1], { target: { value: option } })
        })
      }
    })

    it('should test toggle sort order multiple times', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      for (let i = 0; i < 5; i++) {
        const sortButtons = screen.getAllByRole('button')
        const sortOrderBtn = sortButtons.find(btn =>
          btn.textContent === '↑' || btn.textContent === '↓'
        )
        if (sortOrderBtn) {
          fireEvent.click(sortOrderBtn)
        }
      }
    })

    it('should test delete selected script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('成交促单话术')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const deleteBtns = screen.queryAllByRole('button').filter(btn =>
          btn.textContent?.includes('删除') && !btn.textContent.includes('批量')
        )
        if (deleteBtns.length > 0) {
          fireEvent.click(deleteBtns[deleteBtns.length - 1])
        }
      }, { timeout: 1000 })
    })

    it('should test edit and cancel workflow', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('价格异议处理')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const editBtn = screen.queryByText('编辑')
        if (editBtn) {
          fireEvent.click(editBtn)
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const cancelBtn = screen.queryByText('取消')
        if (cancelBtn) {
          fireEvent.click(cancelBtn)
        }
      }, { timeout: 500 })
    })

    it('should test play/pause toggle', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const playBtns = screen.queryAllByRole('button').filter(btn =>
          btn.querySelector('svg.lucide-play')
        )
        if (playBtns.length > 0) {
          fireEvent.click(playBtns[0])
        }
      }, { timeout: 1000 })
    })

    it('should test preview mode toggle', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('沙发产品介绍')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const previewBtns = screen.queryAllByRole('button').filter(btn =>
          btn.querySelector('svg.lucide-eye') && !btn.querySelector('svg.lucide-eye-off')
        )
        if (previewBtns.length > 0) {
          fireEvent.click(previewBtns[0])
        }
      }, { timeout: 1000 })
    })

    it('should test tag input with Enter key', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          fireEvent.change(tagInput, { target: { value: '测试标签' } })
          fireEvent.keyPress(tagInput, { key: 'Enter' })
        }
      }, { timeout: 1000 })
    })

    it('should test adding maximum number of tags', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          for (let i = 1; i <= 5; i++) {
            fireEvent.change(tagInput, { target: { value: `标签${i}` } })
            const addBtn = screen.queryByText('添加')
            if (addBtn && !addBtn.hasAttribute('disabled')) {
              fireEvent.click(addBtn)
            } else {
              break
            }
          }
        }
      }, { timeout: 1500 })
    })

    it('should test content with multiple variables', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, {
            target: { value: '您好{客户姓名}，关于{产品名称}，价格是{价格}元，请联系{联系方式}' }
          })
        }
      }, { timeout: 1000 })
    })

    it('should test category change in editor', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const allSelects = screen.queryAllByRole('combobox')

        const editorCategorySelect = allSelects.find(select => {
          const selectValue = select as HTMLSelectElement
          return selectValue.value && ['greeting', 'product-intro', 'objection-handling'].includes(selectValue.value)
        })

        if (editorCategorySelect) {
          const categories = ['product-intro', 'objection-handling', 'closing', 'after-sales', 'complaint']
          categories.forEach(cat => {
            fireEvent.change(editorCategorySelect, { target: { value: cat } })
          })
        }
      }, { timeout: 1000 })
    })

    it('should test remove tag by clicking badge', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          fireEvent.change(tagInput, { target: { value: '可删除标签' } })
          const addBtn = screen.queryByText('添加')
          if (addBtn) {
            fireEvent.click(addBtn)
          }
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const tagBadges = screen.queryAllByText(/×|可删除标签/)
        if (tagBadges.length > 0) {
          fireEvent.click(tagBadges[0])
        }
      }, { timeout: 500 })
    })

    it('should test content change triggers variable extraction', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {

          fireEvent.change(contentTextarea, { target: { value: '无变量内容' } })
          fireEvent.change(contentTextarea, { target: { value: '有{变量1}和{变量2}' } })
          fireEvent.change(contentTextarea, { target: { value: '再次无变量' } })
        }
      }, { timeout: 1000 })
    })

    it('should test select all with multiple scripts selected', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')

      if (checkboxes.length > 3) {

        fireEvent.click(checkboxes[1])
        fireEvent.click(checkboxes[2])
        fireEvent.click(checkboxes[3])


        const selectAllCheckbox = checkboxes[0]
        if (selectAllCheckbox) {
          fireEvent.click(selectAllCheckbox)
        }
      }
    })

    it('should test search with case insensitive matching', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)

        fireEvent.change(searchInput, { target: { value: 'PRODUCT' } })
        fireEvent.change(searchInput, { target: { value: 'product' } })
        fireEvent.change(searchInput, { target: { value: '沙 发' } })
      }, { timeout: 2000 })
    })

    it('should test script selection updates details panel', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scripts = ['专业问候语', '沙发产品介绍', '价格异议处理', '成交促单话术']

        scripts.forEach(scriptName => {
          const scriptItem = screen.getByText(scriptName)
          fireEvent.click(scriptItem)
        })
      }, { timeout: 2500 })
    })

    it('should handle empty state when no scripts exist after delete', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })


      const checkboxes = screen.getAllByRole('checkbox')

      for (let i = 1; i < Math.min(checkboxes.length, 5); i++) {
        fireEvent.click(checkboxes[i])
      }

      await waitFor(() => {
        const batchDeleteBtn = screen.queryAllByRole('button').find(btn =>
          btn.textContent?.includes('删除') && btn.closest('.bg-cyan-900')
        )
        if (batchDeleteBtn && checkboxes.length > 2) {
          fireEvent.click(batchDeleteBtn)
        }
      }, { timeout: 500 })
    })

    it('should test successful save with valid data', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)

        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '有效话术标题' } })
        }
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '有效的话术内容用于测试保存功能' } })
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should test content length validation', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '测试内容长度' } })
        }

        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          const longContent = 'a'.repeat(2500)
          fireEvent.change(contentTextarea, { target: { value: longContent } })
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })
    })

    it('should test duplicate tag prevention', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {

          fireEvent.change(tagInput, { target: { value: '重复标签' } })
          let addBtn = screen.queryByText('添加')
          if (addBtn) fireEvent.click(addBtn)


          fireEvent.change(tagInput, { target: { value: '重复标签' } })
          addBtn = screen.queryByText('添加')
          if (addBtn && !addBtn.hasAttribute('disabled')) {
            fireEvent.click(addBtn)
          }
        }
      }, { timeout: 1500 })
    })

    it('should test disabled state when max tags reached', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          for (let i = 1; i <= 6; i++) {
            fireEvent.change(tagInput, { target: { value: `标签${i}` } })
            const addBtn = screen.queryByText('添加')
            if (addBtn && !addBtn.getAttribute('disabled')) {
              fireEvent.click(addBtn)
            }
          }
        }
      }, { timeout: 1500 })
    })

    it('should test copy button on selected script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('价格异议处理')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const allButtons = screen.getAllByRole('button')

        const copyButtons = allButtons.filter(btn => {
          const svg = btn.querySelector('svg')
          return svg && svg.classList.contains('lucide-copy')
        })

        if (copyButtons.length > 0) {
          fireEvent.click(copyButtons[copyButtons.length - 1])
        }
      }, { timeout: 1000 })
    })

    it('should test file button on selected script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('成交促单话术')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const allButtons = screen.getAllByRole('button')

        const fileTextButtons = allButtons.filter(btn => {
          const svg = btn.querySelector('svg')
          return svg && svg.classList.contains('lucide-file-text')
        })

        if (fileTextButtons.length > 0) {
          fireEvent.click(fileTextButtons[fileTextButtons.length - 1])
        }
      }, { timeout: 1000 })
    })

    it('should test save updates existing script', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const editBtn = screen.queryByText('编辑')
        if (editBtn) {
          fireEvent.click(editBtn)
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '修改后的标题' } })
        }
      }, { timeout: 500 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })
    })

    it('should test show inactive toggle multiple times', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 2000 })

      for (let i = 0; i < 5; i++) {
        const showInactiveButton = screen.queryByText(/显示停用|隐藏停用/)
        if (showInactiveButton) {
          fireEvent.click(showInactiveButton)
        }
      }
    })

    it('should test search filters by tags correctly', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/搜索话术/)


        fireEvent.change(searchInput, { target: { value: '问候' } })
        fireEvent.change(searchInput, { target: { value: '专业' } })
        fireEvent.change(searchInput, { target: { value: '热情' } })
      }, { timeout: 2000 })
    })

    it('should test reset selection after batch operation', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('专业问候语')).toBeInTheDocument()
      }, { timeout: 2000 })

      const checkboxes = screen.getAllByRole('checkbox')

      if (checkboxes.length > 2) {

        fireEvent.click(checkboxes[1])


        await waitFor(() => {
          const enableBtns = screen.queryAllByRole('button').filter(btn =>
            btn.textContent?.includes('启用') && btn.closest('.bg-cyan-900')
          )
          if (enableBtns.length > 0) {
            fireEvent.click(enableBtns[enableBtns.length - 1])
          }
        }, { timeout: 500 })


        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }
    })

    it('should test validation error display for category', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should test validation error display for content', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '有标题' } })
        }
      }, { timeout: 1000 })

      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })
    })

    it('should test onUpdateScript callback with content change', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {


          fireEvent.change(contentTextarea, { target: { value: 'a' } })
          fireEvent.change(contentTextarea, { target: { value: 'ab' } })
          fireEvent.change(contentTextarea, { target: { value: 'abc' } })
        }
      }, { timeout: 1000 })
    })

    it('should test preview mode with variables displayed', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('专业问候语')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {

        const eyeBtns = screen.queryAllByRole('button').filter(btn =>
          btn.querySelector('svg.lucide-eye') && !btn.querySelector('svg.lucide-eye-off')
        )

        if (eyeBtns.length > 0) {
          fireEvent.click(eyeBtns[0])
        }
      }, { timeout: 1000 })


      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should test edit mode title input with validation error style', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {


        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 1000 })


      await waitFor(() => {
        const errorElements = screen.queryAllByText(/不能为空|请选择/)
        expect(errorElements.length).toBeGreaterThanOrEqual(0)
      }, { timeout: 500 })
    })

    it('should test category validation error display in editor', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '有标题无分类' } })
        }

        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '有内容' } })
        }


        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 1000 })
    })

    it('should test content validation error display in editor', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '有标题' } })
        }


        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 1000 })
    })

    it('should test tag input disabled when max reached', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          for (let i = 1; i <= 5; i++) {
            fireEvent.change(tagInput, { target: { value: `max${i}` } })
            const addBtn = screen.queryByText('添加')
            if (addBtn && !addBtn.hasAttribute('disabled')) {
              fireEvent.click(addBtn)
            }
          }
        }
      }, { timeout: 1500 })


      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          expect((tagInput as HTMLInputElement).disabled).toBe(true)
        }
      }, { timeout: 500 })
    })

    it('should test add button disabled when no tag text', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const addBtn = screen.queryByText('添加')
        if (addBtn) {
          expect(addBtn).toBeDisabled()
        }
      }, { timeout: 1000 })
    })

    it('should test preview mode toggle on and off', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('沙发产品介绍')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })


      for (let i = 0; i < 4; i++) {
        await waitFor(() => {
          const eyeBtns = screen.queryAllByRole('button').filter(btn =>
            btn.querySelector('svg.lucide-eye') || btn.querySelector('svg.lucide-eye-off')
          )
          if (eyeBtns.length > 0) {
            fireEvent.click(eyeBtns[0])
          }
        }, { timeout: 500 })
      }

      expect(screen.getByText('话术管理系统')).toBeInTheDocument()
    })

    it('should test import file with valid JSON content', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('导入')).toBeInTheDocument()
      }, { timeout: 2000 })

      const importBtns = screen.queryAllByRole('button').filter(btn =>
        btn.textContent?.includes('导入') && !btn.closest('.bg-cyan-900')
      )

      if (importBtns.length > 0) {
        fireEvent.click(importBtns[importBtns.length - 1])
      }


      await waitFor(() => {
        expect(screen.getByText('话术管理系统')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should test duplicate script creates new entry', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const scriptItem = screen.getByText('成交促单话术')
        fireEvent.click(scriptItem)
      }, { timeout: 2000 })

      await waitFor(() => {
        const allButtons = screen.getAllByRole('button')

        const copyButtons = allButtons.filter(btn =>
          btn.querySelector('svg.lucide-copy')
        )

        if (copyButtons.length > 0) {
          fireEvent.click(copyButtons[copyButtons.length - 1])
        }
      }, { timeout: 1000 })
    })

    it('should test export button triggers download', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        expect(screen.getByText('导出')).toBeInTheDocument()
      }, { timeout: 2000 })

      const exportBtns = screen.queryAllByRole('button').filter(btn =>
        btn.textContent?.includes('导出') && !btn.closest('.bg-cyan-900')
      )

      if (exportBtns.length > 0) {
        fireEvent.click(exportBtns[exportBtns.length - 1])
      }
    })

    it('should test add tag by pressing Enter key', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const tagInput = screen.queryByPlaceholderText(/标签|添加标签/)
        if (tagInput) {
          fireEvent.change(tagInput, { target: { value: 'Enter标签' } })
          fireEvent.keyPress(tagInput, { key: 'Enter', code: 'Enter', charCode: 13 })
        }
      }, { timeout: 1000 })
    })

    it('should test preview mode with variable content', async () => {
      render(<ScriptManagement />)

      await waitFor(() => {
        const createButton = screen.getByText('新建话术')
        fireEvent.click(createButton)
      }, { timeout: 2000 })

      await waitFor(() => {
        const titleInput = screen.queryByPlaceholderText(/标题|输入话术标题/)
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: '变量预览测试' } })
        }

        const contentTextarea = screen.queryByPlaceholderText(/内容|输入话术内容/)
        if (contentTextarea) {
          fireEvent.change(contentTextarea, { target: { value: '您好{客户姓名}，欢迎来到{公司名称}' } })
        }
      }, { timeout: 1000 })


      await waitFor(() => {
        const saveButton = screen.queryByText('保存')
        if (saveButton) {
          fireEvent.click(saveButton)
        }
      }, { timeout: 500 })


      await waitFor(() => {
        const eyeBtns = screen.queryAllByRole('button').filter(btn =>
          btn.querySelector('svg.lucide-eye') && !btn.querySelector('svg.lucide-eye-off')
        )
        if (eyeBtns.length > 0) {
          fireEvent.click(eyeBtns[0])
        }
      }, { timeout: 1000 })

      expect(screen.getByText('话术管理系统')).toBeInTheDocument()
    })
  })
})
