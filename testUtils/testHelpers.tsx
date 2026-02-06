import { beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React, { useState } from 'react'
import arTranslations from '../src/translations/ar.json'
import enTranslations from '../src/translations/en.json'
import { registerLocale } from 'react-datepicker'
import { ar } from 'date-fns/locale'
import { ChakraProvider } from '@chakra-ui/react'
import { vi } from 'vitest'
import { UserContext } from '../src/context/UserContextDefinition'
import type { UserRole } from '../src/apiTypes/userTypes'

export const resetLanguage = () => {
  i18n.changeLanguage('en')
  document.documentElement.lang = 'en'
  document.documentElement.dir = 'ltr'
}

export const addi18n = () => {
  beforeAll(() => {
    registerLocale('ar', ar)
    i18n.init({
      lng: 'en',
      resources: {
        en: enTranslations,
        ar: arTranslations,
      },
    })
    resetLanguage()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })
}

interface MockUserProviderProps {
  children: React.ReactNode
  isLoggedIn?: boolean
  role?: UserRole | null
}

// eslint-disable-next-line react-refresh/only-export-components
function MockUserProvider({
  children,
  isLoggedIn = false,
  role = null,
}: MockUserProviderProps) {
  const [loggedInState, setLoggedInState] = useState(isLoggedIn)
  const [roleState, setRoleState] = useState<UserRole | null>(role)

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: loggedInState,
        setIsLoggedIn: setLoggedInState,
        role: roleState,
        setRole: setRoleState,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

interface RenderOptions {
  language?: 'en' | 'ar'
  isLoggedIn?: boolean
  role?: UserRole | null
}

export const renderWithProviders = (
  component: React.ReactNode,
  options: RenderOptions = {},
) => {
  if (options.language) {
    i18n.changeLanguage(options.language)
    document.documentElement.lang = options.language
    document.documentElement.dir = options.language === 'ar' ? 'rtl' : 'ltr'
  }

  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <MockUserProvider isLoggedIn={options.isLoggedIn} role={options.role}>
            {component}
          </MockUserProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>,
  )
}
