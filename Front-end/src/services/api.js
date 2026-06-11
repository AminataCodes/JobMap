const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
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
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur serveur')
    return data
  })
}

export function updateProfilEtudiant(formData) {
  return fetch(`${BASE}/auth/etudiant/profil`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
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
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
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
//  AUTH ÉCOLE
// ──────────────────────────────────────────────

export const registerEcole = async (data) => {
  const res = await fetch(`${BASE}/auth/ecole/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const loginEcole = async (data) => {
  const res = await fetch(`${BASE}/auth/ecole/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getProfilEcole = async (token) => {
  const res = await fetch(`${BASE}/auth/ecole/profil`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const ajouterFormation = async (token, nom) => {
  const res = await fetch(`${BASE}/auth/ecole/formations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nom }),
  })
  return res.json()
}

export const supprimerFormation = async (token, id) => {
  const res = await fetch(`${BASE}/auth/ecole/formations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const ajouterOffre = async (token, titre, description) => {
  const res = await fetch(`${BASE}/auth/ecole/offres`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ titre, description }),
  })
  return res.json()
}

export const supprimerOffre = async (token, id) => {
  const res = await fetch(`${BASE}/auth/ecole/offres/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}