import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { loginEtudiant, loginEcole } from "../services/api";
import "../styles/auth.css";

function LoginPage() {
  const [onglet, setOnglet] = useState("etudiant");

  // Étudiant
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  // École
  const [emailEcole, setEmailEcole] = useState("");
  const [motDePasseEcole, setMotDePasseEcole] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ── Submit Étudiant ──
  const handleSubmitEtudiant = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !motDePasse) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const data = await loginEtudiant(email, motDePasse);
      login(data.user, data.token);
      navigate("/profil");
    } catch {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit École ──
  const handleSubmitEcole = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailEcole || !motDePasseEcole) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const data = await loginEcole({ emailPro: emailEcole, password: motDePasseEcole });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "ecole");
        localStorage.setItem("ecole", JSON.stringify(data.ecole));
        navigate("/profil-ecole");
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT ================= */}
      <div className="auth-card">

        <a href="#" className="auth-logo">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M16 6a7 7 0 0 1 7 7c0 4.5-7 13-7 13S9 17.5 9 13a7 7 0 0 1 7-7z" fill="white" />
            <circle cx="16" cy="13" r="2.5" fill="#2563EB" />
          </svg>
          JobMap
        </a>

        <h1>Se connecter</h1>
        <p className="subtitle">Bienvenue sur JobMap</p>

        {/* ── Onglets ── */}
        <div className="tabs">
          <button
            type="button"
            className={onglet === "etudiant" ? "active" : ""}
            onClick={() => { setOnglet("etudiant"); setError(""); }}
          >
            🎓 Étudiant
          </button>
          <button
            type="button"
            className={onglet === "ecole" ? "active" : ""}
            onClick={() => { setOnglet("ecole"); setError(""); }}
          >
            🏫 École
          </button>
        </div>

        {error && (
          <p style={{ color: "#EF4444", marginBottom: "12px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        {/* ── Formulaire Étudiant ── */}
        {onglet === "etudiant" && (
          <form onSubmit={handleSubmitEtudiant}>
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
            <Link to="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </Link>
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        )}

        {/* ── Formulaire École ── */}
        {onglet === "ecole" && (
          <form onSubmit={handleSubmitEcole}>
            <InputField
              label="Email professionnel"
              type="email"
              icon="mail"
              placeholder="contact@ecole.fr"
              value={emailEcole}
              onChange={(e) => setEmailEcole(e.target.value)}
            />
            <InputField
              label="Mot de passe"
              type="password"
              icon="lock"
              placeholder="••••••••••"
              value={motDePasseEcole}
              onChange={(e) => setMotDePasseEcole(e.target.value)}
            />
            <Link to="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </Link>
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        )}

        <p className="bottom-text">
          Pas de compte ? <Link to="/register">S'inscrire</Link>
        </p>

      </div>

      {/* ================= RIGHT ================= */}
      <div className="auth-panel">
        <div className="auth-panel-illustration">
          <svg viewBox="0 0 500 350" fill="none">
            <ellipse cx="250" cy="310" rx="200" ry="20" fill="#BFDBFE" opacity="0.5" />
            <rect x="120" y="160" width="260" height="160" rx="10" fill="#E2E8F0" />
            <rect x="130" y="170" width="240" height="140" rx="6" fill="#1E293B" />
            <rect x="140" y="180" width="220" height="120" rx="4" fill="#2563EB" opacity="0.15" />
            <circle cx="250" cy="130" r="30" fill="#FBBF24" />
            <rect x="210" y="160" width="80" height="100" rx="20" fill="#3B82F6" />
          </svg>
        </div>
        <div className="auth-panel-text">
          <h2>Construis ton avenir</h2>
          <p>et ne perds pas tes opportunités</p>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;