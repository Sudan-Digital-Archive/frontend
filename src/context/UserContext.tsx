import { useState, ReactNode, useEffect } from 'react'
import { UserContext } from './UserContextDefinition'
import type { UserRole, User } from '../apiTypes/userTypes.ts'
import { appConfig } from '../constants.ts'

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)

  useEffect(() => {
    const fetchRole = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch(`${appConfig.apiURL}auth`, {
            credentials: 'include',
          })
          if (response.ok) {
            const user: User = await response.json()
            setRole(user.role)
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      } else {
        setRole(null)
      }
    }

    fetchRole()
  }, [isLoggedIn])

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
      {children}
    </UserContext.Provider>
  )
}
