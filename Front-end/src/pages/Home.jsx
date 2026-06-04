import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiBriefcase, FiTrendingUp, FiArrowRight, FiUsers, FiAward } from "react-icons/fi";
import MarqueeBg from "../components/MarqueeBg"; // Importation du bandeau de logos animés
import "../styles/Home.css";

// Données fictives pour alimenter les annonces du jour
const ANNONCES_DU_JOUR = [
  {
    id: 101,
    poste: "Développeur Front-end React (Alternance)",
    entreprise: "TechScale",
    lieu: "Paris (Hybride)",
    type: "Alternance",
    salaire: "35k - 42k €",
    tags: ["React", "TypeScript", "Tailwind"]
  },
  {
    id: 102,
    poste: "Product Designer UI/UX (Stage)",
    entreprise: "Studio Pulse",
    lieu: "Lyon",
    type: "Stage",
    salaire: "1 200 € / mois",
    tags: ["Figma", "Design System", "User Research"]
  },
  {
    id: 103,
    poste: "Fullstack Developer Node/Vue",
    entreprise: "GreenTech Solutions",
    lieu: "Montreuil (Full Remote)",
    type: "CDI",
    salaire: "45k - 50k €",
    tags: ["Node.js", "Vue.js", "PostgreSQL"]
  }
];

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirection directe vers le catalogue d'offres global
    navigate("/annonce");
  };

  return (
    <div className="home-container">
      
      {/* ================= HERO SECTION ================= */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-badge"><FiTrendingUp /> Plateforme de centralisation</span>
          <h1>Et si rater une opportunité... <br /><span className="text-gradient">n'était plus jamais une option!</span></h1>
          <p className="hero-subtitle">
            La passerelle directe entre les talents de demain et les entreprises qui réinventent le futur. 
            Postulez en 3 clics.
          </p>

          {/* Barre de recherche SaaS premium */}
          <form onSubmit={handleSearchSubmit} className="hero-search-bar">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Métier, compétences, mots-clés..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-input-wrapper separator">
              <FiMapPin className="search-icon" />
              <input type="text" placeholder="Localisation" readOnly value="Paris (Hybride)" />
            </div>
            <button type="submit" className="hero-search-btn">Rechercher</button>
          </form>

          {/* CTAs d'orientation rapides */}
          <div className="hero-actions">
            <button onClick={() => navigate("/annonce")} className="btn-primary-home">
              Explorer les offres <FiArrowRight />
            </button>
            <button onClick={() => navigate("/login")} className="btn-secondary-home">
              Se Connecter <FiUsers />
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION LOGOS ANIMÉS (MARQUEE) ================= */}
      <section className="home-trust-logos" style={{ padding: "50px 0 20px 0", textAlign: "center" }}>
        <p style={{ 
          fontSize: "12px", 
          fontWeight: "700", 
          color: "var(--color-text-secondary)", 
          textTransform: "uppercase", 
          letterSpacing: "2px", 
          marginBottom: "24px" 
        }}>
          Les leaders de l'industrie recrutent nos profils
        </p>
        <MarqueeBg />
      </section>

      {/* ================= SECTION ANNONCES DU JOUR ================= */}
      <section className="home-featured-offers">
        <div className="section-header">
          <div>
            <h2>🔥 Les annonces du jour</h2>
            <p>Les opportunités les plus fraîches, sélectionnées pour vous aujourd'hui.</p>
          </div>
          <button className="btn-text-link">
            Voir toutes les offres ({ANNONCES_DU_JOUR.length}+) <FiArrowRight />
          </button>
        </div>

        <div className="offers-grid">
          {ANNONCES_DU_JOUR.map((annonce) => (
            <div key={annonce.id} className="offer-card-home">
              <div className="offer-card-top">
                <span className="offer-type-tag">{annonce.type}</span>
                <span className="offer-salary">{annonce.salaire}</span>
              </div>
              
              <h3 className="offer-title-home">{annonce.poste}</h3>
              <p className="offer-company-home">{annonce.entreprise}</p>
              
              <div className="offer-location-home">
                <FiMapPin size={14} /> {annonce.lieu}
              </div>

              <div className="offer-tags-row">
                {annonce.tags.map((tag, idx) => (
                  <span key={idx} className="mini-tag">{tag}</span>
                ))}
              </div>

              <button 
                onClick={() => navigate(`/annonce/${annonce.id}`)}  
                className="offer-apply-btn-home"
              >
                voir offre
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;