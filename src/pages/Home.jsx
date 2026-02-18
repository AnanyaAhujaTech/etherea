import Galaxy from "../components/Galaxy";
import HomeLanding from "../components/HomeLanding";
import HomeComp2 from "../components/HomeComp2";
import HomeComp3 from "../components/HomeComp3"; // <--- NEW
import HomeComp4 from "../components/HomeComp4"; // <--- NEW
import SmaranPage from "../components/SmaranPage";
import bg from "../assets/Background_Events.png";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">

      {/* Background image (Fixed) */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Galaxy animation (Fixed) */}
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

      {/* Scrollable Content */}
      <div className="content-layer">
        
        {/* Section 1: Landing */}
        <section className="snap-section">
          <HomeLanding />
        </section>
        
        {/* Section 2: Navrasa */}
        <section className="snap-section">
          <HomeComp2 />
        </section>

        {/* Section 3: New Comp 3 */}
        <section className="snap-section">
          <HomeComp3 />
        </section>

        {/* Section 4: New Comp 4 */}
        <section className="snap-section">
          <HomeComp4 />
        </section>

        {/* Section 5 & 6: Smaran (Contains 2 internal sections) 
            Note: The CSS 'display: contents' on .smaran-container 
            will ensure the two internal sections snap individually.
        */}
        <SmaranPage />

      </div>

    </div>
  );
}