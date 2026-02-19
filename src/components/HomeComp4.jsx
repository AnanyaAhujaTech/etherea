import React, { useState, useRef, useEffect } from "react";

// ==========================================
// 🛠️ CONFIGURATION
// ==========================================

const CONFIG = {
  // Layout
  cardWidth: "42vw", // Fits two side-by-side with gap
  cardMaxWidth: "700px",
  cardHeight: "55vh", // Slightly shorter than the main Hero card
  gap: "2vw",
  
  // Animation
  tiltSensitivity: 30, 
  embroideryOpacity: 0.95,
  glowColor: "192, 220, 255", 
};

// Data for the two cards
const CARDS_DATA = [
  {
    id: "dean",
    name: "Prof. Manoj Soni",
    title: "Dean Student Welfare",
    quote: "Fostering an environment where innovation meets tradition. His leadership ensures student welfare remains the heart of every celebration.",
    img: "dean.jpg",
    plate: "dean.png",
    delay: 0, // Instant start
  },
  {
    id: "advisor",
    name: "Dr. Meha Joshi",
    title: "Faculty Advisor",
    quote: "Guiding us with patience and precision. Her mentorship transforms challenges into stepping stones for success.",
    img: "advisor.jpg",
    plate: "advisor.png",
    delay: 0.2, // Slight stagger
  }
];

// Helper to resolve images
const getAsset = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// ==========================================
// 🃏 REUSABLE CARD COMPONENT
// ==========================================

const DignitaryCard = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // 3D Tilt State
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  // Tilt Handlers
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / CONFIG.tiltSensitivity;
    const y = -(e.clientY - top - height / 2) / CONFIG.tiltSensitivity;
    setRotate({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      style={{
        ...styles.cardOuter,
        width: CONFIG.cardWidth,
        maxWidth: CONFIG.cardMaxWidth,
        height: CONFIG.cardHeight,
        
        // Entry Animation
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${data.delay}s, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${data.delay}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          ...styles.cardVisual,
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          boxShadow: isHovered 
            ? `0 20px 50px rgba(${CONFIG.glowColor}, 0.25), 0 0 30px rgba(${CONFIG.glowColor}, 0.15)` 
            : `0 10px 25px rgba(0,0,0,0.5), 0 0 10px rgba(${CONFIG.glowColor}, 0.05)`,
          border: isHovered 
            ? `1px solid rgba(${CONFIG.glowColor}, 0.4)` 
            : `1px solid rgba(255, 255, 255, 0.1)`,
        }}
      >
        {/* Background */}
        <div
          style={{
            ...styles.layer,
            backgroundImage: `url(${getAsset('landscapeembroidery.png')})`,
            opacity: CONFIG.embroideryOpacity,
          }}
        />

        {/* Content */}
        <div style={styles.contentLayer}>
          
          {/* Left: Image & Frame */}
          <div style={styles.leftColumn}>
            <div style={styles.frameContainer}>
              <div style={styles.photoWrapper}>
                <img src={getAsset(data.img)} alt={data.name} style={styles.photo} />
              </div>
              <img src={getAsset('frame2.png')} alt="Frame" style={styles.frame} />
            </div>
            
            <div style={styles.plateWrapper}>
              <img src={getAsset(data.plate)} alt={data.title} style={styles.plate} />
            </div>
          </div>

          {/* Right: Text */}
          <div style={styles.rightColumn}>
            <div style={styles.textWrapper}>
              <h3 style={styles.headingTitle}>{data.title}</h3>
              <h2 style={styles.headingName}>{data.name}</h2>
              <div style={styles.divider}></div>
              <p style={styles.quote}>{data.quote}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================

export default function HomeComp4() {
  return (
    <section style={styles.container}>
      <div style={styles.gridWrapper}>
        {CARDS_DATA.map((card) => (
          <DignitaryCard key={card.id} data={card} />
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 🎨 STYLES
// ==========================================

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    paddingTop: "80px", // Navbar Offset
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    perspective: "2000px",
    overflow: "hidden",
    // 🟢 ADDED: Black Overlay Gradient Background
    background: "radial-gradient(circle at center, rgba(17, 17, 17, 0.8) 0%, rgba(0, 0, 0, 0.60) 100%)",
  },
  gridWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: CONFIG.gap,
    width: "100%",
    padding: "0 2vw",
    flexWrap: "wrap", // Wraps on very small screens
  },
  
  // --- Card Container ---
  cardOuter: {
    position: "relative",
    cursor: "default",
    minWidth: "300px", // Prevent squishing
  },
  cardVisual: {
    width: "100%",
    height: "100%",
    position: "relative",
    borderRadius: "20px",
    backgroundColor: "rgba(15, 15, 20, 0.85)",
    overflow: "hidden",
    transformStyle: "preserve-3d",
    transition: "transform 0.1s ease-out, box-shadow 0.4s ease, border 0.4s ease",
  },
  layer: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
    pointerEvents: "none",
  },
  contentLayer: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 4%",
  },

  // --- Left Column (Visuals) ---
  leftColumn: {
    flex: "0 0 42%", // Slightly narrower than main card to fit text
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    transform: "translateZ(30px)",
  },
  frameContainer: {
    position: "relative",
    width: "90%",
    maxWidth: "220px", // Smaller frame for smaller cards
    aspectRatio: "3/4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  photoWrapper: {
    position: "absolute",
    top: "13%",
    left: "13%",
    width: "74%",
    height: "74%",
    zIndex: 1,
    overflow: "hidden",
    borderRadius: "50%",
    boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  frame: {
    position: "relative",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    zIndex: 2,
  },
  plateWrapper: {
    width: "90%",
    zIndex: 3,
    transform: "translateZ(20px)",
    display: "flex",
    justifyContent: "center",
  },
  plate: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.6))",
  },

  // --- Right Column (Text) ---
  rightColumn: {
    flex: "1",
    paddingLeft: "4%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transform: "translateZ(20px)",
    textAlign: "left",
  },
  textWrapper: {
    background: "rgba(0, 0, 0, 0.25)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(4px)",
  },
  headingTitle: {
    fontFamily: '"Cinzel", serif',
    color: "#79bcff",
    fontSize: "0.7rem",
    letterSpacing: "2px",
    marginBottom: "5px",
    textTransform: "uppercase",
  },
  headingName: {
    fontFamily: '"Playfair Display", serif',
    color: "#ffffff",
    fontSize: "clamp(1.2rem, 2vw, 1.8rem)", // Smaller font for dual cards
    margin: "0 0 10px 0",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  divider: {
    width: "40px",
    height: "2px",
    background: "linear-gradient(90deg, #79bcff, transparent)",
    marginBottom: "15px",
  },
  quote: {
    fontFamily: '"Montserrat", sans-serif',
    color: "#e2e8f0",
    fontSize: "0.85rem", // Smaller text
    lineHeight: "1.6",
    fontStyle: "italic",
    opacity: 0.9,
  },
};