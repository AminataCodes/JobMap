import React, { useState, useEffect } from 'react';

function ThemeToggle() {
  // On initialise avec le thème actuel (ou 'light' par défaut)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Dès que le thème change, on met à jour la balise <html> et le localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label="Changer de thème"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;