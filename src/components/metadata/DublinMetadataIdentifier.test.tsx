import { DublinMetadataIdentifier } from './DublinMetadataIdentifier.tsx'
import { describe, it, expect, vi } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

vi.mock('../../hooks/useParsedDate', () => ({
  useParsedDate: () => ({
    parseDate: vi.fn().mockReturnValue('January 1, 2024'),
  }),
}))

addi18n()

describe('DublinMetadataIdentifier', () => {
  const testUrl = 'https://example.com'
  const testTimestamp = '2024-01-01T00:00:00.000Z'

  it('should render with identifier label and url', () => {
    renderWithProviders(
      <DublinMetadataIdentifier url={testUrl} crawlTimestamp={testTimestamp} />,
    )
    expect(screen.getByText('Identifier:')).toBeTruthy()
    expect(screen.getByText(testUrl)).toBeTruthy()
  })

  it('should render with captured date', () => {
    renderWithProviders(
      <DublinMetadataIdentifier url={testUrl} crawlTimestamp={testTimestamp} />,
    )
    expect(screen.getByText(/Captured:/)).toBeTruthy()
  })

  it('should render properly in Arabic', () => {
    renderWithProviders(
      <DublinMetadataIdentifier url={testUrl} crawlTimestamp={testTimestamp} />,
      { language: 'ar' },
    )
    expect(screen.getByText('المعرف:')).toBeTruthy()
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('should show truncated url when url is long', () => {
    const longUrl =
      'https://example.com/very/long/url/that/exceeds/the/limit/of/sixty/characters/for/testing'
    renderWithProviders(
      <DublinMetadataIdentifier url={longUrl} crawlTimestamp={testTimestamp} />,
      { language: 'en' },
    )
    expect(screen.getByText(longUrl.slice(0, 60) + '...')).toBeTruthy()
    expect(screen.getByText('[Show more]')).toBeTruthy()
  })

  it('should not show truncate toggle when url is short', () => {
    renderWithProviders(
      <DublinMetadataIdentifier url={testUrl} crawlTimestamp={testTimestamp} />,
    )
    expect(screen.queryByText('[Show more]')).toBeNull()
  })
})
