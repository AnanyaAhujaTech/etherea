import * as THREE from "three";
import { ORBIT_DEFINITIONS } from "./orbits";

const LOADER = new THREE.TextureLoader();

const SPONSOR_CONFIG = {
  // --- ANIMATION SPEED CONTROL ---
  orbitSpeed: 0.0010, 
  hoverSpeed: 0.35,  
  
  // --- VISUALS ---
  hoverScaleGrowth: 1.4,
  defaultScale: 1.0,
  glowOpacity: 0.4,
  
  // *** TRANSPARENCY CONTROL ***
  // 1.0 = Fully Solid
  // 0.7 = 70% Visible (Ghostly)
  baseOpacity: 0.7, 
};

/**
 * Creates a sponsor object placed on a specific orbit.
 */
export function createSponsorToken({
  name,
  orbitIndex,
  angleDegree,
  imageWhitePath,
  imageColorPath,
  camera, 
  size = 40,
  lift = 10
}) {
  const group = new THREE.Group();

  // --- 1. Load Textures & Fix Aspect Ratio ---
  let meshWhite, meshColor;

  const onLoadTexture = (tex) => {
    // Safety check: calculate aspect only if image loaded successfully
    if (tex.image && tex.image.width && tex.image.height) {
      const aspect = tex.image.width / tex.image.height;
      if (meshWhite) meshWhite.scale.x = aspect;
      if (meshColor) meshColor.scale.x = aspect;
    }
  };

  const texWhite = LOADER.load(imageWhitePath, onLoadTexture);
  const texColor = LOADER.load(imageColorPath);

  [texWhite, texColor].forEach((t) => {
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.colorSpace = THREE.SRGBColorSpace;
  });

  // --- 2. Create Meshes ---
  const geometry = new THREE.PlaneGeometry(size, size);

  const matWhite = new THREE.MeshBasicMaterial({
    map: texWhite,
    transparent: true,
    opacity: SPONSOR_CONFIG.baseOpacity, // Start with base opacity
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

  meshWhite = new THREE.Mesh(geometry, matWhite);
  meshColor = new THREE.Mesh(geometry, matColor);
  meshColor.position.z = 0.2; 

  group.add(meshWhite);
  group.add(meshColor);

  // --- 3. Add Glow (Halo) ---
  const glowTexture = createGlowTexture();
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffffff,
    transparent: true,
    opacity: SPONSOR_CONFIG.glowOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const glowSprite = new THREE.Sprite(glowMaterial);
  glowSprite.raycast = () => {};
  
  const glowScale = size * 2.5; 
  glowSprite.scale.set(glowScale, glowScale, 1.5);
  glowSprite.position.z = -2; 
  group.add(glowSprite);

  // --- 4. Animation State ---
  let currentMix = 0;   // 0 = White, 1 = Color
  let currentScale = SPONSOR_CONFIG.defaultScale;
  
  // Convert initial degree to radians for internal calculation
  let currentAngleRad = (angleDegree * Math.PI) / 180;

  // Retrieve orbit data once
  const orbitData = ORBIT_DEFINITIONS[orbitIndex] || ORBIT_DEFINITIONS[0];

  // --- 5. Update Function ---
  function update(isHovered) {
    // A. ORBIT ROTATION LOGIC
    currentAngleRad += SPONSOR_CONFIG.orbitSpeed;
    
    const newPos = calculateOrbitPositionRadians(orbitData, currentAngleRad, lift);
    group.position.copy(newPos);

    // B. HOVER FADE LOGIC
    const targetMix = isHovered ? 1 : 0;
    currentMix += (targetMix - currentMix) * SPONSOR_CONFIG.hoverSpeed;

    // Fade white out as color fades in
    if (meshWhite && meshWhite.material) {
        meshWhite.material.opacity = (1 - currentMix) * SPONSOR_CONFIG.baseOpacity;
    }
    if (meshColor && meshColor.material) {
        meshColor.material.opacity = currentMix;
    }
    
    // C. HOVER SCALE LOGIC
    const targetScale = isHovered ? SPONSOR_CONFIG.hoverScaleGrowth : SPONSOR_CONFIG.defaultScale;
    currentScale += (targetScale - currentScale) * SPONSOR_CONFIG.hoverSpeed;
    group.scale.set(currentScale, currentScale, 1);

    // D. BILLBOARDING
    if (camera) {
      group.quaternion.copy(camera.quaternion);
    }
  }

  // Identify this group for raycasting
  group.userData = { isSponsor: true, name };

  return { group, update };
}

/**
 * Calculates 3D coordinates based on orbit definition (Using Radians).
 */
function calculateOrbitPositionRadians(data, angleRad, lift) {
  const localX = data.major * Math.cos(angleRad);
  const localY = data.minor * Math.sin(angleRad);
  const localZ = lift;

  // Apply Orbit Tilt
  const tiltRad = (data.tiltX || 0) * (Math.PI / 180);
  
  const rotatedY = localY * Math.cos(tiltRad) - localZ * Math.sin(tiltRad);
  const rotatedZ = localY * Math.sin(tiltRad) + localZ * Math.cos(tiltRad);

  const globalX = localX + data.x;
  const globalY = rotatedY + data.y;
  const globalZ = rotatedZ + data.z;

  return new THREE.Vector3(globalX, globalY, globalZ);
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext("2d");
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
}