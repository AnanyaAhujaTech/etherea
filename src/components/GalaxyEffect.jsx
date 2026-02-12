import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function GalaxyEffect() {
  return (
    <Canvas
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}
      camera={{ position: [0, 0, 1] }}
    >
      <Stars
        radius={100}
        depth={50}
        count={4000}
        factor={4}
        fade
        speed={0.5}
      />
    </Canvas>
  );
}