import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  getClockRotation, 
  getCurrentSecond, 
  getInitialRotation,
  TICK_SETTINGS 
} from "../config/timeConfig";

// ==========================================
// 🎛️ CONTROL PANEL (VISUAL STYLES)
// ==========================================

const CONFIG = {
  // 1. POSITIONING
  VERTICAL_OFFSET: "30px", 

  // 2. HEADING SETTINGS
  HEADING: {
    PATH: "/assets/countdown.png",
    WIDTH: "clamp(250px, 15vmin, 600px)",
    MARGIN_BOTTOM: "60px",
    OPACITY: 1.0, 
    
    // Glow effect behind the logo
    BG_GLOW: {
      COLOR: "rgba(255, 176, 50, 0.7)", // Bright Copper
      SIZE_SCALE: "1.5", 
      BLUR: "10px",      
    }
  },

  // 3. CLOCK GLOW SETTINGS
  CLOCK_GLOW_FILTER: "drop-shadow(0px 0px 15px rgba(184, 115, 51, 0.7))",

  // 4. SIZING
  SIZES: {
    GLOBAL_SIZE: "clamp(300px, 72vmin, 650px)", 
    FRAME_SCALE: "114%",    
    RING_SCALE: "72%",      
    SEGMENT_SCALE: "65%",   
    MAIN_HAND_LENGTH: "16%", 
    MINUTE_HAND_LENGTH: "22%",
    GEAR_SIZE: "18%",
  }
};

// ==========================================
// 🧩 COMPONENT
// ==========================================

export default function CountdownClock() {
  // References to DOM elements
  const mainHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const gearRef = useRef(null);
  const segmentsRef = useRef(null);

  // Configuration for start/end points on the ring
  // These keys must match the keys in timeConfig.js -> RING_SEGMENTS
  const START_MARKER = "Taking Shape";
  const END_MARKER = "The Moment You've Waited For...";

  // State refs for animation loop
  const lastSecond = useRef(getCurrentSecond());
  const visualRotation = useRef(getInitialRotation());

  useEffect(() => {
    // 1. Set initial state immediately to avoid layout thrashing
    if (minuteHandRef.current) {
      gsap.set(minuteHandRef.current, { rotation: visualRotation.current });
    }

    // 2. The Animation Loop
    const tick = () => {
      // A. Update Main Hand (The Slow Progress Hand)
      // This calculates the exact position between Feb 14 and Feb 24
      const mainRotation = getClockRotation(START_MARKER, END_MARKER);
      if (mainHandRef.current) {
        gsap.set(mainHandRef.current, { rotation: mainRotation });
      }

      // B. Update Minute/Second Hand (The Ticking Hand)
      const currentSecond = getCurrentSecond();
      if (currentSecond !== lastSecond.current) {
        // Increment rotation by 6 degrees
        visualRotation.current += TICK_SETTINGS.DEGREES_PER_TICK;
        
        if (minuteHandRef.current) {
          gsap.to(minuteHandRef.current, {
            rotation: visualRotation.current,
            duration: TICK_SETTINGS.DURATION,    
            ease: `back.out(${TICK_SETTINGS.ELASTICITY})`,
            overwrite: true, // Ensures new ticks override old ones if user lags
          });
        }
        lastSecond.current = currentSecond;
      }

      // C. Update Ambient Rotation (Gears & Segments)
      if (gearRef.current) gsap.set(gearRef.current, { rotation: "+=0.5" });
      if (segmentsRef.current) gsap.set(segmentsRef.current, { rotation: "-=0.05" }); 
    };

    // 3. Bind to GSAP Ticker (more efficient than setInterval)
    gsap.ticker.add(tick);

    // 4. Cleanup on Unmount
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div style={styles.overlayContainer}>
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          transform: `translateY(${CONFIG.VERTICAL_OFFSET})`,
          position: 'relative'
        }}
      >
        
        {/* --- HEADING CONTAINER --- */}
        <div style={{ 
          position: 'relative', 
          marginBottom: CONFIG.HEADING.MARGIN_BOTTOM,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%', 
        }}>
          
          {/* 🌟 GLOW LAYER */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: CONFIG.HEADING.WIDTH,
            height: "60%", 
            transform: `translate(-50%, -50%) scale(${CONFIG.HEADING.BG_GLOW.SIZE_SCALE})`,
            background: `radial-gradient(ellipse at center, ${CONFIG.HEADING.BG_GLOW.COLOR} 0%, transparent 70%)`,
            filter: `blur(${CONFIG.HEADING.BG_GLOW.BLUR})`,
            zIndex: -1, 
            pointerEvents: 'none',
          }} />

          {/* --- HEADING IMAGE --- */}
          <img 
            src={CONFIG.HEADING.PATH} 
            alt="Navrasa In Motion"
            style={{
              width: CONFIG.HEADING.WIDTH,
              opacity: CONFIG.HEADING.OPACITY,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* --- CLOCK COMPONENT --- */}
        <div 
          style={{ 
            ...styles.clockWrapper, 
            width: CONFIG.SIZES.GLOBAL_SIZE, 
            height: CONFIG.SIZES.GLOBAL_SIZE,
          }}
        >
          {/* Layer 1: Segments (Rotating Background) */}
          <div style={{ ...styles.layerContainer, zIndex: 1, width: CONFIG.SIZES.SEGMENT_SCALE, height: CONFIG.SIZES.SEGMENT_SCALE }}>
            <img ref={segmentsRef} src="/assets/clock_segments.png" alt="Segments" style={styles.imageFit} />
          </div>

          {/* Layer 2: Ring (Static with Glow) */}
          <div style={{ ...styles.layerContainer, zIndex: 2, width: CONFIG.SIZES.RING_SCALE, height: CONFIG.SIZES.RING_SCALE }}>
            <img 
              src="/assets/clock_ring.png" 
              alt="Ring" 
              style={{ ...styles.imageFit, filter: CONFIG.CLOCK_GLOW_FILTER }} 
            />
          </div>

          {/* Layer 3: Frame */}
          <div style={{ ...styles.layerContainer, zIndex: 3, width: CONFIG.SIZES.FRAME_SCALE, height: CONFIG.SIZES.FRAME_SCALE }}>
            <img 
              src="/assets/clock_frame.png" 
              alt="Frame" 
              style={{ ...styles.imageFit, filter: CONFIG.CLOCK_GLOW_FILTER }} 
            />
          </div>

          {/* Layer 4: Main Hand (Progress Tracker) */}
          <div ref={mainHandRef} style={{ ...styles.handContainer, zIndex: 4 }}>
            <img 
              src="/assets/clock_hand.png" 
              alt="Main Hand" 
              style={{ ...styles.handImage, height: CONFIG.SIZES.MAIN_HAND_LENGTH }} 
            />
          </div>

          {/* Layer 5: Minute Hand (Visual Ticker) */}
          <div ref={minuteHandRef} style={{ ...styles.handContainer, zIndex: 5 }}>
            <img 
              src="/assets/long_clock_hand.png" 
              alt="Minute Hand" 
              style={{ ...styles.minuteHandImage, height: CONFIG.SIZES.MINUTE_HAND_LENGTH }} 
            />
          </div>

          {/* Layer 6: Gears (Center Decoration) */}
          <div style={{ ...styles.centerPivot, zIndex: 6, width: CONFIG.SIZES.GEAR_SIZE, height: CONFIG.SIZES.GEAR_SIZE }}>
            <img ref={gearRef} src="/assets/clock_gears.png" alt="Gears" style={styles.imageFit} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 💅 STYLES
// ==========================================

const styles = {
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    overflow: "visible", 
  },
  clockWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: "1 / 1", 
  },
  layerContainer: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageFit: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },
  centerPivot: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  handContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    willChange: "transform",
  },
  handImage: {
    transformOrigin: "bottom center",
    transform: "translateY(-50%)", 
    width: "auto",
  },
  minuteHandImage: {
    opacity: 0.9,
    filter: "brightness(1.1)",
    transformOrigin: "bottom center",
    transform: "translateY(-50%)", 
    width: "auto",
  },
};