import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiSun, FiMoon, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

function JobMapLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="#3b82f6" />
      <path
        d="M20 8C15.58 8 12 11.58 12 16C12 22 20 32 20 32C20 32 28 22 28 16C28 11.58 24.42 8 20 8Z"
        fill="white"
      />
      <circle cx="20" cy="16" r="3.5" fill="#3b82f6" />
    </svg>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isEtudiant, isEntreprise, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <nav className="app-navbar">

      {/* ── LOGO ── */}
      <div className="nav-logo" onClick={() => navigate("/")}>
        <JobMapLogo size={32} />
        <span>JobMap</span>
      </div>

      {/* ── LIENS (changent selon le rôle) ── */}
      <div className="nav-links">

        <Link to="/" className={isActive("/")}>Accueil</Link>

        {/* Pas connecté */}
        {!isAuthenticated && (
          <Link to="/offre" className={isActive("/offre")}>Offres</Link>
        )}

        {/* Étudiant connecté */}
        {isEtudiant && (
          <>
            <Link to="/offre" className={isActive("/offre")}>Offres</Link>
            <Link to="/candidatures" className={isActive("/candidatures")}>Mes candidatures</Link>
            <Link to="/messagerie" className={isActive("/messagerie")}>Messagerie</Link>
          </>
        )}

        {/* Entreprise connectée */}
        {isEntreprise && (
          <>
            <Link to="/entreprise-annonces" className={isActive("/entreprise-annonces")}>Mes annonces</Link>
            <Link to="/candidatures" className={isActive("/candidatures")}>Candidatures reçues</Link>
            <Link to="/entretiens" className={isActive("/entretiens")}>Entretiens</Link>
            <Link to="/entreprise-offres" className="nav-item border-link">+ Publier</Link>
          </>
        )}

      </div>

      {/* ── ACTIONS DROITE ── */}
      <div className="nav-actions">

        {/* Notifications */}
        {isAuthenticated && (
          <button className="nav-action-btn" title="Notifications">
            <FiBell size={18} />
            <span className="notif-badge"></span>
          </button>
        )}

        {/* Dark / Light mode */}
        <button className="nav-action-btn theme-toggle" onClick={toggleTheme}>
          {theme === "dark"
            ? <FiSun size={18} style={{ color: "#f59e0b" }} />
            : <FiMoon size={18} style={{ color: "#3b82f6" }} />
          }
        </button>

        {/* Connecté */}
        {isAuthenticated ? (
          <div className="nav-user">
            <div
              className="nav-profile"
              onClick={() => navigate(isEntreprise ? "/entreprise" : "/profil")}
              title="Mon profil"
            >
              <FiUser size={16} />
              <span className="nav-username">{user?.nom}</span>
            </div>
            <button
              className="nav-action-btn logout-btn"
              onClick={handleLogout}
              title="Se déconnecter"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        ) : (
          /* Pas connecté */
          <button className="nav-login-btn" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;