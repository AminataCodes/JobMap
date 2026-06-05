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
        <p className="trust-label">Les leaders de l'industrie recrutent nos profils</p>
        <MarqueeBg />
      </section>

    </div>
  );
}

export default Home;