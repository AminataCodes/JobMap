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
  const [ecoleForm, setEcoleForm] = useState({
    nomEtablissement: "",
    typeEtablissement: "",
    logo: "",
    siteWeb: "",
    emailPro: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "",
    description: "",
    password: "",
    confirmPassword: "",
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleEcoleChange = (e) => {
    setEcoleForm({ ...ecoleForm, [e.target.name]: e.target.value })
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
  const handleSubmitEcole = async (e) => {
    e.preventDefault()
    setError("")
    if (ecoleForm.password !== ecoleForm.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    setLoading(true)
    try {
      const { confirmPassword: _, ...dataToSend } = ecoleForm
      const result = await registerEcole(dataToSend)
      if (result.token) {
        localStorage.setItem("token", result.token)
        localStorage.setItem("role", "ecole")
        localStorage.setItem("ecole", JSON.stringify(result.ecole))
        navigate("/profil-ecole")
      } else {
        setError(result.message || "Erreur lors de l'inscription")
      }
    } catch (err) {
      console.error(err)
      setError("Erreur serveur")
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
            className={onglet === "ecole" ? "active" : ""}
            onClick={() => { setOnglet("ecole"); setError("") }}
          >
            🏫 École
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
        {onglet === "ecole" && (
          <form onSubmit={handleSubmitEcole}>

            <p className="form-section-label">Informations de l'établissement</p>

            <div className="form-group">
              <label>Nom de l'établissement *</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                <input
                  name="nomEtablissement"
                  type="text"
                  placeholder="Ex : Université Paris-Est"
                  value={ecoleForm.nomEtablissement}
                  onChange={handleEcoleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Type d'établissement *</label>
              <div className="select-wrapper">
                <select
                  name="typeEtablissement"
                  value={ecoleForm.typeEtablissement}
                  onChange={handleEcoleChange}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {TYPES_ETABLISSEMENT.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="select-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>URL du logo <span className="optional-label">(optionnel)</span></label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </span>
                <input
                  name="logo"
                  type="url"
                  placeholder="https://ecole.fr/logo.png"
                  value={ecoleForm.logo}
                  onChange={handleEcoleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Site web <span className="optional-label">(optionnel)</span></label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </span>
                <input
                  name="siteWeb"
                  type="url"
                  placeholder="https://ecole.fr"
                  value={ecoleForm.siteWeb}
                  onChange={handleEcoleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Décrivez votre établissement..."
                value={ecoleForm.description}
                onChange={handleEcoleChange}
                rows={3}
                required
              />
            </div>

            <p className="form-section-label">Coordonnées</p>

            <div className="form-group">
              <label>Email professionnel *</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  name="emailPro"
                  type="email"
                  placeholder="contact@ecole.fr"
                  value={ecoleForm.emailPro}
                  onChange={handleEcoleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Téléphone *</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <input
                  name="telephone"
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                  value={ecoleForm.telephone}
                  onChange={handleEcoleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Adresse *</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <input
                  name="adresse"
                  type="text"
                  placeholder="12 rue des Écoles"
                  value={ecoleForm.adresse}
                  onChange={handleEcoleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ville *</label>
                <div className="input-wrapper">
                  <input
                    name="ville"
                    type="text"
                    placeholder="Paris"
                    value={ecoleForm.ville}
                    onChange={handleEcoleChange}
                    required
                    style={{ paddingLeft: "14px" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Code postal *</label>
                <div className="input-wrapper">
                  <input
                    name="codePostal"
                    type="text"
                    placeholder="75001"
                    value={ecoleForm.codePostal}
                    onChange={handleEcoleChange}
                    required
                    style={{ paddingLeft: "14px" }}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Pays *</label>
              <div className="input-wrapper">
                <input
                  name="pays"
                  type="text"
                  placeholder="France"
                  value={ecoleForm.pays}
                  onChange={handleEcoleChange}
                  required
                  style={{ paddingLeft: "14px" }}
                />
              </div>
            </div>

            <p className="form-section-label">Sécurité</p>

            <div className="form-group">
              <label>Mot de passe *</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••••"
                  value={ecoleForm.password}
                  onChange={handleEcoleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe *</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••••"
                  value={ecoleForm.confirmPassword}
                  onChange={handleEcoleChange}
                  required
                />
              </div>
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Inscription..." : "Inscrire l'établissement"}
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