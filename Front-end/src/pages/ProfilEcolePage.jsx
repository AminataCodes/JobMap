import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfilAdmin,
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

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState("apropos");

  const [nouvelleFormation, setNouvelleFormation] = useState("");
  const [nouvelleOffre, setNouvelleOffre] = useState({ titre: "", description: "" });

  useEffect(() => {
    // Redirige si pas de token ou pas le bon rôle
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const data = await getProfilAdmin(token);
      // Redirige seulement si token invalide (401)
      if (data.message === "Token manquant" || data.message === "Token invalide ou expiré") {
        navigate("/login");
        return;
      }
      setAdmin(data);
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
  if (!admin)  return <div className="pe-loading">Profil introuvable.</div>;

  return (
    <div className="pe-page">

      {/* ── En-tête ── */}
      <div className="pe-header-card">
       <div className="pe-logo-box">
  {admin.photoProfilUrl ? (
    <img src={admin.photoProfilUrl} alt="Profil" />
  ) : (
    <div className="pe-default-avatar">
      {admin.nomAdmin?.charAt(0)}
    </div>
  )}
</div>

<div className="pe-header-info">
  <h1>{admin.nomAdmin}</h1>
  <p>{admin.email}</p>
</div>
      </div>

      {/* ── Stats ── */}
      <div className="pe-stats-row">
              <div className="pe-stat-card">
        <span className="pe-stat-num">
          {admin.offres?.length ?? 0}
        </span>
        <span className="pe-stat-lbl">
          Offres publiées
        </span>
      </div>
        <div className="pe-stat-card">
          <span className="pe-stat-num">{admin  .formations?.length ?? 0}</span>
          <span className="pe-stat-lbl">Formations</span>
        </div>
        <div className="pe-stat-card">
          <span className="pe-stat-num">{new Date(admin.createdAt).getFullYear()}</span>
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
          <p className="pe-about-text">{admin.description}</p>
        </div>
      )}

      {/* ── Formations ── */}
      {onglet === "formations" && (
        <div className="pe-section-card">
          <h2 className="pe-section-title">Formations</h2>

          {admin.formations?.length === 0 && (
            <p className="pe-empty">Aucune formation ajoutée.</p>
          )}

          <ul className="pe-formation-list">
            {admin.formations?.map(f => (
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

          {admin.offres?.length === 0 && (
            <p className="pe-empty">Aucune offre publiée.</p>
          )}

          <div className="pe-offres-grid">
            {admin.offres?.map(o => (
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
              { label: "Adresse",     value: admin.adresse    },
              { label: "Ville",       value: admin.ville      },
              { label: "Code postal", value: admin.codePostal },
              { label: "Pays",        value: admin.pays       },
              { label: "Email",       value: admin.emailPro   },
              { label: "Téléphone",   value: admin.telephone  },
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