import * as THREE from "three";

function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgb(132, 210, 255)");
  gradient.addColorStop(1, "rgba(18, 0, 73, 0.97)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export function createStars({ count = 5000, spread = 3000, size = 3.5 }) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // 75% stars cluster in the nebula core
    const isCoreStar = Math.random() < 0.75;
    const currentSpread = isCoreStar ? spread * 0.45 : spread;

    const x = (Math.random() - 0.5) * currentSpread;
    const y = (Math.random() - 0.5) * currentSpread;
    const z = (Math.random() - 0.5) * (currentSpread * 0.5);

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // Luminosity falloff: darker towards the edges
    const distFromCenter = Math.sqrt(x * x + y * y + z);
    const distanceFactor = Math.max(0.1, 1 - distFromCenter / (spread * 0.7));
    const brightness = (Math.random() * 0.6 + 0.4) * distanceFactor;

    if (isCoreStar) {
      color.setHSL(0.55 + Math.random() * 0.1, 0.6, brightness); // Cyan/White tint
    } else {
      color.set(0xffffff).multiplyScalar(brightness * 0.5);
    }

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
  );
}