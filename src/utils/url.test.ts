import { describe, it, expect } from 'vitest'
import { buildFilters, buildArchiveUrl } from './url'
import { AccessionsQueryFilters } from '../apiTypes/apiRequests'

describe('buildFilters', () => {
  it('should create URLSearchParams from simple key-value pairs', () => {
    const filters: AccessionsQueryFilters = {
      page: 1,
      per_page: 20,
      lang: 'english',
    }
    const params = buildFilters(filters)
    expect(params.get('page')).toBe('1')
    expect(params.get('per_page')).toBe('20')
    expect(params.get('lang')).toBe('english')
  })

  it('should handle array values by appending multiple keys', () => {
    const filters: AccessionsQueryFilters = {
      metadata_subjects: [1, 2, 3],
    }
    const params = buildFilters(filters)
    const values = params.getAll('metadata_subjects')
    expect(values).toEqual(['1', '2', '3'])
  })

  it('should ignore undefined or null values but keep empty strings', () => {
    const filters: AccessionsQueryFilters = {
      query_term: '',
      url_filter: undefined,
      // @ts-expect-error - testing runtime behavior for null
      lang: null,
      page: 5,
    }
    const params = buildFilters(filters)
    expect(params.has('query_term')).toBe(true)
    expect(params.get('query_term')).toBe('')
    expect(params.has('url_filter')).toBe(false)
    expect(params.has('lang')).toBe(false)
    expect(params.get('page')).toBe('5')
  })

  it('should correctly encode special characters in values', () => {
    const urlWithSpecialChars = 'https://example.com/path?query=1&other=2'
    const filters: AccessionsQueryFilters = {
      url_filter: urlWithSpecialChars,
    }
    const params = buildFilters(filters)
    // URLSearchParams handles encoding, so when we toString() the params, it should be encoded.
    // However, .get() returns the decoded value.
    expect(params.get('url_filter')).toBe(urlWithSpecialChars)

    // To verify encoding, we can check the string representation
    const paramString = params.toString()
    expect(paramString).toContain(
      'url_filter=https%3A%2F%2Fexample.com%2Fpath%3Fquery%3D1%26other%3D2',
    )
  })

  it('should return correct path with language param', () => {
    const url = buildArchiveUrl(123, 'english')
    expect(url).toBe('/archive/123?lang=english')
  })

  it('should include isPrivate param when flag is true', () => {
    const url = buildArchiveUrl(456, 'arabic', true)
    expect(url).toContain('isPrivate=true')
    expect(url).toContain('lang=arabic')
  })
})
