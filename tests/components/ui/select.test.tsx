import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

describe('Select Components', () => {
  it('should render SelectTrigger with children', () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    )

    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('should render SelectItem with text content', () => {
    render(
      <Select>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('should render SelectGroup with items', () => {
    render(
      <Select>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('should handle SelectValue with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
      </Select>
    )

    expect(screen.getByText('Choose...')).toBeInTheDocument()
  })
})
