import { screen } from '@testing-library/react'
import Collections from './Collections'
import {
  addi18n,
  renderWithProviders,
  resetLanguage,
} from '../../testUtils/testHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
addi18n()

describe('Collections Component', () => {
  beforeEach(() => {
    resetLanguage()
  })

  it('renders without errors', () => {
    renderWithProviders(<Collections />)
  })

  it('displays the heading in English', () => {
    renderWithProviders(<Collections />, { language: 'en' })
    expect(
      screen.getByRole('heading', { name: /^collections$/i, level: 2 }),
    ).toBeTruthy()
  })

  it('displays the heading in Arabic', () => {
    renderWithProviders(<Collections />, { language: 'ar' })
    expect(
      screen.getByRole('heading', { name: /^المجموعات$/i, level: 2 }),
    ).toBeTruthy()
  })

  it('displays the Yale collection in English', () => {
    renderWithProviders(<Collections />, { language: 'en' })
    expect(
      screen.getByText('Yale Humanitarian Research Labs reports'),
    ).toBeTruthy()
  })

  it('displays the Tahrir Institute collection in English', () => {
    renderWithProviders(<Collections />, { language: 'en' })
    expect(screen.getByText('Tahrir Institute Articles on Sudan')).toBeTruthy()
  })

  it('displays the Tahrir Institute collection in Arabic', () => {
    renderWithProviders(<Collections />, { language: 'ar' })
    expect(screen.getByText('مقالات معهد التحرير عن السودان')).toBeTruthy()
  })
})
