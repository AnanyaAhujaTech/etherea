import { useState } from 'react';
import './SmaranPage.css';

// Import the existing FAQ heading image
import questionsHeadingImg from './faq.png'; 
// Import the NEW Smaran heading image
import smaranHeadingImg from './smaran.png';

// Import Card Images
import image1 from './image1.png'; // Ensure these extensions match your actual files (jpg/png)
import image2 from './image2.png';
import image3 from './image3.png';
import image4 from './image1.png';
import image5 from './image2.png';

const smaranCards = [
  {
    id: "01",
    title: "Opening Ceremony",
    desc: "A thousand lanterns light the night sky.",
    color: "rgba(184, 134, 11, 0.85)", // Increased opacity for overlay effect
    glow: "rgba(255, 215, 0, 0.6)",
    image: image1,
  },
  {
    id: "02",
    title: "Rasa Dance",
    desc: "Performers embody emotion in flux.",
    color: "rgba(139, 69, 19, 0.85)", 
    glow: "rgba(205, 92, 92, 0.6)",
    image: image2,
  },
  {
    id: "03",
    title: "Cosmic Music",
    desc: "Silent sunrise on mountain peaks.",
    color: "rgba(47, 79, 79, 0.85)", 
    glow: "rgba(64, 224, 208, 0.6)",
    image: image3,
  },
  {
    id: "04",
    title: "Art Installation",
    desc: "Interactive sound and light.",
    color: "rgba(25, 25, 112, 0.85)", 
    glow: "rgba(65, 105, 225, 0.6)",
    image: image4,
  },
  {
    id: "05",
    title: "Closing Night",
    desc: "Unity under stars, hearts intertwined.",
    color: "rgba(75, 0, 130, 0.85)", 
    glow: "rgba(138, 43, 226, 0.6)",
    image: image5,
  },
];

const questions = [
  {
    q: "When and where is Etherea taking place?",
    a: "The fest will be held on February 26-27, 2025 at the IGDTUW campus. The event will start at 11:00 AM and continue until 8:30 PM on both days.",
  },
  {
    q: "How can I register for the competitions?",
    a: "Registration for all competitions is available online on Unstop through our official website. Navigate to the 'Events' section and select the competitions you'd like to participate in. The Events registration will be live soon.",
  },
  {
    q: "Is there an entry fee for the fest?",
    a: "General entry to the fest is free for all students with a valid college ID and pass. Entry to the fest is strictly through passes.",
  },
  {
    q: "Who are the celebrity performers this year?",
    a: "It's a surprise.",
  },
  {
    q: "Who can attend Taarangana?",
    a: "While organized by IGDTUW, Taarangana is open to students from various colleges and universities, fostering a diverse and inclusive environment.",
  },
  {
    q: "How can one stay updated about Fest passes?",
    a: "The scheduled release of passes will be posted in the website soon."
  }
];

export default function SmaranPage() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="smaran-container">
      
      {/* SECTION 1: SMARAN CARDS */}
      <section className="smaran-section">
        <div className="smaran-header">
          <img 
            src={smaranHeadingImg} 
            alt="Smaran" 
            className="smaran-main-heading-img"
          />
          <h3 className="smaran-subtitle">A Retrospective</h3>
        </div>

        <div className="cards-wrapper">
          {smaranCards.map((card, index) => (
            <div 
              key={card.id} 
              className="smaran-card"
              style={{ 
                '--card-bg': card.color, 
                '--card-glow': card.glow,
              }}
            >
              {/* Background Image */}
              <img 
                src={card.image} 
                alt={card.title} 
                className="card-bg-image" 
              />
              
              {/* Color Overlay to ensure text readability */}
              <div className="card-overlay"></div>

              <div className="card-inner">
                <span className="card-number">{card.id}</span>
                <div className="card-content">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: QUESTIONS (FAQ) */}
      <section className="smaran-section faq-section-spacing">
        <div className="faq-header">
          <img 
            src={questionsHeadingImg} 
            alt="Jigyasa aur Spashtata (Curiosity and Clarity)" 
            className="smaran-heading-img"
          />
          <p className="smaran-text">Everything you need to know</p>
        </div>

        <div className="faq-list">
          {questions.map((item, index) => {
            const colorObj = smaranCards[index % smaranCards.length];
            return (
              <div 
                key={index} 
                className={`faq-item ${activeQuestion === index ? 'active' : ''}`}
                onClick={() => toggleQuestion(index)}
                style={{
                  '--faq-bg': colorObj.color,
                  '--faq-border': colorObj.glow
                }}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <div className="faq-chevron"></div>
                </div>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}