import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OffrePreview.css";

// ── Confettis ──────────────────────────────────────────────
const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6"];

function Confettis() {
  const pieces = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="confetti">
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: COLORS[Math.floor(Math.random() * COLORS.length)],
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Icônes ─────────────────────────────────────────────────
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Données initiales ──────────────────────────────────────
const OFFRE_INITIALE = {
  titre: "Développeur Web .Net H/F",
  entreprise: "Coexya",
  lieu: "Paris 12e – 75",
  contrat: "Stage",
  salaire: "15 000 – 17 000 € / an",
  secteur: "Informatique • ESN",
  niveaux: ["Bac +2", "Bac +3, Bac +4", "Bac +5"],
  publiee: "09/06/2026",
  ref: "SIPCDINET",

  contexte: `Pour suivre notre croissance et renforcer notre pôle d'expertise SIP, nous recherchons un Développeur Web .NET F/H, lequel mènera à bien le développement et l'intégration des projets confiés par nos clients grands comptes.

La division SIP de COEXYA est un acteur majeur dans le contexte métier de la propriété industrielle. Au sein de notre pôle d'activité basé à Paris (une quarantaine d'ingénieurs), les solutions mises en place sont des applications de gestion avec composante documentaire et mise en place de services sur le WEB.

Dans le cadre de gros projets de développement et d'intégration, les applications pour les offices de marques et de brevets reposent sur la réutilisation des composants logiciels métier développés par COEXYA et sur la modélisation des workflows et règles métier du client.

Ce poste est à pourvoir en CDI au sein de notre agence parisienne (pas de délégation chez le client).`,

  missions: [
    "Développement et Test",
    "Conception / Spécifications",
    "Mise à jour de la documentation technique",
    "Amélioration continue des performances et de la sécurité",
    "Implication dans les différentes phases de maintenance (corrective, évolutive…)",
  ],

  profil: [
    "Formation supérieure en informatique, idéalement école d'ingénieur",
    "Débutant ou expérimenté, le développement Web n'a que peu de secrets pour vous",
    "Bonnes connaissances des technologies Microsoft",
    "Force de proposition, capacité à prendre du recul",
    "Le travail d'équipe est essentiel pour vous",
    "Bon niveau d'anglais (espagnol apprécié)",
  ],

  technos: [
    "Visual Studio .Net (2.0, 3.5, 4.0)",
    "VB.Net / C#",
    "Bootstrap",
    "Team Foundation Server",
    "SGBDR : Oracle, SQL Server",
    "Systèmes et workflows documentaires",
  ],

  avantages: [
    "🏥 Mutuelle",
    "🍽️ Tickets restaurant",
    "📈 Possibilité d'entrée dans l'actionnariat",
    "🎉 CSE dynamique",
    "🚲 Programme de mobilité douce",
  ],

  etapesRecrutement: [
    "Préqualification téléphonique si CV retenu",
    "Entretien avec un pair",
    "Entretien avec le directeur de la BU (N+1)",
    "Durée du processus : ~10 jours",
  ],
};

// ── Champ éditable inline ──────────────────────────────────
function EditableText({ value, onChange, isEditing, multiline = false, style = {} }) {
  if (!isEditing) {
    return <span style={style}>{value}</span>;
  }
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          minHeight: "140px",
          padding: "10px",
          border: "2px solid #6366f1",
          borderRadius: "8px",
          fontSize: "15px",
          lineHeight: 1.75,
          color: "#374151",
          resize: "vertical",
          fontFamily: "inherit",
          outline: "none",
          background: "#fafbff",
          boxSizing: "border-box",
          ...style,
        }}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 10px",
        border: "2px solid #6366f1",
        borderRadius: "8px",
        fontSize: "inherit",
        fontWeight: "inherit",
        color: "inherit",
        fontFamily: "inherit",
        outline: "none",
        background: "#fafbff",
        width: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}

// ── Liste éditable (missions, profil, étapes) ──────────────
function EditableList({ items, onChange, isEditing }) {
  const updateItem = (index, val) => {
    const next = [...items];
    next[index] = val;
    onChange(next);
  };
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));
  const addItem = () => onChange([...items, ""]);

  if (!isEditing) {
    return (
      <ul style={{ paddingLeft: "20px", margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: "8px", fontSize: "15px", color: "#374151", lineHeight: 1.6 }}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            style={{
              flex: 1,
              padding: "8px 10px",
              border: "2px solid #c7d2fe",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#374151",
              fontFamily: "inherit",
              outline: "none",
              background: "#fafbff",
            }}
          />
          <button
            onClick={() => removeItem(i)}
            style={{
              padding: "6px 10px",
              background: "#fee2e2",
              color: "#ef4444",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        style={{
          padding: "8px 16px",
          background: "#eef2ff",
          color: "#6366f1",
          border: "2px dashed #a5b4fc",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
          marginTop: "4px",
        }}
      >
        + Ajouter une ligne
      </button>
    </div>
  );
}

// ── Tags éditables (technos, avantages) ───────────────────
function EditableTags({ items, onChange, isEditing, tagStyle }) {
  const updateItem = (index, val) => {
    const next = [...items];
    next[index] = val;
    onChange(next);
  };
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));
  const addItem = () => onChange([...items, ""]);

  if (!isEditing) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {items.map((t, i) => (
          <span key={i} style={tagStyle}>{t}</span>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            style={{
              padding: "5px 10px",
              border: "2px solid #a5b4fc",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "inherit",
              outline: "none",
              background: "#fafbff",
              width: "auto",
              minWidth: "80px",
            }}
          />
          <button
            onClick={() => removeItem(i)}
            style={{
              background: "#fee2e2",
              color: "#ef4444",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              padding: "4px 7px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        style={{
          padding: "5px 12px",
          background: "#eef2ff",
          color: "#6366f1",
          border: "2px dashed #a5b4fc",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        + Ajouter
      </button>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function OffrePreviewPage() {
  const navigate = useNavigate();

  const [offre, setOffre] = useState(OFFRE_INITIALE);
  const [offreBackup, setOffreBackup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showPublishAnim, setShowPublishAnim] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Champ simple ──
  const update = (key, val) => setOffre((prev) => ({ ...prev, [key]: val }));

  // ── Mode édition ──
  const handleModifier = () => {
    setOffreBackup(offre); // sauvegarde pour annuler
    setIsEditing(true);
  };

  const handleSauvegarder = () => {
    setIsEditing(false);
    setOffreBackup(null);
    // ici tu peux appeler ton API : await api.put(`/offres/${offre.id}`, offre);
  };

  const handleAnnuler = () => {
    setOffre(offreBackup);
    setIsEditing(false);
    setOffreBackup(null);
  };

  // ── Publier ──
  const handlePublier = () => {
    if (isEditing) handleSauvegarder();
    setShowPublishAnim(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowPublishAnim(false);
      setShowConfetti(false);
      navigate("/offres");
    }, 3200);
  };

  // ── Supprimer ──
  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    navigate("/offres");
  };

  return (
    <div className="preview-wrapper">

      {showConfetti && <Confettis />}

      {/* ── Animation publication ── */}
      {showPublishAnim && (
        <div className="publish-overlay">
          <div className="publish-modal">
            <div className="publish-icon"><IconCheck /></div>
            <h2>Offre publiée ! 🎉</h2>
            <p>
              <strong>{offre.titre}</strong> chez <strong>{offre.entreprise}</strong> est
              maintenant visible par tous les candidats.
            </p>
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>Redirection en cours…</p>
          </div>
        </div>
      )}

      {/* ── Modal suppression ── */}
      {showDeleteModal && (
        <div className="delete-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="del-icon">🗑️</div>
            <h3>Supprimer l'offre ?</h3>
            <p>"<em>{offre.titre}</em>" sera définitivement supprimée.</p>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bannière mode édition ── */}
      {isEditing && (
        <div style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          padding: "12px 24px",
          borderRadius: "12px",
          marginBottom: "16px",
          fontSize: "14px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          maxWidth: "760px",
          width: "100%",
        }}>
          ✏️ Mode édition activé — Modifiez directement le contenu ci-dessous
        </div>
      )}

      {/* ── Badge brouillon ── */}
      {!isEditing && (
        <div className="preview-badge">
          <span className="dot" />
          Brouillon – non publié
        </div>
      )}

      {/* ── Carte principale ── */}
      <div className="preview-card">

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <input
                type="text"
                value={offre.titre}
                onChange={(e) => update("titre", e.target.value)}
                style={{
                  fontSize: "26px", fontWeight: 700, color: "#1a1a2e",
                  border: "2px solid #6366f1", borderRadius: "8px",
                  padding: "6px 12px", width: "100%",
                  fontFamily: "inherit", outline: "none", background: "#fafbff",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <h1>{offre.titre}</h1>
            )}
            <div style={{ marginTop: "6px" }}>
              <EditableText
                value={offre.entreprise}
                onChange={(v) => update("entreprise", v)}
                isEditing={isEditing}
                style={{ fontSize: "16px", color: "#6366f1", fontWeight: 600 }}
              />
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "13px", color: "#9ca3af" }}>
            <div>Publiée le {offre.publiee}</div>
            <div>Réf : {offre.ref}</div>
          </div>
        </div>

        {/* Tags infos clés */}
        <div className="preview-meta" style={{ marginTop: "16px" }}>
          {[
            { key: "contrat", emoji: "📋", bg: "#e8f4fd", color: "#0369a1" },
            { key: "lieu", emoji: "📍", bg: "#f0fdf4", color: "#166534" },
            { key: "salaire", emoji: "💶", bg: "#fdf4ff", color: "#7e22ce" },
            { key: "secteur", emoji: "🏢", bg: "#fff7ed", color: "#c2410c" },
          ].map(({ key, emoji, bg, color }) => (
            isEditing ? (
              <input
                key={key}
                type="text"
                value={offre[key]}
                onChange={(e) => update(key, e.target.value)}
                style={{
                  background: bg, color, fontSize: "13px", fontWeight: 500,
                  padding: "4px 12px", borderRadius: "20px",
                  border: `2px solid ${color}40`,
                  outline: "none", fontFamily: "inherit", minWidth: "80px",
                }}
              />
            ) : (
              <span key={key} className="preview-tag" style={{ background: bg, color }}>
                {emoji} {offre[key]}
              </span>
            )
          ))}
        </div>

        <hr className="preview-divider" />

        {/* Contexte */}
        <div className="preview-section-title">Contexte</div>
        <EditableText
          value={offre.contexte}
          onChange={(v) => update("contexte", v)}
          isEditing={isEditing}
          multiline
          style={{ display: "block", width: "100%" }}
        />
        {!isEditing && (
          <p className="preview-description">{offre.contexte}</p>
        )}

        <hr className="preview-divider" />

        {/* Missions */}
        <div className="preview-section-title">Missions</div>
        <EditableList
          items={offre.missions}
          onChange={(v) => update("missions", v)}
          isEditing={isEditing}
        />

        <hr className="preview-divider" />

        {/* Profil */}
        <div className="preview-section-title">Profil recherché</div>
        <EditableList
          items={offre.profil}
          onChange={(v) => update("profil", v)}
          isEditing={isEditing}
        />

        <hr className="preview-divider" />

        {/* Stack technique */}
        <div className="preview-section-title">Stack technique</div>
        <EditableTags
          items={offre.technos}
          onChange={(v) => update("technos", v)}
          isEditing={isEditing}
          tagStyle={{
            background: "#eef2ff", color: "#4338ca",
            fontSize: "13px", fontWeight: 500,
            padding: "5px 12px", borderRadius: "8px",
            border: "1px solid #c7d2fe",
          }}
        />

        <hr className="preview-divider" />

        {/* Avantages */}
        <div className="preview-section-title">Avantages</div>
        <EditableTags
          items={offre.avantages}
          onChange={(v) => update("avantages", v)}
          isEditing={isEditing}
          tagStyle={{
            background: "#f0fdf4", color: "#166534",
            fontSize: "13px", fontWeight: 500,
            padding: "5px 14px", borderRadius: "20px",
            border: "1px solid #bbf7d0",
          }}
        />

        <hr className="preview-divider" />

        {/* Étapes recrutement */}
        <div className="preview-section-title">Étapes de recrutement</div>
        {isEditing ? (
          <EditableList
            items={offre.etapesRecrutement}
            onChange={(v) => update("etapesRecrutement", v)}
            isEditing={isEditing}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {offre.etapesRecrutement.map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  minWidth: "28px", height: "28px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white", borderRadius: "50%",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "13px", fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: "14px", color: "#374151" }}>{e}</span>
              </div>
            ))}
          </div>
        )}

        <hr className="preview-divider" />

        {/* ── Barre d'actions ── */}
        <div className="preview-actions">

          {isEditing ? (
            <>
              {/* Mode édition : Sauvegarder + Annuler */}
              <button
                onClick={handleAnnuler}
                style={{
                  flex: 1, padding: "13px 20px",
                  border: "2px solid #e5e7eb", background: "white",
                  color: "#6b7280", fontSize: "15px", fontWeight: 600,
                  borderRadius: "10px", cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#f9fafb"}
                onMouseOut={(e) => e.currentTarget.style.background = "white"}
              >
                <IconX /> Annuler
              </button>

              <button
                onClick={handleSauvegarder}
                style={{
                  flex: 2, padding: "13px 20px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white", fontSize: "15px", fontWeight: 600,
                  border: "none", borderRadius: "10px", cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                  transition: "all 0.2s",
                }}
              >
                <IconSave /> Sauvegarder les modifications
              </button>
            </>
          ) : (
            <>
              {/* Mode normal : Modifier + Publier + Supprimer */}
              <button className="btn-modifier" onClick={handleModifier}>
                <IconEdit /> Modifier
              </button>
              <button className="btn-publier" onClick={handlePublier}>
                <IconSend /> Publier l'offre
              </button>
              <button className="btn-supprimer" onClick={() => setShowDeleteModal(true)}>
                <IconTrash />
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}