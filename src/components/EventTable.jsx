import React, { useRef, useState } from "react";

// Updated Data with "Neon" colors
const scheduleData = [
  { type: "header", label: "Day - 1" },
  { 
    event: "Ms. and Mr. Taarangana", 
    venue: "Main Stage", 
    time: "11:00 am - 1:00 pm", 
    borderColor: "rgba(255, 215, 0, 0.8)", 
    glowColor: "rgba(255, 215, 0, 0.6)"   
  },
  { 
    event: "Rangmanch", 
    venue: "Auditorium", 
    time: "11:00 am - 1:30 pm", 
    borderColor: "rgba(60, 160, 255, 0.9)", 
    glowColor: "rgba(60, 160, 255, 0.6)"  
  },
  { 
    event: "Aaghaaz", 
    venue: "Badminton Court", 
    time: "11:00 am - 3:00 pm", 
    borderColor: "rgba(50, 255, 50, 0.8)", 
    glowColor: "rgba(50, 255, 50, 0.5)"   
  },
  { 
    event: "Antra", 
    venue: "Main Stage", 
    time: "1:00 pm - 3:30 pm", 
    borderColor: "rgba(0, 255, 255, 0.8)", 
    glowColor: "rgba(0, 255, 255, 0.5)"   
  },
  { 
    event: "Rap Battle", 
    venue: "Auditorium", 
    time: "1:30 pm - 3:30 pm", 
    borderColor: "rgba(255, 80, 80, 0.9)", 
    glowColor: "rgba(255, 80, 80, 0.5)"   
  },
  { type: "header", label: "Day - 2" },
  { 
    event: "Aalap", 
    venue: "Auditorium", 
    time: "11:00 am - 1:30 pm", 
    borderColor: "rgba(255, 255, 255, 0.9)", 
    glowColor: "rgba(255, 255, 255, 0.5)" 
  },
  { 
    event: "Lilac Dreams", 
    venue: "Main Stage", 
    time: "11:00 am - 1:30 pm", 
    borderColor: "rgba(255, 100, 255, 0.9)", 
    glowColor: "rgba(255, 100, 255, 0.5)" 
  },
  { 
    event: "Urban Thump", 
    venue: "Main Stage", 
    time: "1:30 pm - 4:00 pm", 
    borderColor: "rgba(80, 180, 255, 0.9)", 
    glowColor: "rgba(80, 180, 255, 0.5)"  
  },
  { 
    event: "Slam Poetry", 
    venue: "Auditorium", 
    time: "3:30 pm - 5:30 pm", 
    borderColor: "rgba(180, 100, 255, 0.9)", 
    glowColor: "rgba(180, 100, 255, 0.5)" 
  },
];

export default function EventTable({ onReturnToClock, navHeight = "80px" }) {
  const listRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleListWheel = (e) => {
    if (listRef.current) {
      const { scrollTop } = listRef.current;
      if (scrollTop === 0 && e.deltaY < 0) {
        if (onReturnToClock) onReturnToClock();
      } else {
        e.stopPropagation();
      }
    }
  };

  return (
    <div style={{...styles.container, paddingTop: navHeight}}>
      <div style={styles.contentWrapper}>
        
        {/* --- HEADING IMAGE SECTION --- */}
        <div style={styles.headingContainer}>
          <div style={styles.headingGlow} />
          <img 
            src="/assets/itinerary_heading.png" 
            alt="Navrasa In Motion" 
            style={styles.headingImage} 
          />
        </div>

        {/* --- TABLE SECTION --- */}
        <div style={styles.tableContainer}>
          <div style={styles.headerRow}>
            <div style={styles.headerCell}>Event</div>
            <div style={styles.headerCell}>Venue</div>
            <div style={styles.headerCell}>Time</div>
          </div>

          <div 
            ref={listRef} 
            style={styles.scrollableBody}
            onWheel={handleListWheel}
          >
            {scheduleData.map((item, index) => {
              if (item.type === "header") {
                return (
                  <div key={index} style={styles.dayHeader}>
                    {item.label}
                  </div>
                );
              }

              const isHovered = hoveredIndex === index;

              return (
                <div 
                  key={index} 
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    ...styles.dataRow,
                    
                    // 1. Always use the Item's specific color for the border
                    borderColor: item.borderColor,
                    
                    // 2. Dynamic Box Shadow
                    // - Hover: Strong outer glow + Inner glow
                    // - Normal: Faint outer glow so it's not "colorless"
                    boxShadow: isHovered 
                      ? `0 0 25px ${item.glowColor}, inset 0 0 15px ${item.glowColor}`
                      : `0 0 6px ${item.glowColor.replace('0.6', '0.2')}, inset 0 0 0px transparent`,

                    // 3. Dynamic Background
                    // - Hover: Radial gradient fill
                    // - Normal: Dark glass linear gradient
                    background: isHovered
                      ? `radial-gradient(circle at center, ${item.glowColor.replace('0.6', '0.25')} 0%, rgba(20,20,20,0.95) 70%)`
                      : `linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(30,30,30,0.8) 100%)`,
                    
                    transform: isHovered ? "scale(1.015)" : "scale(1)",
                  }}
                >
                  {/* Texture Overlay */}
                  <div style={styles.noiseOverlay} />
                  
                  {/* Content Cells */}
                  <div style={styles.cell}>{item.event}</div>
                  <div style={styles.cell}>{item.venue}</div>
                  <div style={styles.cell}>{item.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    color: "white",
    fontFamily: "Times New Roman",
    boxSizing: "border-box",
    background: "transparent",
  },
  contentWrapper: {
    width: "90%",
    maxWidth: "1000px",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  headingContainer: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
    marginTop: "10px",
  },
  headingImage: {
    position: "relative",
    zIndex: 2,
    width: "200px", 
    height: "auto",
    objectFit: "contain",
  },
  headingGlow: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "60%",
    background: "radial-gradient(circle, rgba(240, 202, 11, 0.7) 0%, transparent 70%)",
    filter: "blur(20px)",
    pointerEvents: "none",
  },
  tableContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "rgba(0, 0, 0, 0.4)", 
    backdropFilter: "blur(8px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  headerRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1fr",
    padding: "16px",
    background: "rgba(0, 0, 0, 0.8)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    fontWeight: "bold",
    fontSize: "1.1rem",
    letterSpacing: "1px",
    zIndex: 2, 
    position: "relative",
  },
  headerCell: {
    textAlign: "left",
    paddingLeft: "10px",
  },
  scrollableBody: {
    flex: 1,
    overflowY: "auto",
    padding: "15px", 
    display: "flex",
    flexDirection: "column",
    gap: "16px", 
    scrollbarWidth: "none", 
    msOverflowStyle: "none",
  },
  dayHeader: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    padding: "10px 0 5px 5px",
    marginTop: "10px",
    marginBottom: "5px",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "3px",
    borderLeft: "4px solid #fff",
    paddingLeft: "15px",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
  },
  
  // --- ROW STYLES ---
  dataRow: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1fr",
    minHeight: "70px", 
    padding: "0 20px", 
    borderRadius: "16px", 
    alignItems: "center",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", 
    cursor: "default",
    borderWidth: "1px",
    borderStyle: "solid",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },

  // --- VISUAL EFFECTS ---
  noiseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.1, 
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
  },
  
  cell: {
    position: "relative",
    zIndex: 1,
    paddingLeft: "10px",
    fontSize: "1.05rem",
    fontWeight: "500",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    height: "100%", 
    width: "100%",
    textShadow: "0 2px 4px rgba(0,0,0,0.8)",
  }
};