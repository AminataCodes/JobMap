import { Link } from "react-router-dom";
import "../styles/CandidaturesPage.css"
function CandidateCard({ candidat }) {
  return (
    <div className="card">
        <h3>
         {candidat.prenom} {candidat.nom}
        </h3>

      <p>{candidat.niveauEtude}</p>
      <p>Statut : {candidat.statut}</p>
        <Link to={`/candidature/${candidat.id}`}>
         Voir la candidature
        </Link>
    </div>
  );
}

export default CandidateCard;