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

    const savedUser = (() => {
      try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
    })()

    const role = savedUser?.role
    const profilUrl = role === 'entreprise'
      ? '/api/auth/entreprise/profil'
      : '/api/auth/etudiant/profil'

    fetch(profilUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token invalide')
        return res.json()
      })
      .then(data => {
        const updatedUser = { ...data, role: role || 'etudiant' }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      })
  }, [token])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/register'
  }
  const isEtudiant = user?.role === "etudiant";
  const isEntreprise = user?.role === "entreprise";
  const isAuthenticated = !!user && !!localStorage.getItem("token");
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isEtudiant, isEntreprise, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}