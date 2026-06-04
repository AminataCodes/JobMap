function AuthTabs({ role, setRole }) {
  const StudentIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );

  const CompanyIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );

  return (
    <div className="tabs">
      <button
        type="button"
        className={role === 'student' ? 'active' : ''}
        onClick={() => setRole('student')}
      >
        <StudentIcon /> Étudiant
      </button>
      <button
        type="button"
        className={role === 'company' ? 'active' : ''}
        onClick={() => setRole('company')}
      >
        <CompanyIcon /> Entreprise
      </button>
    </div>
  );
}

export default AuthTabs;