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

  useEffect(() => {
    if (!token) return

    const role = localStorage.getItem('role')

    // ← choisit la bonne route selon le rôle
    const profilUrl =
      role === 'admin'
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
        setUser(updatedUser)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        setUser(null)
      })
  }, [token])

  const login = (userData, token, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
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

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isEtudiant, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}