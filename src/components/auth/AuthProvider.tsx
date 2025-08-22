'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, getIdTokenResult } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  adminLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)
      
      if (user) {
        try {
          // Get the user's ID token result to check custom claims
          const tokenResult = await getIdTokenResult(user)
          setIsAdmin(tokenResult.claims.admin === true)
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        } finally {
          setAdminLoading(false)
        }
      } else {
        setIsAdmin(false)
        setAdminLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 