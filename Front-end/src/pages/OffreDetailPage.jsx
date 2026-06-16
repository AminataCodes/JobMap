import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/OffreDetail.css";

function OffreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // ── Fetch de l'offre ──
  useEffect(() => {
    fetch(`http://localhost:3000/api/offres/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Offre introuvable");
        return res.json();
      })
      .then((data) => {
        setOffre(data);
        setTitre(data.nomPoste);
        setDescription(data.description);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // ── Sauvegarde ──
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/offres/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nomPoste: titre, description }),
      });

      if (!res.ok) throw new Error();

      setOffre((prev) => ({ ...prev, nomPoste: titre, description }));
      setEditMode(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch {
      alert("Erreur lors de la sauvegarde");
    }
  };

  // ── Suppression ──
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/offres/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteConfirm(false);
      setDeleted(true);
      setTimeout(() => navigate(-1), 2000);
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  // ── États de chargement ──
  if (loading) {
    return (
      <div className="od-wrapper">
        <p style={{ color: "#94A3B8", padding: "40px" }}>Chargement…</p>
      </div>
    );
  }

  if (error || !offre) {
    return (
      <div className="od-wrapper">
        <button className="od-back" onClick={() => navigate(-1)}>← Retour</button>
        <p style={{ color: "#EF4444", padding: "40px" }}>{error ?? "Offre introuvable"}</p>
      </div>
    );
  }

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

      {/* ── TOAST ── */}
      {showToast && (
        <div className="od-toast">
          <div className="od-toast-inner">
            <div className="od-toast-icon">✓</div>
            <span>Votre offre est publiée !</span>
          </div>
        </div>
      )}

      {/* ── MODAL SUPPRESSION ── */}
      {showDeleteConfirm && (
        <div className="od-modal-overlay">
          <div className="od-modal">
            <div className="od-modal-icon">⚠️</div>
            <h3>Supprimer cette offre ?</h3>
            <p>Cette action est irréversible.</p>
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

      {/* ── RETOUR ── */}
      <button className="od-back" onClick={() => navigate(-1)}>← Retour</button>

      {/* ── HERO CARD ── */}
      <div className="od-hero-card">
        <div className="od-hero-top">

          <div className="od-logo">{offre.initiale ?? offre.nomEntreprise.charAt(0)}</div>

          <div className="od-hero-info">
            <div className="od-badges-row">
              <span className="od-badge od-badge-stage">{offre.typeContrat}</span>
              {offre.isSuperRecruteur && <span className="od-badge od-badge-super">⭐ Super recruteur</span>}
              {offre.isReactif && <span className="od-badge od-badge-reactif">⚡ Réactif</span>}
              {offre.isTransparent && <span className="od-badge od-badge-transparent">💬 Transparent</span>}
            </div>

            {editMode ? (
              <input
                className="od-input-titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
              />
            ) : (
              <h1 className="od-titre">{offre.nomPoste}</h1>
            )}

            <p className="od-company">{offre.nomEntreprise}</p>

            <div className="od-chips-row">
              {offre.lieu && <span className="od-chip">📍 {offre.lieu}</span>}
              {offre.salaire && <span className="od-chip">💶 {offre.salaire}</span>}
              {offre.niveauEtudes && <span className="od-chip">🎓 {offre.niveauEtudes}</span>}
              {offre.secteur && <span className="od-chip">💻 {offre.secteur}</span>}
            </div>

            <p className="od-pubdate">
              Publiée le {new Date(offre.datePublication).toLocaleDateString("fr-FR")}
              {offre.reference && ` · Réf : ${offre.reference}`}
            </p>
          </div>
        </div>

        {/* ── BOUTONS ── */}
        <div className="od-actions">
          {role === "admin" && !editMode && (
            <>
              <button className="od-btn-edit" onClick={() => setEditMode(true)}>✏️ Modifier l'offre</button>
              <button className="od-btn-delete" onClick={() => setShowDeleteConfirm(true)}>🗑️ Supprimer</button>
            </>
          )}
          {editMode && (
            <>
              <button className="od-btn-save" onClick={handleSave}>💾 Publier les modifications</button>
              <button className="od-btn-cancel" onClick={() => setEditMode(false)}>Annuler</button>
            </>
          )}
          {role !== "admin" && (
            <button className="od-btn-postuler" onClick={() => navigate(`/offres/${offre.id}/candidature`)}>
              Postuler maintenant →
            </button>
          )}
        </div>
      </div>

      {/* ── CORPS ── */}
      <div className="od-body">

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
              <p className="od-text">{offre.description}</p>
            )}
          </div>

          {offre.missions?.length > 0 && (
            <div className="od-section">
              <h2 className="od-section-title">Missions</h2>
              <ul className="od-list">
                {offre.missions.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}

          {offre.profilRecherche?.length > 0 && (
            <div className="od-section">
              <h2 className="od-section-title">Profil recherché</h2>
              <ul className="od-list">
                {offre.profilRecherche.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {offre.avantages?.length > 0 && (
            <div className="od-section">
              <h2 className="od-section-title">Les avantages</h2>
              <div className="od-avantages">
                {offre.avantages.map((a, i) => (
                  <div key={i} className="od-avantage">{a}</div>
                ))}
              </div>
            </div>
          )}

          {offre.etapesRecrutement?.length > 0 && (
            <div className="od-section">
              <h2 className="od-section-title">Étapes de recrutement</h2>
              <div className="od-steps">
                {offre.etapesRecrutement.map((e, i) => (
                  <div key={i} className="od-step">
                    <div className="od-step-num">{i + 1}</div>
                    <div className="od-step-content">
                      <strong>{e.titre}</strong>
                      <p>{e.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── SIDEBAR ── */}
        <aside className="od-sidebar">

          <div className="od-sidebar-card">
            <h3 className="od-sidebar-title">Informations</h3>
            <div className="od-sinfo"><span>Entreprise</span><strong>{offre.nomEntreprise}</strong></div>
            {offre.lieu && <div className="od-sinfo"><span>Lieu</span><strong>{offre.lieu}</strong></div>}
            <div className="od-sinfo"><span>Type de contrat</span><strong>{offre.typeContrat}</strong></div>
            {offre.salaire && <div className="od-sinfo"><span>Salaire</span><strong>{offre.salaire}</strong></div>}
            {offre.niveauEtudes && <div className="od-sinfo"><span>Niveau requis</span><strong>{offre.niveauEtudes}</strong></div>}
            {offre.secteur && <div className="od-sinfo"><span>Secteur</span><strong>{offre.secteur}</strong></div>}
            <div className="od-sinfo">
              <span>Publiée le</span>
              <strong>{new Date(offre.datePublication).toLocaleDateString("fr-FR")}</strong>
            </div>
          </div>

          {offre.delaiReponse && (
            <div className="od-sidebar-card">
              <h3 className="od-sidebar-title">Recruteur</h3>
              <p className="od-recruiter-text">
                Ce recruteur répond en moyenne en <strong>{offre.delaiReponse}</strong>.
              </p>
              <div className="od-recruiter-tags">
                {offre.isTransparent && <span>💬 Transparent</span>}
                {offre.isReactif && <span>⚡ Réactif</span>}
                {offre.isSuperRecruteur && <span>⭐ Super recruteur</span>}
              </div>
            </div>
          )}

          {role === "admin" && !editMode && (
            <div className="od-sidebar-card od-sidebar-danger">
              <h3 className="od-sidebar-title">Gestion</h3>
              <p className="od-danger-text">Modifier ou retirer cette offre de la plateforme.</p>
              <div className="od-sidebar-btns">
                <button className="od-sidebar-edit-btn" onClick={() => setEditMode(true)}>✏️ Modifier</button>
                <button className="od-sidebar-delete-btn" onClick={() => setShowDeleteConfirm(true)}>🗑️ Supprimer l'offre</button>
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}

export default OffreDetailPage;