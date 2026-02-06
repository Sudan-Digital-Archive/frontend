import { createContext } from 'react'
import type { UserRole } from '../apiTypes/userTypes.ts'

export interface UserContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  role: UserRole | null
  setRole: (role: UserRole | null) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
