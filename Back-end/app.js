import express from 'express'
import cors from 'cors'
import authEtudiantRoutes from './src/routes/auth.etudiant.routes.js'
import candidatureRoutes from './src/routes/candidature-route.js'
import authAdminRoutes from './src/routes/auth.admin.routes.js'  // ← était ./routes/


import offreRoutes from './src/routes/offre.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth/etudiant', authEtudiantRoutes)
app.use('/api/candidatures', candidatureRoutes)
app.use('/api/auth/admin', authAdminRoutes)
app.use('/api/offres', offreRoutes)

app.use((err, req, res, next) => {
  if (err.name === 'MulterError' || err.message?.includes('CV') || err.message?.includes('logo')) {
    return res.status(400).json({ message: err.message })
  }
  next(err)
})

export default app