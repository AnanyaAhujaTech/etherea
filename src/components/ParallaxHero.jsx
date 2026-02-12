import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StarField from "./StarField";
import "../styles/ParallaxHero.css";
import mountainsNebula from "../assets/mountains-nebula.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxHero() {
  const containerRef = useRef(null);
  const nebulaRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Background parallax
      gsap.to(nebulaRef.current, {
        y: -200,
        scale: 1.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Title fade on scroll
      gsap.to(titleRef.current, {
        y: -300,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1,
        },
      });

      // Subtitle fade
      gsap.to(subtitleRef.current, {
        y: -200,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "50% top",
          scrub: 1,
        },
      });

      // Scroll indicator fade
      gsap.to(scrollTextRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "5% top",
          end: "15% top",
          scrub: true,
        },
      });

      // Entrance animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 2 }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, delay: 0.8 }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="hero-container">
      
      <div className="hero-sticky">

        {/* Background */}
        <div
          ref={nebulaRef}
          className="hero-background"
          style={{ backgroundImage: `url(${mountainsNebula})` }}
        />

        {/* Stars */}
        <div className="hero-stars">
          <StarField />
        </div>

        {/* Title */}
        <div ref={titleRef} className="hero-title">
          ETHEREA
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="hero-subtitle">
          Where the Navrasa transcend
        </div>

        {/* Scroll indicator */}
        <div ref={scrollTextRef} className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
        </div>

      </div>
    </div>
  );
}