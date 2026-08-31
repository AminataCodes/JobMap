import { useEffect, useState } from "react";
import "../styles/offres.css";
import OffreCard from "../components/OffreCard";
import {BASE} from "../services/api.js";

function OffresPage() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch(`${BASE}/offres`);

        if (!res.ok) {
          throw new Error("Erreur lors du chargement");
        }

        const data = await res.json();

        setOffres(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  const handleVoirOffre = (offre) => {
    console.log("Offre cliquée :", offre);
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="offres-page">
      <h1>Offres disponibles</h1>

      <div className="offres-list">
        {offres.map((offre) => (
          <OffreCard
            key={offre.id}
            offre={offre}
            onVoirOffre={handleVoirOffre}
          />
        ))}
      </div>
    </div>
  );
}

export default OffresPage;