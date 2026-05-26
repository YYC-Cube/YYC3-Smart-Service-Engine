import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast, toast, reducer } from '@/hooks/use-toast'

describe('useToast Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty toasts', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toEqual([])
  })

  it('should add a toast with toast() function', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'Test Toast' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Test Toast')
    expect(result.current.toasts[0].open).toBe(true)
  })

  it('should dismiss a specific toast', () => {
    const { result } = renderHook(() => useToast())

    let toastId: string

    act(() => {
      const result = toast({ title: 'Dismissible Toast' })
      toastId = result.id
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.dismiss(toastId)
    })

    expect(result.current.toasts[0].open).toBe(false)
  })

  it('should update an existing toast', () => {
    const { result } = renderHook(() => useToast())

    let toastResult: any

    act(() => {
      toastResult = toast({ title: 'Original Title' })
    })

    act(() => {
      toastResult.update({ title: 'Updated Title' })
    })

    expect(result.current.toasts[0].title).toBe('Updated Title')
  })

  it('should limit number of toasts (TOAST_LIMIT=1)', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'First Toast' })
      toast({ title: 'Second Toast' })
      toast({ title: 'Third Toast' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Third Toast')
  })

  it('should handle toast with description and action', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({
        title: 'Action Toast',
        description: 'This is a description',
        action: <button>Action</button>,
        variant: 'destructive',
      })
    })

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Action Toast',
      description: 'This is a description',
      variant: 'destructive',
    })
    expect(result.current.toasts[0].action).toBeDefined()
  })

  it('should return id, dismiss, and update from toast()', () => {
    let toastReturn: any

    act(() => {
      toastReturn = toast({ title: 'Test' })
    })

    expect(toastReturn.id).toBeDefined()
    expect(typeof toastReturn.dismiss).toBe('function')
    expect(typeof toastReturn.update).toBe('function')
  })

  it('should handle duplicate dismiss calls (addToRemoveQueue guard)', () => {
    const { result } = renderHook(() => useToast())

    let toastId: string

    act(() => {
      const toastResult = toast({ title: 'Duplicate Dismiss' })
      toastId = toastResult.id
    })

    act(() => {

      result.current.dismiss(toastId)
      result.current.dismiss(toastId)
      result.current.dismiss(toastId)
    })

    expect(result.current.toasts).toHaveLength(1)
  })

  it('should call dismiss when onOpenChange is called with false', () => {
    const { result } = renderHook(() => useToast())

    let toastResult: any
    let onOpenChange: ((open: boolean) => void) | undefined

    act(() => {
      toastResult = toast({ title: 'Open Change Test' })
    })

    act(() => {


      const toast = result.current.toasts.find(t => t.id === toastResult.id)
      if (toast?.onOpenChange) {
        onOpenChange = toast.onOpenChange
        onOpenChange(false)
      }
    })

    expect(result.current.toasts[0].open).toBe(false)
  })
})

describe('toast reducer', () => {
  it('should handle ADD_TOAST action', () => {
    const state = { toasts: [] }
    const newState = reducer(state, {
      type: 'ADD_TOAST',
      toast: { id: '1', open: true },
    })

    expect(newState.toasts).toHaveLength(1)
    expect(newState.toasts[0].id).toBe('1')
  })

  it('should handle UPDATE_TOAST action', () => {
    const state = {
      toasts: [{ id: '1', title: 'Old', open: true }],
    }
    const newState = reducer(state, {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'New' },
    })

    expect(newState.toasts[0].title).toBe('New')
  })

  it('should handle DISMISS_TOAST action with toastId', () => {
    const state = {
      toasts: [{ id: '1', open: true }],
    }
    const newState = reducer(state, {
      type: 'DISMISS_TOAST',
      toastId: '1',
    })

    expect(newState.toasts[0].open).toBe(false)
  })

  it('should handle DISMISS_TOAST action without toastId', () => {
    const state = {
      toasts: [
        { id: '1', open: true },
        { id: '2', open: true },
      ],
    }
    const newState = reducer(state, {
      type: 'DISMISS_TOAST',
    })

    expect(newState.toasts[0].open).toBe(false)
    expect(newState.toasts[1].open).toBe(false)
  })

  it('should handle REMOVE_TOAST action with toastId', () => {
    const state = {
      toasts: [
        { id: '1', open: false },
        { id: '2', open: true },
      ],
    }
    const newState = reducer(state, {
      type: 'REMOVE_TOAST',
      toastId: '1',
    })

    expect(newState.toasts).toHaveLength(1)
    expect(newState.toasts[0].id).toBe('2')
  })

  it('should handle REMOVE_TOAST action without toastId (clear all)', () => {
    const state = {
      toasts: [
        { id: '1', open: false },
        { id: '2', open: false },
      ],
    }
    const newState = reducer(state, {
      type: 'REMOVE_TOAST',
    })

    expect(newState.toasts).toHaveLength(0)
  })
})
