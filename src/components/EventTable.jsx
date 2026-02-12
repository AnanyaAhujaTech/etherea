import React, { useRef } from "react";

const scheduleData = [
  { type: "header", label: "Day - 1" },
  { event: "Ms. and Mr. Taarangana", venue: "Main Stage", time: "11:00 am - 1:00 pm", color: "rgba(255, 230, 150, 0.25)", borderColor: "rgba(255, 213, 75, 0.7)" },
  { event: "Rangmanch", venue: "Auditorium", time: "11:00 am - 1:30 pm", color: "rgba(180, 210, 255, 0.25)", borderColor: "rgba(109, 167, 255, 0.73)" },
  { event: "Aaghaaz", venue: "Badminton Court", time: "11:00 am - 3:00 pm", color: "rgba(200, 240, 200, 0.25)", borderColor: "rgba(130, 255, 130, 0.63)" },
  { event: "Antra", venue: "Main Stage", time: "1:00 pm - 3:30 pm", color: "rgba(140, 180, 190, 0.25)", borderColor: "rgba(72, 159, 181, 0.82)" },
  { event: "Rap Battle", venue: "Auditorium", time: "1:30 pm - 3:30 pm", color: "rgba(255, 180, 180, 0.25)", borderColor: "rgba(255, 103, 103, 0.6)" },
  { type: "header", label: "Day - 2" },
  { event: "Aalap", venue: "Auditorium", time: "11:00 am - 1:30 pm", color: "rgba(240, 240, 240, 0.2)", borderColor: "rgba(240, 240, 240, 0.75)" },
  { event: "Lilac Dreams", venue: "Main Stage", time: "11:00 am - 1:30 pm", color: "rgba(230, 190, 230, 0.25)", borderColor: "rgba(232, 131, 232, 0.66)" },
  { event: "Urban Thump", venue: "Main Stage", time: "1:30 pm - 4:00 pm", color: "rgba(180, 210, 255, 0.25)", borderColor: "rgba(105, 165, 255, 0.68)" },
  { event: "Slam Poetry", venue: "Auditorium", time: "3:30 pm - 5:30 pm", color: "rgba(200, 180, 220, 0.25)", borderColor: "rgba(162, 107, 217, 0.78)" },
];

export default function EventTable({ onReturnToClock, navHeight = "80px" }) {
  const listRef = useRef(null);

  const handleContainerWheel = (e) => {
    // If scrolling UP at the very top of the list, go back to clock
    if (e.deltaY < 0) {
      if (listRef.current) {
        if (listRef.current.scrollTop <= 0) {
           if (onReturnToClock) onReturnToClock();
        }
      } else {
        if (onReturnToClock) onReturnToClock();
      }
    }
  };

  return (
    <div style={{...styles.container, paddingTop: navHeight}} onWheel={handleContainerWheel}>
      <div style={styles.background} />
      
      <div style={styles.contentWrapper}>
        
        {/* --- HEADING IMAGE SECTION --- */}
        <div style={styles.headingContainer}>
          {/* Glow Effect */}
          <div style={styles.headingGlow} />
          
          {/* Image */}
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

          <div ref={listRef} style={styles.scrollableBody}>
            {scheduleData.map((item, index) => {
              if (item.type === "header") {
                return (
                  <div key={index} style={styles.dayHeader}>
                    {item.label}
                  </div>
                );
              }
              return (
                <div 
                  key={index} 
                  style={{
                    ...styles.dataRow,
                    backgroundColor: item.color,
                    borderLeft: `4px solid ${item.borderColor}`
                  }}
                >
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
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle at center, #1a0b2e 0%, #000000 100%)",
    zIndex: -1,
  },
  contentWrapper: {
    width: "90%",
    maxWidth: "1000px",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center", // Center the heading image
  },
  
  // --- NEW HEADER STYLES ---
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
    // Responsive width: min 300px, preferred 50% of screen, max 600px
    width: "clamp(300px, 13vw, 600px)", 
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

  // --- TABLE STYLES ---
  tableContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  headerRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1fr",
    padding: "16px",
    background: "rgba(0, 0, 0, 0.3)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    scrollbarWidth: "none", 
    msOverflowStyle: "none",
  },
  dayHeader: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "12px 10px",
    marginTop: "10px",
    marginBottom: "5px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  dataRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1fr",
    padding: "14px",
    borderRadius: "8px",
    alignItems: "center",
    transition: "transform 0.2s ease, filter 0.2s ease",
    cursor: "default",
  },
  cell: {
    paddingLeft: "10px",
    fontSize: "1rem",
  }
};