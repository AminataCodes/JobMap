import { useState, useRef } from 'react';

function UploadBox({ label, accept = '*', hint = '', onFileChange }) {
  const [filename, setFilename] = useState('');
  const inputRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilename(file.name);
      onFileChange?.(file);
    }
  };

  const UploadIcon = () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="upload-box" onClick={() => inputRef.current.click()}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <div className="upload-box-icon"><UploadIcon /></div>
        {filename ? (
          <span className="upload-box-filename">📄 {filename}</span>
        ) : (
          <>
            <span className="upload-box-label">Cliquez pour choisir un fichier</span>
            {hint && <span className="upload-box-hint">{hint}</span>}
          </>
        )}
      </div>
    </div>
  );
}

export default UploadBox;