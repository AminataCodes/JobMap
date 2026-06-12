import { Routes, Route } from "react-router-dom"

import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilEcolePage from "./pages/ProfilEcolePage";

import ProfilPage from "./pages/ProfilPage"
import Messagerie from "./pages/Messagerie"
import Calendrier from "./pages/Calendrier"
import AppointementPage from "./pages/AppointementPage"

/* =========================
   CANDIDATURE (STUDENT ONLY)
========================= */
import {
  Candidature,
  Candidatures
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

              {/* =========================
                  PAGES PUBLIQUES
              ========================= */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* =========================
                  ETUDIANT
              ========================= */}
              <Route path="/profil" element={<ProfilPage />} />

              {/* liste + suivi candidatures */}
              <Route path="/candidatures" element={<Candidatures />} />
              <Route path="/candidatures-suivi" element={<Candidatures />} />

              {/* formulaire candidature */}
              <Route path="/annonce/:id/candidature" element={<Candidature />} />

              {/* =========================
                  OUTILS
              ========================= */}
              <Route path="/messagerie" element={<Messagerie />} />
              <Route path="/calendrier" element={<Calendrier />} />
              <Route path="/entretiens" element={<AppointementPage />} />
              <Route path="/calendar/:id" element={<AppointementPage />} />
              <Route path="/profil-admin" element={<ProfilEcolePage />} />

            </Routes>
          </main>

        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App