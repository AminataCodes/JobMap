import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FiCheckCircle, FiClock } from "react-icons/fi"
import "../styles/CandidatureBundle.css"
import { useNavigate } from "react-router-dom"

/* =========================
   MOCK CANDIDATURES
========================= */

const MOCK_CANDIDATURES = [
  {
    id: "1",
    poste: "Développeur Front-end React",
    entreprise: "TechScale",
    date: "2026-05-25",
    statut: "Dossier en cours"
  },
  {
    id: "2",
    poste: "UX/UI Designer",
    entreprise: "Studio Pulse",
    date: "2026-05-24",
    statut: "Entretien RH"
  },
  {
    id: "3",
    poste: "Data Analyst",
    entreprise: "DataVision",
    date: "2026-05-20",
    statut: "Entretien manager"
  }
]

/* =========================
   TIMELINE
========================= */

const TIMELINE_STEPS = [
  { id: 1, label: "Candidature envoyée", desc: "Dossier transmis à l'entreprise." },
  { id: 2, label: "Sélection CV", desc: "Analyse du profil par le recruteur." },
  { id: 3, label: "Entretiens", desc: "Tests techniques et RH." },
  { id: 4, label: "Décision finale", desc: "Réponse finale de l'entreprise." }
]

/* ==========================================
   1. PAGE : LISTE + SUIVI ÉTUDIANT
========================================== */

export function Candidatures() {
  const [selected, setSelected] = useState(MOCK_CANDIDATURES[0])

  const getStep = (statut) => {
    if (statut === "Dossier en cours") return 1
    if (statut === "Entretien RH") return 2
    if (statut === "Entretien manager") return 3
    return 0
  }

  const currentStep = getStep(selected.statut)

  return (
    <div className="cand-page">

      {/* HEADER */}
      <div className="cand-header">
        <div className="cand-header-left">
          <div className="cand-badge-count">
            {MOCK_CANDIDATURES.length}
          </div>
          <div>
            <h1>Mes candidatures</h1>
            <p>Suivi en temps réel de tes candidatures</p>
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="cand-layout">

        {/* LISTE */}
        <div className="cand-list">
          {MOCK_CANDIDATURES.map((c) => (
            <div
              key={c.id}
              className={`cand-card ${selected.id === c.id ? "active" : ""}`}
              onClick={() => setSelected(c)}
            >
              <div className="cand-card-top">
                <div className="cand-card-icon">💼</div>

                <div className="cand-card-info">
                  <h4>{c.poste}</h4>
                  <span>{c.entreprise}</span>
                </div>
              </div>

              <div className="cand-card-bottom">
                <div className="cand-date">
                  <FiClock size={12} />
                  {c.date}
                </div>
              </div>

              <div className="cand-status-bar">
                <span className="cand-statut statut-1">
                  {c.statut}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DETAIL */}
        <div className="cand-detail">

          <div className="cand-detail-header">
            <div>
              <h2>{selected.poste}</h2>
              <div className="cand-detail-meta">
                <span>🏢 {selected.entreprise}</span>
                <span>📅 {selected.date}</span>
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="cand-timeline">
            <h3>Suivi du processus</h3>

            <div className="timeline-track">
              {TIMELINE_STEPS.map((step, index) => {
                const done = index < currentStep
                const current = index === currentStep

                return (
                  <div
                    key={step.id}
                    className={`tl-node ${done ? "done" : ""} ${current ? "current" : ""}`}
                  >
                    <div className="tl-connector">
                      <div className="tl-dot">
                        {done ? <FiCheckCircle /> : <FiClock />}
                      </div>
                      {index !== TIMELINE_STEPS.length - 1 && (
                        <div className="tl-line"></div>
                      )}
                    </div>

                    <div className="tl-content">
                      <strong>{step.label}</strong>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ==========================================
   2. FORMULAIRE CANDIDATURE
========================================== */

export function Candidature() {
  const { id } = useParams()

  const [formData, setFormData] = useState({
    lettre: null,
    message: ""
  })

  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append("offreId", id)                  // ✅ Bug 2 corrigé
    data.append("message", formData.message)
    data.append("lettre", formData.lettre)

    try {
      const res = await fetch(
        `http://localhost:3000/api/candidatures`,  // ✅ Bug 1 corrigé
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: data
        }
      )

      if (res.ok) {
        setSuccess(true)
      } else {
        const err = await res.json()
        console.error("Erreur API :", err)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="cand-page">
      <div className="bundle-card max-600">
        <h2>Postuler à une offre</h2>

        <form onSubmit={handleSubmit} className="bundle-form">

          <label className="bundle-upload">
            <input
              type="file"
              name="lettre"
              onChange={handleChange}
              required
              style={{ display: "none" }}
            />
            <span>
              {formData.lettre ? formData.lettre.name : "📎 Lettre de motivation"}
            </span>
          </label>

          <textarea
            name="message"
            placeholder="Message additionnel (optionnel)..."
            onChange={handleChange}
          />

          <button type="submit" className="btn-submit">
            Envoyer ma candidature
          </button>

          {success && (
            <div className="toast-success">
              <FiCheckCircle />
              Candidature envoyée avec succès !
            </div>
          )}

        </form>
      </div>
    </div>
  )
}

export function MesCandidatures() {
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/candidatures", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })

        const data = await res.json()
        setCandidatures(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="page">Chargement...</div>
  }

  return (
    <div className="page">
      <h2>Mes candidatures</h2>

      <div className="cards-grid">
        {candidatures.map((c) => (
          <div key={c.id} className="cand-card">

            {/* Entreprise */}
            <h3 className="company">
              {c.offre?.nomEntreprise}
            </h3>

            {/* Poste */}
            <p className="role">
              💼 {c.offre?.nomPoste}
            </p>

            {/* Date */}
            <p className="date">
              📅 {new Date(c.createdAt).toLocaleDateString("fr-FR")}
            </p>

            {/* Bouton voir offre */}
            <button
              className="btn-view"
              onClick={() => navigate(`/offres/${c.offreId}`)}
            >
              Voir l'offre
            </button>

          </div>
        ))}
      </div>
    </div>
  )
}