import React, { useEffect, useRef, useState } from "react";

// --- Components ---
import Navbar from "./components/Navbar/Navbar";
import CountdownClock from "./components/CountdownClock";
import EventTable from "./components/EventTable";
import SponsorsPage from "./components/Sponsors/SponsorsPage";

// --- Pages ---
import Home from "./pages/Home";
import Events from "./pages/Events";
import Team from "./pages/Team"; // <--- NEW IMPORT

// --- Three.js ---
import { initScene } from "./three/initScene";

// ==========================================
// 📄 ITINERARY PAGE COMPONENT
// ==========================================
const ItineraryPage = ({ navHeight }) => {
  const bgRef = useRef(null);
  const containerRef = useRef(null);
  const clockSectionRef = useRef(null);
  const tableSectionRef = useRef(null);
  
  useEffect(() => {
    let cleanupScene;
    if (bgRef.current) {
      cleanupScene = initScene(bgRef.current, 'home');
    }
    return () => {
      if (cleanupScene) cleanupScene();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tableSectionRef.current) {
        tableSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToClock = () => {
    if (clockSectionRef.current) {
      clockSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.itineraryWrapper}>
      <div ref={bgRef} style={styles.fixedBackground} />

      <div ref={containerRef} style={styles.snapContainer}>
        {/* Section 1: Clock */}
        <section ref={clockSectionRef} style={styles.snapSection}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
             <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                <CountdownClock />
             </div>
          </div>
        </section>

        {/* Section 2: Event Table */}
        <section ref={tableSectionRef} style={styles.snapSection}>
          <EventTable onReturnToClock={scrollToClock} navHeight={navHeight} />
        </section>
      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const NAV_HEIGHT = "80px";

  const handleNavigation = (page) => {
    if (page === activePage) return;
    setActivePage(page);
  };

  return (
    <>
      {/* GLOBAL CSS RESET */}
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #050505;
            overflow-x: hidden;
          }
          * {
            box-sizing: border-box;
          }
        `}
      </style>

      <Navbar onNavigate={handleNavigation} />

      <main style={styles.mainContainer}>
        {activePage === "home" && <Home navHeight={NAV_HEIGHT} />}
        {activePage === "events" && <Events navHeight={NAV_HEIGHT} />}
        {activePage === "sponsors" && <SponsorsPage navHeight={NAV_HEIGHT} />}
        {activePage === "itinerary" && <ItineraryPage navHeight={NAV_HEIGHT} />}
        {activePage === "team" && <Team navHeight={NAV_HEIGHT} />} {/* <--- NEW ROUTE */}
      </main>
    </>
  );
}

const styles = {
  mainContainer: {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#050505",
    overflowX: "hidden",
  },
  // --- Itinerary Styles ---
  itineraryWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  fixedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },
  snapContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    zIndex: 1,
    scrollbarWidth: 'none',
  },
  snapSection: {
    width: '100vw',
    height: '100vh',
    scrollSnapAlign: 'start',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};