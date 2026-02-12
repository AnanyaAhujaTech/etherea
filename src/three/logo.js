import * as THREE from "three";
import festLogoWhiteUrl from "../assets/fest-logo-white.png";
import festLogoColorUrl from "../assets/fest-logo.png";

// --- CONFIGURATION ---
// Adjust these to match the "feel" of your sponsors
const LOGO_CONFIG = {
  // Animation Physics
  hoverSpeed: 0.45,        // 0.05 = Slow/Fluid, 0.5 = Snappy
  hoverScaleGrowth: 1.05,   // 1.2 = 20% larger on hover
  defaultScale: 1.0,
  
  // Visuals
  size: 200,               // Base size width
  tiltXDeg: 30,            // Tilted back to fit the floor perspective
  zPosition: 0.15,
  glowOpacity: 0.45,
};

export function createLogo() {
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();

  // Variables to hold meshes (accessed in update loop)
  let meshWhite, meshColor;

  // --- 1. Texture Loading & Aspect Ratio Fix ---
  const onLoadTexture = (tex) => {
    // Determine aspect ratio (width / height)
    const aspect = tex.image.width / tex.image.height;
    
    // Apply aspect ratio to meshes if they exist
    if (meshWhite) meshWhite.scale.x = aspect;
    if (meshColor) meshColor.scale.x = aspect;
    
    // Optional: Adjust texture filtering for sharpness
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
  };

  const texWhite = loader.load(festLogoWhiteUrl, onLoadTexture);
  const texColor = loader.load(festLogoColorUrl, (tex) => {
     // Ensure color texture also has correct settings
     tex.minFilter = THREE.LinearFilter;
     tex.magFilter = THREE.LinearFilter;
     tex.colorSpace = THREE.SRGBColorSpace;
  });

  // --- 2. Geometry & Materials ---
  const geometry = new THREE.PlaneGeometry(LOGO_CONFIG.size, LOGO_CONFIG.size);

  const matWhite = new THREE.MeshBasicMaterial({
    map: texWhite,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const matColor = new THREE.MeshBasicMaterial({
    map: texColor,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  // --- 3. Meshes ---
  meshWhite = new THREE.Mesh(geometry, matWhite);
  meshColor = new THREE.Mesh(geometry, matColor);
  meshColor.position.z = 0.5; // Slight offset to prevent Z-fighting

  group.add(meshWhite);
  group.add(meshColor);

  // --- 4. The Glow (Halo) ---
  const glowTexture = createGlowTexture();
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffffff,
    transparent: true,
    opacity: LOGO_CONFIG.glowOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  
  const glowSprite = new THREE.Sprite(glowMaterial);

  glowSprite.raycast = () => {};

  // Scale glow based on config size
  const glowScale = LOGO_CONFIG.size * 1.0;
  glowSprite.scale.set(glowScale, glowScale, 1);
  glowSprite.position.z = -10; // Behind the logo
  
  group.add(glowSprite);

  // --- 5. Positioning ---
  // Center of scene, but tilted and lifted slightly
  group.position.set(0, 20, LOGO_CONFIG.zPosition);
  group.rotation.x = THREE.MathUtils.degToRad(LOGO_CONFIG.tiltXDeg);

  // --- 6. Animation State ---
  let currentMix = 0; // 0 = White, 1 = Color
  let currentScale = LOGO_CONFIG.defaultScale;

  function update(isHovered) {
    // Safety check: ensure meshes are created
    if (!meshWhite || !meshColor) return;

    // A. Opacity Transition (Lerp)
    const targetMix = isHovered ? 1 : 0;
    currentMix += (targetMix - currentMix) * LOGO_CONFIG.hoverSpeed;

    meshWhite.material.opacity = 1 - currentMix;
    meshColor.material.opacity = currentMix;

    // B. Scale Transition (Lerp)
    const targetScale = isHovered ? LOGO_CONFIG.hoverScaleGrowth : LOGO_CONFIG.defaultScale;
    currentScale += (targetScale - currentScale) * LOGO_CONFIG.hoverSpeed;

    // Apply scale to the whole group (affects logo + glow uniformly)
    group.scale.set(currentScale, currentScale, 1);
  }

  return { group, update };
}

/**
 * Helper: Radial Gradient Texture
 */
function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128; 
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");   
  gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)"); 
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");     
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  
  return new THREE.CanvasTexture(canvas);
}