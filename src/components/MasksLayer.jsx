import { motion } from "framer-motion";
import "./MasksLayer.css";

import adbhut from "../assets/Adbhut.png";
import bhayanak from "../assets/Bhayankar.png";
import hasya from "../assets/Hasyaa.png";
import karun from "../assets/Karun.png";
import raudra from "../assets/Roudra.png";
import shant from "../assets/Shant.png";
import shringar from "../assets/Shringar.png";
import vibhatsa from "../assets/Vibhatsa.png";
import veer from "../assets/Vir.png";

// Configuration for every mask
const masks = [
  { 
    id: 1,
    src: vibhatsa, 
    glow: "#4da6ff", 
    width: "180px",
    position: { top: "5%", left: "1.5%" }
  },
  { 
    id: 2,
    src: bhayanak, 
    glow: "#5cff7a", 
    width: "230px",
    position: { top: "5%", right: "1.5%" }
  },
  { 
    id: 3,
    src: hasya, 
    glow: "#ffd54d", 
    width: "450px",
    position: { top: "22%", left: "12%" }
  },
  { 
    id: 4,
    src: karun, 
    glow: "#8a7cff", 
    width: "230px", // Customized size
    position: { top: "44%", right: "1%" }
  },
  { 
    id: 5,
    src: shringar, 
    glow: "#d16bff", 
    width: "420px",
    position: { bottom: "24%", left: "2%" }
  },
  { 
    id: 6,
    src: shant, 
    glow: "#ffffff", 
    glowSize: [4, 12, 20], // Custom softer glow
    width: "320px",
    position: { bottom: "6%", left: "22%" }
  },
  { 
    id: 7,
    src: veer, 
    glow: "#6aa0ff", 
    width: "400px",
    position: { top: "23%", right: "13%" }
  },
  { 
    id: 8,
    src: raudra, 
    glow: "#ff3b3b", 
    width: "400px",
    position: { bottom: "18%", left: "40%" }
  },
  { 
    id: 9,
    src: adbhut, 
    glow: "#7ef9ff", 
    width: "500px",
    position: { bottom: "1%", right: "11%" }
  }
];

export default function MasksLayer() {
  return (
    <div className="masks-container">
      {masks.map((mask, index) => {
        // Default glow sizes if not specified
        const glowSizes = mask.glowSize || [8, 22, 40];

        return (
          <motion.img
            key={mask.id}
            src={mask.src}
            className="mask"
            alt={`mask-${mask.id}`}
            
            // Apply size, position, and filter via inline styles
            style={{
              width: mask.width,
              ...mask.position, // Spreads top, left, right, bottom
              filter: `
                brightness(1.05)
                drop-shadow(0 0 ${glowSizes[0]}px ${mask.glow})
                drop-shadow(0 0 ${glowSizes[1]}px ${mask.glow})
                drop-shadow(0 0 ${glowSizes[2]}px ${mask.glow})
              `
            }}

            /* Entrance Animation: Start below screen */
            initial={{ y: "100vh", opacity: 0 }}

            /* Float Animation: Rise up, then bob up and down */
            animate={{
              y: [0, -12, 0],
              opacity: 1
            }}

            transition={{
              y: {
                delay: index * 0.25 + 0.8, // Staggered start
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              opacity: {
                duration: 1,
                delay: index * 0.25
              }
            }}

            whileHover={{ scale: 1.1, zIndex: 10 }}
          />
        );
      })}
    </div>
  );
}