import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 🛠️ CONFIGURATION & DATA
// ==========================================

// ⚙️ STYLE CONFIGURATION
const STYLE_CONFIG = {
  cardMaxWidth: '350px',      
  cardMaxHeight: '65vh',      
  gridCardHeight: '35vh',     
  gridGap: '20px',            
  cardPadding: '15px',        
  embroideryOpacity: 0.9,     
  photoRadius: '0px',         
};

// 🎨 LEVEL GLOW COLORS (RGB values for easy opacity manipulation)
const LEVEL_COLORS = {
  1: '255, 215, 0',    // Golden
  2: '192, 192, 192',  // Silver
  3: '64, 224, 208',   // Turquoise
  4: '255, 0, 0',      // Red
  5: '0, 0, 255',      // Blue
  6: '128, 0, 128',    // Purple
  7: '0, 0, 255',      // Blue
  8: '128, 0, 128',    // Purple
  9: '0, 128, 0',      // Green
};

// Helper to resolve images
const getAsset = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// 🟢 SHAPE DEFINITIONS
const SHAPES = {
  HEART: 'polygon(50% 15%, 65% 5%, 85% 5%, 100% 30%, 85% 65%, 50% 95%, 15% 65%, 0% 30%, 15% 5%, 35% 5%)',
  RECTANGLE: 'inset(2% 2% 2% 2%)',
  OVAL: 'ellipse(50% 50% at 50% 50%)', 
};

// Team Hierarchy Definitions
const TEAM_STRUCTURE = [
  { id: 'president', label: 'President', count: 1, clipPath: SHAPES.HEART },
  { id: 'core', label: 'Core Team', count: 3, clipPath: SHAPES.OVAL },              
  { id: 'website', label: 'Website', count: 2, clipPath: SHAPES.RECTANGLE },
  { id: 'events', label: 'Event Management', count: 6, clipPath: SHAPES.OVAL },
  { id: 'pr', label: 'PR & Security', count: 5, clipPath: SHAPES.RECTANGLE },
  { id: 'creative', label: 'Creative', count: 2, clipPath: SHAPES.RECTANGLE },
  { id: 'hr', label: 'HR & Logistics', count: 6, clipPath: SHAPES.OVAL },
  { id: 'sponsorship', label: 'Sponsorship', count: 4, clipPath: SHAPES.RECTANGLE },
  { id: 'socials', label: 'Social Media', count: 2, clipPath: SHAPES.RECTANGLE },
];

// Generate Data
let globalMemberCounter = 1;

const TEAMS = TEAM_STRUCTURE.map((team, index) => {
  const levelNumber = index + 1;

  const members = Array.from({ length: team.count }).map(() => {
    const memberId = globalMemberCounter;
    globalMemberCounter++;

    return {
      id: memberId,
      level: levelNumber, 
      embroidery: `embroidery${levelNumber}.png`, 
      frame: `frame${levelNumber}.png`,
      clipPath: team.clipPath, 
      photo: `member${memberId}.jpg`, 
      plate: `plate${memberId}.png`,
    };
  });

  return { ...team, levelNumber, members };
});

// ==========================================
// 🃏 CARD COMPONENT (With 3D Effect & Glow)
// ==========================================

const MemberCard = ({ member, isGrid, cardWidth }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D Tilt State
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20; 
    const y = -(e.clientY - top - height / 2) / 20;
    setRotate({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 }); 
  };

  // Determine Glow Color
  const glowRgb = LEVEL_COLORS[member.level] || '255, 255, 255';

  return (
    <div
      ref={cardRef}
      style={{
        ...styles.cardOuterWrapper,
        width: cardWidth, 
        height: isGrid ? STYLE_CONFIG.gridCardHeight : '100%',
        maxWidth: isGrid ? 'none' : STYLE_CONFIG.cardMaxWidth,
        maxHeight: isGrid ? 'none' : STYLE_CONFIG.cardMaxHeight,
        padding: isGrid ? '0' : `0 ${STYLE_CONFIG.cardPadding}`,
        perspective: '1000px', 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        style={{
          ...styles.cardVisualWrapper,
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          // Colored Glow Logic
          boxShadow: isHovered 
            ? `0 20px 50px rgba(${glowRgb}, 0.6), 0 0 20px rgba(${glowRgb}, 0.4)` 
            : `0 10px 20px rgba(0,0,0,0.3), 0 0 10px rgba(${glowRgb}, 0.2)`,       
          border: isHovered ? `1px solid rgba(${glowRgb}, 0.3)` : '1px solid transparent',
        }}
      >
        
        {/* Background Layer */}
        <div
          style={{
            ...styles.layer,
            opacity: STYLE_CONFIG.embroideryOpacity, 
            backgroundImage: `url(${getAsset(member.embroidery)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Content Wrapper */}
        <div style={styles.contentWrapper}>
          <div style={styles.frameAssembly}>
            <div style={{
              ...styles.photoContainer,
              clipPath: member.clipPath, 
              WebkitClipPath: member.clipPath, 
            }}>
              <img
                src={getAsset(member.photo)}
                alt={`Member ${member.id}`}
                style={{
                  ...styles.memberPhoto,
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            </div>
            <img src={getAsset(member.frame)} alt="Frame" style={styles.frameImage} />
          </div>

          <div style={styles.plateContainer}>
            <img src={getAsset(member.plate)} alt="Info Plate" style={styles.plateImage} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN PAGE COMPONENT
// ==========================================

const Team = ({ navHeight }) => {
  const [activeSection, setActiveSection] = useState(TEAMS[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSidebarClick = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Fixed Global Background */}
      <div
        style={{
          ...styles.fixedBackground,
          backgroundImage: `url(${getAsset('background.png')})`,
        }}
      />

      {/* 🟢 SIDEBAR NAVIGATION */}
      <nav style={styles.sidebarContainer}>
        {TEAMS.map((team, index) => {
          const reverseIndex = TEAMS.length - 1 - index;
          
          return (
            <button
              key={team.id}
              onClick={() => handleSidebarClick(team.id)}
              style={{
                ...styles.sidebarItem,
                // Cascade Animation Logic
                opacity: isSidebarOpen ? 1 : 0,
                transform: isSidebarOpen ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: isSidebarOpen ? 'auto' : 'none',
                transitionDelay: `${reverseIndex * 50}ms`, // Staggered delay
                
                // Active State Styling
                borderRight: activeSection === team.id ? '3px solid #79bcff' : '3px solid transparent',
                textShadow: activeSection === team.id ? '0 0 10px rgba(121, 188, 255, 0.8)' : 'none',
                color: activeSection === team.id ? '#fff' : 'rgba(255,255,255,0.6)',
              }}
            >
              {team.label}
            </button>
          );
        })}
      </nav>

      {/* 🟢 PODIUM TOGGLE BUTTON */}
      <div 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={styles.podiumContainer}
      >
        <img 
          src={getAsset('podium.png')} 
          alt="Menu" 
          style={{
            ...styles.podiumImage,
            filter: isSidebarOpen ? 'brightness(1.2) drop-shadow(0 0 15px gold)' : 'none'
          }} 
        />
      </div>

      {/* Scrollable Content Container */}
      <div style={styles.scrollContainer}>
        {TEAMS.map((team) => {
          const isGrid = team.members.length >= 5 || team.id === 'sponsorship';
          
          let itemWidth;
          if (isGrid) {
             if (team.id === 'sponsorship') itemWidth = '40%'; 
             else itemWidth = '30%'; 
          } else {
             itemWidth = `${100 / team.members.length}%`;
          }

          return (
            <section
              key={team.id}
              id={team.id}
              ref={(el) => (sectionRefs.current[team.id] = el)}
              style={{
                ...styles.teamSection,
                display: 'flex',
                flexWrap: isGrid ? 'wrap' : 'nowrap',
                justifyContent: 'center',
                alignContent: 'center', 
                gap: isGrid ? STYLE_CONFIG.gridGap : '0',
                paddingLeft: isGrid ? '10%' : '0', 
                paddingRight: isGrid ? '10%' : '0',
              }}
            >
              {team.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isGrid={isGrid}
                  cardWidth={itemWidth}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 🎨 STYLES
// ==========================================

const styles = {
  pageWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#050505',
  },
  fixedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.6)', 
  },
  scrollContainer: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none', 
    zIndex: 1, 
  },
  
  // 🟢 Sidebar is now Fixed and independent of Flexbox
  sidebarContainer: {
    position: 'fixed',
    bottom: '280px', // Adjusted to sit above the larger podium
    right: '2rem',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column', 
    gap: '0.5rem',
    alignItems: 'flex-end',
    pointerEvents: 'none', 
  },
  sidebarItem: {
    background: 'transparent',
    border: 'none',
    fontFamily: '"Times New Roman", serif',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textAlign: 'right',
    padding: '0.4rem 1rem',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  // 🟢 Podium Button Styles
  podiumContainer: {
    position: 'fixed',
    bottom: '0px',
    right: '20px',
    width: '180px',  // 🟢 INCREASED SIZE
    height: 'auto', // 🟢 INCREASED SIZE
    zIndex: 101, 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
  },
  podiumImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'filter 0.3s ease',
  },

  teamSection: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    scrollSnapAlign: 'start',
    paddingTop: '60px', 
    boxSizing: 'border-box',
  },
  
  // --- Card Styles ---
  cardOuterWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box', 
  },
  cardVisualWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', 
    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, border 0.3s ease', 
    borderRadius: '10px', 
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    transition: 'transform 0.5s ease',
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%', 
    width: '100%',
    gap: '5%', 
    padding: '10px',
    boxSizing: 'border-box',
    pointerEvents: 'none', 
  },
  frameAssembly: {
    position: 'relative',
    height: '65%', 
    width: 'auto',
    maxWidth: '100%', 
    aspectRatio: '3/4', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    position: 'absolute',
    top: '15%',     
    left: '15%',    
    width: '70%',   
    height: '70%',
    zIndex: 3,
    overflow: 'hidden',
    borderRadius: STYLE_CONFIG.photoRadius, 
  },
  memberPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  frameImage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 4,
    objectFit: 'contain',
  },
  plateContainer: {
    width: '85%',
    height: 'auto',
    maxHeight: '20%',
    maxWidth: '300px',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))',
  },
};

export default Team;