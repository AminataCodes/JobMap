import { useNavigate } from "react-router-dom";

function OffreCard({ offre, onVoirOffre }) {
  const navigate = useNavigate();

  return (
    <div className="offre-card">
      <div className="offre-logo">
        {offre.nomEntreprise?.charAt(0)}
      </div>

      <div className="offre-content">
        <h2 className="offre-titre">{offre.nomPoste}</h2>

        <p className="offre-entreprise">
          {offre.nomEntreprise}
        </p>

        <p className="offre-description">
          {offre.description}
        </p>

        <button
          className="offre-btn"
          onClick={() => {
            onVoirOffre?.(offre);
            navigate(`/offres/${offre.id}`);
          }}
        >
          Voir l'offre
        </button>
      </div>
    </div>
  );
}

export default OffreCard;