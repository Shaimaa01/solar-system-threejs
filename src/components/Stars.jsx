
import * as THREE from 'three';

class Stars {
  constructor(scene, isDark) {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: isDark ? 0xffffff : 0xcccccc,
      size: isDark ? 1 : 0.5,
      sizeAttenuation: false,
      transparent: true,
      opacity: isDark ? 0.8 : 0.4
    });

    const starsVertices = [];
    for (let i = 0; i < 150; i++) {
      const radius = 500 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(this.stars);
  }

  getStars() {
    return this.stars;
  }
}

export default Stars;