import { CollectionHeader } from './CollectionHeader'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

describe('CollectionHeader', () => {
  it('renders title and description correctly', () => {
    renderWithProviders(
      <CollectionHeader
        collection={{
          id: 1,
          title: 'Test Collection Title',
          description: 'Test collection description',
          subject_ids: [],
          is_private: false,
        }}
      />,
    )
    expect(screen.getByText('Test Collection Title')).toBeTruthy()
    expect(screen.getByText('Test collection description')).toBeTruthy()
  })

  it('renders with provided title', () => {
    renderWithProviders(
      <CollectionHeader
        collection={{
          id: 1,
          title: 'My Collection',
          description: 'A description',
          subject_ids: [],
          is_private: false,
        }}
      />,
    )
    expect(screen.getByText('My Collection')).toBeTruthy()
  })

  it('renders with provided description', () => {
    renderWithProviders(
      <CollectionHeader
        collection={{
          id: 1,
          title: 'Title',
          description: 'A longer description text',
          subject_ids: [],
          is_private: false,
        }}
      />,
    )
    expect(screen.getByText('A longer description text')).toBeTruthy()
  })
})
