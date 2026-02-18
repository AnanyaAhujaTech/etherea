import React from "react";

export default function HomeComp3() {
  return (
    <div 
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        // Distinct background or gradient can be added here
        background: "rgba(0, 0, 0, 0.2)" 
      }}
    >
      <div 
        style={{
          textAlign: "center",
          color: "#e2e8f0",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          padding: "4rem",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <h2 
          style={{ 
            fontFamily: "Georgia, serif", 
            fontSize: "3rem", 
            marginBottom: "1rem" 
          }}
        >
          Resonance
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", color: "#94a3b8" }}>
          Home Component 3 - Content Coming Soon
        </p>
      </div>
    </div>
  );
}