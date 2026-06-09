import { useNavigate } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import MarqueeBg from "../components/MarqueeBg";
import "../styles/Home.css";

function MapLogo({ size = 90 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="4,12 22,6 22,50 4,48" fill="#2563eb" />
      <polygon points="22,6 40,12 40,50 22,50" fill="#16a34a" />
      <polygon points="40,12 56,6 56,48 40,50" fill="#2563eb" />
      <path d="M10 42 Q18 38 22 44 Q30 52 40 36" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="10" cy="42" r="3" fill="white" />
      <circle cx="40" cy="36" r="3" fill="white" />
      <path d="M30 4C25.58 4 22 7.58 22 12C22 18 30 26 30 26C30 26 38 18 38 12C38 7.58 34.42 4 30 4Z" fill="#1d4ed8"/>
      <circle cx="30" cy="12" r="4" fill="white" />
    </svg>
  );
}

const HOW_STEPS = [
  {
    step: "ÉTAPE 01",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 10h8M8 15h6M8 20h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <path d="M22 24l1.5 1.5L26 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Clique sur l'extension",
    description:
      "Lorsque tu consultes une offre et que tu cliques pour postuler ou interagir avec une annonce, l'extension détecte automatiquement la candidature et l'ajoute à ton espace JobMap.",
  },
  {
    step: "ÉTAPE 02",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="11" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M5 28c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 9l2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Crée ton compte",
    description:
      "Inscris-toi avec ton email en quelques secondes. L'extension reconnaît ton compte et sait exactement où centraliser toutes tes candidatures.",
  },
  {
    step: "ÉTAPE 03",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 12h24" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 18h5M10 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="22" cy="20" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Suis tes candidatures",
    description:
      "Toutes tes candidatures s'affichent sur ton dashboard : nom du poste, entreprise et date de dépôt. Tout au même endroit, peu importe la plateforme.",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* ================= HERO ================= */}
      <section className="home-hero">
        <div className="hero-content">

          <div className="hero-logo-icon">
            <MapLogo size={88} />
          </div>

          <span className="hero-badge"><FiTrendingUp /> Plateforme de centralisation</span>

          <h1>
            Et si rater une opportunité... <br />
            <span className="text-gradient">n'était plus jamais une option!</span>
          </h1>

        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <section className="home-trust-logos">
        <p className="trust-label"></p>
        <MarqueeBg />
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="home-how">
        <div className="how-header">
          <h2>Comment ça marche ?</h2>
          <p className="how-subtitle">Trois étapes pour ne plus jamais perdre le fil de tes candidatures.</p>
        </div>

        <div className="how-steps">
          {HOW_STEPS.map((item, i) => (
            <div className="how-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="how-card-icon">{item.icon}</div>
              <span className="how-card-step">{item.step}</span>
              <h3 className="how-card-title">{item.title}</h3>
              <p className="how-card-desc">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="how-cta">
          <button className="how-cta-btn" onClick={() => navigate("/register")}>
            Commencer maintenant
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <MapLogo size={28} />
            <span className="footer-brand-name">JobMap</span>
          </div>
          <p className="footer-tagline">Centralise toutes tes candidatures, en un seul endroit.</p>
          <div className="footer-links">
            <button onClick={() => navigate("/register")} className="footer-link">Créer un compte</button>
            <span className="footer-dot">·</span>
            <button onClick={() => navigate("/login")} className="footer-link">Se connecter</button>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} JobMap </p>
        </div>
      </footer>

    </div>
  );
}

export default Home;