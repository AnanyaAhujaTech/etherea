import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeLanding.css";
import StarField from "./StarField";
import mountainsNebula from "../assets/mountains-nebula.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function HomeLanding() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const presentsRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- Entry Animation Sequence ---
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Taarangana Presents: Slides from top
      tl.fromTo(presentsRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5 }
      );

      // 2. Etherea: Dissolves in (Opacity + Blur) - starts slightly before previous ends
      tl.fromTo(titleRef.current, 
        { 
          opacity: 0,
          scale: 0.95,
          filter: "blur(10px)", // Blur effect for "dissolve" feel
        },
        { 
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 2.5, // Slow dissolve
        },
        "-=0.5"
      );

      // 3. Subtitle: Slides down from Etherea (starts from negative Y)
      tl.fromTo(subtitleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 2.0 }, // Even slower
        "-=1.0"
      );

      // --- Scroll Effects ---
      
      // Background parallax (Kept for depth)
      gsap.to(bgRef.current, {
        y: -100, // Reduced movement speed
        scale: 1.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Scroll text fade out (Only this disappears)
      gsap.to(scrollRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "5% top",
          end: "15% top",
          scrub: true,
        },
      });

      // Note: Removed exit animations for text so they stay visible

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="home-landing">
      <div className="landing-sticky">

        {/* Background */}
        <div
          ref={bgRef}
          className="landing-background"
          style={{ backgroundImage: `url(${mountainsNebula})` }}
        />

        {/* Starfield */}
        <div className="landing-stars">
          <StarField />
        </div>

        {/* Content */}
        <div className="landing-content">
          
          {/* Level 1 */}
          <h3 ref={presentsRef} className="landing-presents">
            Taarangana presents
          </h3>

          {/* Level 2 */}
          <h1 ref={titleRef} className="landing-title">
            ETHEREA
          </h1>

          {/* Level 3 */}
          <p ref={subtitleRef} className="landing-subtitle">
            Where the Navrasa transcend
          </p>
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollRef} className="landing-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
        </div>

      </div>
    </section>
  );
}