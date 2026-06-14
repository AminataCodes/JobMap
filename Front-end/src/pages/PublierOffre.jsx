import { useState } from "react"

export default function PublierOffre() {

    const [format, setFormat] = useState("") // "pdf" | "lien" | "texte"

    const [formData, setFormData] = useState({
        nomEntreprise: "",
        nomPoste: "",
        description: "",
        lieu: "",
        competencesObligatoires: "",
        competencesSouhaitables: "",
        dateDeDebut: "",
        lienPostulation: ""
    })

    const [pdfFile, setPdfFile] = useState(null)
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFormatChange = (e) => {
        setFormat(e.target.value)
        setMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem("token")
            let payload

            if (format === "pdf") {
                // On envoie un FormData pour pouvoir envoyer le fichier
                payload = new FormData()
                payload.append("pdf", pdfFile)
                payload.append("format", "pdf")

            } else if (format === "lien") {
                payload = {
                    format: "lien",
                    lienPostulation: formData.lienPostulation
                }

            } else {
                payload = {
                    format: "texte",
                    ...formData
                }
            }



            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la publication")
            }

            setMessage("Offre publiée avec succès ✅")

            // Reset
            setFormat("")
            setPdfFile(null)
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

                {/* 🔽 MENU DÉROULANT FORMAT */}
                <label>Format de l'offre</label>
                <select value={format} onChange={handleFormatChange} required>
                    <option value="">Sélectionner un format...</option>
                    <option value="pdf">📄 PDF</option>
                    <option value="lien">🔗 Lien</option>
                    <option value="texte">📝 Texte</option>
                </select>

                {format === "pdf" && (
    <>
        <label>Fichier PDF</label>
        <div className="file-upload-zone" onClick={() => document.getElementById("pdf-input").click()}>
            <span className="file-upload-icon">📄</span>
            <span className="file-upload-text">
                {pdfFile ? pdfFile.name : "Cliquer pour choisir un fichier PDF"}
            </span>
            <span className="file-upload-hint">
                {pdfFile ? "✅ Fichier sélectionné" : "Format accepté : .pdf"}
            </span>
        </div>
        <input
            id="pdf-input"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            required
            style={{ display: "none" }}
        />
    </>
)}

                {/* 🔗 FORMAT LIEN */}
                {format === "lien" && (
                    <>
                        <label>Lien de l'offre</label>
                        <input
                            type="url"
                            name="lienPostulation"
                            placeholder="https://..."
                            value={formData.lienPostulation}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                {/* 📝 FORMAT TEXTE */}
                {format === "texte" && (
                    <>
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
                    </>
                )}

                {/* Bouton visible seulement si un format est choisi */}
                {format && (
                    <button type="submit">Publier</button>
                )}

                {message && <p>{message}</p>}

            </form>
        </div>
    )
}