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
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Background parallax
      gsap.to(bgRef.current, {
        y: -200,
        scale: 1.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Title fade
      gsap.to(titleRef.current, {
        y: -250,
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

      // Scroll text fade
      gsap.to(scrollRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "5% top",
          end: "15% top",
          scrub: true,
        },
      });

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
          <h1 ref={titleRef} className="landing-title">
            ETHEREA
          </h1>

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