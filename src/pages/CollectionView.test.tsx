import { screen, waitFor } from '@testing-library/react'
import CollectionView from './CollectionView'
import {
  addi18n,
  renderWithProviders,
  resetLanguage,
} from '../../testUtils/testHelpers'
import { describe, it, expect, beforeEach, vi } from 'vitest'

addi18n()

const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock react-router useParams
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  }
})

describe('CollectionView Component', () => {
  beforeEach(() => {
    resetLanguage()
    mockFetch.mockClear()
  })

  const mockCollectionResponse = {
    id: 1,
    title: 'Yale Humanitarian Research Labs reports',
    description:
      'Reports from the Yale Humanitarian Research Lab on human rights violations in Sudan.',
    is_public: true,
    subject_ids: [37],
  }

  const mockAccessionsResponse = {
    items: [
      {
        id: '1',
        seed_url: 'http://example.com/accession1',
        dublin_metadata_date: '2024-01-01',
        title_en: 'Test Accession 1',
        description_en: 'Test Description 1',
        subjects_en: ['Yale Reports'],
        subjects_en_ids: [37],
        title_ar: null,
        description_ar: null,
        subjects_ar: null,
        subjects_ar_ids: null,
        has_english_metadata: true,
        has_arabic_metadata: false,
        crawl_status: 'completed',
        crawl_timestamp: '2024-01-01T00:00:00.000Z',
        crawl_id: 'crawl1',
        org_id: 'org1',
        job_run_id: 'job1',
        is_private: false,
      },
    ],
    num_pages: 1,
    page: 0,
    per_page: 50,
  }

  it('renders collection title and description', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollectionResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccessionsResponse,
      })

    renderWithProviders(<CollectionView />)

    await waitFor(() => {
      expect(
        screen.getByText('Yale Humanitarian Research Labs reports'),
      ).toBeTruthy()
    })

    expect(
      screen.getByText(
        'Reports from the Yale Humanitarian Research Lab on human rights violations in Sudan.',
      ),
    ).toBeTruthy()
  })

  it('fetches accessions with collection subject_ids filter', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollectionResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccessionsResponse,
      })

    renderWithProviders(<CollectionView />)

    await waitFor(() => {
      expect(screen.getByText('Test Accession 1')).toBeTruthy()
    })

    // Check that the accessions fetch call includes the subject_ids filter
    // The accessions fetch should be the second call (after collection fetch)
    await waitFor(() => {
      const accessionsCalls = mockFetch.mock.calls.filter((call) =>
        call[0].includes('accessions'),
      )
      expect(accessionsCalls.length).toBeGreaterThan(0)
      const accessionsCall = accessionsCalls[accessionsCalls.length - 1]
      expect(accessionsCall[0]).toContain('metadata_subjects=37')
      expect(accessionsCall[0]).toContain(
        'metadata_subjects_inclusive_filter=true',
      )
    })
  })

  it('displays filtered accessions', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollectionResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccessionsResponse,
      })

    renderWithProviders(<CollectionView />)

    await waitFor(() => {
      expect(screen.getByText('Test Accession 1')).toBeTruthy()
    })
  })

  it('hides subject filters in collection view', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollectionResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccessionsResponse,
      })

    renderWithProviders(<CollectionView />)

    await waitFor(() => {
      expect(
        screen.getByText('Yale Humanitarian Research Labs reports'),
      ).toBeTruthy()
    })

    // Subject autocomplete should not be visible
    expect(screen.queryByText('Search subjects')).not.toBeTruthy()
  })

  it('shows other filters (URL, text, date) in collection view', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollectionResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccessionsResponse,
      })

    renderWithProviders(<CollectionView />)

    await waitFor(() => {
      expect(
        screen.getByText('Yale Humanitarian Research Labs reports'),
      ).toBeTruthy()
    })

    // Other filters should be visible
    expect(screen.getByPlaceholderText('Filter by URL...')).toBeTruthy()
    expect(
      screen.getByPlaceholderText('Enter search term here...'),
    ).toBeTruthy()
    expect(
      screen.getByText((content) => content.includes('Date from')),
    ).toBeTruthy()
    expect(
      screen.getByText((content) => content.includes('Date to')),
    ).toBeTruthy()
  })

  it('shows not found message when collection does not exist', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    renderWithProviders(<CollectionView />)

    await waitFor(() => {
      expect(
        screen.getByText('The requested record could not be found.'),
      ).toBeTruthy()
    })
  })

  it('renders loading spinner while fetching collection', () => {
    // Return a promise that never resolves to keep loading state
    mockFetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          // Never resolve
        }),
    )

    renderWithProviders(<CollectionView />)
    // Check for spinner by looking for the spinner element
    // The spinner should be visible while loading
    expect(document.querySelector('.chakra-spinner')).toBeTruthy()
  })
})
