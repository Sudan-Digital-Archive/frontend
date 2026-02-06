export type UserRole = 'Researcher' | 'Admin' | 'Contributor'

export type User = {
  id: string
  email: string
  role: UserRole
  is_active: boolean
}

export type ListUsers = {
  items: User[]
  num_pages: number
  page: number
  per_page: number
}

export type CreateUserPayload = {
  email: string
  is_active: boolean
  role: UserRole
}

export type UpdateUserPayload = {
  is_active: boolean
  role: UserRole
}

export type UsersQueryFilters = {
  page?: number
  per_page?: number
  email?: string
}
