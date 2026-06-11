import axios from "axios"

const API_URL = "http://localhost:3000/api/offres"

export const getOffres = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const createOffre = async (offre, token) => {
  const response = await axios.post(
    API_URL,
    offre,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}