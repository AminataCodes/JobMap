import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Annonce({ offre }) {

  const navigate = useNavigate();
  
  return (
    <div className="annonce">

      <div className="annonce-entreprise">

        <div className="header">

          <div className="entreprise-info">

            <img
              src={offre.entreprise.logoUrl}
              alt={offre.entreprise.nomEntreprise}
              width="100"
            />

            <h1>
              {offre.entreprise.nomEntreprise}
            </h1>
            
          </div>

          <div className="details">

            <p>
              {new Date(
                offre.datePublication
              ).toLocaleDateString()}
            </p>

            <p>{offre.lieu}</p>

          </div>

          <div className="description-entreprise">
          <h2>Description de l'entreprise</h2>

          <p>
            {offre.entreprise.description}
          </p>
        </div>
        
        </div>

        <p className="nom-poste">
          {offre.nomPoste}
        </p>
      </div>

      <div className="annonce-post">

        <h2>Description du poste</h2>

        <p>{offre.description}</p>

        <h2>Compétences obligatoires</h2>

        <p>
          {offre.competencesObligatoires}
        </p>

        <h2>Compétences souhaitables</h2>

        <p>
          {offre.competencesSouhaitables}
        </p>

        <h2>Date de début</h2>

        <p>
          {offre.dateDeDebut
            ? new Date(
                offre.dateDeDebut
              ).toLocaleDateString()
            : "Non précisée"}
        </p>

        <button onClick={() => navigate(`/annonce/${offre.id}/candidature`)}>
          Postuler
        </button>

      </div>
    </div>
  );
}

export default Annonce;