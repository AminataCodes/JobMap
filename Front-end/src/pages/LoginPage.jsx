import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthTabs from "../components/AuthTabs";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { loginEtudiant, loginEntreprise } from "../services/api";
import "../styles/auth.css";

function LoginPage() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const fn = role === 'student' ? loginEtudiant : loginEntreprise;
      const data = await fn(email, motDePasse);
      login(data.user, data.token);
      navigate(role === 'student' ? '/profil' : '/entreprise');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <a href="#" className="auth-logo">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB"/>
            <path d="M16 6a7 7 0 0 1 7 7c0 4.5-7 13-7 13S9 17.5 9 13a7 7 0 0 1 7-7z" fill="white"/>
            <circle cx="16" cy="13" r="2.5" fill="#2563EB"/>
          </svg>
          JobMap
        </a>

        <h1>Se Connecter</h1>
        <p className="subtitle">Bienvenue ! Connectez-vous à votre espace.</p>

        <AuthTabs role={role} setRole={setRole} />

        {error && (
          <p style={{ color: '#EF4444', marginBottom: '12px', fontSize: '14px' }}>{error}</p>
        )}

        <InputField
          label="Adresse e-mail"
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Mot de passe"
          type="password"
          placeholder="••••••••••"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        <a href="#" className="forgot-link">Mot de passe oublié ?</a>

        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="separator">ou</div>

        <p className="bottom-text">
          Vous n'avez pas de compte ?{' '}
          <Link to="/register">inscrivez-vous ici</Link>
        </p>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-illustration">
          <svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="250" cy="310" rx="200" ry="20" fill="#BFDBFE" opacity="0.5"/>
            <rect x="120" y="160" width="260" height="160" rx="10" fill="#E2E8F0"/>
            <rect x="130" y="170" width="240" height="140" rx="6" fill="#1E293B"/>
            <rect x="140" y="180" width="220" height="120" rx="4" fill="#2563EB" opacity="0.15"/>
            <rect x="80" y="318" width="340" height="12" rx="6" fill="#CBD5E1"/>
            <rect x="90" y="250" width="80" height="14" rx="3" fill="#EF4444"/>
            <rect x="88" y="264" width="80" height="14" rx="3" fill="#F59E0B"/>
            <rect x="86" y="278" width="80" height="14" rx="3" fill="#10B981"/>
            <circle cx="250" cy="130" r="30" fill="#FBBF24"/>
            <rect x="210" y="160" width="80" height="100" rx="20" fill="#3B82F6"/>
            <rect x="310" y="80" width="100" height="60" rx="10" fill="white" opacity="0.9"/>
            <circle cx="330" cy="100" r="8" fill="#E2E8F0"/>
            <rect x="344" y="94" width="50" height="8" rx="4" fill="#CBD5E1"/>
            <rect x="344" y="106" width="38" height="6" rx="3" fill="#E2E8F0"/>
            <circle cx="370" cy="50" r="28" fill="white" opacity="0.9"/>
            <path d="M370 50 L370 28 A22 22 0 0 1 392 50 Z" fill="#3B82F6"/>
            <path d="M370 50 L392 50 A22 22 0 0 1 355 68 Z" fill="#93C5FD"/>
            <path d="M370 50 L355 68 A22 22 0 0 1 370 28 Z" fill="#DBEAFE"/>
          </svg>
        </div>
        <div className="auth-panel-text">
          <h2>Une plateforme pour construire votre avenir</h2>
          <p>Accédez à des opportunités, développez vos compétences et connectez-vous avec le monde professionnel.</p>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;