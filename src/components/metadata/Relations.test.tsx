import { Relations } from './Relations.tsx'
import { describe, it, expect } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'
import type { Relation } from '../../apiTypes/apiResponses'

addi18n()

describe('Relations', () => {
  it('should not render when relations is null', () => {
    renderWithProviders(<Relations relations={null} language="english" />)

    expect(screen.queryByText('Relations:')).toBeNull()
  })

  it('should not render when relations is empty array', () => {
    renderWithProviders(<Relations relations={[]} language="english" />)

    expect(screen.queryByText('Relations:')).toBeNull()
  })

  it('should render relation type and accession id when relations exist', () => {
    const mockRelations: Relation[] = [
      { id: 1, related_accession_id: 42, relation_type: 'has_part' },
    ]

    renderWithProviders(
      <Relations relations={mockRelations} language="english" />,
    )

    expect(screen.getByText('Has Part')).toBeTruthy()
    expect(screen.getByText('Accession 42')).toBeTruthy()
  })
})
