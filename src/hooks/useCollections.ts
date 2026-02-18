import { useCallback, useEffect, useState } from 'react'
import { appConfig } from '../constants.ts'
import { buildFilters } from '../utils/url.ts'
import type { CollectionsQueryFilters } from '../apiTypes/apiRequests.ts'
import type { ListCollections } from '../apiTypes/apiResponses.ts'

interface UseCollectionsOptions {
  isLoggedIn: boolean
  baseFilters?: Record<string, unknown>
}

export const useCollections = (options: UseCollectionsOptions) => {
  const { isLoggedIn, baseFilters = {} } = options

  const [queryFilters, setQueryFilters] = useState<CollectionsQueryFilters>({
    page: 0,
    per_page: 50,
    ...baseFilters,
  })

  const [collections, setCollections] = useState<ListCollections | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  })

  const updateFilters = useCallback(
    (updates: Partial<CollectionsQueryFilters>) => {
      setQueryFilters((prev) => ({
        ...prev,
        ...updates,
      }))
    },
    [],
  )

  const fetchCollections = useCallback(async () => {
    try {
      const endpoint =
        isLoggedIn && queryFilters.is_private
          ? `${appConfig.apiURL}collections/private`
          : `${appConfig.apiURL}collections`
      const url = `${endpoint}?${buildFilters(queryFilters)}`
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      })
      const data: ListCollections = await response.json()
      setCollections(data)
      setPagination({
        currentPage: data.page,
        totalPages: data.num_pages,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [queryFilters, isLoggedIn])

  useEffect(() => {
    setIsLoading(true)
    fetchCollections()
    return () => {
      setCollections(null)
      setIsLoading(false)
    }
  }, [fetchCollections])

  return {
    queryFilters,
    updateFilters,
    collections,
    isLoading,
    pagination,
  }
}
