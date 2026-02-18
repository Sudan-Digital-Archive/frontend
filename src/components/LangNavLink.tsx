import React from 'react'
import { NavLink, NavLinkProps } from 'react-router'
import { useTranslation } from 'react-i18next'

export type LangNavLinkProps = NavLinkProps & {
  /**
   * Optional flag to preserve lang parameter in URL
   * @default true
   */
  preserveLang?: boolean
}

/**
 * LangNavLink - A NavLink wrapper that automatically preserves the lang query parameter.
 *
 * This component ensures bilingual support throughout the application by:
 * - Reading the current language from i18n
 * - Appending it to the navigation target
 * - Preserving any existing query parameters
 *
 * Use this for all internal navigation links to maintain language context.
 * Use regular NavLink for external links.
 */
export const LangNavLink = React.forwardRef<
  HTMLAnchorElement,
  LangNavLinkProps
>(function LangNavLink({ to, preserveLang = true, ...props }, ref) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  // If preserveLang is false, just use regular NavLink
  if (!preserveLang) {
    return <NavLink ref={ref} to={to} {...props} />
  }

  // Build the URL with lang parameter
  if (typeof to === 'string') {
    // Handle string URLs
    const hasQueryParams = to.includes('?')
    const destination = hasQueryParams
      ? `${to}&lang=${currentLang}`
      : `${to}?lang=${currentLang}`
    return <NavLink ref={ref} to={destination} {...props} />
  }

  if (typeof to === 'object' && to !== null) {
    // Handle object URLs (pathname, search, etc.)
    const search = to.search || ''
    const hasQueryParams = search.length > 0
    const langParam = `lang=${currentLang}`
    const newSearch = hasQueryParams
      ? `${search}&${langParam}`
      : `?${langParam}`

    const destination = {
      ...to,
      search: newSearch,
    }
    return <NavLink ref={ref} to={destination} {...props} />
  }

  // Fallback for function URLs or any other case - return as-is
  return <NavLink ref={ref} to={to} {...props} />
})
