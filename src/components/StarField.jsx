import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./StarField.css";

/**
 * Helper function to generate a radial gradient texture programmatically.
 * This avoids the need to import an external image file.
 */
function generateCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);

  // Core is white, edges fade to transparent
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function Stars() {
  const ref = useRef();
  const count = 3000;

  // Generate random positions for stars
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  // Generate the circular texture once
  const texture = useMemo(() => generateCircleTexture(), []);

  useFrame((state) => {
    if (ref.current) {
      // Rotate the entire starfield slowly
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      // Optional: slight X rotation for more dynamic movement
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.1} // Increased size slightly as gradients look smaller than solid blocks
        map={texture} // Apply the circular texture
        transparent={true}
        depthWrite={false} // Prevents transparent corners from clipping other stars
        blending={THREE.AdditiveBlending} // Makes overlapping stars glow brighter
        color="#ffffff"
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function StarField() {
  return (
    <div className="starfield-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Optional: Add a dark color to background if not handled by CSS */}
        {/* <color attach="background" args={['#000000']} /> */}
        <Stars />
      </Canvas>
    </div>
  );
}