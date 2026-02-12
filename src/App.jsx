import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// --- Components ---
import Navbar from "./components/Navbar/Navbar";
import CountdownClock from "./components/CountdownClock";
import EventTable from "./components/EventTable";
import SponsorsPage from "./components/Sponsors/SponsorsPage";

// --- Pages ---
import Home from "./pages/Home";
import Events from "./pages/Events";

// --- Three.js ---
import { initScene } from "./three/initScene";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const NAV_HEIGHT = "80px";

  // --- ITINERARY SPECIFIC REFS & STATE ---
  const itineraryContainerRef = useRef(null); // For Three.js
  const clockOverlayRef = useRef(null);       // The sliding overlay
  const autoScrollTimer = useRef(null);
  const isAnimating = useRef(false);
  
  // Track if we are currently showing the clock (vs the table)
  const [showClock, setShowClock] = useState(true);

  // --- NAVIGATION HANDLER ---
  const handleNavigation = (page) => {
    if (page === activePage) return;
    
    setActivePage(page);

    // If navigating TO itinerary, reset the clock view
    if (page === "itinerary") {
      setShowClock(true);
      isAnimating.current = false;
    }
  };

  // --- ITINERARY ANIMATION LOGIC ---
  const hideClockOverlay = () => {
    if (!clockOverlayRef.current || isAnimating.current || !showClock) return;

    isAnimating.current = true;
    if (autoScrollTimer.current) clearTimeout(autoScrollTimer.current);

    gsap.to(clockOverlayRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: "power4.inOut",
      onComplete: () => {
        setShowClock(false);
        isAnimating.current = false;
      },
    });
  };

  // --- EFFECTS ---

  // 1. Manage Three.js Scene & Scroll (Only runs when activePage is 'itinerary')
  useEffect(() => {
    let cleanupScene;

    if (activePage === "itinerary" && showClock) {
      // Initialize Three.js scene on the clock overlay
      // We use a small timeout to ensure the DOM element is rendered
      const timer = setTimeout(() => {
        if (itineraryContainerRef.current) {
          cleanupScene = initScene(itineraryContainerRef.current, 'home');
        }
      }, 0);

      // Auto-scroll timer
      autoScrollTimer.current = setTimeout(() => {
        hideClockOverlay();
      }, 5000);

      // Scroll listener to dismiss clock
      const handleScroll = (e) => {
        if (e.deltaY > 0) hideClockOverlay();
      };
      window.addEventListener("wheel", handleScroll);

      return () => {
        clearTimeout(timer);
        if (cleanupScene) cleanupScene();
        if (autoScrollTimer.current) clearTimeout(autoScrollTimer.current);
        window.removeEventListener("wheel", handleScroll);
      };
    }
  }, [activePage, showClock]);

  // --- RENDER HELPERS ---

  const renderItinerary = () => (
    <>
      {/* 1. The Event Table (Always rendered, sits behind) */}
      <div style={{ width: "100%", minHeight: "100vh", paddingTop: NAV_HEIGHT, boxSizing: "border-box" }}>
        <EventTable onReturnToClock={() => {/* Optional: Add logic if you want to recall clock */}} navHeight={NAV_HEIGHT} />
      </div>

      {/* 2. The Clock Overlay (Slides away) */}
      {/* We keep it in DOM but moved up if showClock is false, or conditionally render. 
          GSAP moves it, so we keep it rendered until animation completes or logic dictates.
          However, to keep state simple, if showClock is false, we technically don't need the DOM, 
          but GSAP needs it to animate OUT. After animation, we can leave it off-screen. */}
      
      <div 
        ref={clockOverlayRef}
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          zIndex: 50, 
          background: "black",
          transform: showClock ? "translateY(0%)" : "translateY(-100%)", // CSS fallback
        }}
      >
        {/* Three.js Canvas */}
        <div ref={itineraryContainerRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 1 }} />
        
        {/* Clock Component */}
        <div style={{ position: "relative", zIndex: 2, height: "100%", width: "100%" }}>
           <CountdownClock />
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar onNavigate={handleNavigation} />

      <main style={{ width: "100%", minHeight: "100vh", backgroundColor: "#050505", overflowX: "hidden" }}>
        {activePage === "home" && <Home navHeight={NAV_HEIGHT} />}
        {activePage === "events" && <Events navHeight={NAV_HEIGHT} />}
        {activePage === "sponsors" && <SponsorsPage navHeight={NAV_HEIGHT} />}
        {activePage === "itinerary" && renderItinerary()}
      </main>
    </>
  );
}