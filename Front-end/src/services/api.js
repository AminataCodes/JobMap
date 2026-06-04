const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur serveur');
    return data;
  });
}

export function registerEtudiant(formData) {
  return fetch(`${BASE}/auth/etudiant/register`, {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur serveur');
    return data;
  });
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur serveur');
    return data;
  });
}

export function registerEntreprise(formData) {
  return fetch(`${BASE}/auth/entreprise/register`, {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur serveur');
    return data;
  });
}

// ──────────────────────────────────────────────
//  PROFIL ÉTUDIANT
// ──────────────────────────────────────────────

export function getProfilEtudiant() {
  return fetch(`${BASE}/auth/etudiant/profil`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur serveur');
    return data;
  });
}

export function updateProfilEtudiant(formData) {
  return fetch(`${BASE}/auth/etudiant/profil`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur serveur');
    return data;
  });
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur serveur');
    return data;
  });
}