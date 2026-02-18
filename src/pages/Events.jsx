import { useEffect, useRef } from "react";
import HeroSection from "../components/HeroSection";
import RasaSection from "../components/RasaSection";
import Galaxy from "../components/Galaxy";
import bg from "../assets/Background_Events.png";
import "./Events.css";

export default function Events() {
  const rasaRef = useRef(null);

  // Auto-scroll to RasaSection after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (rasaRef.current) {
        rasaRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    // The container that handles the scroll snapping
    <div className="events-container">
      
      {/* Fixed Background Layer */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Fixed Galaxy Animation Layer */}
      <div className="galaxy-layer">
        <Galaxy
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          starSpeed={0.5}
          speed={1}
          transparent={true}
        />
      </div>

      {/* Section 1: Hero */}
      <section className="event-section">
        <HeroSection />
      </section>

      {/* Section 2: Rasa (Target for auto-scroll) */}
      <section className="event-section" ref={rasaRef}>
        <RasaSection />
      </section>

    </div>
  );
}