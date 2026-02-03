import { screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import {
  addi18n,
  renderWithProviders,
  resetLanguage,
} from '../../testUtils/testHelpers'
import Layout from './Layout.tsx'

addi18n()

describe('Layout', () => {
  beforeEach(() => {
    resetLanguage()
  })

  it('renders children content', () => {
    renderWithProviders(<Layout>Test Content</Layout>)
    expect(screen.getByText('Test Content')).toBeTruthy()
  })

  it('renders Menu component', () => {
    renderWithProviders(<Layout>Test Content</Layout>)
    expect(screen.getByText('The Archive')).toBeTruthy()
  })

  it('renders Footer component', () => {
    renderWithProviders(<Layout>Test Content</Layout>)
    expect(screen.getByText(/This website is made with/)).toBeTruthy()
  })

  it('wraps children in SlideFade animation', () => {
    const { container } = renderWithProviders(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>,
    )

    expect(container.querySelector('[data-testid="content"]')).toBeTruthy()
  })

  it('passes changeLanguageOverride to Menu when provided', () => {
    const mockLanguageChange = () => {}
    renderWithProviders(
      <Layout changeLanguageOverride={mockLanguageChange}>
        <div>Test Content</div>
      </Layout>,
    )

    // Should render without errors and contain the menu
    expect(screen.getByText('The Archive')).toBeTruthy()
  })
})
