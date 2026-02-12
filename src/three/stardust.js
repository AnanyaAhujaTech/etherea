// stardust.js
import * as THREE from "three";

export function createStardust() {
  const particleCount = 150; // Pool size
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const opacities = new Float32Array(particleCount); // We'll use this for lifecycle

  // Initialize off-screen
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 9999;
    positions[i * 3 + 1] = 9999;
    positions[i * 3 + 2] = 9999;
    sizes[i] = 0;
    opacities[i] = 0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));

  const texture = createSparkleTexture();

  // Custom Shader Material for performant fading
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: texture },
      color: { value: new THREE.Color(0xffffff) }, // Gold/Stardust color
    },
    vertexShader: `
      attribute float size;
      attribute float aOpacity;
      varying float vOpacity;
      void main() {
        vOpacity = aOpacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      uniform vec3 color;
      varying float vOpacity;
      void main() {
        if (vOpacity <= 0.01) discard;
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(color, vOpacity) * texColor;
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  // --- LOGIC ---
  const particles = []; // JS array to manage lifecycle state
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      index: i,
      life: 0,
      vx: 0,
      vy: 0,
      active: false,
    });
  }

  let spawnIndex = 0;

  /**
   * @param {THREE.Vector3} mouseWorldPos - World coordinates of mouse (projected to z=0 or relevant depth)
   * @param {boolean} shouldEmit - Only true when hovering a constellation
   */
  function update(mouseWorldPos, shouldEmit, deltaTime = 0.016) {
    // 1. SPAWN NEW PARTICLES
    if (shouldEmit) {
      // Spawn 2 particles per frame for density
      for (let k = 0; k < 2; k++) {
        const p = particles[spawnIndex];
        p.active = true;
        p.life = 1.0; // Starts full life
        
        // Position with slight jitter
        const jitter = 5;
        positions[p.index * 3] = mouseWorldPos.x + (Math.random() - 0.5) * jitter;
        positions[p.index * 3 + 1] = mouseWorldPos.y + (Math.random() - 0.5) * jitter;
        positions[p.index * 3 + 2] = mouseWorldPos.z + 50; // Slightly in front

        // Velocity (drift away)
        p.vx = (Math.random() - 0.5) * 20;
        p.vy = (Math.random() - 0.5) * 20;

        spawnIndex = (spawnIndex + 1) % particleCount;
      }
    }

    // 2. UPDATE EXISTING PARTICLES
    let activeCount = 0;
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      if (!p.active) continue;

      p.life -= deltaTime * 1.5; // Decay speed

      if (p.life <= 0) {
        p.active = false;
        positions[p.index * 3] = 9999; // Hide
        sizes[p.index] = 0;
        opacities[p.index] = 0;
      } else {
        // Move
        positions[p.index * 3] += p.vx * deltaTime;
        positions[p.index * 3 + 1] += p.vy * deltaTime;
        
        // Update Attributes
        sizes[p.index] = p.life * 15.0; // Shrink
        opacities[p.index] = p.life;    // Fade
        activeCount++;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    geometry.attributes.aOpacity.needsUpdate = true;
  }

  return { mesh: points, update };
}

function createSparkleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext("2d");
  
  // Cross/Star shape
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  
  return new THREE.CanvasTexture(canvas);
}