import { useCallback, useEffect, useState } from 'react'
import { appConfig } from 'src/constants.ts'
import { buildFilters } from 'src/utils/url.ts'
import type { AccessionsQueryFilters } from 'src/apiTypes/apiRequests.ts'
import type { ListAccessions } from 'src/apiTypes/apiResponses.ts'

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

  // Sync baseFilters changes into queryFilters
  useEffect(() => {
    setQueryFilters((prev) => ({
      ...prev,
      ...baseFilters,
    }))
  }, [baseFilters])

  const [accessions, setAccessions] = useState<ListAccessions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  })

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
    setIsLoading(true)
    fetchAccessions(queryFilters)
    return () => {
      setAccessions(null)
      setIsLoading(false)
    }
  }, [fetchAccessions, queryFilters, enabled])

  const handleRefresh = () => {
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
