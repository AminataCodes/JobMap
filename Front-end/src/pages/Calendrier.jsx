import { useState, useEffect } from 'react'
import '../styles/Calendrier.css'
import { useAuth } from '../context/AuthContext'
import { getMesRendezVous } from '../services/api'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function rdvToEvent(rdv) {
  const date = new Date(rdv.dateProposee)
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const heure = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  const nomPoste = rdv.candidature?.annonce?.nomPoste || 'Entretien'
  const nomEntreprise = rdv.candidature?.annonce?.nomEntreprise || ''
  return {
    id: rdv.id,
    date: dateKey,
    heure,
    title: nomEntreprise ? `Entretien – ${nomEntreprise}` : nomPoste,
    type: 'entretien',
    statut: rdv.statut,
    lieu: rdv.lieu,
    lienVisio: rdv.lienVisio,
    message: rdv.message,
    isFromBackend: true
  }
}

function AddEventModal({ date, onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', type: 'entretien', heure: '09:00' })

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onAdd({ ...form, date, id: Date.now() })
    onClose()
  }

  return (
    <div className="cal__modal-overlay" onClick={onClose}>
      <div className="cal__modal" onClick={e => e.stopPropagation()}>
        <div className="cal__modal-header">
          <h3>Ajouter un événement</h3>
          <button className="cal__modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cal__modal-body">
          <label>Titre</label>
          <input
            className="cal__input"
            type="text"
            placeholder="Ex : Entretien chez Google"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <label>Heure</label>
          <input
            className="cal__input"
            type="time"
            value={form.heure}
            onChange={e => setForm(f => ({ ...f, heure: e.target.value }))}
          />
          <label>Type</label>
          <select
            className="cal__input"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          >
            <option value="entretien">Entretien</option>
            <option value="test">Test technique</option>
            <option value="relance">Relance</option>
            <option value="deadline">Deadline</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="cal__modal-footer">
          <button className="cal__btn cal__btn--secondary" onClick={onClose}>Annuler</button>
          <button className="cal__btn cal__btn--primary" onClick={handleSubmit}>Ajouter</button>
        </div>
      </div>
    </div>
  )
}

function RdvDetailModal({ event, onClose }) {
  return (
    <div className="cal__modal-overlay" onClick={onClose}>
      <div className="cal__modal" onClick={e => e.stopPropagation()}>
        <div className="cal__modal-header">
          <h3>📅 Détail du rendez-vous</h3>
          <button className="cal__modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cal__modal-body">
          <div className="rdv-detail-row">
            <span className="rdv-detail-label">💼 Poste</span>
            <span className="rdv-detail-value">{event.title}</span>
          </div>
          <div className="rdv-detail-row">
            <span className="rdv-detail-label">📅 Date</span>
            <span className="rdv-detail-value">{event.date} à {event.heure}</span>
          </div>
          <div className="rdv-detail-row">
            <span className="rdv-detail-label">📊 Statut</span>
            <span className={`rdv-statut-badge rdv-statut--${event.statut?.toLowerCase()}`}>
              {event.statut === 'EN_ATTENTE' ? '⏳ En attente' :
               event.statut === 'ACCEPTE' ? '✅ Accepté' : '❌ Refusé'}
            </span>
          </div>
          {event.lienVisio && (
            <div className="rdv-detail-row">
              <span className="rdv-detail-label">💻 Visio</span>
              <a href={event.lienVisio} target="_blank" rel="noreferrer" className="rdv-visio-link">
                Rejoindre la réunion →
              </a>
            </div>
          )}
          {event.lieu && (
            <div className="rdv-detail-row">
              <span className="rdv-detail-label">📍 Lieu</span>
              <span className="rdv-detail-value">{event.lieu}</span>
            </div>
          )}
          {event.message && (
            <div className="rdv-detail-row rdv-detail-row--column">
              <span className="rdv-detail-label">💬 Message</span>
              <p className="rdv-detail-message">"{event.message}"</p>
            </div>
          )}
        </div>
        <div className="cal__modal-footer">
          <button className="cal__btn cal__btn--secondary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}

function Calendrier() {
  const today = new Date()
  const { user } = useAuth()

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [events, setEvents] = useState([])
  const [rdvLoading, setRdvLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selectedDay, setSelectedDay] = useState(formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()))
  const [detailEvent, setDetailEvent] = useState(null)

  // ─── Charge les RDV depuis le backend via api.js ───
  useEffect(() => {
    const fetchRdvs = async () => {
      try {
        const data = await getMesRendezVous()
        setEvents(data.map(rdvToEvent))
      } catch (err) {
        console.error('Erreur RDV calendrier : ', err)
      } finally {
        setRdvLoading(false)
      }
    }
    fetchRdvs()
  }, [])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const goToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setSelectedDay(formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()))
  }

  const getEventsForDate = (dateKey) => events.filter(e => e.date === dateKey)

  const handleDayClick = (day) => {
    setSelectedDay(formatDateKey(viewYear, viewMonth, day))
  }

  const handleDayDblClick = (day) => {
    setModal(formatDateKey(viewYear, viewMonth, day))
  }

  const addEvent = (event) => setEvents(ev => [...ev, event])

  const removeEvent = (id) => setEvents(ev => ev.filter(e => e.id !== id || e.isFromBackend))

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const focusDate = selectedDay || formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
  const focusEvents = getEventsForDate(focusDate)
  const monthEvents = events.filter(e =>
    e.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)
  )

  return (
    <div className="cal__page">
      <main className="cal__main">

        <div className="cal__header">
          <div>
            <h1 className="cal__title">Calendrier</h1>
            <p className="cal__subtitle">Vos entretiens planifiés par les recruteurs</p>
          </div>
          <div className="cal__header-actions">
            <button className="cal__btn cal__btn--ghost" onClick={goToday}>Aujourd'hui</button>
            <button className="cal__btn cal__btn--primary" onClick={() => setModal(focusDate)}>+ Ajouter</button>
          </div>
        </div>

        {rdvLoading && (
          <div className="cal__loading-bar">⏳ Chargement de vos rendez-vous...</div>
        )}

        <div className="cal__stats">
          {[
            { label: 'Ce mois', value: monthEvents.length, color: 'blue' },
            { label: 'Entretiens', value: monthEvents.filter(e => e.type === 'entretien').length, color: 'green' },
            { label: 'En attente', value: monthEvents.filter(e => e.statut === 'EN_ATTENTE').length, color: 'orange' },
            { label: 'Confirmés', value: monthEvents.filter(e => e.statut === 'ACCEPTE').length, color: 'purple' },
          ].map(s => (
            <div key={s.label} className={`cal__stat cal__stat--${s.color}`}>
              <span className="cal__stat-value">{s.value}</span>
              <span className="cal__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="cal__content">
          <div className="cal__grid-wrap">
            <div className="cal__nav">
              <button className="cal__nav-btn" onClick={prevMonth}>‹</button>
              <h2 className="cal__month-title">{MOIS[viewMonth]} {viewYear}</h2>
              <button className="cal__nav-btn" onClick={nextMonth}>›</button>
            </div>

            <div className="cal__weekdays">
              {JOURS.map(j => <div key={j} className="cal__weekday">{j}</div>)}
            </div>

            <div className="cal__grid">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="cal__day cal__day--empty" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateKey = formatDateKey(viewYear, viewMonth, day)
                const dayEvents = getEventsForDate(dateKey)
                const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
                const isSelected = selectedDay === dateKey

                return (
                  <div
                    key={day}
                    className={`cal__day ${isToday ? 'cal__day--today' : ''} ${isSelected ? 'cal__day--selected' : ''} ${dayEvents.length > 0 ? 'cal__day--has-events' : ''}`}
                    onClick={() => handleDayClick(day)}
                    onDoubleClick={() => handleDayDblClick(day)}
                  >
                    <span className="cal__day-num">{day}</span>
                    <div className="cal__day-dots">
                      {dayEvents.slice(0, 3).map(ev => (
                        <span key={ev.id} className={`cal__dot cal__dot--${ev.type}`} />
                      ))}
                      {dayEvents.length > 3 && <span className="cal__dot-more">+{dayEvents.length - 3}</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cal__legend">
              {[
                { type: 'entretien', label: 'Entretien planifié' },
                { type: 'test', label: 'Test' },
                { type: 'relance', label: 'Relance' },
                { type: 'deadline', label: 'Deadline' },
                { type: 'autre', label: 'Autre' },
              ].map(l => (
                <div key={l.type} className="cal__legend-item">
                  <span className={`cal__dot cal__dot--${l.type}`} />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cal__panel">
            <div className="cal__panel-header">
              <h3>
                {focusDate === formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
                  ? "Aujourd'hui"
                  : `${focusDate.split('-')[2]} ${MOIS[parseInt(focusDate.split('-')[1]) - 1]}`}
              </h3>
              <span className="cal__panel-count">{focusEvents.length} événement{focusEvents.length !== 1 ? 's' : ''}</span>
            </div>

            {focusEvents.length === 0 ? (
              <div className="cal__panel-empty">
                <div className="cal__panel-empty-icon">📅</div>
                <p>Aucun événement ce jour</p>
                <button className="cal__btn cal__btn--ghost" onClick={() => setModal(focusDate)}>+ Ajouter un événement</button>
              </div>
            ) : (
              <div className="cal__panel-events">
                {focusEvents.map(ev => (
                  <div
                    key={ev.id}
                    className={`cal__panel-event cal__panel-event--${ev.type} ${ev.isFromBackend ? 'cal__panel-event--rdv' : ''}`}
                    onClick={() => ev.isFromBackend && setDetailEvent(ev)}
                  >
                    <div className="cal__panel-event-bar" />
                    <div className="cal__panel-event-info">
                      <span className="cal__panel-event-title">{ev.title}</span>
                      <span className="cal__panel-event-heure">🕐 {ev.heure}</span>
                      {ev.isFromBackend && (
                        <span className={`cal__rdv-statut cal__rdv-statut--${ev.statut?.toLowerCase()}`}>
                          {ev.statut === 'EN_ATTENTE' ? '⏳ En attente de confirmation'
                           : ev.statut === 'ACCEPTE' ? '✅ Confirmé'
                           : '❌ Refusé'}
                        </span>
                      )}
                    </div>
                    {ev.isFromBackend ? (
                      <button
                        className="cal__panel-event-detail-btn"
                        onClick={(e) => { e.stopPropagation(); setDetailEvent(ev) }}
                        title="Voir détails"
                      >→</button>
                    ) : (
                      <button className="cal__panel-event-remove" onClick={() => removeEvent(ev.id)} title="Supprimer">✕</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {modal && <AddEventModal date={modal} onClose={() => setModal(null)} onAdd={addEvent} />}
        {detailEvent && <RdvDetailModal event={detailEvent} onClose={() => setDetailEvent(null)} />}

      </main>
    </div>
  )
}

export default Calendrier