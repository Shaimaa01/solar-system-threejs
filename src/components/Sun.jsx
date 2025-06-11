
import * as THREE from 'three';

class Sun {
  constructor(scene) {
    // Main sun
    const sunGeometry = new THREE.SphereGeometry(4,24, 24);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
    //   emissive: 0xFFAA00,
    //   emissiveIntensity: 0.3
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(this.sun);

    // Sun corona (glow effect)
    const coronaGeometry = new THREE.SphereGeometry(5.5, 24, 24);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    this.corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    scene.add(this.corona);
  }

  getSun() {
    return this.sun;
  }

  getCorona() {
    return this.corona;
  }
}

export default Sun;