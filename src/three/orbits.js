import * as THREE from "three";

// EXPORTED CONFIGURATION
// We export this so the Sponsor system knows where the rings are.
export const ORBIT_DEFINITIONS = [
  { name: "Inner",  major: 400, minor: 232, tiltX: 40, x: 0, y: 0,    z: -150, color: 0x3f3f3f },
  { name: "Middle", major: 600, minor: 366, tiltX: 40, x: 0, y: -100, z: -100, color: 0x7f7f7f },
  { name: "Outer",  major: 900, minor: 528, tiltX: 40, x: 0, y: -230, z: -100, color: 0x9f9f9f },
];

/**
 * Creates a group of soft, volumetric elliptical orbits.
 * Uses the exported ORBIT_DEFINITIONS by default.
 */
export function createOrbits() {
  const group = new THREE.Group();

  ORBIT_DEFINITIONS.forEach((data) => {
    const orbitContainer = new THREE.Group();

    // 1. Create the Ellipse Path
    const curve = new THREE.EllipseCurve(
      0, 0,
      data.major, data.minor,
      0, 2 * Math.PI,
      false, 0
    );

    // Convert to 3D path
    const points = curve.getPoints(128);
    const path = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    path.closed = true;

    // 2. Core Mesh (The "Line")
    const coreGeo = new THREE.TubeGeometry(path, 128, 0.6, 8, true);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x545454,
      transparent: true,
      opacity: 0.004,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);

    // 3. Glow Mesh (The "Softness")
    const glowGeo = new THREE.TubeGeometry(path, 128, 2.0, 8, true);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xededed,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);

    // 4. Transformations
    orbitContainer.position.set(data.x || 0, data.y || 0, data.z || 0);
    orbitContainer.rotation.x = (data.tiltX || 0) * (Math.PI / 180);
    
    // Support for individual Y and Z rotations if provided
    if (data.tiltY) orbitContainer.rotation.y = data.tiltY * (Math.PI / 180);
    if (data.tiltZ) orbitContainer.rotation.z = data.tiltZ * (Math.PI / 180);

    orbitContainer.add(coreMesh);
    orbitContainer.add(glowMesh);
    
    group.add(orbitContainer);
  });

  return group;
}