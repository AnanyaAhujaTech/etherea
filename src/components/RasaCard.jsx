import "./RasaCard.css";

export default function RasaCard({ event, onClick }) {
  return (
    <div className="rasa-card" onClick={onClick}>
      <h3>{event.title}</h3>
      <p>{event.rasa}</p>
      <p>{event.description}</p>

      <div className="meta">
        <span>{event.time}</span>
        <span>{event.venue}</span>
      </div>
    </div>
  );
}