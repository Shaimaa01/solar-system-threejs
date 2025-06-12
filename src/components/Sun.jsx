
import * as THREE from 'three';

const Sun = (scene) => {
  const sunGeometry = new THREE.SphereGeometry(2.5, 16, 16); // Smaller and lower detail
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    emissive: 0xffaa00,
    emissiveIntensity: 0.3
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
  return sun;
};

export default Sun;