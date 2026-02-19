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

// 🎨 LEVEL GLOW COLORS (RGB values)
const LEVEL_COLORS = {
  1: '255, 215, 0',    // Golden (Core Team)
  2: '192, 192, 192',  // Silver (Skipped)
  3: '64, 224, 208',   // Turquoise (Website)
  4: '255, 0, 0',      // Red (Events)
  5: '0, 0, 255',      // Blue (PR)
  6: '128, 0, 128',    // Purple (Creative)
  7: '0, 0, 255',      // Blue (HR)
  8: '128, 0, 128',    // Purple (Sponsorship)
  9: '0, 128, 0',      // Green (Socials)
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
  { id: 'core', label: 'Core Team', count: 4, clipPath: SHAPES.HEART, visualLevel: 1 },              
  { id: 'website', label: 'Website', count: 2, clipPath: SHAPES.RECTANGLE, visualLevel: 3 },
  { id: 'events', label: 'Event Management', count: 6, clipPath: SHAPES.OVAL, visualLevel: 4 },
  { id: 'pr', label: 'PR & Security', count: 5, clipPath: SHAPES.RECTANGLE, visualLevel: 5 },
  { id: 'creative', label: 'Creative', count: 2, clipPath: SHAPES.RECTANGLE, visualLevel: 6 },
  { id: 'hr', label: 'HR & Logistics', count: 6, clipPath: SHAPES.OVAL, visualLevel: 7 },
  { id: 'sponsorship', label: 'Sponsorship', count: 4, clipPath: SHAPES.RECTANGLE, visualLevel: 8 },
  { id: 'socials', label: 'Social Media', count: 2, clipPath: SHAPES.RECTANGLE, visualLevel: 9 },
];

// Generate Data
let globalMemberCounter = 1;

const TEAMS = TEAM_STRUCTURE.map((team) => {
  const levelNumber = team.visualLevel;
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
// 🃏 CARD COMPONENT
// ==========================================

const MemberCard = ({ member, isGrid, cardWidth, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

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
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        style={{
          ...styles.cardVisualWrapper,
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          boxShadow: isHovered 
            ? `0 20px 50px rgba(${glowRgb}, 0.6), 0 0 20px rgba(${glowRgb}, 0.4)` 
            : `0 10px 20px rgba(0,0,0,0.3), 0 0 10px rgba(${glowRgb}, 0.2)`,       
          border: isHovered ? `1px solid rgba(${glowRgb}, 0.3)` : '1px solid transparent',
        }}
      >
        <div
          style={{
            ...styles.layer,
            opacity: STYLE_CONFIG.embroideryOpacity, 
            backgroundImage: `url(${getAsset(member.embroidery)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

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
  const hoverTimeoutRef = useRef(null); 

  useEffect(() => {
    // Threshold adjusted to 0.5 to detect center of new scroll area
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

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 200); 
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

      {/* 🔴 FIXED TEAM HEADING (Now part of Flex layout, not absolute overlay) */}
      <div style={styles.headingContainer}>
        <img 
          src={getAsset('teamheading.png')} 
          alt="Team Heading" 
          style={styles.headingImage} 
        />
      </div>

      {/* 🟢 SIDEBAR NAVIGATION */}
      <nav 
        style={styles.sidebarContainer}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        {TEAMS.map((team, index) => {
          const reverseIndex = TEAMS.length - 1 - index;
          return (
            <button
              key={team.id}
              onClick={() => handleSidebarClick(team.id)}
              style={{
                ...styles.sidebarItem,
                opacity: isSidebarOpen ? 1 : 0,
                transform: isSidebarOpen ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: isSidebarOpen ? 'auto' : 'none',
                transitionDelay: `${reverseIndex * 50}ms`,
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

      {/* 🟢 PODIUM TOGGLE */}
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
            ...styles.podiumContainer,
            transform: activeSection === 'core' ? 'translateY(150%)' : 'translateY(0%)',
            opacity: activeSection === 'core' ? 0 : 1,
            pointerEvents: activeSection === 'core' ? 'none' : 'auto',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
        }}
      >
        <img 
          src={getAsset('podium.png')} 
          alt="Menu" 
          style={{
            ...styles.podiumImage,
            filter: isSidebarOpen 
              ? 'brightness(1.2) drop-shadow(0 0 15px gold)' 
              : 'none'
          }} 
        />
      </div>

      {/* Scrollable Content Container (Takes remaining height) */}
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
              {team.members.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isGrid={isGrid}
                  cardWidth={itemWidth}
                  delay={index * 0.15} 
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
    display: 'flex',        // 🟢 Changed to Flex
    flexDirection: 'column' // 🟢 Stack items vertically
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
  // 🔴 Heading Container (Occupies space at top)
  headingContainer: {
    width: '100%',
    height: '140px', // Fixed height for header area
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    flexShrink: 0,   // Prevent shrinking
    paddingTop: '75px',
  },
  headingImage: {
    width: 'auto',
    height: '120px', 
    maxWidth: '80%',
    objectFit: 'contain',
    // 🟡 Golden Glow Effect
    filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
  },
  // 🟢 Scroll Container (Takes remaining space)
  scrollContainer: {
    position: 'relative',
    width: '100vw',
    flex: 1, // 🟢 Takes all remaining height below heading
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none', 
    zIndex: 1, 
  },
  
  // 🟢 Sidebar Styles
  sidebarContainer: {
    position: 'fixed',
    bottom: '280px', 
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
    width: '180px',  
    height: 'auto', 
    zIndex: 101, 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'filter 0.3s ease',
  },

  // 🟢 Section (Height is now relative to scroll container)
  teamSection: {
    height: '100%', // 🟢 Matches scrollContainer height (not 100vh)
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    scrollSnapAlign: 'start',
    paddingTop: '0px', // Removed extra padding since header is separate
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
    height: '78%', 
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
    width: '90%',
    height: 'auto',
    maxHeight: '20%',
    maxWidth: '350px',
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