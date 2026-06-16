import { Routes, Route } from "react-router-dom"

import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilEcolePage from "./pages/ProfilEcolePage"
import ProfilPage from "./pages/ProfilPage"
import Messagerie from "./pages/Messagerie"
import Calendrier from "./pages/Calendrier"
import AppointementPage from "./pages/AppointementPage"
import OffresPage from "./pages/OffresPage"
import PublierOffre from "./pages/PublierOffre"
import OffreDetailPage from "./pages/OffreDetailPage"
import OffrePreviewPage from "./pages/OffrePreviewPage"
import ProfilEtudiantsPage from './pages/ProfilEtudiantsPage'

import {
  Candidature,
  Candidatures,
  MesCandidatures
} from "./pages/CandidatureBundle"

import "./App.css"
import "./styles/Navbar.css"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app-layout">
          <Navbar />
          <main className="app-main-content">
            <Routes>

              {/* PUBLIQUES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* OFFRE DÉTAIL */}
              <Route path="/offres/:id" element={<OffreDetailPage />} />

              {/* ÉTUDIANT */}
              <Route
                path="/profil"
                element={
                  <ProtectedRoute allowedRoles={["etudiant"]}>
                    <ProfilPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidatures"
                element={
                  <ProtectedRoute allowedRoles={["etudiant"]}>
                    <Candidatures />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mes-candidatures"
                element={
                  <ProtectedRoute allowedRoles={["etudiant"]}>
                    <MesCandidatures />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offres/:id/candidature"
                element={
                  <ProtectedRoute allowedRoles={["etudiant"]}>
                    <Candidature />
                  </ProtectedRoute>
                }
              />

              {/* OUTILS */}
              <Route
                path="/messagerie"
                element={
                  <ProtectedRoute allowedRoles={["etudiant", "admin"]}>
                    <Messagerie />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendrier"
                element={
                  <ProtectedRoute allowedRoles={["etudiant", "admin"]}>
                    <Calendrier />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entretiens"
                element={
                  <ProtectedRoute allowedRoles={["etudiant", "admin"]}>
                    <AppointementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar/:id"
                element={
                  <ProtectedRoute allowedRoles={["etudiant", "admin"]}>
                    <AppointementPage />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN */}
              <Route
                path="/profil-admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ProfilEcolePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/publier-offre"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <PublierOffre />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offres"
                element={
                  <ProtectedRoute allowedRoles={["admin", "etudiant"]}>
                    <OffresPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offre-preview"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <OffrePreviewPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/etudiants" element={<ProfilEtudiantsPage />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App