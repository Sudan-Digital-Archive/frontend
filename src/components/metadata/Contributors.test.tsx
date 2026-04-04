import { Contributors } from './Contributors.tsx'
import { describe, it, expect } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

addi18n()

describe('Contributors', () => {
  it('should render contributors with roles', () => {
    renderWithProviders(
      <Contributors
        contributors={['John Doe', 'Jane Smith']}
        contributorRoles={['Photographer', 'Transcriber']}
      />,
    )

    expect(screen.getByText('John Doe')).toBeTruthy()
    expect(screen.getByText('Jane Smith')).toBeTruthy()
    expect(screen.getByText('Photographer')).toBeTruthy()
    expect(screen.getByText('Transcriber')).toBeTruthy()
  })

  it('should render contributors without roles', () => {
    renderWithProviders(
      <Contributors contributors={['John Doe']} contributorRoles={[null]} />,
    )

    expect(screen.getByText('John Doe')).toBeTruthy()
    expect(screen.queryByText('has role')).toBeNull()
  })

  it('should not render when contributors is null', () => {
    renderWithProviders(
      <Contributors contributors={null} contributorRoles={null} />,
    )

    expect(screen.queryByText('Contributors:')).toBeNull()
  })
})
