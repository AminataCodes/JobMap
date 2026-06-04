import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfilEtudiant, updateProfilEtudiant, getMesRendezVous } from '../services/api';
import { 
  FiUser, FiBriefcase, FiCalendar, FiLogOut, FiArrowRight, 
  FiPlus, FiX, FiCheckCircle, FiActivity 
} from 'react-icons/fi';
import '../styles/Profil.css';

const INITIAL_PROFILE = {
  prenom: '',
  nom: '',
  email: '',
  role: 'student',
  formation: 'Mastère Tech & Web Development — HETIC',
  bio: 'Développeur Fullstack passionné par React, l\'architecture des applications SaaS et l\'optimisation des interfaces utilisateur.',
  competences: ['React.js', 'Vite', 'TypeScript', 'Node.js', 'Tailwind CSS', 'CSS Optimisé'],
};

const STATUT_CONFIG = {
  'Attente de réponse':   { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  'Dossier en cours':     { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  'Entretien RH':         { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
  'Signature de contrat': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
};

const DEMO_CANDIDATURES = [
  { id: 1, entreprise: 'TechScale',    poste: 'Développeur Front-end React', date: '2026-05-25', statut: 'Entretien RH',     lieu: 'Paris (Hybride)' },
  { id: 2, entreprise: 'Studio Pulse', poste: 'Product Designer UI/UX',      date: '2026-05-24', statut: 'Dossier en cours', lieu: 'Lyon' },
];

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS  = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function MiniCalendrier({ rdvs = [] }) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const rdvDays = new Set(
    rdvs
      .map(rdv => new Date(rdv.dateProposee))
      .filter(d => d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear())
      .map(d => d.getDate())
  );

  return (
    <div className="pcal">
      <div className="pcal__nav">
        <span>{MOIS[today.getMonth()]} {today.getFullYear()}</span>
      </div>
      <div className="pcal__weekdays">
        {JOURS.map(j => <div key={j}>{j}</div>)}
      </div>
      <div className="pcal__grid">
        {Array.from({ length: offset }).map((_, i) => <div key={i} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();
          const hasRdv = rdvDays.has(day);
          return (
            <div
              key={day}
              className={`pcal__day ${isToday ? 'today' : ''}`}
              style={hasRdv ? { position: 'relative' } : {}}
            >
              {day}
              {hasRdv && (
                <span style={{
                  position: 'absolute',
                  bottom: 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  display: 'block'
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfilPage() {
  const { setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]           = useState(INITIAL_PROFILE);
  const [rdvs, setRdvs]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState(null);
  const [currentRole, setCurrentRole]   = useState('student');
  const [editing, setEditing]           = useState(false);
  const [newSkill, setNewSkill]         = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    Promise.all([
      getProfilEtudiant(),
      getMesRendezVous().catch(() => [])
    ])
      .then(([data, rdvData]) => {
        setProfile(prev => ({
          ...prev,
          prenom:      data.prenom      || '',
          nom:         data.nom         || '',
          email:       data.email       || '',
          formation:   data.niveauEtude || prev.formation,
          bio:         data.bio         || prev.bio,
          competences: data.competences?.length > 0
                         ? data.competences
                         : prev.competences,
        }));
        setRdvs(rdvData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement profil:', err);
        setError('Impossible de charger le profil.');
        setLoading(false);
      });
  }, []);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (!cleanSkill || profile?.competences?.includes(cleanSkill)) return;
    setProfile(prev => ({ ...prev, competences: [...(prev.competences || []), cleanSkill] }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      competences: (prev.competences || []).filter(s => s !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    if (!editing) {
      setEditing(true);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('nom',    profile.nom);
      formData.append('prenom', profile.prenom);
      if (profile.formation) formData.append('niveauEtude',  profile.formation);
      if (profile.bio)       formData.append('bio',          profile.bio);
      formData.append('competences', JSON.stringify(profile.competences || []));
      if (selectedFile)      formData.append('cv', selectedFile);

      const updated = await updateProfilEtudiant(formData);

      setProfile(prev => ({
        ...prev,
        prenom:      updated.prenom,
        nom:         updated.nom,
        email:       updated.email,
        formation:   updated.niveauEtude || prev.formation,
        bio:         updated.bio         || prev.bio,
        competences: updated.competences?.length > 0
                       ? updated.competences
                       : prev.competences,
      }));
      setUser(updated);
      setEditing(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleToggleRole = (roleTarget) => {
    setCurrentRole(roleTarget);
    if (roleTarget === 'recruiter') navigate('/entreprise');
  };

  if (loading) {
    return (
      <div className="profil-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement du profil…</p>
      </div>
    );
  }

  return (
    <div className="profil-layout">

      <div className="profil-role-tabs">
        <button className={`role-tab ${currentRole === 'student' ? 'active' : ''}`} onClick={() => handleToggleRole('student')}>
          🎓 Tableau de bord Étudiant
        </button>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-pill-card">
          <div className="stat-pill-icon blue"><FiActivity /></div>
          <div className="stat-pill-data"><h3>{DEMO_CANDIDATURES.length}</h3><p>Candidatures Actives</p></div>
        </div>
        <div className="stat-pill-card">
          <div className="stat-pill-icon purple"><FiCalendar /></div>
          <div className="stat-pill-data"><h3>{rdvs.length}</h3><p>Entretien{rdvs.length !== 1 ? 's' : ''} planifié{rdvs.length !== 1 ? 's' : ''}</p></div>
        </div>
        <div className="stat-pill-card">
          <div className="stat-pill-icon green"><FiCheckCircle /></div>
          <div className="stat-pill-data"><h3>98%</h3><p>Complétion du profil</p></div>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '8px 16px', marginBottom: '8px' }}>{error}</div>
      )}

      <main className="profil__main">
        <div className="profil-left-col">
          <section className="profile-card premium-focus">
            <div className="profile-card-edit-trigger">
              <h2><FiUser /> Identité & Parcours</h2>
              <button className="btn-edit-action-minimal" onClick={handleSave} disabled={saving}>
                {editing ? (saving ? '⏳ Sauvegarde…' : '💾 Sauvegarder') : '✏️ Modifier'}
              </button>
            </div>

            <div className="profile-identity-display">
              <div className="profile-avatar-circle">
                {profile?.prenom ? profile.prenom[0].toUpperCase() : '?'}
              </div>
              <div className="profile-identity-fields">
                {editing ? (
                  <>
                    <input
                      type="text"
                      className="edit-profile-input text-bold"
                      value={profile?.prenom || ''}
                      onChange={e => handleChange('prenom', e.target.value)}
                      placeholder="Prénom"
                    />
                    <input
                      type="text"
                      className="edit-profile-input"
                      value={profile?.formation || ''}
                      onChange={e => handleChange('formation', e.target.value)}
                      placeholder="Formation"
                    />
                  </>
                ) : (
                  <>
                    <h3>{profile?.prenom || ''} {profile?.nom || ''}</h3>
                    <p className="profile-school-tag">{profile?.formation || 'Étudiant — HETIC'}</p>
                  </>
                )}
              </div>
            </div>

            <div className="profile-bio-container">
              <h4>À propos de moi</h4>
              {editing ? (
                <textarea
                  className="edit-profile-textarea"
                  value={profile?.bio || ''}
                  onChange={e => handleChange('bio', e.target.value)}
                />
              ) : (
                <p className="profile-bio-text">"{profile?.bio || 'Aucune biographie rédigée pour le moment.'}"</p>
              )}
            </div>

            <div className="profile-contact-line">
              <span>📧 {profile?.email || 'non-renseigné@hetic.net'}</span>
            </div>

            <input
              type="file"
              ref={fileRef}
              hidden
              accept=".pdf"
              onChange={handleFileChange}
            />
            <button className="btn-upload-cv" onClick={() => fileRef.current.click()}>
              {selectedFile ? `📎 ${selectedFile.name}` : '📁 Mettre à jour mon CV (PDF)'}
            </button>
          </section>

          <section className="skills-management-card">
            <h2>🛠️ Mes compétences phares</h2>
            <p className="section-subdescription">Ajoutez vos technologies clés pour optimiser le matching des recruteurs.</p>
            <div className="profile-skills-tags-cloud">
              {(profile?.competences || []).map(skill => (
                <span key={skill} className="interactive-skill-badge">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)}><FiX size={12} /></button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddSkill} className="add-skill-inline-form">
              <input
                type="text"
                placeholder="Ex: Vue.js, Docker..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
              />
              <button type="submit" title="Ajouter la compétence"><FiPlus /></button>
            </form>
          </section>
        </div>

        <div className="profil-right-col">
          <section className="candidatures-card">
            <div className="section-title-with-action">
              <h2><FiBriefcase /> Flux de vos candidatures</h2>
              <button className="btn-text-link-navigation" onClick={() => navigate('/candidatures-suivi')}>
                Gérer mes suivis →
              </button>
            </div>
            <div className="candidatures-list-wrapper">
              {DEMO_CANDIDATURES.map(c => (
                <div key={c.id} className="candidature-item-row" onClick={() => navigate('/candidatures')}>
                  <div className="candidature-item-main">
                    <strong>{c.poste}</strong>
                    <span>{c.entreprise} • <small>{c.lieu}</small></span>
                  </div>
                  <span
                    className="status-pill-premium"
                    style={{ backgroundColor: STATUT_CONFIG[c.statut]?.bg, color: STATUT_CONFIG[c.statut]?.color }}
                  >
                    {c.statut}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="calendar-card">
            <h2><FiCalendar /> Agenda & Sessions de Tests</h2>
            <MiniCalendrier rdvs={rdvs} />
          </section>

          <button className="btn-global-logout" onClick={logout}>
            <FiLogOut /> Se déconnecter de JobMap
          </button>
        </div>
      </main>
    </div>
  );
}

export default ProfilPage;