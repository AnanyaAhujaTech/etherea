import React, { useEffect, useRef } from "react";
import { initScene } from "../../three/initScene"; // Adjust path if needed
import './SponsorsPage.css';

const SponsorsPage = ({ navHeight }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Pass 'sponsors' mode to load orbits, logos, etc.
    const cleanup = initScene(containerRef.current, 'sponsors');
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div 
      className="sponsors-page-wrapper" 
      style={{ paddingTop: navHeight }}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="three-canvas-container" />

      {/* Glassmorphism Card Overlay */}
      <div className="glass-overlay">
        <div className="glass-card">
          <h2>To be revealed shortly...</h2>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage;