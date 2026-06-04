import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protège une route selon l'authentification et le rôle
 *
 * Usage :
 * <ProtectedRoute>                        → juste connecté
 * <ProtectedRoute role="etudiant">        → étudiant seulement
 * <ProtectedRoute role="entreprise">      → entreprise seulement
 */
export function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Pas connecté → redirige vers login en gardant l'URL d'origine
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Connecté mais mauvais rôle → redirige vers la page d'accueil
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}