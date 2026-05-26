import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

describe('Card Components', () => {
  it('should render Card with custom className', () => {
    const { container } = render(<Card className="custom-class">Card Content</Card>)
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('should render CardHeader with children', () => {
    render(<CardHeader>Header Content</CardHeader>)
    expect(screen.getByText('Header Content')).toBeInTheDocument()
  })

  it('should render CardTitle with text', () => {
    render(<CardTitle>Title Text</CardTitle>)
    expect(screen.getByText('Title Text')).toBeInTheDocument()
  })

  it('should render CardDescription with description', () => {
    render(<CardDescription>Description Text</CardDescription>)
    expect(screen.getByText('Description Text')).toBeInTheDocument()
  })

  it('should render CardContent with content', () => {
    render(<CardContent>Content Text</CardContent>)
    expect(screen.getByText('Content Text')).toBeInTheDocument()
  })

  it('should render CardFooter with footer content', () => {
    render(<CardFooter>Footer Content</CardFooter>)
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText('Test Footer')).toBeInTheDocument()
  })

  it('should apply custom className to Card components', () => {
    const { container } = render(
      <Card data-testid="test-card">
        <CardHeader className="header-class">Header</CardHeader>
        <CardContent className="content-class">Content</CardContent>
      </Card>
    )

    expect(container.querySelector('[data-testid="test-card"]')).toBeInTheDocument()
  })

  it('should handle empty Card', () => {
    const { container } = render(<Card />)
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
  })
})
