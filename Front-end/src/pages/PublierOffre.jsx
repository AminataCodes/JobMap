import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PublierOffre() {
    const navigate = useNavigate()

    const [format, setFormat] = useState("")

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
            setMessage("Extraction en cours... ⏳")

            // ⏳ simulation backend (2 secondes)
            await new Promise((resolve) => setTimeout(resolve, 2000))

            setMessage("Offre publiée avec succès ✅")

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

            // 🚀 navigation après 2 sec
            navigate("/offre-preview")

        } catch (error) {
            console.error(error)
            setMessage("Erreur lors de la publication ❌")
        }
    }

    return (
        <div className="candidature">

            <h1 onClick={() => navigate("/offre-preview")}>Publier une offre</h1>

            <form onSubmit={handleSubmit}>

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

                {format && (
                    <button type="submit">Extraire l'offre</button>
                )}

                {message && <p>{message}</p>}

            </form>
        </div>
    )
}