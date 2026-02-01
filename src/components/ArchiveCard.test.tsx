import { ArchiveCard } from './ArchiveCard'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

describe('ArchiveCard', () => {
  it('renders children correctly', () => {
    renderWithProviders(
      <ArchiveCard>
        <div>Test Content</div>
      </ArchiveCard>,
    )
    expect(screen.getByText('Test Content')).toBeTruthy()
  })
})
