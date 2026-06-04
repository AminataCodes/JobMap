import { useState } from "react";

import "../styles/entrepriseOffres.css";

function EntrepriseOffres() {

  const [formData, setFormData] = useState({
  
    nomPoste: "",

    description: "",

    lieu: "",

    competencesObligatoires: "",

    competencesSouhaitables: "",

    dateDeDebut: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }
async function handleSubmit(e) {

  e.preventDefault();


  const token = localStorage.getItem("token"); // 👈 récupère le token

    if (!token) {
      setMessage("Vous n'êtes pas connecté.");
      return;
    }

  try {

    const response = await fetch(
  "http://localhost:3000/api/annonces",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",

      Authorization:
        `Bearer ${token}`,
    },

    body: JSON.stringify(
      formData
    ),
  }
);

    const data = await response.json();

    if (response.ok) {
        setMessage("✅ Annonce publiée avec succès !");
        setFormData({ // 👈 reset le formulaire
          nomPoste: "",
          description: "",
          lieu: "",
          competencesObligatoires: "",
          competencesSouhaitables: "",
          dateDeDebut: "",
        });
      } else {
        setMessage(`❌ Erreur : ${data.error || data.message}`);
      }


    console.log(data);

  } catch (error) {

    console.error(error);
  }
}

  return (
    <div className="page-formulaire">

      <form
        className="formulaire"
        onSubmit={handleSubmit}
      >

        <h1>Créer une offre d'emploi</h1>
        
        <br />

        <div>
          <label>Nom du poste :</label>

          <br />

          <input
            type="text"
            name="nomPoste"
            value={formData.nomPoste}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Description :</label>

          <br />

          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Lieu :</label>

          <br />

          <input
            type="text"
            name="lieu"
            value={formData.lieu}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>
            Compétences obligatoires :
          </label>

          <br />

          <input
            type="text"
            name="competencesObligatoires"
            value={
              formData.competencesObligatoires
            }
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>
            Compétences souhaitables :
          </label>

          <br />

          <input
            type="text"
            name="competencesSouhaitables"
            value={
              formData.competencesSouhaitables
            }
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Date de début :</label>

          <br />

          <input
            type="date"
            name="dateDeDebut"
            value={formData.dateDeDebut}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">
          Publier l'annonce
        </button>

        {message && (
          <p className="message-success">
            {message}
          </p>
        )}

      </form>
    </div>
  );
}

export default EntrepriseOffres;