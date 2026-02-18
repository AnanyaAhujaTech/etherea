import React from "react";
import "./HeroSection.css";
// import girl from "../assets/girl.png"; 
import heading from "../assets/EventsHeading.png";
import MasksLayer from "./MasksLayer";

export default function HeroSection() {
  return (
    <section className="hero">
      
      {/* Heading image with Gold Glow */}
      <img
        src={heading}
        alt="Events Heading"
        className="events-heading"
      />

      {/* Girl Silhouette (Currently Hidden) */}
      {/* <img 
        src={girl} 
        alt="Silhouette" 
        className="girl-silhouette"
      /> 
      */}

      {/* Masks Layer */}
      <MasksLayer />

    </section>
  );
}