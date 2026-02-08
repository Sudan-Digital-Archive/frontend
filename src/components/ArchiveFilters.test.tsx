import { ArchiveFilters } from './ArchiveFilters'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addi18n, renderWithProviders } from '../../testUtils/testHelpers.tsx'
import { screen, waitFor, fireEvent } from '@testing-library/react'

const mockFetch = vi.fn()
global.fetch = mockFetch

addi18n()

describe('ArchiveFilters Component', () => {
  const mockUpdateFilters = vi.fn()

  const defaultProps = {
    queryFilters: {
      page: 0,
      per_page: 50,
      lang: 'english',
      query_term: '',
      metadata_subjects: [],
      metadata_subjects_inclusive_filter: true,
      is_private: false,
      url_filter: '',
    },
    updateFilters: mockUpdateFilters,
    showSubjectFilters: true,
    isLoggedIn: false,
  }

  beforeEach(() => {
    mockUpdateFilters.mockClear()
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

  it('renders URL filter input', () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} />)
    expect(screen.getByPlaceholderText('Filter by URL...')).toBeTruthy()
  })

  it('renders text search input', () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} />)
    expect(
      screen.getByPlaceholderText('Enter search term here...'),
    ).toBeTruthy()
  })

  it('renders date from filter', () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} />)
    expect(
      screen.getByText((content) => content.includes('Date from')),
    ).toBeTruthy()
  })

  it('renders date to filter', () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} />)
    expect(
      screen.getByText((content) => content.includes('Date to')),
    ).toBeTruthy()
  })

  it('shows subject filters when showSubjectFilters is true', async () => {
    renderWithProviders(
      <ArchiveFilters {...defaultProps} showSubjectFilters={true} />,
    )
    await waitFor(() => {
      expect(screen.getByText('Search subjects')).toBeTruthy()
    })
  })

  it('hides subject filters when showSubjectFilters is false', () => {
    renderWithProviders(
      <ArchiveFilters {...defaultProps} showSubjectFilters={false} />,
    )
    expect(screen.queryByText('Search subjects')).not.toBeTruthy()
  })

  it('shows private records switch when logged in', () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} isLoggedIn={true} />)
    expect(
      screen.getByText((content) => content.includes('Private records')),
    ).toBeTruthy()
  })

  it('hides private records switch when not logged in', () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} isLoggedIn={false} />)
    expect(
      screen.queryByText((content) => content.includes('Private records')),
    ).not.toBeTruthy()
  })

  it('calls updateFilters when URL filter changes after debounce', async () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} />)
    const urlInput = screen.getByPlaceholderText('Filter by URL...')
    fireEvent.change(urlInput, { target: { value: 'example.com' } })

    await waitFor(
      () => {
        expect(mockUpdateFilters).toHaveBeenCalledWith({
          url_filter: 'example.com',
        })
      },
      { timeout: 500 },
    )
  })

  it('calls updateFilters when text search changes after debounce', async () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} />)
    const searchInput = screen.getByPlaceholderText('Enter search term here...')
    fireEvent.change(searchInput, { target: { value: 'search term' } })

    await waitFor(
      () => {
        expect(mockUpdateFilters).toHaveBeenCalledWith({
          query_term: 'search term',
        })
      },
      { timeout: 500 },
    )
  })

  it('calls updateFilters when private switch is toggled', () => {
    renderWithProviders(<ArchiveFilters {...defaultProps} isLoggedIn={true} />)
    const privateSwitch = screen.getByRole('checkbox')
    fireEvent.click(privateSwitch)

    expect(mockUpdateFilters).toHaveBeenCalledWith({ is_private: true })
  })
})
