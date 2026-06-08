import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { registerEtudiant } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!prenom || !nom || !email || !motDePasse) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (motDePasse !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("prenom", prenom);
      formData.append("nom", nom);
      formData.append("email", email);
      formData.append("motDePasse", motDePasse);

      const data = await registerEtudiant(formData);

      login(data.user, data.token);
      navigate("/profil");
    } catch (err) {
      setError("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

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
        <p className="subtitle">Rejoins les opportunités qui t’attendent</p>

        {error && (
          <p style={{ color: "#EF4444", marginBottom: "12px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

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

        <p className="bottom-text">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>

      </div>

      {/* ================= RIGHT (TRACKING DECO) ================= */}
      <div className="auth-panel">

        <div className="auth-panel-illustration">
          <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg">

            {/* background */}
            <circle cx="420" cy="80" r="60" fill="#BFDBFE" opacity="0.35" />
            <circle cx="90" cy="300" r="45" fill="#93C5FD" opacity="0.25" />

            {/* card */}
            <rect x="130" y="70" width="240" height="240" rx="18" fill="white" opacity="0.95" />

            {/* title */}
            <rect x="160" y="100" width="120" height="10" rx="5" fill="#2563EB" opacity="0.25" />
            <rect x="160" y="120" width="80" height="8" rx="4" fill="#E2E8F0" />

            {/* timeline */}
            <line x1="200" y1="150" x2="200" y2="280" stroke="#CBD5E1" strokeWidth="3" />

            {/* steps */}
            <circle cx="200" cy="160" r="10" fill="#2563EB" />
            <rect x="220" y="152" width="110" height="8" rx="4" fill="#E2E8F0" />

            <circle cx="200" cy="200" r="10" fill="#60A5FA" />
            <rect x="220" y="192" width="130" height="8" rx="4" fill="#F1F5F9" />

            <circle cx="200" cy="240" r="10" fill="#93C5FD" />
            <rect x="220" y="232" width="100" height="8" rx="4" fill="#E2E8F0" />

            <circle cx="200" cy="280" r="10" fill="#10B981" />
            <rect x="220" y="272" width="120" height="8" rx="4" fill="#DCFCE7" />

            {/* success */}
            <circle cx="360" cy="120" r="26" fill="#10B981" />
            <path
              d="M348 120l8 8 16-16"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

          </svg>
        </div>

        <div className="auth-panel-text">
          <h2>Suivi de tes candidatures</h2>
          <p>
            Crée ton compte et commence à suivre tes opportunités facilement.
          </p>
        </div>

      </div>

    </div>
  );
}

export default RegisterPage;