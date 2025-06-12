
import * as THREE from "three";

const Sun = (scene) => {
  const sunGeometry = new THREE.SphereGeometry(2.5, 16, 16);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdd44,
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
  return sun;
};

export default Sun;
