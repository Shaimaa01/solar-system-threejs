
import * as THREE from "three";

const Planet = (scene, planetInfo) => {
  // Use basic material for better compatibility
  const geometry = new THREE.SphereGeometry(planetInfo.size, 16, 16);
  const material = new THREE.MeshPhongMaterial({
    color: planetInfo.color,
    shininess: 30,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planetInfo.distance;
  mesh.userData = {
    ...planetInfo,
    angle: Math.random() * Math.PI * 2,
    rotationSpeed: 0.005 + Math.random() * 0.01,
  };

  scene.add(mesh);

  // Create simple orbit path
  const orbitGeometry = new THREE.RingGeometry(
    planetInfo.distance - 0.05,
    planetInfo.distance + 0.05,
    32
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = -Math.PI / 2;
  scene.add(orbit);

  // Add special features
  if (planetInfo.name === "Saturn") {
    const ringGeometry = new THREE.RingGeometry(
      planetInfo.size * 1.2,
      planetInfo.size * 2.0,
      16
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xd2691e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = -Math.PI / 2;
    rings.rotation.z = Math.PI / 12;
    mesh.add(rings);
  }

  if (planetInfo.name === "Earth") {
    const moonGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const moonMaterial = new THREE.MeshLambertMaterial({
      color: 0xc0c0c0,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(2.0, 0, 0);
    mesh.add(moon);
  }

  return mesh;
};

export default Planet;
