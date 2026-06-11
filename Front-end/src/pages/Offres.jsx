import { useEffect, useState } from "react"
import { getOffres } from "../services/offre.service"

export default function Offres() {

    const [offres, setOffres] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await getOffres()
                setOffres(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [])

    if (loading) {
        return <p>Chargement...</p>
    }

    return (
        <div style={{ padding: "20px" }}>

            <h1>Offres de stages / alternance</h1>

            {offres.length === 0 ? (
                <p>Aucune offre disponible</p>
            ) : (
                offres.map((offre) => (
                    <div key={offre.id} style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                    }}>

                        <h2>{offre.nomPoste}</h2>
                        <h3>{offre.nomEntreprise}</h3>

                        <p><b>Lieu :</b> {offre.lieu}</p>

                        <p>{offre.description}</p>

                        <p>
                            <b>Compétences :</b>{" "}
                            {offre.competencesObligatoires || "Non spécifiées"}
                        </p>

                        {/* 🔥 Bouton Postuler */}
                        {offre.lienPostulation && (
                            <a
                                href={offre.lienPostulation}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-block",
                                    marginTop: "10px",
                                    padding: "10px 15px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontWeight: "bold"
                                }}
                            >
                                🚀 Postuler
                            </a>
                        )}

                    </div>
                ))
            )}

        </div>
    )
}