import "../styles/offres.css";

function OffresPage() {
  // Exemple de donnée d'offre (à remplacer par tes données API plus tard)
  const offre = {
    titre: "Développeur Front-End React",
    description: "Rejoignez notre équipe pour développer des interfaces modernes et intuitives au sein d'un environnement agile.",
    entreprise: "TechNova",
  };

  return (
    <div className="offres-page">
      <h1>Offres disponibles</h1>

      <div className="offre-card">
        <h2 className="offre-titre">{offre.titre}</h2>
        <p className="offre-description">{offre.description}</p>
        <p className="offre-entreprise">🏢 {offre.entreprise}</p>
      </div>
    </div>
  );
}

export default OffresPage;