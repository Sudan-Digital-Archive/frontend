import { useState, ReactNode, useEffect } from 'react'
import { UserContext } from './UserContextDefinition'
import type { UserRole } from '../apiTypes/userTypes.ts'
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
            const text = await response.text()
            // Parse role from text: "Verifying your account... Your data: UserId: <email> Expiry: None Role: Admin"
            const roleMatch = text.match(/Role:\s*(\w+)/i)
            if (roleMatch) {
              const parsedRole = roleMatch[1] as UserRole
              setRole(parsedRole)
            }
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
