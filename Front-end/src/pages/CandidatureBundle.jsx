import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiFileText, FiMail, FiMapPin } from 'react-icons/fi'
import '../styles/CandidatureBundle.css'

const MOCK_CANDIDATS = {
  "101a": {
    id: "101a",
    nom: "Lucas Martin",
    email: "lucas.martin@hetic.net",
    telephone: "+33 6 12 34 56 78",
    formation: "HETIC - Mastère Tech & Web Development",
    competences: ["React.js", "TypeScript", "Node.js", "Docker", "Tailwind CSS"],
    bio: "Développeur passionné par les architectures Front-end scalables et l'optimisation des performances UI. Recherche une alternance de 12 mois.",
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
    bio: "Créatrice d'interfaces centrées utilisateur. Spécialisée dans la conception de plateformes complexes SaaS et d'outils collaboratifs B2B.",
    experience: "Designer UI Freelance - 1 an (Création de 4 app mobiles)",
    cvUrl: "#"
  }
}

const MOCK_CANDIDATURES_RECRUTEUR = [
  { id: 1, candidatId: "101a", poste: "Développeur Front-end React (Alternance)", entreprise: "TechScale", date: "2026-05-25", statut: "Entretien RH" },
  { id: 2, candidatId: "102a", poste: "Product Designer UI/UX (Stage)", entreprise: "Studio Pulse", date: "2026-05-24", statut: "Dossier en cours" }
]

const TIMELINE_STEPS = [
  { id: 1, label: "Candidature Envoyée", desc: "Votre dossier a bien été transmis à l'entreprise." },
  { id: 2, label: "Sélection sur CV", desc: "Le recruteur étudie vos compétences et votre profil." },
  { id: 3, label: "Entretiens & Tests", desc: "Échanges techniques et RH en cours." },
  { id: 4, label: "Décision Finale", desc: "Validation de l'offre ou feedback constructif." }
]

// ==========================================
// 1. VUE ÉTUDIANT
// ==========================================
export function Candidatures() {
  const [selectedApp, setSelectedApp] = useState(MOCK_CANDIDATURES_RECRUTEUR[0])

  const getActiveStepIndex = (statut) => {
    if (statut === "Dossier en cours") return 1
    if (statut === "Entretien RH" || statut === "Entretien manager") return 2
    if (statut === "Signature de contrat") return 3
    return 0
  }

  const currentStepIndex = getActiveStepIndex(selectedApp.statut)

  return (
    <div className="bundle-container">
      <div className="bundle-header">
        <h1>📊 Suivi en temps réel de mes candidatures</h1>
        <p>Suivez l'avancement de vos dossiers auprès des recruteurs partenaires.</p>
      </div>

      <div className="student-tracking-layout">
        <div className="tracking-sidebar-list">
          <h3>Mes candidatures en cours</h3>
          {MOCK_CANDIDATURES_RECRUTEUR.map(app => (
            <div
              key={app.id}
              className={`tracking-card-item ${selectedApp.id === app.id ? 'active' : ''}`}
              onClick={() => setSelectedApp(app)}
            >
              <h4>{app.poste}</h4>
              <p>{app.entreprise}</p>
              <span className="tracking-card-status">{app.statut}</span>
            </div>
          ))}
        </div>

        <div className="tracking-timeline-workspace">
          <div className="workspace-card-top">
            <h2>{selectedApp.poste}</h2>
            <p className="company-tag">🏢 {selectedApp.entreprise} • Transmis le {selectedApp.date}</p>
          </div>

          <div className="visual-timeline">
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              return (
                <div key={step.id} className={`timeline-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="node-icon-status">
                    {isCompleted ? <FiCheckCircle /> : isCurrent ? <FiClock /> : <span>{step.id}</span>}
                  </div>
                  <div className="node-text-content">
                    <h5>{step.label}</h5>
                    <p>{step.desc}</p>
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
// 2. VUE RECRUTEUR : LISTE CANDIDATURES
// ==========================================
export function CandidaturesPage() {
  const navigate = useNavigate()
  return (
    <div className="bundle-container">
      <div className="bundle-header">
        <h1>🏢 Dashboard Recruteur — Candidatures Reçues</h1>
        <p>Analysez les profils des étudiants d'HETIC ayant postulé à vos offres.</p>
      </div>

      <div className="recruiter-table-container">
        <table className="recruiter-grid-table">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Poste visé</th>
              <th>Date de réception</th>
              <th>Statut actuel</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CANDIDATURES_RECRUTEUR.map((c) => {
              const candidatInfo = MOCK_CANDIDATS[c.candidatId]
              return (
                <tr key={c.id}>
                  <td>
                    <div className="table-candidate-identity">
                      <div className="avatar-mini-circle">{candidatInfo.nom[0]}</div>
                      <div>
                        <strong>{candidatInfo.nom}</strong>
                        <small>{candidatInfo.formation}</small>
                      </div>
                    </div>
                  </td>
                  <td>{c.poste}</td>
                  <td>{c.date}</td>
                  <td><span className="status-badge-table">{c.statut}</span></td>
                  <td>
                    <button
                      className="btn-open-detail-recruiter"
                      onClick={() => navigate(`/candidaturedetail/`)}
                    >
                      Évaluer le profil →
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
// 3. VUE RECRUTEUR DÉTAILLÉE
// ==========================================
export function CandidatureDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const candidature = MOCK_CANDIDATURES_RECRUTEUR.find(c => c.id === parseInt(id)) || MOCK_CANDIDATURES_RECRUTEUR[0]
  const candidat = MOCK_CANDIDATS[candidature.candidatId]

  const [currentStatut, setCurrentStatut] = useState(candidature.statut)

  return (
    <div className="bundle-container">
      <button className="btn-back-dashboard" onClick={() => navigate('/candidatures')}>← Retour au Dashboard</button>

      <div className="detail-recruiter-split-layout">

        {/* BLOC GAUCHE : RÉSUMÉ CANDIDAT */}
        <div className="candidate-mini-resume-panel">
          <div className="resume-header-card">
            <div className="large-avatar-placeholder">{candidat.nom[0]}</div>
            <h2>{candidat.nom}</h2>
            <p className="resume-sub-title">🎓 {candidat.formation}</p>
          </div>

          <div className="resume-section-body">
            <h4>💡 À propos du profil</h4>
            <p className="candidate-bio-text">"{candidat.bio}"</p>

            <h4>🛠️ Compétences clés</h4>
            <div className="resume-skills-grid">
              {candidat.competences.map((skill, idx) => (
                <span key={idx} className="resume-skill-tag">{skill}</span>
              ))}
            </div>

            <h4>💼 Dernière expérience</h4>
            <p className="candidate-experience-text">🔹 {candidat.experience}</p>

            <div className="resume-contact-footer">
              <h4>📞 Coordonnées</h4>
              <p><FiMail size={14} /> {candidat.email}</p>
              <p><FiMapPin size={14} /> Paris, France</p>
            </div>

            <a href={candidat.cvUrl} className="btn-download-candidate-cv" download>
              <FiFileText size={16} /> Consulter le CV Original (PDF)
            </a>
          </div>
        </div>

        {/* BLOC DROITE : ACTIONS RECRUTEUR */}
        <div className="recruiter-action-decision-panel">
          <div className="decision-box-card">
            <h3>⚙️ Pilotage du Statut</h3>
            <p>Modifiez l'état d'avancement pour mettre à jour automatiquement la timeline de l'étudiant.</p>

            <div className="select-status-wrapper">
              <label>Statut de la candidature :</label>
              <select
                value={currentStatut}
                onChange={(e) => setCurrentStatut(e.target.value)}
                className="select-premium-dropdown"
              >
                <option value="Dossier en cours">Dossier en cours</option>
                <option value="Entretien RH">Entretien RH</option>
                <option value="Entretien manager">Entretien manager</option>
                <option value="Signature de contrat">Signature de contrat</option>
              </select>
            </div>

            <div className="decision-action-buttons">
              <button
                className="btn-validate-decision"
                onClick={() => alert('Statut sauvegardé avec succès !')}
              >
                Enregistrer la décision
              </button>

              {/* ✅ NOUVEAU BOUTON PLANIFIER ENTRETIEN */}
              <button
                className="btn-plan-interview"
                onClick={() => navigate('/entretiens', {
                  state: {
                    candidatureId: candidature.id,
                    candidateName: candidat.nom,
                    poste: candidature.poste,
                    email: candidat.email
                  }
                })}
              >
                📅 Planifier un entretien
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
// ==========================================
// 4. VUE ÉTUDIANT : LE FORMULAIRE DE CANDIDATURE INSTANTANÉE
// ==========================================
export function Candidature() {
  const { id : annonceId } = useParams();

  const [formData, setFormData] =
    useState({
      nomCandidat: "",
      prenom: "",
      lettreMotivation: null,
      messageAdditionnel: "",
    });

  const [messageEnvoye, setMessageEnvoye] =
    useState(false);

  const handleChange = (e) => {
    const { name, value, files } =
      e.target;

    setFormData({
      ...formData,
      [name]: files
        ? files[0]
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data =
        new FormData();

      data.append(
        "nomCandidat",
        formData.nomCandidat
      );

      data.append(
        "prenom",
        formData.prenom
      );

      data.append(
        "messageAdditionnel",
        formData.messageAdditionnel
      );

      data.append(
        "lettreMotivation",
        formData.lettreMotivation
      );

      const response =
        await fetch(
          `http://localhost:3000/api/annonce/${annonceId}/candidature`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },

            body: data,
          }
        );

      const result =
        await response.json();

      if (response.ok) {
        setMessageEnvoye(true);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  

  return (
    <div className="bundle-container">
      <div className="bundle-card max-600">
        <h2>
          Formulaire de candidature
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bundle-form"
        >
          <input
            type="text"
            name="nomCandidat"
            placeholder="Nom"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            onChange={handleChange}
            required
          />

          <label className="bundle-upload">
            <input
              type="file"
              name="lettreMotivation"
              onChange={handleChange}
              required
            />

            <span>
              {formData.lettreMotivation
                ? formData
                    .lettreMotivation
                    .name
                : "Déposez votre lettre de motivation"}
            </span>
          </label>

          <textarea
            name="messageAdditionnel"
            placeholder="Message..."
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn-submit"
          >
            Soumettre
          </button>

          {messageEnvoye && (
            <div className="toast-success">
              <FiCheckCircle />
              Transmis avec succès !
            </div>
          )}
        </form>
      </div>
    </div>
  );
}