import { useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/Messagerie.css'

const conversations = [
  {
    id: 1,
    company: "Google",
    domain: "google.com",
    post: "Stage Développeur Frontend",
    lastMessage: "Bonjour, nous avons bien reçu votre candidature...",
    time: "10:24",
    unread: 2,
  },
  {
    id: 2,
    company: "Doctolib",
    domain: "doctolib.fr",
    post: "Stage Ingénieur Backend",
    lastMessage: "Nous souhaitons vous convier à un entretien...",
    time: "Hier",
    unread: 1,
  },
  {
    id: 3,
    company: "Spotify",
    domain: "spotify.com",
    post: "Stage UX Design",
    lastMessage: "Merci pour votre intérêt, nous reviendrons...",
    time: "Lun",
    unread: 0,
  },
]

const initialMessages = {
  1: [
    { from: "company", text: "Bonjour, nous avons bien reçu votre candidature et sommes intéressés par votre profil.", time: "10:20" },
    { from: "company", text: "Seriez-vous disponible pour un entretien la semaine prochaine ?", time: "10:24" },
  ],
  2: [
    { from: "company", text: "Nous souhaitons vous convier à un entretien le jeudi 22 mai à 14h00.", time: "Hier" },
  ],
  3: [
    { from: "company", text: "Merci pour votre intérêt. Nous reviendrons vers vous prochainement.", time: "Lun" },
  ],
}

const TOKEN = 'pk_RgZv9IVvRsCQxCCmTGIIUw'

function Messagerie() {
  const [activeId, setActiveId] = useState(1)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const activeConv = conversations.find(c => c.id === activeId)
  const activeMessages = messages[activeId] || []

  function sendMessage() {
    if (!input.trim()) return
    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), { from: "me", text: input, time: "À l'instant" }]
    }))
    setInput('')
  }

  return (
    <div className="messagerie">
      
      <div className="messagerie__main">

        {/* Liste conversations */}
        <aside className="messagerie__list">
          <h2 className="messagerie__list-title">Messagerie</h2>
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conv__item ${activeId === conv.id ? 'conv__item--active' : ''}`}
              onClick={() => setActiveId(conv.id)}
            >
              <div className="conv__logo">
                <img
                  src={`https://img.logo.dev/${conv.domain}?token=${TOKEN}&size=40`}
                  alt={conv.company}
                  className="conv__logo-img"
                />
              </div>
              <div className="conv__info">
                <div className="conv__top">
                  <span className="conv__company">{conv.company}</span>
                  <span className="conv__time">{conv.time}</span>
                </div>
                <div className="conv__top">
                  <span className="conv__preview">{conv.lastMessage}</span>
                  {conv.unread > 0 && (
                    <span className="conv__unread">{conv.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </aside>

        {/* Fil de messages */}
        <div className="messagerie__chat">
          <div className="chat__header">
            <img
              src={`https://img.logo.dev/${activeConv.domain}?token=${TOKEN}&size=40`}
              alt={activeConv.company}
              className="chat__header-logo"
            />
            <div>
              <h3 className="chat__header-company">{activeConv.company}</h3>
              <p className="chat__header-post">{activeConv.post}</p>
            </div>
          </div>

          <div className="chat__messages">
            {activeMessages.map((msg, i) => (
              <div key={i} className={`chat__bubble-wrap ${msg.from === 'me' ? 'chat__bubble-wrap--me' : ''}`}>
                <div className={`chat__bubble ${msg.from === 'me' ? 'chat__bubble--me' : 'chat__bubble--company'}`}>
                  <p>{msg.text}</p>
                  <span className="chat__time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="chat__input-wrap">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Écrire un message..."
              className="chat__input"
            />
            <button className="chat__send" onClick={sendMessage}>Envoyer</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Messagerie 