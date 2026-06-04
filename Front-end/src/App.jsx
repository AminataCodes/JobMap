import { Routes, Route } from "react-router-dom";

// Context
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages communes
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OffrePage from "./pages/OffrePage";

// Pages étudiant uniquement
import ProfilPage from "./pages/ProfilPage";
import Messagerie from "./pages/Messagerie";
import Calendrier from "./pages/Calendrier";
import { Candidature, Candidatures,  CandidaturesPage, CandidatureDetailPage } from "./pages/CandidatureBundle";

// Pages entreprise uniquement
import EntrepriseOffres from "./pages/entrepriseOffres";
import EntrepriseAnnonces from "./pages/entrepriseAnnonces";
import EntreprisePage from "./pages/EntreprisePage";

// Pages partagées (étudiant + entreprise)
import AppointementPage from "./pages/AppointementPage";

import "./App.css";
import "./styles/Navbar.css";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app-layout">
          <Navbar />

          <main className="app-main-content">
            <Routes>

              {/* ─── Pages publiques (tout le monde) ─── */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/offre" element={<OffrePage />} />
              <Route path="/annonce/:id" element={<OffrePage />} />

              {/* ─── Pages étudiant uniquement ─── */}
              <Route path="/profil" element={
                <ProtectedRoute role="etudiant">
                  <ProfilPage />
                </ProtectedRoute>
              } />
              <Route path="/candidatures" element={
                <ProtectedRoute >
                  <CandidaturesPage />
                </ProtectedRoute>
              } />
              <Route path="/candidatures-suivi" element={
                <ProtectedRoute >
                  <Candidatures />
                </ProtectedRoute>
              } />
              <Route path="/annonce/:id/candidature" element={
                <ProtectedRoute role="etudiant">
                  <Candidature />
                </ProtectedRoute>
              } />
              <Route path="/candidaturedetail/" element={
                <ProtectedRoute role="entreprise">
                  <CandidatureDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/messagerie" element={
                <ProtectedRoute role="etudiant">
                  <Messagerie />
                </ProtectedRoute>
              } />
              <Route path="/calendrier" element={
                <ProtectedRoute role="etudiant">
                  <Calendrier />
                </ProtectedRoute>
              } />

              {/* ─── Pages entreprise uniquement ─── */}
              <Route path="/entreprise" element={
                <ProtectedRoute role="entreprise">
                  <EntreprisePage />
                </ProtectedRoute>
              } />
              <Route path="/entreprise-offres" element={
                <ProtectedRoute role="entreprise">
                  <EntrepriseOffres />
                </ProtectedRoute>
              } />
              <Route path="/entreprise-annonces" element={
                <ProtectedRoute role="entreprise">
                  <EntrepriseAnnonces />
                </ProtectedRoute>
              } />

              {/* ─── Pages partagées (connecté peu importe le rôle) ─── */}
              <Route path="/entretiens" element={
                <ProtectedRoute>
                  <AppointementPage />
                </ProtectedRoute>
              } />
              <Route path="/calendar/:id" element={
                <ProtectedRoute>
                  <AppointementPage />
                </ProtectedRoute>
              } />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;