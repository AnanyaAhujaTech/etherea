import * as THREE from "three";

function createPuffTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.03)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export function createNebula() {
  const group = new THREE.Group();
  const texture = createPuffTexture();
  
  const colors = ["hsl(264, 100%, 45%)", "#0346fe", "#ffc005", "#34005a", "#00494d", "#002651", "#002b1e"];
  const puffCount = 250; 

  for (let i = 0; i < puffCount; i++) {
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: new THREE.Color(colors[i % colors.length]),
      transparent: true,
      opacity: Math.random() * 0.2 + 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);
    
    // Distribution: Broad and expansive
    const angle = Math.random() * Math.PI * 2;
    const radius = 200 + Math.random() * 800; // Increased spread
    sprite.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.6,
      (Math.random() - 0.5) * 500
    );

    // Large scale for nebula clouds
    const scale = 400 + Math.random() * 600;
    sprite.scale.set(scale, scale, 1);
    
    group.add(sprite);
  }

  return group;
}