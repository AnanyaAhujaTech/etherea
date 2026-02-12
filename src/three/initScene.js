import * as THREE from "three";
// Environment
import { createStars } from "./stars";
import { createNebula } from "./nebula";
import { createConstellationsManager } from "./constellations"; 
import { createStardust } from "./stardust"; 

// Sponsors Logic
import { createHeading } from "./heading"; 
import { createSponsorToken } from "./sponsors"; 
import { createOrbits } from "./orbits";
import { createLogo } from "./logo";

// Placeholder Asset Paths
import logoWhite from "../assets/fest-logo-white.png"; 
import logoColor from "../assets/fest-logo.png";

export function initScene(container, pageType = 'home') {
  // 1. Scene Setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0006);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 800; 

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // 2. Interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-1000, -1000);
  const mouseWorldPos = new THREE.Vector3(); 

  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener( 'mousemove', onPointerMove );

  // 3. Environment (Shared)
  const galaxyGroup = new THREE.Group();
  const nebula = createNebula();
  galaxyGroup.add(nebula); 
  const stars = createStars({ count: 8000, spread: 4500, size: 5.0 });
  galaxyGroup.add(stars); 
  galaxyGroup.position.z = -400; 
  scene.add(galaxyGroup);

  // 4. Conditional Content
  let constellations, stardust; // Home
  let heading, orbits, logo; // Sponsors
  const sponsorTokens = []; 

  if (pageType === 'home') {
      constellations = createConstellationsManager();
      scene.add(constellations.group);
      stardust = createStardust();
      scene.add(stardust.mesh);
  } 
  else if (pageType === 'sponsors') {
      // A. Orbits
      orbits = createOrbits(); 
      scene.add(orbits); 

      // B. Logo
      logo = createLogo(); 
      scene.add(logo.group);

      // C. Heading
      heading = createHeading(); 
      scene.add(heading.group);

      // D. Sponsors Loop
      const sponsorData = [
        { name: "Sponsor 1", orbitIndex: 0, angle: 0 },
        { name: "Sponsor 2", orbitIndex: 0, angle: 120 },
        { name: "Sponsor 3", orbitIndex: 0, angle: 240 },
        { name: "Sponsor 4", orbitIndex: 1, angle: 60 },
        { name: "Sponsor 5", orbitIndex: 1, angle: 180 },
        { name: "Sponsor 6", orbitIndex: 1, angle: 300 },
        { name: "Sponsor 7", orbitIndex: 2, angle: 45 },
        { name: "Sponsor 8", orbitIndex: 2, angle: 135 },
      ];

      sponsorData.forEach(data => {
         const token = createSponsorToken({
            name: data.name,
            orbitIndex: data.orbitIndex,
            angleDegree: data.angle,
            imageWhitePath: logoWhite, 
            imageColorPath: logoColor,
            camera: camera 
         });
         scene.add(token.group);
         sponsorTokens.push(token);
      });
  }

  // 5. Animation Loop
  let frameId;
  const clock = new THREE.Clock();

  function animate() {
    frameId = requestAnimationFrame(animate);
    const delta = clock.getDelta(); 
    
    // Rotate Galaxy
    galaxyGroup.rotation.z += 0.00080;
    if (nebula.children) {
        nebula.children.forEach((s, i) => s.rotation.x += 0.05 * (i % 2 === 0 ? 1 : -1));
    }

    // --- HOME MODE LOGIC ---
    if (pageType === 'home' && constellations && stardust) {
        raycaster.setFromCamera( pointer, camera );
        
        const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
        vec.unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const dist = (0 - camera.position.z) / dir.z; 
        mouseWorldPos.copy(camera.position).add(dir.multiplyScalar(dist));

        const hits = raycaster.intersectObjects(constellations.hitTargets);
        const hovered = hits.length > 0 ? hits[0].object : null;
        
        // ⚠️ FIXED: Removed camera/renderer args. Purely hover logic now.
        const isActive = constellations.update(hovered);
        
        stardust.update(mouseWorldPos, isActive, delta);
    }

    // --- SPONSORS MODE LOGIC ---
    if (pageType === 'sponsors') {
        raycaster.setFromCamera(pointer, camera);

        if (heading && heading.update) heading.update(camera); 

        if (logo && logo.update) {
            const logoHits = raycaster.intersectObjects([logo.group], true);
            logo.update(logoHits.length > 0);
        }

        if (sponsorTokens.length > 0) {
            const sponsorGroups = sponsorTokens.map(t => t.group);
            const intersects = raycaster.intersectObjects(sponsorGroups, true);
            
            let hoveredSponsorName = null;
            if (intersects.length > 0) {
                let obj = intersects[0].object;
                while(obj) {
                    if (obj.userData && obj.userData.isSponsor) {
                        hoveredSponsorName = obj.userData.name;
                        break;
                    }
                    obj = obj.parent;
                }
            }

            sponsorTokens.forEach(token => {
                const isHovered = (token.group.userData.name === hoveredSponsorName);
                if (token.update) token.update(isHovered);
            });
        }
    }

    renderer.render(scene, camera);
  }

  animate();

  // 6. Resize & Cleanup
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onPointerMove);
    cancelAnimationFrame(frameId);
    
    // Dispose resources
    scene.traverse((o) => {
      if(o.geometry) o.geometry.dispose();
      if(o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
          else o.material.dispose();
      }
    });
    renderer.dispose();
    if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
  };
}