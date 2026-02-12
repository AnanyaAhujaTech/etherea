import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeComp2.css";
import muni from "../assets/muni.png";

gsap.registerPlugin(ScrollTrigger);

/* LEFT: Festival Text */
const FestivalSection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    gsap.fromTo(
      el,
      { x: -200, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none play reset"
        }
      }
    );

    ScrollTrigger.refresh();
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

/* RIGHT: Muni Image */
const MuniSection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    gsap.fromTo(
      el,
      { x: 200, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none play reset"
        }
      }
    );

    ScrollTrigger.refresh();
  }, []);

  return (
    <div ref={ref} className="muni">
      <img src={muni} alt="Muni Illustration" className="muni__image" />
    </div>
  );
};

export default function HomeComp2() {
  return (
    <section className="homecomp2">
      <div className="homecomp2__container">
        <FestivalSection />
        <MuniSection />
      </div>
    </section>
  );
}