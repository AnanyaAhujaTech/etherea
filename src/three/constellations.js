import * as THREE from "three";

// ==========================================
// 🎛️ CONTROL PANEL
// ==========================================

const CONFIG = {
  // Visuals
  lineColor: 0xffffff, 
  starColor: 0xffffff,
  passiveOpacity: 0.1,  
  activeOpacity: 1.0,
  scale: 4.5,           // Global size multiplier

  // Animation
  fadeSpeedIn: 0.1,    
  fadeSpeedOut: 0.09, 
};

// 🗺️ POSITIONS
const CONSTELLATION_DATA = {
  mirror: { x: -800, y: 300, z: -500 },
  trident: { x: -1100, y: -100, z: -500 },
  lotus: { x: -800, y: -500, z: -500 },
  feather: { x: -1100, y: -700, z: -500 },
  sword: { x: 800, y: 300, z: -500 },
  moon: { x: 1100, y: -100, z: -500 },
  teardrop: { x: 800, y: -500, z: -500 },
  eye: { x: 1100, y: -800, z: -500 },
  dove: { x: 900, y: 150, z: -500 }
};

// 📐 SHAPE DEFINITIONS
const SHAPES = {
  mirror: [[0, 40, 0], [20, 20, 0], [0, 0, 0], [-20, 20, 0], [0, 40, 0], [0, 0, 0], [0, -40, 0]],
  trident: [[0, -40, 0], [0, 40, 0], [-20, 20, 0], [-20, 0, 0], [0, -10, 0], [20, 0, 0], [20, 20, 0]],
  lotus: [[0, -20, 0], [-15, 0, 0], [0, 20, 0], [15, 0, 0], [0, -20, 0], [-15, 0, 0], [-30, 10, 0], [-10, -20, 0], [15, 0, 0], [30, 10, 0], [10, -20, 0]],
  feather: [[0, -40, 0], [0, 40, 0], [0, 30, 0], [10, 35, 0], [0, 20, 0], [15, 25, 0], [0, 10, 0], [12, 12, 0], [0, 0, 0], [10, 0, 0]],
  sword: [[0, -40, 0], [0, 50, 0], [-15, -10, 0], [15, -10, 0]],
  moon: [[0, 40, 0], [10, 20, 0], [10, -20, 0], [0, -40, 0], [-15, -30, 0], [-25, 0, 0], [-15, 30, 0], [0, 40, 0]],
  teardrop: [[0, 40, 0], [15, -10, 0], [0, -30, 0], [-15, -10, 0], [0, 40, 0]],
  eye: [[-40, 0, 0], [0, 20, 0], [40, 0, 0], [0, -20, 0], [-40, 0, 0], [0, 5, 0], [5, 0, 0], [0, -5, 0], [-5, 0, 0], [0, 5, 0]],
  dove: [[0, 0, 0], [-20, 10, 0], [-30, 30, 0], [-10, 20, 0], [0, 0, 0], [0, 0, 0], [20, -10, 0], [10, 10, 0], [0, 0, 0]]
};

// ==========================================

export function createConstellationsManager() {
  const group = new THREE.Group();
  const hitTargets = []; 
  const instances = [];  
  
  const starTexture = createStarTexture();

  // --- BUILD MESHES ---
  Object.keys(CONSTELLATION_DATA).forEach((key) => {
    const data = CONSTELLATION_DATA[key];
    const pointsData = SHAPES[key];
    
    if (!pointsData) return;

    // 1. Container
    const constellation = new THREE.Group();
    constellation.position.set(data.x, data.y, data.z);
    constellation.scale.set(CONFIG.scale, CONFIG.scale, CONFIG.scale);
    constellation.rotation.z = (Math.random() - 0.5) * 0.5;

    // 2. Geometry
    const points = pointsData.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // 3. Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: CONFIG.lineColor,
      transparent: true,
      opacity: CONFIG.passiveOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const lineMesh = new THREE.Line(geometry, lineMat);
    constellation.add(lineMesh);

    // 4. Stars
    const starGeo = new THREE.BufferGeometry().setFromPoints(points);
    const starMat = new THREE.PointsMaterial({
      color: CONFIG.starColor,
      map: starTexture,
      size: 15,
      transparent: true,
      opacity: CONFIG.passiveOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    constellation.add(starPoints);

    // 5. Hit Area
    geometry.computeBoundingSphere();
    const hitGeo = new THREE.SphereGeometry(geometry.boundingSphere.radius + 15, 8, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.userData = { id: key }; // ID used for hover logic
    hitTargets.push(hitMesh);
    constellation.add(hitMesh);

    group.add(constellation);

    instances.push({
      name: key,
      lineMat,
      starMat,
      currentOpacity: CONFIG.passiveOpacity
    });
  });

  // --- UPDATE LOOP ---
  function update(hoveredMesh) {
    if (!instances || instances.length === 0) return false;

    let anyActive = false;

    // Opacity Animation
    instances.forEach(inst => {
      const isTarget = hoveredMesh && hoveredMesh.userData?.id === inst.name;
      const targetOpacity = isTarget ? CONFIG.activeOpacity : CONFIG.passiveOpacity;
      const speed = isTarget ? CONFIG.fadeSpeedIn : CONFIG.fadeSpeedOut;
      
      inst.currentOpacity += (targetOpacity - inst.currentOpacity) * speed;
      inst.lineMat.opacity = inst.currentOpacity;
      inst.starMat.opacity = inst.currentOpacity;
      
      if (isTarget) anyActive = true;
    });

    return anyActive;
  }

  return { group, hitTargets, update };
}

// --- HELPERS ---

function createStarTexture() {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement("canvas");
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}