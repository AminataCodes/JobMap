import { useState } from "react";
import "../styles/entrepriseAnnonces.css";

function EntrepriseAnnonces() {
  // Données enrichies pour matcher le rendu premium d'un catalogue entreprise
  const [annonces] = useState([
    { id: 1, titre: "Développeur React", lieu: "Paris", type: "CDI", candidats: 14, statut: "Actif", date: "Mis à jour hier" },
    { id: 2, titre: "Développeur Node.js", lieu: "Lyon", type: "Alternance", candidats: 5, statut: "Actif", date: "Il y a 3 jours" },
    { id: 3, titre: "UX/UI Designer", lieu: "Marseille", type: "Stage", candidats: 2, statut: "Brouillon", date: "Créé il y a 1 semaine" },
  ]);

  const [searchPoste, setSearchPoste] = useState("");
  const [searchLieu, setSearchLieu] = useState("");

  const filteredAnnonces = annonces.filter((annonce) => {
    return (
      annonce.titre.toLowerCase().includes(searchPoste.toLowerCase()) &&
      annonce.lieu.toLowerCase().includes(searchLieu.toLowerCase())
    );
  });

  return (
    <div className="ent-annonces__wrapper">
      {/* Arrière-plans décoratifs pour accentuer l'effet de flou du verre (Glassmorphism) */}
      <div className="ent-annonces__blur-blob color-1"></div>
      <div className="ent-annonces__blur-blob color-2"></div>

      <div className="ent-annonces__container">
        
        {/* En-tête de page format Glass */}
        <header className="ent-annonces__header glass-layer">
          <div>
            <span className="ent-annonces__badge-top">Espace Recruteur</span>
            <h1>Toutes vos annonces</h1>
            <p>Gérez, éditez et suivez l'attractivité de vos offres en ligne</p>
          </div>
          <button className="ent-annonces__btn-primary">
            <span>➕ Publier une nouvelle offre</span>
          </button>
        </header>

        {/* Barre de Recherche et Filtres en ligne */}
        <div className="ent-annonces__filters glass-layer">
          <div className="ent-annonces__input-wrapper">
            <span className="input-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par métier (ex: React)..."
              value={searchPoste}
              onChange={(e) => setSearchPoste(e.target.value)}
            />
          </div>

          <div className="ent-annonces__input-wrapper">
            <span className="input-icon">📍</span>
            <input
              type="text"
              placeholder="Filtrer par ville (ex: Paris)..."
              value={searchLieu}
              onChange={(e) => setSearchLieu(e.target.value)}
            />
          </div>

          {(searchPoste || searchLieu) && (
            <button 
              className="ent-annonces__btn-reset"
              onClick={() => { setSearchPoste(""); setSearchLieu(""); }}
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Grille de cartes d'annonces au format projet */}
        <div className="ent-annonces__grid">
          {filteredAnnonces.length === 0 ? (
            <div className="ent-annonces__empty glass-layer">
              <span className="empty-icon">📭</span>
              <p>Aucune annonce ne correspond à vos filtres actuels.</p>
            </div>
          ) : (
            filteredAnnonces.map((annonce) => (
              <div key={annonce.id} className="ent-annonces__card glass-layer">
                
                {/* Haut de la carte : Type & Statut */}
                <div className="card-top">
                  <span className="contract-badge">{annonce.type}</span>
                  <span className={`status-badge ${annonce.statut.toLowerCase()}`}>
                    ● {annonce.statut}
                  </span>
                </div>

                {/* Corps de la carte */}
                <div className="card-middle">
                  <h3>{annonce.titre}</h3>
                  <div className="info-row">
                    <span>📍 {annonce.lieu}</span>
                    <span className="info-dot">•</span>
                    <span>{annonce.date}</span>
                  </div>
                </div>

                {/* Bas de la carte : Métriques Recruteur & Boutons d'action */}
                <div className="card-bottom">
                  <div className="candidate-stat">
                    <span className="stat-number">{annonce.candidats}</span>
                    <span className="stat-label">Candidatures</span>
                  </div>
                  
                  <div className="card-actions">
                    <button className="btn-icon" title="Modifier l'annonce">✏️</button>
                    <button className="btn-action-view">Voir les profils</button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default EntrepriseAnnonces;