import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiVideo, FiMapPin, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/Appointement.css';

const CRENEAUX_DISPOS = [
  { id: 1, heure: '09:00', dispo: true },
  { id: 2, heure: '10:30', dispo: true },
  { id: 3, heure: '14:00', dispo: false },
  { id: 4, heure: '15:30', dispo: true },
  { id: 5, heure: '17:00', dispo: true },
];

function AppointmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const candidateInfo = location.state || {
    candidatureId: null,
    candidatName: 'Candidat',
    poste: 'Poste non défini',
    email: 'contact@hetic.net'
  };

  const [selectedDate, setSelectedDate] = useState('2026-06-02');
  const [selectedTime, setSelectedTime] = useState(null);
  const [meetingType, setMeetingType] = useState('visio');
  const [message, setMessage] = useState('');
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmMeeting = async (e) => {
    e.preventDefault();
    if (!selectedTime) return;

    if (!candidateInfo.candidatureId) {
      setError("ID de candidature manquant. Retournez au dashboard et réessayez.");
      return;
    }

    if (!user || user.role !== 'entreprise') {
      setError("Vous devez être connecté en tant qu'entreprise pour planifier un entretien.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dateProposee = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      const token = localStorage.getItem('token');

      // ✅ On passe par le proxy Vite /api (plus de localhost:3000)
      const response = await fetch('/api/rendezvous/proposer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          candidatureId: candidateInfo.candidatureId,   // ✅ UUID String venant du backend
          dateProposee,
          lieu: meetingType === 'on-site' ? 'Campus HETIC - Montreuil' : null,
          lienVisio: meetingType === 'visio' ? 'https://meet.google.com/generated-link' : null,
          message: message || `Entretien pour le poste : ${candidateInfo.poste}`
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erreur lors de la création du rendez-vous');
      }

      setBooked(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── PAGE SUCCÈS ───────────────────────────────────────
  if (booked) {
    return (
      <div className="appointment-success-card">
        <div className="success-icon-animation"><FiCheckCircle /></div>
        <h2>Entretien Planifié !</h2>
        <p>
          Une invitation a été envoyée à <strong>{candidateInfo.email}</strong>.
        </p>

        <div className="summary-box-premium">
          <h4>Récapitulatif du rendez-vous</h4>
          <p>👤 <strong>Candidat :</strong> {candidateInfo.candidateName}</p>
          <p>💼 <strong>Poste :</strong> {candidateInfo.poste}</p>
          <p>📅 <strong>Date :</strong> {selectedDate} à {selectedTime}</p>
          <p>📍 <strong>Format :</strong> {meetingType === 'visio' ? '💻 Visio (Google Meet)' : '🏢 Présentiel — Campus HETIC'}</p>
        </div>

        <button
          className="btn-return-dashboard-recruiter"
          onClick={() => navigate('/candidatures')}
        >
          <FiArrowLeft /> Retourner aux candidatures
        </button>
      </div>
    );
  }

  // ─── PAGE PRINCIPALE ───────────────────────────────────
  return (
    <div className="appointment-container">

      <button className="btn-back-link" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Annuler et retourner au tableau de bord
      </button>

      <header className="appointment-header">
        <h1>🎯 Planificateur d'Entretiens</h1>
        <p>Configurez le créneau de rencontre pour finaliser le processus de recrutement.</p>
      </header>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="appointment-grid-layout">

        {/* ── COLONNE GAUCHE ── */}
        <div className="appointment-info-sidebar">

          <div className="candidate-context-card">
            <span className="context-badge">Action Requise</span>
            <h3>Planification avec :</h3>
            <div className="context-profile-row">
              <div className="context-avatar">
                {candidateInfo.candidateName?.[0] || '?'}
              </div>
              <div>
                <h4>{candidateInfo.candidateName}</h4>
                <p>{candidateInfo.poste}</p>
              </div>
            </div>
          </div>

          <div className="meeting-type-selector-card">
            <h4>Format de la rencontre</h4>
            <div className="type-options-stack">

              <label className={`type-option-bubble ${meetingType === 'visio' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="mtype"
                  value="visio"
                  checked={meetingType === 'visio'}
                  onChange={() => setMeetingType('visio')}
                />
                <FiVideo className="icon" />
                <div>
                  <strong>Visioconférence</strong>
                  <span>Génère un lien Google Meet</span>
                </div>
              </label>

              <label className={`type-option-bubble ${meetingType === 'on-site' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="mtype"
                  value="on-site"
                  checked={meetingType === 'on-site'}
                  onChange={() => setMeetingType('on-site')}
                />
                <FiMapPin className="icon" />
                <div>
                  <strong>Sur site (HETIC)</strong>
                  <span>Campus de Montreuil</span>
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* ── COLONNE DROITE ── */}
        <div className="appointment-picker-workspace">
          <form onSubmit={handleConfirmMeeting}>

            <div className="date-picker-section">
              <h4><FiCalendar /> 1. Choisir une date</h4>
              <input
                type="date"
                className="premium-date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min="2026-05-30"
              />
            </div>

            <div className="time-picker-section">
              <h4><FiClock /> 2. Sélectionner un créneau disponible</h4>
              <div className="time-slots-grid">
                {CRENEAUX_DISPOS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.dispo}
                    className={`time-slot-bubble ${!slot.dispo ? 'locked' : ''} ${selectedTime === slot.heure ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(slot.heure)}
                  >
                    {slot.heure}
                  </button>
                ))}
              </div>
            </div>

            <div className="message-section">
              <h4>💬 3. Message pour le candidat (optionnel)</h4>
              <textarea
                className="premium-textarea"
                placeholder="Ex: Nous aimerions discuter de votre expérience React..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn-submit-appointment"
              disabled={!selectedTime || loading}
            >
              {loading ? '⏳ Envoi en cours...' : "🚀 Confirmer et bloquer l'entretien"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AppointmentPage;