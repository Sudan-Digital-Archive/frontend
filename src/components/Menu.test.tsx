import Menu from './Menu.tsx'
import { describe, it, expect, beforeEach } from 'vitest'
import {
  addi18n,
  renderWithProviders,
  resetLanguage,
} from '../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

addi18n()

describe('Menu', () => {
  beforeEach(() => {
    resetLanguage()
  })

  it('should render properly in English', () => {
    renderWithProviders(<Menu />)
    expect(screen.getByText('The Archive')).toBeTruthy()
    expect(screen.getByText('About')).toBeTruthy()
    expect(screen.getByText('عربي')).toBeTruthy()
  })

  it('should render properly in Arabic', () => {
    renderWithProviders(<Menu />, { language: 'ar' })
    expect(screen.getByText('الأرشيف')).toBeTruthy()
    expect(screen.getByText('English')).toBeTruthy()
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
  })

  it('should show login link when not logged in', () => {
    renderWithProviders(<Menu />, { isLoggedIn: false })
    expect(screen.getByText('Login')).toBeTruthy()
  })

  it('should not show login link when logged in', () => {
    renderWithProviders(<Menu />, { isLoggedIn: true })
    expect(screen.queryByText('Login')).toBeNull()
  })

  it('should show User Management link for admin users', () => {
    renderWithProviders(<Menu />, { isLoggedIn: true, role: 'Admin' })
    expect(screen.getByText('User Management')).toBeTruthy()
  })

  it('should not show User Management link for non-admin users', () => {
    renderWithProviders(<Menu />, { isLoggedIn: true, role: 'Contributor' })
    expect(screen.queryByText('User Management')).toBeNull()
  })

  it('should not show User Management link when not logged in', () => {
    renderWithProviders(<Menu />, { isLoggedIn: false })
    expect(screen.queryByText('User Management')).toBeNull()
  })
})
