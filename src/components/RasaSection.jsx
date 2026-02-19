import { useState } from "react";
import "./RasaSection.css";

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const events = [
  { id: 1, title: "Antra", rasa: "Adbhuta", emotion: "Wonder", eventType: "Group Singing", description: "When multiple voices blend into harmony, something greater than the individual emerges.", whyRasa: "Group singing evokes awe through collective resonance, unpredictability, and the sheer wonder of shared musical expression.", time: "Day 1, 1:00 PM", venue: "Main Stage", borderColor: "rgba(59,130,246,0.5)", rasaColor: "#60a5fa", icon: "🎭" },
  { id: 2, title: "Rap Battle", rasa: "Raudra", emotion: "Fury", eventType: "Solo Rap", description: "Channel raw intensity, confrontation, and unfiltered emotion through aggressive cadence and lyrical warfare.", whyRasa: "Rap battles embody fury through verbal confrontation, intense energy, and the raw power of unfiltered expression.", time: "Day 1, 1:30 PM", venue: "Auditorium", borderColor: "rgba(239,68,68,0.5)", rasaColor: "#f87171", icon: "🔥" },
  { id: 3, title: "Aaghaaz", rasa: "Bibhatsa", emotion: "Disgust", eventType: "Nukkad Natak", description: "Confront social evils head-on, exposing corruption, injustice, and hypocrisy through powerful street performances.", whyRasa: "Street theatre channels disgust at social injustice into powerful performances that confront audiences with uncomfortable truths.", time: "Day 1, 11:00 AM", venue: "Badminton Court", borderColor: "rgba(168,85,247,0.5)", rasaColor: "#c084fc", icon: "🎪" },
  { id: 4, title: "Slam Poetry", rasa: "Bhayanaka", emotion: "Fear", eventType: "Open Mic", description: "True expression requires vulnerability. Face the fear of being seen, heard, and judged.", whyRasa: "Slam poetry embodies fear through the vulnerability of standing alone, bearing your soul, and facing judgment from the audience.", time: "Day 2, 3:30 PM", venue: "Auditorium", borderColor: "rgba(20,184,166,0.5)", rasaColor: "#2dd4bf", icon: "📜" },
  { id: 5, title: "Aalap", rasa: "Shanta", emotion: "Peace", eventType: "Solo Singing", description: "A solitary voice, unaccompanied and introspective, creates an atmosphere of calm and contemplation.", whyRasa: "Solo singing in the aalap form represents the pursuit of inner peace through meditative, unhurried musical exploration.", time: "Day 2, 11:00 AM", venue: "Auditorium", borderColor: "rgba(34,211,238,0.5)", rasaColor: "#22d3ee", icon: "🕊️" },
  { id: 6, title: "Lilac Dreams", rasa: "Shringara", emotion: "Love & Beauty", eventType: "Fashion Show", description: "Celebrate aesthetic pleasure, grace, confidence, and allure through visual and stylistic expression.", whyRasa: "Fashion embodies love and beauty through the celebration of aesthetics, self-expression, and the art of visual allure.", time: "Day 2, 11:00 AM", venue: "Main Stage", borderColor: "rgba(236,72,153,0.5)", rasaColor: "#f472b6", icon: "💜" },
  { id: 7, title: "Mr. & Ms. Taarangana", rasa: "Hasya", emotion: "Joy & Laughter", eventType: "Talent & Personality", description: "Entertainment, wit, spontaneity, and audience engagement define this celebration of joy and laughter.", whyRasa: "This event captures joy through humor, spontaneity, and the infectious energy of performers connecting with their audience.", time: "Day 1, 11:00 AM", venue: "Main Stage", borderColor: "rgba(234,179,8,0.5)", rasaColor: "#facc15", icon: "😄" },
  { id: 8, title: "Urban Thump", rasa: "Veera", emotion: "Heroic Energy", eventType: "Group Dance", description: "High-impact choreography demands strength, stamina, and collective discipline.", whyRasa: "Group dance embodies heroic energy through synchronized power, physical prowess, and the courage to command the stage.", time: "Day 2, 1:30 PM", venue: "Main Stage", borderColor: "rgba(249,115,22,0.5)", rasaColor: "#fb923c", icon: "💪" },
  { id: 9, title: "Rangmancha", rasa: "Karuna", emotion: "Compassion", eventType: "Solo Acting", description: "Step into another's emotional reality through empathy, vulnerability, and deep human connection.", whyRasa: "Solo acting channels compassion by requiring the performer to deeply inhabit another's pain, joy, and emotional truth.", time: "Day 1, 11:00 AM", venue: "Auditorium", borderColor: "rgba(244,63,94,0.5)", rasaColor: "#fb7185", icon: "🎭" },
];

export default function RasaSection() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="rasa-container">
      <div className="rasa-header">
        <h1 className="rasa-title">The Nine <span>Rasas</span></h1>
        <p className="rasa-subtitle">Each event embodies one of the nine classical emotions — discover the essence that resonates with your soul</p>
      </div>

      <div className="rasa-grid">
        {events.map((e) => (
          <button
            key={e.id}
            className="rasa-card"
            style={{ "--card-border": e.borderColor, "--rasa-color": e.rasaColor }}
            onClick={() => setSelected(e)}
          >
            <div className="rasa-card-icon">?</div>
            <h3 className="rasa-card-title">{e.title}</h3>
            <p className="rasa-card-rasa">{e.rasa} · {e.emotion}</p>
            <p className="rasa-card-desc">{e.eventType} – {e.description}</p>
            <div className="rasa-card-meta">
              <span><ClockIcon />{e.time}</span>
              <span><PinIcon />{e.venue}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="rasa-overlay" onClick={() => setSelected(null)}>
          <div className="rasa-dialog" onClick={(ev) => ev.stopPropagation()} style={{ "--rasa-color": selected.rasaColor }}>
            <button className="rasa-dialog-close" onClick={() => setSelected(null)}>✕</button>
            <div className="rasa-dialog-icon">
              <div className="rasa-dialog-icon-circle">{selected.icon}</div>
            </div>
            <div className="rasa-dialog-body">
              <h2 className="rasa-dialog-title">{selected.title}</h2>
              <p className="rasa-dialog-rasa">{selected.rasa} · {selected.emotion}</p>
              <div className="rasa-dialog-meta">
                <span><ClockIcon />{selected.time}</span>
                <span><PinIcon />{selected.venue}</span>
              </div>
              <p className="rasa-dialog-desc">{selected.eventType} – {selected.description}</p>
              <div className="rasa-why-box">
                <p className="rasa-why-title">Why {selected.rasa}?</p>
                <p className="rasa-why-text">{selected.whyRasa}</p>
              </div>
              <button className="rasa-register-btn">Coming Soon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}