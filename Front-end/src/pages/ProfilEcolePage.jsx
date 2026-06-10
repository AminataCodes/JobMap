import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfilEcole,
  ajouterFormation,
  supprimerFormation,
  ajouterOffre,
  supprimerOffre,
} from "../services/api";
import "../styles/ProfilEcole.css";

function ProfilEcolePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  const [ecole, setEcole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState("apropos");

  const [nouvelleFormation, setNouvelleFormation] = useState("");
  const [nouvelleOffre, setNouvelleOffre] = useState({ titre: "", description: "" });

  useEffect(() => {
    // Redirige si pas de token ou pas le bon rôle
    if (!token || role !== "ecole") {
      navigate("/login");
      return;
    }
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const data = await getProfilEcole(token);
      // Redirige seulement si token invalide (401)
      if (data.message === "Token manquant" || data.message === "Token invalide ou expiré") {
        navigate("/login");
        return;
      }
      setEcole(data);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormation = async (e) => {
    e.preventDefault();
    if (!nouvelleFormation.trim()) return;
    await ajouterFormation(token, nouvelleFormation.trim());
    setNouvelleFormation("");
    fetchProfil();
  };

  const handleDelFormation = async (id) => {
    await supprimerFormation(token, id);
    fetchProfil();
  };

  const handleAddOffre = async (e) => {
    e.preventDefault();
    if (!nouvelleOffre.titre.trim()) return;
    await ajouterOffre(token, nouvelleOffre.titre.trim(), nouvelleOffre.description.trim());
    setNouvelleOffre({ titre: "", description: "" });
    fetchProfil();
  };

  const handleDelOffre = async (id) => {
    await supprimerOffre(token, id);
    fetchProfil();
  };

  if (loading) return <div className="pe-loading">Chargement...</div>;
  if (!ecole)  return <div className="pe-loading">Profil introuvable.</div>;

  return (
    <div className="pe-page">

      {/* ── En-tête ── */}
      <div className="pe-header-card">
        <div className="pe-logo-box">
          {ecole.logo
            ? <img src={ecole.logo} alt="Logo" />
            : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
          }
        </div>
        <div className="pe-header-info">
          <h1 className="pe-school-name">{ecole.nomEtablissement}</h1>
          <span className="pe-school-type">{ecole.typeEtablissement}</span>
          <div className="pe-header-meta">
            <span className="pe-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {ecole.ville}, {ecole.pays}
            </span>
            {ecole.siteWeb && (
              <a href={ecole.siteWeb} target="_blank" rel="noreferrer" className="pe-meta-item pe-meta-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                {ecole.siteWeb.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="pe-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {ecole.emailPro}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="pe-stats-row">
        <div className="pe-stat-card">
          <span className="pe-stat-num">{ecole.offres?.length ?? 0}</span>
          <span className="pe-stat-lbl">Offres publiées</span>
        </div>
        <div className="pe-stat-card">
          <span className="pe-stat-num">{ecole.formations?.length ?? 0}</span>
          <span className="pe-stat-lbl">Formations</span>
        </div>
        <div className="pe-stat-card">
          <span className="pe-stat-num">{new Date(ecole.createdAt).getFullYear()}</span>
          <span className="pe-stat-lbl">Membre depuis</span>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div className="pe-tab-bar">
        {[
          { id: "apropos",    label: "À propos"     },
          { id: "formations", label: "Formations"   },
          { id: "offres",     label: "Offres"       },
          { id: "infos",      label: "Informations" },
        ].map(t => (
          <button
            key={t.id}
            className={`pe-tab-btn ${onglet === t.id ? "active" : ""}`}
            onClick={() => setOnglet(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── À propos ── */}
      {onglet === "apropos" && (
        <div className="pe-section-card">
          <h2 className="pe-section-title">À propos</h2>
          <p className="pe-about-text">{ecole.description}</p>
        </div>
      )}

      {/* ── Formations ── */}
      {onglet === "formations" && (
        <div className="pe-section-card">
          <h2 className="pe-section-title">Formations</h2>

          {ecole.formations?.length === 0 && (
            <p className="pe-empty">Aucune formation ajoutée.</p>
          )}

          <ul className="pe-formation-list">
            {ecole.formations?.map(f => (
              <li key={f.id} className="pe-formation-item">
                <span>{f.nom}</span>
                <button
                  className="pe-del-btn"
                  onClick={() => handleDelFormation(f.id)}
                  aria-label="Supprimer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <form className="pe-add-row" onSubmit={handleAddFormation}>
            <input
              className="pe-add-input"
              placeholder="Ajouter une formation..."
              value={nouvelleFormation}
              onChange={e => setNouvelleFormation(e.target.value)}
            />
            <button className="pe-add-btn" type="submit">+ Ajouter</button>
          </form>
        </div>
      )}

      {/* ── Offres ── */}
      {onglet === "offres" && (
        <div className="pe-section-card">
          <h2 className="pe-section-title">Offres publiées</h2>

          {ecole.offres?.length === 0 && (
            <p className="pe-empty">Aucune offre publiée.</p>
          )}

          <div className="pe-offres-grid">
            {ecole.offres?.map(o => (
              <div key={o.id} className="pe-offre-card">
                <div className="pe-offre-top">
                  <div>
                    <p className="pe-offre-titre">{o.titre}</p>
                    <p className="pe-offre-date">
                      {new Date(o.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    className="pe-del-btn"
                    onClick={() => handleDelOffre(o.id)}
                    aria-label="Supprimer l'offre"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                {o.description && <p className="pe-offre-desc">{o.description}</p>}
              </div>
            ))}
          </div>

          <form className="pe-offre-form" onSubmit={handleAddOffre}>
            <input
              className="pe-add-input"
              placeholder="Titre de l'offre *"
              value={nouvelleOffre.titre}
              onChange={e => setNouvelleOffre({ ...nouvelleOffre, titre: e.target.value })}
              required
            />
            <textarea
              className="pe-add-input pe-textarea"
              placeholder="Description de l'offre..."
              rows={3}
              value={nouvelleOffre.description}
              onChange={e => setNouvelleOffre({ ...nouvelleOffre, description: e.target.value })}
            />
            <button className="pe-add-btn" type="submit" style={{ alignSelf: "flex-start" }}>
              + Publier l'offre
            </button>
          </form>
        </div>
      )}

      {/* ── Informations ── */}
      {onglet === "infos" && (
        <div className="pe-section-card">
          <h2 className="pe-section-title">Informations</h2>
          <div className="pe-info-grid">
            {[
              { label: "Adresse",     value: ecole.adresse    },
              { label: "Ville",       value: ecole.ville      },
              { label: "Code postal", value: ecole.codePostal },
              { label: "Pays",        value: ecole.pays       },
              { label: "Email",       value: ecole.emailPro   },
              { label: "Téléphone",   value: ecole.telephone  },
            ].map(r => (
              <div key={r.label} className="pe-info-row">
                <span className="pe-info-label">{r.label}</span>
                <span className="pe-info-value">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfilEcolePage;