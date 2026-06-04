import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthTabs from '../components/AuthTabs';
import InputField from '../components/InputField';
import UploadBox from '../components/UploadBox';
import { registerEtudiant, registerEntreprise } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

function RegisterPage() {
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [emailEt, setEmailEt] = useState('');
  const [mdpEt, setMdpEt] = useState('');
  const [mdpEtConfirm, setMdpEtConfirm] = useState('');
  const [cv, setCv] = useState(null);

  const [nomEntreprise, setNomEntreprise] = useState('');
  const [secteur, setSecteur] = useState('');
  const [description, setDescription] = useState('');
  const [emailEn, setEmailEn] = useState('');
  const [mdpEn, setMdpEn] = useState('');
  const [mdpEnConfirm, setMdpEnConfirm] = useState('');
  const [logo, setLogo] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    if (role === 'student' && mdpEt !== mdpEtConfirm) {
      return setError('Les mots de passe ne correspondent pas');
    }
    if (role === 'company' && mdpEn !== mdpEnConfirm) {
      return setError('Les mots de passe ne correspondent pas');
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (role === 'student') {
        formData.append('prenom', prenom);
        formData.append('nom', nom);
        formData.append('email', emailEt);
        formData.append('motDePasse', mdpEt);
        if (cv) formData.append('cv', cv);
        const data = await registerEtudiant(formData);
        login(data.user, data.token);
        navigate('/profil');
      } else {
        formData.append('nomEntreprise', nomEntreprise);
        formData.append('secteur', secteur);
        formData.append('description', description);
        formData.append('email', emailEn);
        formData.append('motDePasse', mdpEn);
        if (logo) formData.append('logo', logo);
        const data = await registerEntreprise(formData);
        login(data.user, data.token);
        navigate('/entreprise');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card auth-card--scroll">

        <a href="#" className="auth-logo">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB"/>
            <path d="M16 6a7 7 0 0 1 7 7c0 4.5-7 13-7 13S9 17.5 9 13a7 7 0 0 1 7-7z" fill="white"/>
            <circle cx="16" cy="13" r="2.5" fill="#2563EB"/>
          </svg>
          JobMap
        </a>

        <h1>Créer un compte</h1>
        <p className="subtitle">Rejoignez des milliers d'étudiants et d'entreprises.</p>

        <AuthTabs role={role} setRole={setRole} />

        {error && (
          <p style={{ color: '#EF4444', marginBottom: '12px', fontSize: '14px' }}>{error}</p>
        )}

        {role === 'student' ? (
          <>
            <div className="form-row">
              <InputField label="Prénom" placeholder="Votre prénom" icon="user"
                value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              <InputField label="Nom" placeholder="Votre nom" icon="user"
                value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <InputField label="Adresse e-mail" type="email" placeholder="ton@email.com"
              value={emailEt} onChange={(e) => setEmailEt(e.target.value)} />
            <InputField label="Mot de passe" type="password" placeholder="••••••••••"
              value={mdpEt} onChange={(e) => setMdpEt(e.target.value)} />
            <InputField label="Confirmer le mot de passe" type="password" placeholder="••••••••••"
              value={mdpEtConfirm} onChange={(e) => setMdpEtConfirm(e.target.value)} />
            <UploadBox label="Télécharger ton CV" accept=".pdf,.doc,.docx"
              hint="PDF, DOC jusqu'à 5MB" onFileChange={setCv} />
          </>
        ) : (
          <>
            <InputField label="Nom de l'entreprise" placeholder="Ex: Google, LVMH..." icon="building"
              value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} />
            <UploadBox label="Logo de l'entreprise" accept="image/*"
              hint="PNG, JPG jusqu'à 2MB" onFileChange={setLogo} />

            <div className="form-group">
              <label>Secteur d'activité</label>
              <div className="select-wrapper">
                <select value={secteur} onChange={(e) => setSecteur(e.target.value)}>
                  <option value="">Choisir un secteur</option>
                  <option>Informatique</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                  <option>Industrie</option>
                  <option>Santé</option>
                  <option>Éducation</option>
                </select>
                <span className="select-arrow">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" placeholder="Décrivez votre entreprise en quelques mots..."
                value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <InputField label="Adresse e-mail" type="email" placeholder="contact@entreprise.com"
              value={emailEn} onChange={(e) => setEmailEn(e.target.value)} />
            <InputField label="Mot de passe" type="password" placeholder="••••••••••"
              value={mdpEn} onChange={(e) => setMdpEn(e.target.value)} />
            <InputField label="Confirmer le mot de passe" type="password" placeholder="••••••••••"
              value={mdpEnConfirm} onChange={(e) => setMdpEnConfirm(e.target.value)} />
          </>
        )}

        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>

        <p className="bottom-text">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-illustration">
          <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="80" r="60" fill="#BFDBFE" opacity="0.4"/>
            <circle cx="80" cy="300" r="40" fill="#93C5FD" opacity="0.3"/>
            <rect x="100" y="80" width="300" height="200" rx="16" fill="white" opacity="0.9"/>
            <rect x="120" y="105" width="120" height="10" rx="5" fill="#BFDBFE"/>
            <rect x="120" y="123" width="80" height="8" rx="4" fill="#E2E8F0"/>
            <circle cx="135" cy="165" r="18" fill="#DBEAFE"/>
            <circle cx="135" cy="158" r="8" fill="#93C5FD"/>
            <path d="M118 183 Q135 175 152 183" fill="#93C5FD"/>
            <rect x="162" y="153" width="120" height="8" rx="4" fill="#E2E8F0"/>
            <rect x="162" y="167" width="80" height="6" rx="3" fill="#F1F5F9"/>
            <rect x="120" y="200" width="60" height="22" rx="11" fill="#DBEAFE"/>
            <rect x="188" y="200" width="70" height="22" rx="11" fill="#EDE9FE"/>
            <rect x="266" y="200" width="55" height="22" rx="11" fill="#FCE7F3"/>
            <rect x="120" y="230" width="75" height="22" rx="11" fill="#D1FAE5"/>
            <rect x="203" y="230" width="65" height="22" rx="11" fill="#FEF3C7"/>
            <circle cx="370" cy="160" r="30" fill="#2563EB"/>
            <path d="M357 160l8 8 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="60" y="180" width="90" height="70" rx="10" fill="white" opacity="0.85"/>
            <circle cx="105" cy="205" r="14" fill="#DBEAFE"/>
            <rect x="75" y="224" width="60" height="7" rx="3" fill="#E2E8F0"/>
            <rect x="80" y="235" width="50" height="5" rx="2" fill="#F1F5F9"/>
            <rect x="350" y="220" width="90" height="70" rx="10" fill="white" opacity="0.85"/>
            <circle cx="395" cy="245" r="14" fill="#D1FAE5"/>
            <rect x="365" y="264" width="60" height="7" rx="3" fill="#E2E8F0"/>
            <rect x="370" y="275" width="50" height="5" rx="2" fill="#F1F5F9"/>
            <circle cx="300" cy="60" r="6" fill="#93C5FD" opacity="0.6"/>
            <circle cx="170" cy="50" r="4" fill="#BFDBFE" opacity="0.8"/>
            <circle cx="450" cy="280" r="8" fill="#93C5FD" opacity="0.4"/>
          </svg>
        </div>
        <div className="auth-panel-text">
          <h2>Construisez votre réseau professionnel</h2>
          <p>Étudiants, trouvez des stages et alternances. Entreprises, découvrez les meilleurs talents.</p>
        </div>
        <div className="auth-panel-stats">
          <div className="stat">
            <span className="stat-number">12k+</span>
            <span className="stat-label">Étudiants</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">800+</span>
            <span className="stat-label">Entreprises</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">3k+</span>
            <span className="stat-label">Offres actives</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default RegisterPage;