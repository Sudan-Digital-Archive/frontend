import { GenericAutocomplete } from './GenericAutocomplete'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen, waitFor } from '@testing-library/react'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

addi18n()

describe('GenericAutocomplete Component', () => {
  const defaultProps = {
    endpoint: 'subjects',
    idKey: 'id',
    labelKey: 'subject',
    pluralLabel: 'subjects',
    createPayloadKey: 'metadata_subject',
  }

  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          { id: 1, subject: 'Test Subject 1' },
          { id: 2, subject: 'Test Subject 2' },
        ],
        num_pages: 1,
        page: 0,
        per_page: 50,
      }),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows "Translation missing" when a selected value is not found in fetched items', async () => {
    renderWithProviders(
      <GenericAutocomplete
        {...defaultProps}
        value={[
          { value: 1, label: '1' },
          { value: 999, label: '999' },
        ]}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('Test Subject 1')).toBeTruthy()
    })

    expect(screen.getByText('Translation missing')).toBeTruthy()
  })

  it('shows "Translation missing" for locked values not found in fetched items', async () => {
    renderWithProviders(
      <GenericAutocomplete {...defaultProps} lockedValues={[1, 999]} />,
    )

    await waitFor(() => {
      expect(screen.getByText('Test Subject 1')).toBeTruthy()
    })

    expect(screen.getByText('Translation missing')).toBeTruthy()
  })
})
