import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OffreDetail.css";

function OffreDetailPage() {
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [titre, setTitre] = useState("Développeur Web .Net H/F");
  const [description, setDescription] = useState(
    `Pour suivre notre croissance et renforcer notre pôle d'expertise SIP, nous recherchons un Développeur Web .NET F/H, lequel mènera à bien le développement et l'intégration des projets confiés par nos clients grands comptes.

La division SIP de COEXYA est un acteur majeur dans le contexte métier de la propriété industrielle. Au sein de notre pôle d'activité basé à Paris (une quarantaine d'ingénieurs), les solutions mises en place sont des applications de gestion avec composante documentaire et mise en place de services sur le WEB.

Dans le cadre de gros projets de développement et d'intégration, les applications pour les offices de marques et de brevets reposent sur la réutilisation des composants logiciels métier développés par COEXYA et sur la modélisation des workflows et règles métier du client.`
  );

  const role = localStorage.getItem("role");

  const handleSave = () => {
    setEditMode(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    setDeleted(true);
    setTimeout(() => navigate(-1), 2000);
  };

  if (deleted) {
    return (
      <div className="od-deleted-screen">
        <div className="od-deleted-box">
          <div className="od-deleted-icon">🗑️</div>
          <h2>Offre supprimée</h2>
          <p>Vous allez être redirigé…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="od-wrapper">

      {/* ══════════ TOAST PUBLICATION ══════════ */}
      {showToast && (
        <div className="od-toast">
          <div className="od-toast-inner">
            <div className="od-toast-icon">✓</div>
            <span>Votre offre est publiée !</span>
          </div>
        </div>
      )}

      {/* ══════════ MODAL SUPPRESSION ══════════ */}
      {showDeleteConfirm && (
        <div className="od-modal-overlay">
          <div className="od-modal">
            <div className="od-modal-icon">⚠️</div>
            <h3>Supprimer cette offre ?</h3>
            <p>Cette action est irréversible. L'offre sera définitivement supprimée.</p>
            <div className="od-modal-actions">
              <button className="od-modal-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </button>
              <button className="od-modal-confirm" onClick={handleDelete}>
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ RETOUR ══════════ */}
      <button className="od-back" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      {/* ══════════ HERO CARD ══════════ */}
      <div className="od-hero-card">
        <div className="od-hero-top">

          <div className="od-logo">C</div>

          <div className="od-hero-info">
            <div className="od-badges-row">
              <span className="od-badge od-badge-stage">Stage</span>
              <span className="od-badge od-badge-super">⭐ Super recruteur</span>
              <span className="od-badge od-badge-reactif">⚡ Réactif</span>
              <span className="od-badge od-badge-transparent">💬 Transparent</span>
            </div>

            {editMode ? (
              <input
                className="od-input-titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
              />
            ) : (
              <h1 className="od-titre">{titre}</h1>
            )}

            <p className="od-company">Coexya</p>

            <div className="od-chips-row">
              <span className="od-chip">📍 Paris 12e – 75</span>
              <span className="od-chip">💶 15 000 – 17 000 € / an</span>
              <span className="od-chip">🎓 Bac +2 à Bac +5</span>
              <span className="od-chip">💻 Informatique · ESN</span>
            </div>

            <p className="od-pubdate">Publiée le 09 juin 2026 · Réf : SIPCDINET</p>
          </div>
        </div>

        {/* ── BOUTONS ── */}
        <div className="od-actions">

          {/* MODE NORMAL — école */}
          {role === "ecole" && !editMode && (
            <>
              <button className="od-btn-edit" onClick={() => setEditMode(true)}>
                ✏️ Modifier l'offre
              </button>
              <button className="od-btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                🗑️ Supprimer
              </button>
            </>
          )}

          {/* MODE ÉDITION */}
          {editMode && (
            <>
              <button className="od-btn-save" onClick={handleSave}>
                💾 Publier les modifications
              </button>
              <button className="od-btn-cancel" onClick={() => setEditMode(false)}>
                Annuler
              </button>
            </>
          )}

          {/* ÉTUDIANT */}
          {role !== "ecole" && (
            <button
              className="od-btn-postuler"
              onClick={() => navigate("/candidatures")}
            >
              Postuler maintenant →
            </button>
          )}

        </div>
      </div>

      {/* ══════════ CORPS ══════════ */}
      <div className="od-body">

        {/* ── COLONNE PRINCIPALE ── */}
        <div className="od-main">

          <div className="od-section">
            <h2 className="od-section-title">Description du poste</h2>
            {editMode ? (
              <textarea
                className="od-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={12}
              />
            ) : (
              <p className="od-text">{description}</p>
            )}
          </div>

          <div className="od-section">
            <h2 className="od-section-title">Missions</h2>
            <ul className="od-list">
              <li>Développement et Test</li>
              <li>Conception / Spécifications</li>
              <li>Mise à jour de la documentation technique</li>
              <li>Amélioration continue des performances et de la sécurité</li>
              <li>Implication dans les différentes phases de maintenance (corrective, évolutive)</li>
            </ul>
          </div>

          <div className="od-section">
            <h2 className="od-section-title">Profil recherché</h2>
            <ul className="od-list">
              <li>Visual Studio .Net (2.0, 3.5, 4.0), VB.Net, C#</li>
              <li>Bootstrap</li>
              <li>Team Foundation Server</li>
              <li>SGBDR notamment Oracle, SQL Server</li>
              <li>Systèmes et workflows documentaires</li>
              <li>Bon niveau d'anglais — espagnol apprécié</li>
              <li>Force de proposition, travail d'équipe essentiel</li>
            </ul>
          </div>

          <div className="od-section">
            <h2 className="od-section-title">Les avantages</h2>
            <div className="od-avantages">
              <div className="od-avantage">🏥 Mutuelle</div>
              <div className="od-avantage">🍽️ Tickets restaurant</div>
              <div className="od-avantage">📈 Actionnariat</div>
              <div className="od-avantage">🎉 CSE dynamique</div>
              <div className="od-avantage">🚲 Mobilité douce</div>
            </div>
          </div>

          <div className="od-section">
            <h2 className="od-section-title">Étapes de recrutement</h2>
            <div className="od-steps">
              <div className="od-step">
                <div className="od-step-num">1</div>
                <div className="od-step-content">
                  <strong>Préqualification téléphonique</strong>
                  <p>Une personne de l'équipe recrutement vous contacte si votre CV est retenu.</p>
                </div>
              </div>
              <div className="od-step">
                <div className="od-step-num">2</div>
                <div className="od-step-content">
                  <strong>Entretien avec un pair</strong>
                  <p>Mettre en perspective vos visions respectives.</p>
                </div>
              </div>
              <div className="od-step">
                <div className="od-step-num">3</div>
                <div className="od-step-content">
                  <strong>Entretien avec votre futur N+1</strong>
                  <p>Le directeur de la BU — processus de 10 jours maximum.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── SIDEBAR ── */}
        <aside className="od-sidebar">

          <div className="od-sidebar-card">
            <h3 className="od-sidebar-title">Informations</h3>
            <div className="od-sinfo"><span>Entreprise</span><strong>Coexya</strong></div>
            <div className="od-sinfo"><span>Lieu</span><strong>Paris 12e, 75</strong></div>
            <div className="od-sinfo"><span>Type de contrat</span><strong>Stage</strong></div>
            <div className="od-sinfo"><span>Salaire</span><strong>15 000 – 17 000 € / an</strong></div>
            <div className="od-sinfo"><span>Niveau requis</span><strong>Bac +2 à Bac +5</strong></div>
            <div className="od-sinfo"><span>Secteur</span><strong>Informatique · ESN</strong></div>
            <div className="od-sinfo"><span>Publiée le</span><strong>09 juin 2026</strong></div>
          </div>

          <div className="od-sidebar-card">
            <h3 className="od-sidebar-title">Recruteur</h3>
            <p className="od-recruiter-text">
              Ce recruteur garantit une réponse à chaque candidature et répond en moyenne en <strong>15 jours</strong>.
            </p>
            <div className="od-recruiter-tags">
              <span>✅ Réponse garantie</span>
              <span>💬 Transparent</span>
              <span>⚡ Réactif</span>
            </div>
          </div>

          {/* ACTIONS SIDEBAR — école uniquement */}
          {role === "ecole" && !editMode && (
            <div className="od-sidebar-card od-sidebar-danger">
              <h3 className="od-sidebar-title">Gestion</h3>
              <p className="od-danger-text">Modifier ou retirer cette offre de la plateforme.</p>
              <div className="od-sidebar-btns">
                <button className="od-sidebar-edit-btn" onClick={() => setEditMode(true)}>
                  ✏️ Modifier
                </button>
                <button className="od-sidebar-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                  🗑️ Supprimer l'offre
                </button>
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}

export default OffreDetailPage;