import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeComp2.css";
import danceVideo from "../assets/bharatnatyam.mp4"; 

gsap.registerPlugin(ScrollTrigger);

/* LEFT: Festival Text */
const FestivalSection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    gsap.fromTo(
      el,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          scroller: ".home-wrapper", // <--- ADDED: Watches the specific scroll container
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div ref={ref} className="festival">
      <h2 className="festival__title">
        The Festival of <br />
        <span>Nine Emotions</span>
      </h2>

      <p className="festival__description">
        Etherea is an immersive celebration where ancient wisdom meets cosmic
        wonder. Through art, performance, and connection, we explore the
        Navrasa—the nine fundamental emotions that define the human experience.
      </p>

      <p className="festival__quote">
        Each emotion is a doorway to transcendence, a thread in the tapestry of
        existence that binds us all together across time and space.
      </p>
    </div>
  );
};

/* RIGHT: Dance Video */
const DanceVideoSection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    gsap.fromTo(
      el,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          scroller: ".home-wrapper", // <--- ADDED: Watches the specific scroll container
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div ref={ref} className="video-container">
      <video 
        className="dance-video"
        autoPlay 
        loop 
        muted 
        playsInline 
      >
        <source src={danceVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default function HomeComp2() {
  return (
    <section className="homecomp2">
      <div className="homecomp2__container">
        <FestivalSection />
        <DanceVideoSection />
      </div>
    </section>
  );
}