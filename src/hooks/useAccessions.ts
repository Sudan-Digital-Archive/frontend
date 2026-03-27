import { useCallback, useEffect, useRef, useState } from 'react'
import { appConfig } from '../constants'
import { buildFilters } from '../utils/url'
import type { AccessionsQueryFilters } from '../apiTypes/apiRequests'
import type { ListAccessions } from '../apiTypes/apiResponses'

function normalizeFilters(filters: AccessionsQueryFilters): string {
  const normalized = { ...filters }

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

  if (Array.isArray(normalized.metadata_subjects)) {
    normalized.metadata_subjects = [...normalized.metadata_subjects].sort()
  }

  return JSON.stringify(normalized)
}

interface UseAccessionsOptions {
  isLoggedIn: boolean
  baseFilters?: Record<string, unknown>
  enabled?: boolean
}

export const useAccessions = (options: UseAccessionsOptions) => {
  const { isLoggedIn, baseFilters = {}, enabled = true } = options

  const [queryFilters, setQueryFilters] = useState<AccessionsQueryFilters>({
    page: 0,
    per_page: 50,
    ...baseFilters,
  })

  const [accessions, setAccessions] = useState<ListAccessions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  })

  const lastFetchedFiltersRef = useRef<string>('')

  const updateFilters = useCallback(
    (updates: Partial<AccessionsQueryFilters>) => {
      setQueryFilters((prev) => ({
        ...prev,
        ...updates,
      }))
    },
    [],
  )

  const fetchAccessions = useCallback(
    async (filters: AccessionsQueryFilters) => {
      try {
        const endpoint = isLoggedIn
          ? `${appConfig.apiURL}accessions/private`
          : `${appConfig.apiURL}accessions`

        const url = `${endpoint}?${buildFilters({
          ...filters,
        })}`
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch accessions: ${response.status}`)
        }
        const data: ListAccessions = await response.json()
        setAccessions(data)
        setPagination({
          currentPage: data.page,
          totalPages: data.num_pages,
        })
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoggedIn],
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    const currentFilters = normalizeFilters(queryFilters)
    if (currentFilters === lastFetchedFiltersRef.current) {
      return
    }

    setIsLoading(true)
    lastFetchedFiltersRef.current = currentFilters
    fetchAccessions(queryFilters)
    return () => {
      setAccessions(null)
      setIsLoading(false)
    }
  }, [fetchAccessions, queryFilters, enabled])

  const handleRefresh = () => {
    lastFetchedFiltersRef.current = ''
    fetchAccessions(queryFilters)
  }

  return {
    queryFilters,
    updateFilters,
    accessions,
    isLoading,
    pagination,
    handleRefresh,
  }
}
