import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllEtudiants } from '../services/api'
import '../styles/ProfilEtudiants.css'

export default function ProfilEtudiantsPage() {
  const { isAdmin, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [etudiants, setEtudiants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login')
      return
    }

    getAllEtudiants()
      .then((data) => {
        setEtudiants(data)
        if (data.length > 0) {
          setSelected(data[0])
        }
      })
      .catch(() => {
        setError('Impossible de charger les étudiants')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [isAuthenticated, isAdmin, navigate])

  const filteredEtudiants = etudiants.filter((etu) => {
    const fullName = `${etu.prenom} ${etu.nom}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  })

  if (loading) {
    return <p className="etudiants-loading">Chargement...</p>
  }

  if (error) {
    return <p className="etudiants-error">{error}</p>
  }

  return (
    <div className="etudiants-page">
      <h1>Profils des étudiants</h1>

      <input
        type="text"
        className="etudiants-search"
        placeholder="Rechercher un étudiant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="etudiants-layout">
        <div className="etudiants-list">
          {filteredEtudiants.length === 0 ? (
            <p className="no-result">Aucun étudiant trouvé</p>
          ) : (
            filteredEtudiants.map((etu) => (
              <div
                key={etu.uid}
                className={`etudiant-card ${
                  selected?.uid === etu.uid ? 'active' : ''
                }`}
                onClick={() => setSelected(etu)}
              >
                <h3>
                  {etu.prenom} {etu.nom}
                </h3>

                <p>{etu.niveauEtude || 'Niveau non précisé'}</p>

                <span className="candidatures-count">
                  {etu.candidatures?.length || 0} candidature(s)
                </span>
              </div>
            ))
          )}
        </div>

        <div className="etudiant-detail">
          {!selected ? (
            <p>Sélectionne un étudiant pour voir son profil</p>
          ) : (
            <>
              <div className="etudiant-detail-header">
                <h2>
                  {selected.prenom} {selected.nom}
                </h2>

                <span className="etudiant-niveau-badge">
                  {selected.niveauEtude || 'Niveau non précisé'}
                </span>
              </div>

              <p className="etudiant-email">{selected.email}</p>

              {selected.bio && (
                <div className="etudiant-bio">
                  <h4>Bio</h4>
                  <p>{selected.bio}</p>
                </div>
              )}

              <div className="etudiant-competences">
                <h4>Compétences</h4>

                {selected.competences?.length === 0 ? (
                  <p className="empty-text">
                    Aucune compétence renseignée
                  </p>
                ) : (
                  <div className="competences-tags">
                    {selected.competences?.map((competence, index) => (
                      <span
                        key={index}
                        className="competence-tag"
                      >
                        {competence}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {selected.cvUrl && (
                <a
                  href={selected.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cv-link"
                >
                  Voir le CV
                </a>
              )}

              <div className="etudiant-candidatures">
                <h4>
                  Candidatures ({selected.candidatures?.length || 0})
                </h4>

                {selected.candidatures?.length === 0 ? (
                  <p className="empty-text">Aucune candidature</p>
                ) : (
                  selected.candidatures?.map((candidature) => (
                    <div
                      key={candidature.id}
                      className="candidature-item"
                    >
                      <div className="candidature-header">
                        <strong>
                          {candidature.offre?.nomPoste}
                        </strong>

                        <span>
                          {candidature.offre?.nomEntreprise}
                        </span>
                      </div>

                      <p className="candidature-lieu">
                        {candidature.offre?.lieu}
                      </p>

                      {candidature.messageAdditionnel && (
                        <p className="candidature-message">
                          {candidature.messageAdditionnel}
                        </p>
                      )}

                      {candidature.lettreMotivationUrl && (
                        <a
                          href={candidature.lettreMotivationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="lettre-link"
                        >
                          Lettre de motivation
                        </a>
                      )}

                      <span className="candidature-date">
                        {new Date(
                          candidature.createdAt
                        ).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}