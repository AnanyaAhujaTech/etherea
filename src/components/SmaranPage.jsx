import { useState } from 'react';
import './SmaranPage.css';

// Import the existing FAQ heading image
import questionsHeadingImg from './faq.png'; 
// Import the NEW Smaran heading image
import smaranHeadingImg from './smaran.png';

// Import Card Images
import image1 from './image3.png'; 
import image2 from './image2.png';
import image3 from './image1.png';
import image4 from './image4.png';
import image5 from './image5.png';

const smaranCards = [
  {
    id: "01",
    desc: "Courtesy of Prekshya",
    color: "rgba(139, 69, 19, 0.85)", 
    glow: "rgba(205, 92, 92, 0.6)",
    image: image1,
  },
  {
    id: "02",
    desc: "Courtesy of Prekshya",
    color: "rgba(184, 134, 11, 0.85)", 
    glow: "rgba(255, 215, 0, 0.6)",
    image: image2,
  },
  {
    id: "03",
    desc: "Courtesy of Prekshya",
    color: "rgba(47, 79, 79, 0.85)", 
    glow: "rgba(64, 224, 208, 0.6)",
    image: image3,
  },
  {
    id: "04",
    desc: "Courtesy of Prekshya",
    color: "rgba(25, 25, 112, 0.85)", 
    glow: "rgba(65, 105, 225, 0.6)",
    image: image4,
  },
  {
    id: "05",
    desc: "Courtesy of Prekshya",
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
  const [hoveredQuestion, setHoveredQuestion] = useState(null);

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
                alt={card.desc} 
                className="card-bg-image" 
              />
              
              {/* Color Overlay */}
              <div className="card-overlay"></div>

              <div className="card-inner">
                <span className="card-number">{card.id}</span>
                <div className="card-content">
                  <h4>{card.id}</h4> 
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
            // Cycle through colors
            const colorObj = smaranCards[index % smaranCards.length];
            
            // Check state
            const isActive = activeQuestion === index;
            const isHovered = hoveredQuestion === index;
            const isHighlighted = isActive || isHovered;

            // Extract glow color for shadows
            const glowColor = colorObj.glow; 

            return (
              <div 
                key={index} 
                className={`faq-item ${isActive ? 'active' : ''}`}
                onClick={() => toggleQuestion(index)}
                onMouseEnter={() => setHoveredQuestion(index)}
                onMouseLeave={() => setHoveredQuestion(null)}
                style={{
                  // 1. Border
                  borderColor: glowColor.replace('0.6', '0.9'), 

                  // 2. Dynamic Box Shadow
                  boxShadow: isHighlighted 
                    ? `0 0 25px ${glowColor}, inset 0 0 15px ${glowColor}`
                    : `0 0 6px ${glowColor.replace('0.6', '0.2')}, inset 0 0 0px transparent`,

                  // 3. Dynamic Background
                  background: isHighlighted
                    ? `radial-gradient(circle at center, ${glowColor.replace('0.6', '0.25')} 0%, rgba(20,20,20,0.95) 70%)`
                    : `linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(30,30,30,0.8) 100%)`,

                  // 4. Scale effect
                  transform: isHighlighted ? "scale(1.01)" : "scale(1)",
                }}
              >
                {/* Noise Texture Overlay */}
                <div className="faq-noise-overlay" />

                <div className="faq-question">
                  <span>{item.q}</span>
                  <div className="faq-chevron"></div>
                </div>
                
                <div className={`faq-answer ${isActive ? 'open' : ''}`}>
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