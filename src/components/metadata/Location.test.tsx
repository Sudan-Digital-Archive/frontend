import { Location } from './Location.tsx'
import { describe, it, expect } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

addi18n()

describe('Location', () => {
  it('should render location with label', () => {
    renderWithProviders(<Location location="Khartoum" />)

    expect(screen.getByText('Location:')).toBeTruthy()
    expect(screen.getByText('Khartoum')).toBeTruthy()
  })

  it('should not render when location is null', () => {
    renderWithProviders(<Location location={null} />)

    expect(screen.queryByText('Location:')).toBeNull()
  })

  it('should not render when location is empty string', () => {
    renderWithProviders(<Location location="" />)

    expect(screen.queryByText('Location:')).toBeNull()
  })
})
