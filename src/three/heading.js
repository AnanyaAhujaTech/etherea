import * as THREE from "three";
// Ensure this path matches where you put your heading image
import headingUrl from "../assets/heading.png"; 

const CONFIG = {
  yPosition: 380, // Height of the main image
  size: 500,      // Width of the main image
  
  // Subtext Config
  subtextYOffset: -60, // Distance below the main image
  subtextSize: 16,      // Font size factor
  subtextWidth: 800,   // Width of the subtext plane
  
  // Animation
  floatSpeed: 0.002,
  floatRange: 10,
  glowOpacity: 0.6,
};

export function createHeading() {
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();

  // --- 1. Main Heading (Image) ---
  const mainGeometry = new THREE.PlaneGeometry(1, 1);
  const mainMaterial = new THREE.MeshBasicMaterial({
    map: loader.load(headingUrl, (tex) => {
      // Fix aspect ratio when loaded
      const aspect = tex.image.width / tex.image.height;
      mainMesh.scale.set(CONFIG.size, CONFIG.size / aspect, 1);
      
      // Adjust glow to match
      glowSprite.scale.set(CONFIG.size * 2.5, (CONFIG.size / aspect) * 2.5, 1);
      
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
    }),
    transparent: true,
    opacity: 1,
    side: THREE.FrontSide,
    depthWrite: false,
  });

  const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
  group.add(mainMesh);

  // --- 2. Subtext (Generated via Canvas) ---
  const subtextTexture = createTextTexture(
    "Those who help us transcend the ordinary", 
    { font: "Inter sans-serif", fontSize: 45, color: "#fffcf2" }
  );

  const subtextMaterial = new THREE.MeshBasicMaterial({
    map: subtextTexture,
    transparent: true,
    opacity: 0.9,
    side: THREE.FrontSide,
    depthWrite: false,
  });

  // Calculate aspect ratio of the canvas we created (1024x128 typically)
  // We want the width in 3D units to be CONFIG.subtextWidth
  const subAspect = subtextTexture.image.width / subtextTexture.image.height; 
  const subHeight = CONFIG.subtextWidth / subAspect;

  const subtextMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(CONFIG.subtextWidth, subHeight), 
    subtextMaterial
  );
  
  subtextMesh.position.y = CONFIG.subtextYOffset;
  group.add(subtextMesh);

  // --- 3. Background Glow ---
  const glowTexture = createGlowTexture();
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffaa00,
    transparent: true,
    opacity: CONFIG.glowOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const glowSprite = new THREE.Sprite(glowMaterial);
  glowSprite.scale.set(1.5, 1.5, 1.5); // Will be updated in loader callback
  glowSprite.position.z = -5;
  group.add(glowSprite);

  // --- 4. Positioning ---
  group.position.set(0, CONFIG.yPosition, 0);

  // --- 5. Animation Loop ---
  let time = 0;

  function update(camera) {
    // A. Float Animation
    time += CONFIG.floatSpeed;
    const floatY = Math.sin(time) * CONFIG.floatRange;
    group.position.y = CONFIG.yPosition + floatY;

    // B. Billboarding (Always face camera)
    if (camera) {
      group.quaternion.copy(camera.quaternion);
    }
  }

  return { group, update };
}

/**
 * Helper: Create a texture containing text using HTML5 Canvas
 */
function createTextTexture(text, options = {}) {
  const font = options.font || "Arial";
  const fontSize = options.fontSize || 48;
  const color = options.color || "#f7c40a";
  
  const canvas = document.createElement("canvas");
  // Large enough width to prevent wrapping/pixelation
  canvas.width = 1024; 
  canvas.height = 128;
  
  const ctx = canvas.getContext("2d");
  
  ctx.font = `${fontSize}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  
  // Add a slight shadow/glow for readability
  ctx.shadowColor = "rgba(255, 204, 0, 0.97)";
  ctx.shadowBlur = 10;
  
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  return texture;
}

// Helper: Radial Gradient Glow
function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext("2d");
  
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  
  return new THREE.CanvasTexture(canvas);
}