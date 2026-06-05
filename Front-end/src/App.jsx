import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OffrePage from "./pages/OffrePage";
import ProfilPage from "./pages/ProfilPage";
import Messagerie from "./pages/Messagerie";
import Calendrier from "./pages/Calendrier";
import AppointementPage from "./pages/AppointementPage";
import { Candidature, Candidatures, CandidaturesPage, CandidatureDetailPage } from "./pages/CandidatureBundle";

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

              {/* Publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/offre" element={<OffrePage />} />
              <Route path="/annonce/:id" element={<OffrePage />} />

              {/* Étudiant */}
              <Route path="/profil" element={
                <ProtectedRoute role="etudiant"><ProfilPage /></ProtectedRoute>
              } />
              <Route path="/candidatures" element={
                <ProtectedRoute><CandidaturesPage /></ProtectedRoute>
              } />
              <Route path="/candidatures-suivi" element={
                <ProtectedRoute><Candidatures /></ProtectedRoute>
              } />
              <Route path="/annonce/:id/candidature" element={
                <ProtectedRoute role="etudiant"><Candidature /></ProtectedRoute>
              } />
              <Route path="/candidaturedetail/" element={
                <ProtectedRoute><CandidatureDetailPage /></ProtectedRoute>
              } />
              <Route path="/messagerie" element={
                <ProtectedRoute role="etudiant"><Messagerie /></ProtectedRoute>
              } />
              <Route path="/calendrier" element={
                <ProtectedRoute role="etudiant"><Calendrier /></ProtectedRoute>
              } />
              <Route path="/entretiens" element={
                <ProtectedRoute><AppointementPage /></ProtectedRoute>
              } />
              <Route path="/calendar/:id" element={
                <ProtectedRoute><AppointementPage /></ProtectedRoute>
              } />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;