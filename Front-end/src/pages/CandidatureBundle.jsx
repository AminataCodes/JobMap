import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FiCheckCircle, FiClock, FiFileText,
  FiMail, FiMapPin, FiArrowLeft,
  FiBriefcase, FiCalendar, FiActivity
} from 'react-icons/fi'
import '../styles/CandidatureBundle.css'

const MOCK_CANDIDATS = {
  "101a": {
    id: "101a",
    nom: "Lucas Martin",
    email: "lucas.martin@hetic.net",
    telephone: "+33 6 12 34 56 78",
    formation: "HETIC - Mastère Tech & Web Development",
    competences: ["React.js", "TypeScript", "Node.js", "Docker", "Tailwind CSS"],
    bio: "Développeur passionné par les architectures Front-end scalables et l'optimisation des performances UI.",
    experience: "Stage 6 mois chez EdTech Core - Dev Junior Front",
    cvUrl: "#"
  },
  "102a": {
    id: "102a",
    nom: "Sarah Connor",
    email: "s.connor@hetic.net",
    telephone: "+33 7 99 88 77 66",
    formation: "HETIC - Bachelor Web UX/UI Design",
    competences: ["Figma", "Design System", "Prototypage Pro", "User Research"],
    bio: "Créatrice d'interfaces centrées utilisateur. Spécialisée dans la conception de plateformes SaaS.",
    experience: "Designer UI Freelance - 1 an (4 app mobiles)",
    cvUrl: "#"
  }
}

const MOCK_CANDIDATURES = [
  { id: 1, candidatId: "101a", poste: "Développeur Front-end React", entreprise: "TechScale", lieu: "Paris (Hybride)", type: "Alternance", date: "25 mai 2026", statut: "Entretien RH" },
  { id: 2, candidatId: "102a", poste: "Product Designer UI/UX", entreprise: "Studio Pulse", lieu: "Lyon", type: "Stage", date: "24 mai 2026", statut: "Dossier en cours" },
  { id: 3, candidatId: "101a", poste: "Développeur React Native", entreprise: "AppFactory", lieu: "Full Remote", type: "CDI", date: "20 mai 2026", statut: "En attente" },
]

const TIMELINE_STEPS = [
  { label: "Candidature envoyée", desc: "Votre dossier a bien été transmis." },
  { label: "Sélection sur CV", desc: "Le recruteur étudie votre profil." },
  { label: "Entretiens & Tests", desc: "Échanges techniques et RH en cours." },
  { label: "Décision finale", desc: "Validation ou feedback constructif." },
]

const STATUS_CONFIG = {
  "Entretien RH":       { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  step: 2 },
  "Entretien manager":  { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  step: 2 },
  "Dossier en cours":   { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  step: 1 },
  "En attente":         { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   step: 0 },
  "Signature contrat":  { color: "#10b981", bg: "rgba(16,185,129,0.1)",  step: 3 },
  "Refusé":             { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   step: 0 },
}

// ==========================================
// 1. VUE ÉTUDIANT — LISTE + TIMELINE
// ==========================================
export function Candidatures() {
  const [selected, setSelected] = useState(MOCK_CANDIDATURES[0])
  const config = STATUS_CONFIG[selected.statut] || STATUS_CONFIG["En attente"]
  const currentStep = config.step

  return (
    <div className="cand-page">

      {/* HEADER */}
      <div className="cand-header">
        <div>
          <h1>Mes candidatures</h1>
          <p>{MOCK_CANDIDATURES.length} candidatures en cours</p>
        </div>
        <div className="cand-header-stat">
          <FiActivity size={16} />
          <span>{MOCK_CANDIDATURES.filter(c => c.statut === "Entretien RH" || c.statut === "Entretien manager").length} entretien(s) à venir</span>
        </div>
      </div>

      <div className="cand-layout">

        {/* SIDEBAR */}
        <div className="cand-sidebar">
          {MOCK_CANDIDATURES.map(app => {
            const cfg = STATUS_CONFIG[app.statut] || STATUS_CONFIG["En attente"]
            return (
              <div
                key={app.id}
                className={`cand-card ${selected.id === app.id ? 'cand-card--active' : ''}`}
                onClick={() => setSelected(app)}
              >
                <div className="cand-card-top">
                  <span className="cand-type-tag">{app.type}</span>
                  <span
                    className="cand-status-dot"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {app.statut}
                  </span>
                </div>
                <h3>{app.poste}</h3>
                <p>{app.entreprise}</p>
                <div className="cand-card-meta">
                  <span><FiMapPin size={12} /> {app.lieu}</span>
                  <span><FiCalendar size={12} /> {app.date}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* DETAIL */}
        <div className="cand-detail">

          {/* TITRE */}
          <div className="cand-detail-header">
            <div>
              <h2>{selected.poste}</h2>
              <span className="cand-detail-company">
                <FiBriefcase size={14} /> {selected.entreprise} &nbsp;·&nbsp;
                <FiMapPin size={14} /> {selected.lieu} &nbsp;·&nbsp;
                <FiCalendar size={14} /> Envoyé le {selected.date}
              </span>
            </div>
            <span
              className="cand-status-big"
              style={{
                background: (STATUS_CONFIG[selected.statut] || STATUS_CONFIG["En attente"]).bg,
                color: (STATUS_CONFIG[selected.statut] || STATUS_CONFIG["En attente"]).color,
              }}
            >
              {selected.statut}
            </span>
          </div>

          {/* TIMELINE */}
          <div className="cand-timeline">
            {TIMELINE_STEPS.map((step, i) => {
              const done = i < currentStep
              const active = i === currentStep
              return (
                <div key={i} className={`cand-tl-node ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                  <div className="cand-tl-line-wrap">
                    <div className="cand-tl-dot">
                      {done
                        ? <FiCheckCircle size={14} />
                        : active
                          ? <FiClock size={14} />
                          : <span>{i + 1}</span>
                      }
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && <div className="cand-tl-line" />}
                  </div>
                  <div className="cand-tl-text">
                    <strong>{step.label}</strong>
                    <span>{step.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. VUE RECRUTEUR — TABLEAU
// ==========================================
export function CandidaturesPage() {
  const navigate = useNavigate()
  return (
    <div className="cand-page">
      <div className="cand-header">
        <div>
          <h1>Candidatures reçues</h1>
          <p>{MOCK_CANDIDATURES.length} candidats ont postulé à vos offres</p>
        </div>
      </div>

      <div className="cand-table-wrap">
        <table className="cand-table">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Poste visé</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CANDIDATURES.map((c) => {
              const candidat = MOCK_CANDIDATS[c.candidatId]
              const cfg = STATUS_CONFIG[c.statut] || STATUS_CONFIG["En attente"]
              return (
                <tr key={c.id}>
                  <td>
                    <div className="cand-identity">
                      <div className="cand-avatar">{candidat.nom[0]}</div>
                      <div>
                        <strong>{candidat.nom}</strong>
                        <small>{candidat.formation}</small>
                      </div>
                    </div>
                  </td>
                  <td>{c.poste}</td>
                  <td>{c.date}</td>
                  <td>
                    <span className="cand-badge" style={{ background: cfg.bg, color: cfg.color }}>
                      {c.statut}
                    </span>
                  </td>
                  <td>
                    <button
                      className="cand-btn-eval"
                      onClick={() => navigate(`/candidaturedetail/`)}
                    >
                      Évaluer →
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ==========================================
// 3. VUE RECRUTEUR — DÉTAIL
// ==========================================
export function CandidatureDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const candidature = MOCK_CANDIDATURES.find(c => c.id === parseInt(id)) || MOCK_CANDIDATURES[0]
  const candidat = MOCK_CANDIDATS[candidature.candidatId]
  const [currentStatut, setCurrentStatut] = useState(candidature.statut)

  return (
    <div className="cand-page">
      <button className="cand-back-btn" onClick={() => navigate('/candidatures')}>
        <FiArrowLeft size={15} /> Retour
      </button>

      <div className="cand-detail-split">

        {/* RÉSUMÉ CANDIDAT */}
        <div className="cand-resume-panel">
          <div className="cand-resume-top">
            <div className="cand-big-avatar">{candidat.nom[0]}</div>
            <div>
              <h2>{candidat.nom}</h2>
              <p>{candidat.formation}</p>
            </div>
          </div>

          <div className="cand-resume-section">
            <h4>À propos</h4>
            <p>{candidat.bio}</p>
          </div>

          <div className="cand-resume-section">
            <h4>Compétences</h4>
            <div className="cand-skills">
              {candidat.competences.map((s, i) => (
                <span key={i} className="cand-skill-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="cand-resume-section">
            <h4>Expérience</h4>
            <p>{candidat.experience}</p>
          </div>

          <div className="cand-resume-section">
            <h4>Contact</h4>
            <p><FiMail size={13} /> {candidat.email}</p>
            <p><FiMapPin size={13} /> Paris, France</p>
          </div>

          <a href={candidat.cvUrl} className="cand-cv-btn" download>
            <FiFileText size={15} /> Télécharger le CV
          </a>
        </div>

        {/* ACTIONS */}
        <div className="cand-action-panel">
          <h3>Mettre à jour le statut</h3>
          <p>La timeline de l'étudiant sera mise à jour automatiquement.</p>

          <label>Statut de la candidature</label>
          <select
            value={currentStatut}
            onChange={(e) => setCurrentStatut(e.target.value)}
            className="cand-select"
          >
            <option value="En attente">En attente</option>
            <option value="Dossier en cours">Dossier en cours</option>
            <option value="Entretien RH">Entretien RH</option>
            <option value="Entretien manager">Entretien manager</option>
            <option value="Signature contrat">Signature contrat</option>
            <option value="Refusé">Refusé</option>
          </select>

          <button
            className="cand-btn-save"
            onClick={() => alert('Statut mis à jour !')}
          >
            Enregistrer
          </button>

          <button
            className="cand-btn-interview"
            onClick={() => navigate('/entretiens', {
              state: {
                candidatureId: candidature.id,
                candidateName: candidat.nom,
                poste: candidature.poste,
                email: candidat.email
              }
            })}
          >
            <FiCalendar size={15} /> Planifier un entretien
          </button>
        </div>

      </div>
    </div>
  )
}

// ==========================================
// 4. FORMULAIRE CANDIDATURE
// ==========================================
export function Candidature() {
  const { id: annonceId } = useParams()
  const [formData, setFormData] = useState({
    nomCandidat: "", prenom: "", lettreMotivation: null, messageAdditionnel: "",
  })
  const [messageEnvoye, setMessageEnvoye] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({ ...formData, [name]: files ? files[0] : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append("nomCandidat", formData.nomCandidat)
      data.append("prenom", formData.prenom)
      data.append("messageAdditionnel", formData.messageAdditionnel)
      data.append("lettreMotivation", formData.lettreMotivation)
      const response = await fetch(`http://localhost:3000/api/annonce/${annonceId}/candidature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: data,
      })
      const result = await response.json()
      if (response.ok) setMessageEnvoye(true)
      else alert(result.error)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="cand-form-page">
      <div className="cand-form-card">
        <h2>Formulaire de candidature</h2>
        <p>Complétez les informations ci-dessous pour postuler.</p>

        <form onSubmit={handleSubmit} className="cand-form">
          <div className="cand-form-row">
            <input type="text" name="nomCandidat" placeholder="Nom" onChange={handleChange} required />
            <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
          </div>

          <label className="cand-upload">
            <input type="file" name="lettreMotivation" onChange={handleChange} required />
            <FiFileText size={20} />
            <span>{formData.lettreMotivation ? formData.lettreMotivation.name : "Déposez votre lettre de motivation"}</span>
          </label>

          <textarea
            name="messageAdditionnel"
            placeholder="Message complémentaire (optionnel)..."
            onChange={handleChange}
          />

          <button type="submit" className="cand-form-submit">Soumettre ma candidature</button>

          {messageEnvoye && (
            <div className="cand-toast">
              <FiCheckCircle /> Candidature transmise avec succès !
            </div>
          )}
        </form>
      </div>
    </div>
  )
}