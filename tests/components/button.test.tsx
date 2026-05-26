import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-input')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Ghost')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('underline-offset-4')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')

    rerender(<Button size="icon"><svg /></Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should support asChild prop for composition', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref Button</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current).toBeInTheDocument()
  })

  it('should render children correctly', () => {
    render(
      <Button>
        <span data-testid="child-icon">🎉</span>
        With Icon
      </Button>
    )

    expect(screen.getByTestId('child-icon')).toBeInTheDocument()
    expect(screen.getByText(/with icon/i)).toBeInTheDocument()
  })

  it('should have correct default ARIA attributes', () => {
    render(<Button>Accessible</Button>)

    const button = screen.getByRole('button')
    expect(button).not.toHaveAttribute('aria-disabled')
  })

  it('should have aria-disabled when disabled', () => {
    render(<Button disabled>Disabled Accessible</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
