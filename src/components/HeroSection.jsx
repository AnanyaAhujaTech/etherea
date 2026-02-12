// import "./HeroSection.css";
// import girl from "../assets/girl.png";
// import MasksLayer from "./MasksLayer";

// export default function HeroSection() {
//   return (
//     <section className="hero">

//       {/* Girl Silhouette */}
//       {/* <img 
//         src={girl} 
//         alt="Silhouette" 
//         className="girl-silhouette"
//       /> */}

//        {/* Masks */}
//       <MasksLayer />

//     </section>
//   );
// }





import "./HeroSection.css";
//import girl from "../assets/girl.png";
import heading from "../assets/EventsHeading.png";   // add this
import MasksLayer from "./MasksLayer";

export default function HeroSection() {
  return (
    <section className="hero">

      {/* Heading image */}
      <img
        src={heading}
        alt="Events Heading"
        className="events-heading"
      />

      {/* Girl Silhouette */}
      {/* 
      <img 
        src={girl} 
        alt="Silhouette" 
        className="girl-silhouette"
      /> 
      */}

      {/* Masks */}
      <MasksLayer />

    </section>
  );
}