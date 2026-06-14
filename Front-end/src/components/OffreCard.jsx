import { useNavigate } from "react-router-dom";

function OffreCard({ offre, onVoirOffre }) {

    const Navigate = useNavigate();
  return (
    <div className="offre-card"> 
      <h2 className="offre-titre">{offre.titre}</h2>
      <p className="offre-description">{offre.description}</p>
      <p className="offre-entreprise">🏢 {offre.entreprise}</p>

      <button className="offre-btn" onClick={() => Navigate(`/offre`)}>
        Voir l'offre
      </button>
    </div>
  );
}

export default OffreCard;