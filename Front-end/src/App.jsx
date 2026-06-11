import { Routes, Route } from "react-router-dom"

import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilEcolePage from "./pages/ProfilEcolePage"
import ProfilPage from "./pages/ProfilPage"
import Messagerie from "./pages/Messagerie"
import Calendrier from "./pages/Calendrier"
import AppointementPage from "./pages/AppointementPage"
import PublierOffre from "./pages/PublierOffre"
import Offres from "./pages/Offres"

import { Candidature, Candidatures } from "./pages/CandidatureBundle"

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

              {/* ETUDIANT */}
              <Route path="/profil" element={<ProfilPage />} />
              <Route path="/candidatures" element={<Candidatures />} />
              <Route path="/candidatures-suivi" element={<Candidatures />} />
              <Route path="/annonce/:id/candidature" element={<Candidature />} />

              {/* ECOLE */}
              <Route path="/profil-ecole" element={<ProfilEcolePage />} />

              {/* OFFRES */}
              <Route path="/offres" element={<Offres />} />
              <Route path="/publier-offre" element={<PublierOffre />} />

              {/* OUTILS */}
              <Route path="/messagerie" element={<Messagerie />} />
              <Route path="/calendrier" element={<Calendrier />} />
              <Route path="/entretiens" element={<AppointementPage />} />
              <Route path="/calendar/:id" element={<AppointementPage />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
