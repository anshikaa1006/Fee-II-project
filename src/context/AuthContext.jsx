/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const readStoredUser = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('vibeUser'))
    return storedUser?.isLoggedIn ? storedUser : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser())
    window.addEventListener('vibe-auth-change', syncUser)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener('vibe-auth-change', syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  const login = (nextUser) => {
    const userPayload = {
      ...nextUser,
      isLoggedIn: true,
    }

    localStorage.setItem('vibeUser', JSON.stringify(userPayload))
    setUser(userPayload)
    window.dispatchEvent(new Event('vibe-auth-change'))
  }

  const logout = () => {
    localStorage.removeItem('vibeUser')
    setUser(null)
    window.dispatchEvent(new Event('vibe-auth-change'))
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.isLoggedIn),
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
