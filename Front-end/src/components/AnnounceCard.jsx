import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AnnounceCard.css'

const TOKEN = 'pk_RgZv9IVvRsCQxCCmTGIIUw'

function AnnounceCard({ company, domain, post, date, location, preview, tag }) {
  const [imgError, setImgError] = useState(false)

  const tagClass = tag.includes('Populaire') ? 'card__badge--hot'
    : tag.includes('Urgent') ? 'card__badge--urgent'
    : 'card__badge--new'

  const navigate = useNavigate()

  return (
    <div className="card" onClick={()=>{
      navigate('/offre')
    }} >
      <div className="card__header">
        <div className="card__logo">
          {!imgError ? (
            <img
              src={`https://img.logo.dev/${domain}?token=${TOKEN}&size=40`}
              alt={company}
              className="card__logo-img"
              onError={() => setImgError(true)}
            />
          ) : (
            company.charAt(0)
          )}
        </div>
        <div className="card__info">
          <h3 className="card__company">{company}</h3>
          <p className="card__post">{post}</p>
        </div>
        <span className={`card__badge ${tagClass}`}>{tag}</span>
      </div>
      <p className="card__preview">{preview}</p>
      <div className="card__footer">
        <span className="card__location">📍 {location}</span>
        <span className="card__date">🕐 {date}</span>
      </div>
    </div>
  )
}

export default AnnounceCard