import React, { useState, useRef, useEffect } from "react";

// ==========================================
// 🛠️ CONFIGURATION
// ==========================================

const CONFIG = {
  // Dimensions
  cardWidth: "85vw",
  cardMaxWidth: "1100px",
  cardHeight: "70vh", // Adjusted for better fit within the centered view
  
  // Animation
  tiltSensitivity: 40, 
  embroideryOpacity: 0.95,
  
  // Glow Color
  glowColor: "192, 220, 255", 
  
  // Text Content
  vcName: "Prof. Ranjana Jha",
  vcTitle: "Vice Chancellor, IGDTUW",
  vcQuote: "A visionary leader whose guidance illuminates our path. As the Patron of Taarangana, her unwavering support and wisdom empower us to transcend boundaries and celebrate the symphony of emotions.",
};

// Helper to resolve images
const getAsset = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

export default function HomeComp3() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // 3D Tilt State
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  // 🟢 1. INTERSECTION OBSERVER (Fade In)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // 🟢 2. MOUSE TILT HANDLERS
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    // Calculate rotation
    const x = (e.clientX - left - width / 2) / CONFIG.tiltSensitivity;
    const y = -(e.clientY - top - height / 2) / CONFIG.tiltSensitivity;
    
    setRotate({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={containerRef}
      style={styles.container}
    >
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
          transition: 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* 🟢 VISUAL WRAPPER */}
        <div
          style={{
            ...styles.cardVisual,
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.01 : 1})`,
            boxShadow: isHovered 
              ? `0 30px 60px rgba(${CONFIG.glowColor}, 0.3), 0 0 40px rgba(${CONFIG.glowColor}, 0.2)` 
              : `0 15px 35px rgba(0,0,0,0.5), 0 0 10px rgba(${CONFIG.glowColor}, 0.05)`,
            border: isHovered 
              ? `1px solid rgba(${CONFIG.glowColor}, 0.4)` 
              : `1px solid rgba(255, 255, 255, 0.1)`,
          }}
        >
          
          {/* 1️⃣ BACKGROUND LAYER */}
          <div
            style={{
              ...styles.layer,
              backgroundImage: `url(${getAsset('landscapeembroidery.png')})`,
              opacity: CONFIG.embroideryOpacity,
            }}
          />

          {/* 2️⃣ CONTENT LAYER (Split Layout) */}
          <div style={styles.contentLayer}>
            
            {/* --- LEFT SIDE: IMAGE ASSEMBLY --- */}
            <div style={styles.leftColumn}>
              
              {/* Frame & Photo */}
              <div style={styles.frameContainer}>
                {/* OVAL MASK for Photo */}
                <div style={styles.photoWrapper}>
                  <img 
                    src={getAsset('vc.jpg')} 
                    alt="VC" 
                    style={styles.photo} 
                  />
                </div>
                {/* The Frame */}
                <img 
                  src={getAsset('frame2.png')} 
                  alt="Frame" 
                  style={styles.frame} 
                />
              </div>

              {/* Name Plate */}
              <div style={styles.plateWrapper}>
                <img 
                  src={getAsset('vc.png')} 
                  alt={CONFIG.vcName} 
                  style={styles.plate} 
                />
              </div>

            </div>

            {/* --- RIGHT SIDE: TEXT --- */}
            <div style={styles.rightColumn}>
              <div style={styles.textWrapper}>
                <h3 style={styles.headingTitle}>OUR PATRON</h3>
                <h2 style={styles.headingName}>{CONFIG.vcName}</h2>
                <div style={styles.divider}></div>
                <p style={styles.quote}>
                  {CONFIG.vcQuote}
                </p>
                <div style={styles.decorationIcon}>✦</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 🎨 STYLES
// ==========================================

const styles = {
  // Container: Consumes full viewport height, accounts for Navbar
  container: {
    width: "100%",
    height: "100vh", 
    paddingTop: "80px", 
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center", 
    alignItems: "center",     
    perspective: "1500px",
    position: "relative",
    overflow: "hidden",
    // 🟢 ADDED: Black Overlay Gradient Background
    background: "radial-gradient(circle at center, rgba(17, 17, 17, 0.8) 0%, rgba(0, 0, 0, 0.60) 100%)",
  },
  cardOuter: {
    position: "relative",
    cursor: "default",
    willChange: "transform, opacity", 
  },
  cardVisual: {
    width: "100%",
    height: "100%",
    position: "relative",
    borderRadius: "24px",
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
    padding: "0 5%",
  },

  // --- LEFT COLUMN (Image) ---
  leftColumn: {
    flex: "0 0 45%", 
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center",
    gap: "30px", 
    transform: "translateZ(30px)", 
  },
  frameContainer: {
    position: "relative",
    width: "80%",
    maxWidth: "340px", 
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
    borderRadius: "50%", // Oval Mask
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)", 
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
    width: "75%",
    zIndex: 3,
    transform: "translateZ(20px)",
    display: "flex",
    justifyContent: "center",
  },
  plate: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.6))",
  },

  // --- RIGHT COLUMN (Text) ---
  rightColumn: {
    flex: "1", 
    paddingLeft: "5%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transform: "translateZ(20px)",
    textAlign: "left",
  },
  textWrapper: {
    background: "rgba(0, 0, 0, 0.3)", 
    padding: "30px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(4px)",
  },
  headingTitle: {
    fontFamily: '"Cinzel", serif', 
    color: "#79bcff",
    fontSize: "0.9rem",
    letterSpacing: "3px",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  headingName: {
    fontFamily: '"Playfair Display", serif',
    color: "#ffffff",
    fontSize: "clamp(2rem, 3.5vw, 3.2rem)", 
    margin: "0 0 16px 0",
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
  },
  divider: {
    width: "60px",
    height: "3px",
    background: "linear-gradient(90deg, #79bcff, transparent)",
    marginBottom: "24px",
  },
  quote: {
    fontFamily: '"Montserrat", sans-serif',
    color: "#e2e8f0",
    fontSize: "1.1rem",
    lineHeight: "1.7",
    fontStyle: "italic",
    opacity: 0.9,
  },
  decorationIcon: {
    marginTop: "20px",
    color: "#79bcff",
    fontSize: "1.5rem",
    opacity: 0.6,
  },
};