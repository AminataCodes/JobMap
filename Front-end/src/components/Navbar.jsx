import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isEtudiant, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfilClick = () => {
    if (user?.role === "admin") {
      navigate("/profil-admin");
    } else {
      navigate("/profil");
    }
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <nav className="app-navbar">

      <div className="nav-logo" onClick={() => navigate("/")}>
        <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
          <path
            d="M11 0C4.925 0 0 4.925 0 11C0 19.25 11 28 11 28C11 28 22 19.25 22 11C22 4.925 17.075 0 11 0Z"
            fill="var(--color-primary, #3b82f6)"
          />
          <circle cx="11" cy="11" r="4.5" fill="white" />
        </svg>
        <span>JobMap</span>
      </div>

      <div className="nav-links">
        <Link to="/" className={isActive("/")}>Accueil</Link>
        {isEtudiant && (
          <>
            <Link to="/mes-candidatures" className={isActive("/mes-candidatures")}>Mes candidatures</Link>
            <Link to="/messagerie" className={isActive("/messagerie")}>Messagerie</Link>
          </>
        )}
        {isAdmin && (
          <Link to="/etudiants" className={isActive("/etudiants")}>Étudiants</Link>
        )}
      </div>

      <div className="nav-actions">

        {isAuthenticated && (
          <button className="nav-icon-btn" title="Notifications">
            <FiBell size={18} />
            <span className="notif-badge"></span>
          </button>
        )}

        <button className="nav-icon-btn" onClick={toggleTheme}>
          {theme === "dark"
            ? <FiSun size={18} style={{ color: "#f59e0b" }} />
            : <FiMoon size={18} style={{ color: "#6366f1" }} />
          }
        </button>

        {isAuthenticated ? (
          <div className="nav-user">
            <div className="nav-profile-pill" onClick={handleProfilClick}>
              <div className="nav-avatar"><FiUser size={14} /></div>
              <span className="nav-username">{user?.nom || user?.nomAdmin}</span>
            </div>
            <button className="nav-icon-btn logout-btn" onClick={handleLogout} title="Se déconnecter">
              <FiLogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="nav-account-wrapper" ref={menuRef}>
            <button
              className="nav-icon-btn"
              onClick={() => setAccountMenuOpen((v) => !v)}
              title="Mon compte"
            >
              <FiUser size={18} />
            </button>

            {accountMenuOpen && (
              <div className="account-dropdown">
                <button
                  className="account-dropdown-item"
                  onClick={() => { navigate("/login"); setAccountMenuOpen(false); }}
                >
                  <FiLogIn size={14} /> Se connecter
                </button>
                <div className="dropdown-divider" />
                <button
                  className="account-dropdown-item"
                  onClick={() => { navigate("/register"); setAccountMenuOpen(false); }}
                >
                  <FiUserPlus size={14} /> S'inscrire
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;