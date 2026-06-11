import { useState } from "react"
import { createOffre } from "../services/offre.service"

export default function PublierOffre() {

    const [formData, setFormData] = useState({
        nomEntreprise: "",
        nomPoste: "",
        description: "",
        lieu: "",
        competencesObligatoires: "",
        competencesSouhaitables: "",
        dateDeDebut: "",
        lienPostulation: "" // ✅ AJOUT
    })

    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem("token")

            console.log(formData) // 🧪 debug

            await createOffre(formData, token)

            setMessage("Offre publiée avec succès ✅")

            // reset formulaire
            setFormData({
                nomEntreprise: "",
                nomPoste: "",
                description: "",
                lieu: "",
                competencesObligatoires: "",
                competencesSouhaitables: "",
                dateDeDebut: "",
                lienPostulation: ""
            })

        } catch (error) {
            console.error(error)
            setMessage("Erreur lors de la publication ❌")
        }
    }

    return (
        <div className="candidature">

            <h1>Publier une offre</h1>

            <form onSubmit={handleSubmit}>

                <label>Entreprise</label>
                <input
                    type="text"
                    name="nomEntreprise"
                    value={formData.nomEntreprise}
                    onChange={handleChange}
                    required
                />

                <label>Nom du poste</label>
                <input
                    type="text"
                    name="nomPoste"
                    value={formData.nomPoste}
                    onChange={handleChange}
                    required
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label>Lieu</label>
                <input
                    type="text"
                    name="lieu"
                    value={formData.lieu}
                    onChange={handleChange}
                    required
                />

                <label>Compétences obligatoires</label>
                <input
                    type="text"
                    name="competencesObligatoires"
                    value={formData.competencesObligatoires}
                    onChange={handleChange}
                />

                <label>Compétences souhaitables</label>
                <input
                    type="text"
                    name="competencesSouhaitables"
                    value={formData.competencesSouhaitables}
                    onChange={handleChange}
                />

                <label>Date de début</label>
                <input
                    type="date"
                    name="dateDeDebut"
                    value={formData.dateDeDebut}
                    onChange={handleChange}
                />

                {/* 🔥 NOUVEAU CHAMP */}
                <label>Lien de postulation</label>
                <input
                    type="url"
                    name="lienPostulation"
                    placeholder="https://..."
                    value={formData.lienPostulation}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Publier
                </button>

                {message && (
                    <p>{message}</p>
                )}

            </form>

        </div>
    )
}