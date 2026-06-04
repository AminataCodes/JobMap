import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Entreprise.css'
import { useAuth } from '../context/AuthContext'

const STATUTS = ['Nouvelle', 'En cours', 'Entretien RH', 'Entretien manager', 'Refusée', 'Acceptée']

const STATUT_CONFIG = {
  'Nouvelle':          { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  'En cours':          { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  'Entretien RH':      { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  'Entretien manager': { color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  'Refusée':           { color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
  'Acceptée':          { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
}

// Convertit un statut backend → statut affichage
function statutBackendToDisplay(statut) {
  const map = {
    'EN_ATTENTE': 'Nouvelle',
    'ACCEPTEE':   'Acceptée',
    'REJETEE':    'Refusée',
  }
  return map[statut] || 'Nouvelle'
}

function Avatar({ name }) {
  const initials = (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  return <div className="ent__avatar">{initials}</div>
}

function StatutBadge({ statut }) {
  const c = STATUT_CONFIG[statut] || { color: '#64748B', bg: 'rgba(100,116,139,0.12)' }
  return (
    <span className="ent__badge" style={{ color: c.color, background: c.bg }}>
      {statut}
    </span>
  )
}

function DetailPanel({ candidature, onClose, onStatutChange, onNoteChange }) {
  const navigate = useNavigate()
  if (!candidature) return null

  const handleGoToScheduler = () => {
    navigate('/appointment', {
      state: {
        candidatureId: candidature.id,
        candidateName: candidature.candidat,
        poste: candidature.poste,
        email: candidature.email
      }
    })
  }

  const besoinEntretien =
    candidature.statut === 'Entretien RH' ||
    candidature.statut === 'Entretien manager'

  return (
    <div className="ent__panel">
      <div className="ent__panel-header">
        <h3>Dossier & Évaluation</h3>
        <button className="ent__panel-close" onClick={onClose}>✕</button>
      </div>

      <div className="ent__panel-body">
        <div className="ent__panel-section">
          <Avatar name={candidature.candidat} />
          <div>
            <div className="ent__panel-name">{candidature.candidat}</div>
            <div className="ent__panel-sub">{candidature.email}</div>
            <div className="ent__panel-sub">{candidature.niveau}</div>
          </div>
        </div>

        <div className="ent__panel-field">
          <span className="ent__panel-label">Poste visé</span>
          <span className="ent__panel-value">{candidature.poste}</span>
        </div>

        <div className="ent__panel-field">
          <span className="ent__panel-label">CV</span>
          {candidature.cvUrl
            ? <a href={candidature.cvUrl} target="_blank" rel="noreferrer" className="ent__cv-link">📄 Consulter le CV</a>
            : <span className="ent__panel-value" style={{ color: 'var(--text-muted)' }}>Non fourni</span>
          }
        </div>

        <hr className="ent__divider" />

        <h4 className="ent__panel-section-title">📝 Évaluation du candidat</h4>

        <div className="ent__panel-field">
          <span className="ent__panel-label">Étape du processus</span>
          <select
            className="ent__select"
            value={candidature.statut}
            onChange={e => onStatutChange(candidature.id, e.target.value)}
          >
            {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="ent__panel-field">
          <span className="ent__panel-label">Notes et commentaires</span>
          <textarea
            className="ent__textarea"
            placeholder="Ajouter des observations sur le profil..."
            value={candidature.note}
            onChange={e => onNoteChange(candidature.id, e.target.value)}
          />
        </div>

        {besoinEntretien && (
          <div className="ent__workflow-block">
            <p className="ent__workflow-text">
              🎯 Profil validé pour : <strong>{candidature.statut}</strong>.
              Bloquez un créneau dans l'agenda.
            </p>
            <button className="ent__workflow-btn" onClick={handleGoToScheduler}>
              📅 Planifier le rendez-vous
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function EntreprisePage() {
  const { user } = useAuth()
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtre, setFiltre]   = useState('Tous')
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)

  // ─── Charge les vraies candidatures depuis le backend ───
  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/candidatures', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Erreur chargement candidatures')
        const data = await res.json()

        // Adapte le format backend → format affichage
        const formatted = data.map(c => ({
          id: c.id,                                                          // String UUID ✅
          candidat: `${c.etudiant?.prenom || ''} ${c.etudiant?.nom || ''}`.trim() || 'Inconnu',
          email: c.etudiant?.email || '',
          niveau: c.etudiant?.niveauEtude || '',
          poste: c.annonce?.nomPoste || '',
          date: c.createdAt,
          statut: statutBackendToDisplay(c.statut),
          cvUrl: c.cvUrl || null,
          note: '',
        }))

        setCandidatures(formatted)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidatures()
  }, [])

  const updateStatut = (id, statut) => {
    setCandidatures(cs => cs.map(c => c.id === id ? { ...c, statut } : c))
    setSelected(s => s?.id === id ? { ...s, statut } : s)
  }

  const updateNote = (id, note) => {
    setCandidatures(cs => cs.map(c => c.id === id ? { ...c, note } : c))
    setSelected(s => s?.id === id ? { ...s, note } : s)
  }

  const filtered = candidatures
    .filter(c => filtre === 'Tous' || c.statut === filtre)
    .filter(c =>
      c.candidat.toLowerCase().includes(search.toLowerCase()) ||
      c.poste.toLowerCase().includes(search.toLowerCase())
    )

  const stats = [
    { label: 'Total',      value: candidatures.length,                                               color: '#2563EB' },
    { label: 'Nouvelles',  value: candidatures.filter(c => c.statut === 'Nouvelle').length,          color: '#3B82F6' },
    { label: 'En cours',   value: candidatures.filter(c => c.statut === 'En cours').length,          color: '#F59E0B' },
    { label: 'Entretiens', value: candidatures.filter(c => c.statut.startsWith('Entretien')).length, color: '#8B5CF6' },
    { label: 'Acceptées',  value: candidatures.filter(c => c.statut === 'Acceptée').length,          color: '#10B981' },
  ]

  return (
    <div className="ent-layout">
      <main className={`ent__main ${selected ? 'ent__main--split' : ''}`}>

        <div className="ent__header">
          <div>
            <h1 className="ent__title">Candidatures reçues</h1>
            <p className="ent__subtitle">Gérez et suivez les candidats pour vos offres</p>
          </div>
        </div>

        <div className="ent__stats">
          {stats.map(s => (
            <div key={s.label} className="ent__stat">
              <span className="ent__stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="ent__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {loading && <div className="cal__loading-bar">⏳ Chargement des candidatures...</div>}
        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="ent__body">
          <div className="ent__list-wrap">

            <div className="ent__toolbar">
              <input
                className="ent__search"
                type="text"
                placeholder="🔍  Rechercher un candidat ou un poste..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="ent__filtres">
                {['Tous', ...STATUTS].map(s => (
                  <button
                    key={s}
                    className={`ent__filtre ${filtre === s ? 'ent__filtre--active' : ''}`}
                    onClick={() => setFiltre(s)}
                    style={filtre === s && STATUT_CONFIG[s]
                      ? { background: STATUT_CONFIG[s].color, borderColor: STATUT_CONFIG[s].color }
                      : {}
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="ent__table">
              <div className="ent__table-head">
                <span>Candidat</span>
                <span>Poste</span>
                <span>Date</span>
                <span>Statut</span>
                <span>CV</span>
              </div>

              {!loading && filtered.length === 0 ? (
                <div className="ent__empty">Aucune candidature trouvée</div>
              ) : (
                filtered.map(c => (
                  <div
                    key={c.id}
                    className={`ent__row ${selected?.id === c.id ? 'ent__row--active' : ''}`}
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  >
                    <div className="ent__row-candidat">
                      <Avatar name={c.candidat} />
                      <div>
                        <div className="ent__row-name">{c.candidat}</div>
                        <div className="ent__row-sub">{c.niveau}</div>
                      </div>
                    </div>
                    <span className="ent__row-poste">{c.poste}</span>
                    <span className="ent__row-date">
                      {new Date(c.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                    <StatutBadge statut={c.statut} />
                    <span className="ent__row-cv">{c.cvUrl ? '📄' : '—'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {selected && (
            <DetailPanel
              candidature={selected}
              onClose={() => setSelected(null)}
              onStatutChange={updateStatut}
              onNoteChange={updateNote}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default EntreprisePage