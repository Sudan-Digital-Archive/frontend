import { CollectionHeader } from './CollectionHeader'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

describe('CollectionHeader', () => {
  it('renders title and description correctly', () => {
    renderWithProviders(
      <CollectionHeader
        title="Test Collection Title"
        description="Test collection description"
      />,
    )
    expect(screen.getByText('Test Collection Title')).toBeTruthy()
    expect(screen.getByText('Test collection description')).toBeTruthy()
  })

  it('renders with provided title', () => {
    renderWithProviders(
      <CollectionHeader title="My Collection" description="A description" />,
    )
    expect(screen.getByText('My Collection')).toBeTruthy()
  })

  it('renders with provided description', () => {
    renderWithProviders(
      <CollectionHeader
        title="Title"
        description="A longer description text"
      />,
    )
    expect(screen.getByText('A longer description text')).toBeTruthy()
  })
})
