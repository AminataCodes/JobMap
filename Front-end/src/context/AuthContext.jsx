import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token] = useState(() => localStorage.getItem('token'))
  const [authLoading, setAuthLoading] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    if (!token) {
      setAuthLoading(false)
      return
    }

    const savedUser = (() => {
      try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
    })()
    const role = savedUser?.role || localStorage.getItem('role')

    if (!role) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setAuthLoading(false)
      return
    }

    const profilUrl = role === 'admin'
      ? '/api/auth/admin/profil'
      : '/api/auth/etudiant/profil'

    fetch(profilUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token invalide')
        return res.json()
      })
      .then(data => {
        const updatedUser = { ...data, role }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        localStorage.setItem('role', role)
        setUser(updatedUser)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        setUser(null)
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [token])

  const login = (userData, token, role) => {
    const userWithRole = { ...userData, role }
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('user', JSON.stringify(userWithRole))
    setUser(userWithRole)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    setUser(null)
    window.location.href = '/login'
  }

  const isEtudiant = user?.role === 'etudiant'
  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!user && !!localStorage.getItem('token')

  if (authLoading) return null

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isEtudiant, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}