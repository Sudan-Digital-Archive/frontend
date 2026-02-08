import { useCallback, useEffect, useState } from 'react'
import { appConfig } from '../constants.ts'
import { buildFilters } from '../utils/url.ts'
import type { CollectionsQueryFilters } from '../apiTypes/apiRequests.ts'
import type { ListCollections } from '../apiTypes/apiResponses.ts'

export const useCollections = (initialLang: string) => {
  const [queryFilters, setQueryFilters] = useState<CollectionsQueryFilters>({
    lang: initialLang,
    page: 0,
    per_page: 50,
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
      const url = `${appConfig.apiURL}collections?${buildFilters(queryFilters)}`
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
  }, [queryFilters])

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
