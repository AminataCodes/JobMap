const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

const authHeaders = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ──────────────────────────────────────────────
//  AUTH ÉTUDIANT
// ──────────────────────────────────────────────

export function loginEtudiant(email, motDePasse) {
  return fetch(`${BASE}/auth/etudiant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse }),
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

export function registerEtudiant(data) {
  return fetch(`${BASE}/auth/etudiant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

export function getProfilEtudiant() {
  return fetch(`${BASE}/auth/etudiant/profil`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

export function updateProfilEtudiant(formData) {
  return fetch(`${BASE}/auth/etudiant/profil`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

// ──────────────────────────────────────────────
//  RENDEZ-VOUS ÉTUDIANT
// ──────────────────────────────────────────────

export function getMesRendezVous() {
  return fetch(`${BASE}/rendezvous/mes-rdv`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

// ──────────────────────────────────────────────
//  AUTH ENTREPRISE
// ──────────────────────────────────────────────

export function loginEntreprise(email, motDePasse) {
  return fetch(`${BASE}/auth/entreprise/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse }),
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

export function registerEntreprise(formData) {
  return fetch(`${BASE}/auth/entreprise/register`, {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

// ──────────────────────────────────────────────
//  AUTH ADMIN
// ──────────────────────────────────────────────

export const registerAdmin = async (data) => {
  const res = await fetch(`${BASE}/auth/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()                          // ✅ fix


  if (!res.ok) throw new Error(json.message || 'Erreur serveur')  // ✅ fix


  return json                                            // ✅ fix

}

export const loginAdmin = async (data) => {
  const res = await fetch(`${BASE}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()                          // ✅ fix


  if (!res.ok) throw new Error(json.message || 'Erreur serveur')  // ✅ fix


  return json                                            // ✅ fix

}

export const getProfilAdmin = async (token) => {
  const res = await fetch(`${BASE}/auth/admin/profil`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Erreur serveur')
  return json
}

export const ajouterFormation = async (token, nom) => {
  const res = await fetch(`${BASE}/auth/admin/formations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nom }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Erreur serveur')
  return json
}

export const supprimerFormation = async (token, id) => {
  const res = await fetch(`${BASE}/auth/admin/formations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Erreur serveur')
  return json
}

export const ajouterOffre = async (token, titre, description) => {
  const res = await res.fetch(`${BASE}/auth/admin/offres`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ titre, description }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Erreur serveur')
  return json
}

export const supprimerOffre = async (token, id) => {
  const res = await fetch(`${BASE}/auth/admin/offres/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Erreur serveur')
  return json
}

// ──────────────────────────────────────────────
//  OFFRES (PUBLIC + ÉCOLE)
// ──────────────────────────────────────────────

export function getOffres() {
  return fetch(`${BASE}/offres`).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

export function getOffreById(id) {
  return fetch(`${BASE}/offres/${id}`).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

export function modifierOffreApi(token, id, titre, description) {
  return fetch(`${BASE}/offres/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ titre, description }),
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

// ──────────────────────────────────────────────
//  ÉTUDIANTS (CÔTÉ ÉCOLE)
// ──────────────────────────────────────────────

export const getAllEtudiants = async () => {
  const res = await fetch(`${BASE}/etudiants`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Erreur lors de la récupération des étudiants')
  return res.json()
}

export const getEtudiantById = async (id) => {
  const res = await fetch(`${BASE}/etudiants/${id}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Erreur lors de la récupération de l'étudiant")
  return res.json()
}