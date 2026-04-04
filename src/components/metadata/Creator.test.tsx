import { Creator } from './Creator.tsx'
import { describe, it, expect } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

addi18n()

describe('Creator', () => {
  it('should render creator with label', () => {
    renderWithProviders(<Creator creator="Test Creator" />)

    expect(screen.getByText('Creator:')).toBeTruthy()
    expect(screen.getByText('Test Creator')).toBeTruthy()
  })

  it('should not render when creator is null', () => {
    renderWithProviders(<Creator creator={null} />)

    expect(screen.queryByText('Creator:')).toBeNull()
  })

  it('should not render when creator is empty string', () => {
    renderWithProviders(<Creator creator="" />)

    expect(screen.queryByText('Creator:')).toBeNull()
  })
})
