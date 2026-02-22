import { useCallback, useEffect, useState } from 'react'
import { appConfig } from '../constants.ts'
import type {
  User,
  ListUsers,
  CreateUserPayload,
  UpdateUserPayload,
  UsersQueryFilters,
} from '../apiTypes/userTypes.ts'

interface UseUsersReturn {
  users: User[]
  isLoading: boolean
  pagination: {
    currentPage: number
    totalPages: number
  }
  queryFilters: UsersQueryFilters
  updateFilters: (updates: Partial<UsersQueryFilters>) => void
  createUser: (payload: CreateUserPayload) => Promise<void>
  updateUser: (userId: string, payload: UpdateUserPayload) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  refreshUsers: () => void
}

export const useUsers = (): UseUsersReturn => {
  const [queryFilters, setQueryFilters] = useState<UsersQueryFilters>({
    page: 0,
    per_page: 10,
    email: '',
  })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  })

  const updateFilters = useCallback((updates: Partial<UsersQueryFilters>) => {
    setQueryFilters((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  const buildQueryString = useCallback((filters: UsersQueryFilters): string => {
    const params = new URLSearchParams()
    if (filters.page !== undefined) {
      params.append('page', String(filters.page))
    }
    if (filters.per_page !== undefined) {
      params.append('per_page', String(filters.per_page))
    }
    if (filters.email) {
      params.append('email', filters.email)
    }
    return params.toString()
  }, [])

  const fetchUsers = useCallback(
    async (filters: UsersQueryFilters) => {
      try {
        const queryString = buildQueryString(filters)
        const url = `${appConfig.apiURL}auth/users?${queryString}`
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data: ListUsers = await response.json()
        setUsers(data.items)
        setPagination({
          currentPage: data.page,
          totalPages: data.num_pages,
        })
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [buildQueryString],
  )

  useEffect(() => {
    setIsLoading(true)
    fetchUsers(queryFilters)
    return () => {
      setIsLoading(false)
    }
  }, [fetchUsers, queryFilters])

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      const response = await fetch(`${appConfig.apiURL}auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...payload, role: payload.role.toLowerCase() }),
      })
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      await fetchUsers(queryFilters)
    },
    [fetchUsers, queryFilters],
  )

  const updateUser = useCallback(
    async (userId: string, payload: UpdateUserPayload) => {
      const response = await fetch(`${appConfig.apiURL}auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...payload, role: payload.role.toLowerCase() }),
      })
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      await fetchUsers(queryFilters)
    },
    [fetchUsers, queryFilters],
  )

  const deleteUser = useCallback(
    async (userId: string) => {
      const response = await fetch(`${appConfig.apiURL}auth/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      await fetchUsers(queryFilters)
    },
    [fetchUsers, queryFilters],
  )

  const refreshUsers = useCallback(() => {
    fetchUsers(queryFilters)
  }, [fetchUsers, queryFilters])

  return {
    users,
    isLoading,
    pagination,
    queryFilters,
    updateFilters,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  }
}
