import { screen, waitFor } from '@testing-library/react'
import Collections from './Collections'
import {
  addi18n,
  renderWithProviders,
  resetLanguage,
} from '../../testUtils/testHelpers'
import { describe, it, expect, beforeEach, vi } from 'vitest'
addi18n()

// Mock fetch for API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Collections Component', () => {
  beforeEach(() => {
    resetLanguage()
    mockFetch.mockClear()
  })

  const mockCollectionsResponse = {
    items: [
      {
        id: 1,
        title: 'Yale Humanitarian Research Labs reports',
        description:
          'Reports from the Yale Humanitarian Research Lab on human rights violations in Sudan.',
        is_public: true,
        subject_ids: [37],
      },
      {
        id: 2,
        title: 'Tahrir Institute Articles on Sudan',
        description:
          'Reports and analysis from the Tahrir Institute for Middle East Policy (TIMEP) concerning Sudan.',
        is_public: true,
        subject_ids: [1],
      },
    ],
    num_pages: 1,
    page: 0,
    per_page: 50,
  }

  const mockArabicCollectionsResponse = {
    items: [
      {
        id: 1,
        title: 'مقالات معهد التحرير عن السودان',
        description:
          'تقارير وتحليلات من معهد التحرير لسياسات الشرق الأوسط (TIMEP) المتعلقة بالسودان.',
        is_public: true,
        subject_ids: [11],
      },
    ],
    num_pages: 1,
    page: 0,
    per_page: 50,
  }

  it('renders without errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCollectionsResponse,
    })
    renderWithProviders(<Collections />)
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /^collections$/i, level: 2 }),
      ).toBeTruthy()
    })
  })

  it('displays the heading in English', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCollectionsResponse,
    })
    renderWithProviders(<Collections />, { language: 'en' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /^collections$/i, level: 2 }),
      ).toBeTruthy()
    })
  })

  it('displays the heading in Arabic', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockArabicCollectionsResponse,
    })
    renderWithProviders(<Collections />, { language: 'ar' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /^المجموعات$/i, level: 2 }),
      ).toBeTruthy()
    })
  })

  it('displays the Yale collection in English', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCollectionsResponse,
    })
    renderWithProviders(<Collections />, { language: 'en' })
    await waitFor(() => {
      expect(
        screen.getByText('Yale Humanitarian Research Labs reports'),
      ).toBeTruthy()
    })
  })

  it('displays the Tahrir Institute collection in English', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCollectionsResponse,
    })
    renderWithProviders(<Collections />, { language: 'en' })
    await waitFor(() => {
      expect(
        screen.getByText('Tahrir Institute Articles on Sudan'),
      ).toBeTruthy()
    })
  })

  it('displays the Tahrir Institute collection in Arabic', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockArabicCollectionsResponse,
    })
    renderWithProviders(<Collections />, { language: 'ar' })
    await waitFor(() => {
      expect(screen.getByText('مقالات معهد التحرير عن السودان')).toBeTruthy()
    })
  })
})
