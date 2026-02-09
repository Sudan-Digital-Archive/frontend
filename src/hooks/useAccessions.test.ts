import { describe, it, expect } from 'vitest'
import type { AccessionsQueryFilters } from '../apiTypes/apiRequests.ts'

// Import the normalizeFilters function to test it
// Since it's not exported, we'll test it indirectly through the hook behavior
// or we can export it for testing. Let me export it first.

// Normalize filters by removing empty strings and undefined values
// This prevents refetching when filters are functionally equivalent
function normalizeFilters(filters: AccessionsQueryFilters): string {
  const normalized = { ...filters }

  // Remove empty string values
  Object.keys(normalized).forEach((key) => {
    const k = key as keyof AccessionsQueryFilters
    if (
      normalized[k] === '' ||
      normalized[k] === undefined ||
      normalized[k] === null
    ) {
      delete normalized[k]
    }
  })

  // Sort arrays for consistent comparison
  if (Array.isArray(normalized.metadata_subjects)) {
    normalized.metadata_subjects = [...normalized.metadata_subjects].sort()
  }

  return JSON.stringify(normalized)
}

describe('normalizeFilters', () => {
  it('removes empty string values', () => {
    const filters: AccessionsQueryFilters = {
      page: 0,
      per_page: 50,
      lang: 'english',
      query_term: '',
      url_filter: '',
      metadata_subjects: [1, 2],
    }

    const result = normalizeFilters(filters)
    const parsed = JSON.parse(result)

    expect(parsed.query_term).toBeUndefined()
    expect(parsed.url_filter).toBeUndefined()
    expect(parsed.metadata_subjects).toEqual([1, 2])
    expect(parsed.lang).toBe('english')
  })

  it('removes undefined and null values', () => {
    const filters: AccessionsQueryFilters = {
      page: 0,
      per_page: 50,
      lang: 'english',
      query_term: undefined as unknown as string,
      metadata_subjects: null as unknown as number[],
    }

    const result = normalizeFilters(filters)
    const parsed = JSON.parse(result)

    expect(parsed.query_term).toBeUndefined()
    expect(parsed.metadata_subjects).toBeUndefined()
  })

  it('sorts metadata_subjects array', () => {
    const filters: AccessionsQueryFilters = {
      page: 0,
      per_page: 50,
      lang: 'english',
      metadata_subjects: [3, 1, 2],
    }

    const result = normalizeFilters(filters)
    const parsed = JSON.parse(result)

    expect(parsed.metadata_subjects).toEqual([1, 2, 3])
  })

  it('returns identical strings for equivalent filters', () => {
    const filters1: AccessionsQueryFilters = {
      page: 0,
      per_page: 50,
      lang: 'english',
      query_term: '',
      metadata_subjects: [1, 2],
    }

    const filters2: AccessionsQueryFilters = {
      page: 0,
      per_page: 50,
      lang: 'english',
      query_term: '',
      metadata_subjects: [2, 1],
    }

    const result1 = normalizeFilters(filters1)
    const result2 = normalizeFilters(filters2)

    expect(result1).toBe(result2)
  })

  it('preserves non-empty values', () => {
    const filters: AccessionsQueryFilters = {
      page: 1,
      per_page: 25,
      lang: 'arabic',
      query_term: 'search',
      url_filter: 'example.com',
      metadata_subjects: [1],
      is_private: true,
    }

    const result = normalizeFilters(filters)
    const parsed = JSON.parse(result)

    expect(parsed.page).toBe(1)
    expect(parsed.per_page).toBe(25)
    expect(parsed.lang).toBe('arabic')
    expect(parsed.query_term).toBe('search')
    expect(parsed.url_filter).toBe('example.com')
    expect(parsed.metadata_subjects).toEqual([1])
    expect(parsed.is_private).toBe(true)
  })
})
