import "../styles/offres.css";
import OffreCard from "../components/OffreCard";

function OffresPage() {
  // Exemple de donnée d'offre (à remplacer par tes données API plus tard)
  const offre = {
    id: 1,
    titre: "Développeur Front-End React",
    description: "Rejoignez notre équipe pour développer des interfaces modernes et intuitives au sein d'un environnement agile.",
    entreprise: "TechNova",
  };

  const handleVoirOffre = (offre) => {
    // Pour l'instant juste un log, plus tard tu pourras naviguer vers /offres/:id
    console.log("Offre cliquée :", offre);
  };

  return (
    <div className="offres-page">
      <h1>Offres disponibles</h1>
      <OffreCard offre={offre} onVoirOffre={handleVoirOffre} />
    </div>
  );
}

export default OffresPage;