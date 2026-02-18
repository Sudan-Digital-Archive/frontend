import { describe, it, expect } from 'vitest'
import { screen, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { LangNavLink } from './LangNavLink.tsx'

// Initialize i18n for tests
i18n.init({
  lng: 'en',
  resources: {
    en: { translation: {} },
    ar: { translation: {} },
  },
})

describe('LangNavLink', () => {
  it('renders with lang param appended to URL without query params', () => {
    i18n.changeLanguage('ar')
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <LangNavLink to="/collections/123">Link Text</LangNavLink>
        </I18nextProvider>
      </MemoryRouter>,
    )

    const link = screen.getByText('Link Text')
    expect(link.getAttribute('href')).toBe('/collections/123?lang=ar')
  })

  it('renders with lang param appended to URL with existing query params', () => {
    i18n.changeLanguage('ar')
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <LangNavLink to="/archive/60?isPrivate=false">Link Text</LangNavLink>
        </I18nextProvider>
      </MemoryRouter>,
    )

    const link = screen.getByText('Link Text')
    expect(link.getAttribute('href')).toBe(
      '/archive/60?isPrivate=false&lang=ar',
    )
  })

  it('renders without lang param when preserveLang is false', () => {
    i18n.changeLanguage('en')
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <LangNavLink to="/collections/123" preserveLang={false}>
            Link Text
          </LangNavLink>
        </I18nextProvider>
      </MemoryRouter>,
    )

    const link = screen.getByText('Link Text')
    expect(link.getAttribute('href')).toBe('/collections/123')
  })

  it('renders with lang param when in English', () => {
    i18n.changeLanguage('en')
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <LangNavLink to="/collections/123">Link Text</LangNavLink>
        </I18nextProvider>
      </MemoryRouter>,
    )

    const link = screen.getByText('Link Text')
    expect(link.getAttribute('href')).toBe('/collections/123?lang=en')
  })

  it('works with object to prop', () => {
    i18n.changeLanguage('en')
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <LangNavLink to={{ pathname: '/collections/123' }}>
            Link Text
          </LangNavLink>
        </I18nextProvider>
      </MemoryRouter>,
    )

    const link = screen.getByText('Link Text')
    expect(link.getAttribute('href')).toBe('/collections/123?lang=en')
  })

  it('preserves existing search params with object to prop', () => {
    i18n.changeLanguage('en')
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <LangNavLink
            to={{ pathname: '/archive/60', search: '?isPrivate=false' }}
          >
            Link Text
          </LangNavLink>
        </I18nextProvider>
      </MemoryRouter>,
    )

    const link = screen.getByText('Link Text')
    expect(link.getAttribute('href')).toBe(
      '/archive/60?isPrivate=false&lang=en',
    )
  })
})
