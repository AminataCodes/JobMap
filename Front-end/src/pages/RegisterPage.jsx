import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import InputField from "../components/InputField"
import { registerEtudiant, registerEcole } from "../services/api"
import { useAuth } from "../context/AuthContext"
import "../styles/auth.css"

const TYPES_ETABLISSEMENT = [
  "Université",
  "École d'ingénieurs",
  "École de commerce",
  "CFA",
  "Lycée",
  "Centre de formation",
  "Autre",
]

function RegisterPage() {
  const [onglet, setOnglet] = useState("etudiant")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ── État Étudiant ──
  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // ── État École ──
  const [adminForm, setAdminForm] = useState({
  nomAdmin: "",
  email: "",
  description: "",
  photoProfilUrl: "",
  motDePasse: "",
  confirmPassword: "",
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleAdminChange = (e) => {
  setAdminForm({
    ...adminForm,
    [e.target.name]: e.target.value,
  })
}

  // ── Submit Étudiant ──
  const handleSubmitEtudiant = async (e) => {
    e.preventDefault()
    setError("")
    if (!prenom || !nom || !email || !motDePasse) {
      setError("Veuillez remplir tous les champs")
      return
    }
    if (motDePasse !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    setLoading(true)
    try {
      const data = await registerEtudiant({ prenom, nom, email, motDePasse })
      login(data.user, data.token)
      navigate("/profil")
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  // ── Submit École ──
  const handleSubmitAdmin = async (e) => {
  e.preventDefault()

  setError("")

  if (
    !adminForm.nomAdmin ||
    !adminForm.email ||
    !adminForm.motDePasse
  ) {
    setError("Veuillez remplir tous les champs obligatoires")
    return
  }

  if (
    adminForm.motDePasse !==
    adminForm.confirmPassword
  ) {
    setError("Les mots de passe ne correspondent pas")
    return
  }

  setLoading(true)

  try {
    const { confirmPassword, ...dataToSend } = adminForm

    const result = await registerEcole(dataToSend)

    if (result.token) {
      localStorage.setItem("token", result.token)
      localStorage.setItem("role", "admin")
      localStorage.setItem(
        "admin",
        JSON.stringify(result.admin)
      )

      navigate("/profil-admin")
    }
  } catch (err) {
    console.error(err)
    setError(err.message || "Erreur serveur")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="auth-page">

      {/* ================= LEFT ================= */}
      <div className="auth-card auth-card--scroll">

        <a href="#" className="auth-logo">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M16 6a7 7 0 0 1 7 7c0 4.5-7 13-7 13S9 17.5 9 13a7 7 0 0 1 7-7z" fill="white" />
            <circle cx="16" cy="13" r="2.5" fill="#2563EB" />
          </svg>
          JobMap
        </a>

        <h1>Créer un compte</h1>
        <p className="subtitle">Rejoins les opportunités qui t'attendent</p>

        <div className="tabs">
          <button
            type="button"
            className={onglet === "etudiant" ? "active" : ""}
            onClick={() => { setOnglet("etudiant"); setError("") }}
          >
            🎓 Étudiant
          </button> 
          <button
        type="button"
        className={onglet === "admin" ? "active" : ""}
        onClick={() => {
          setOnglet("admin")
          setError("")
        }}
      >
        🏢 Admin
</button>
        </div>

        {error && (
          <p style={{ color: "#EF4444", marginBottom: "12px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        {/* ── FORMULAIRE ÉTUDIANT ── */}
        {onglet === "etudiant" && (
          <form onSubmit={handleSubmitEtudiant}>
            <div className="form-row">
              <InputField
                label="Prénom"
                icon="user"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              <InputField
                label="Nom"
                icon="user"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
            <InputField
              label="Adresse e-mail"
              type="email"
              icon="mail"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="Mot de passe"
              type="password"
              icon="lock"
              placeholder="••••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
            <InputField
              label="Confirmer mot de passe"
              type="password"
              icon="lock"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Chargement..." : "S'inscrire"}
            </button>
          </form>
        )}

        {/* ── FORMULAIRE ÉCOLE ── */}
        {onglet === "admin" && (
  <form onSubmit={handleSubmitAdmin}>

    <div className="form-group">
      <label>Nom Admin *</label>

      <div className="input-wrapper">
        <input
          name="nomAdmin"
          type="text"
          placeholder="JobMap"
          value={adminForm.nomAdmin}
          onChange={handleAdminChange}
          required
          style={{ paddingLeft: "14px" }}
        />
      </div>
    </div>

    <div className="form-group">
      <label>Email *</label>

      <div className="input-wrapper">
        <input
          name="email"
          type="email"
          placeholder="admin@jobmap.com"
          value={adminForm.email}
          onChange={handleAdminChange}
          required
          style={{ paddingLeft: "14px" }}
        />
      </div>
    </div>

    <div className="form-group">
      <label>
        URL Photo de Profil
        <span className="optional-label">
          (optionnel)
        </span>
      </label>

      <div className="input-wrapper">
        <input
          name="photoProfilUrl"
          type="url"
          placeholder="https://..."
          value={adminForm.photoProfilUrl}
          onChange={handleAdminChange}
          style={{ paddingLeft: "14px" }}
        />
      </div>
    </div>

    <div className="form-group">
      <label>
        Description
        <span className="optional-label">
          (optionnel)
        </span>
      </label>

      <textarea
        name="description"
        rows={4}
        value={adminForm.description}
        onChange={handleAdminChange}
        placeholder="Description..."
      />
    </div>

    <div className="form-group">
      <label>Mot de passe *</label>

      <div className="input-wrapper">
        <input
          name="motDePasse"
          type="password"
          placeholder="••••••••"
          value={adminForm.motDePasse}
          onChange={handleAdminChange}
          required
          style={{ paddingLeft: "14px" }}
        />
      </div>
    </div>

    <div className="form-group">
      <label>Confirmer le mot de passe *</label>

      <div className="input-wrapper">
        <input
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={adminForm.confirmPassword}
          onChange={handleAdminChange}
          required
          style={{ paddingLeft: "14px" }}
        />
      </div>
    </div>

    <button
      className="primary-btn"
      type="submit"
      disabled={loading}
    >
      {loading
        ? "Inscription..."
        : "Créer un compte Admin"}
    </button>

  </form>
)}

        <p className="bottom-text">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>

      </div>

      {/* ================= RIGHT ================= */}
      <div className="auth-panel">
        <div className="auth-panel-illustration">
          <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="420" cy="80" r="60" fill="#BFDBFE" opacity="0.35" />
            <circle cx="90" cy="300" r="45" fill="#93C5FD" opacity="0.25" />
            <rect x="130" y="70" width="240" height="240" rx="18" fill="white" opacity="0.95" />
            <rect x="160" y="100" width="120" height="10" rx="5" fill="#2563EB" opacity="0.25" />
            <rect x="160" y="120" width="80" height="8" rx="4" fill="#E2E8F0" />
            <line x1="200" y1="150" x2="200" y2="280" stroke="#CBD5E1" strokeWidth="3" />
            <circle cx="200" cy="160" r="10" fill="#2563EB" />
            <rect x="220" y="152" width="110" height="8" rx="4" fill="#E2E8F0" />
            <circle cx="200" cy="200" r="10" fill="#60A5FA" />
            <rect x="220" y="192" width="130" height="8" rx="4" fill="#F1F5F9" />
            <circle cx="200" cy="240" r="10" fill="#93C5FD" />
            <rect x="220" y="232" width="100" height="8" rx="4" fill="#E2E8F0" />
            <circle cx="200" cy="280" r="10" fill="#10B981" />
            <rect x="220" y="272" width="120" height="8" rx="4" fill="#DCFCE7" />
            <circle cx="360" cy="120" r="26" fill="#10B981" />
            <path d="M348 120l8 8 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="auth-panel-text">
          <h2>Suivi de tes candidatures</h2>
          <p>Crée ton compte et commence à suivre tes opportunités facilement.</p>
        </div>
      </div>

    </div>
  )
}

export default RegisterPage