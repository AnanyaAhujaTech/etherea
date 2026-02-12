import "./EventDialog.css";

export default function EventDialog({ event, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose}>X</button>

        <img src={event.image} alt={event.title} />

        <h2>{event.title}</h2>
        <p>{event.rasa}</p>
        <p>{event.description}</p>

        <div className="why-box">
          <p>{event.why}</p>
        </div>

        <button>REGISTER NOW</button>

      </div>
    </div>
  );
}