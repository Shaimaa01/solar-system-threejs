
import * as THREE from 'three';

class Planet {
  constructor(scene, planetInfo) {
    this.scene = scene;
    
    // Create planet mesh with correct colors
    const geometry = new THREE.SphereGeometry(planetInfo.size, 24, 24);
    const material = new THREE.MeshPhongMaterial({
      color: planetInfo.color,
      shininess: planetInfo.name === 'Earth' ? 50 : 10,
      specular: planetInfo.name === 'Earth' ? 0x222222 : 0x111111
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = planetInfo.distance;
    this.mesh.userData = {
      ...planetInfo,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: 0.01 + Math.random() * 0.02
    };
    
    scene.add(this.mesh);

    // Create orbit path
    this.createOrbitPath(planetInfo);

    // Add special features
    this.addSpecialFeatures(planetInfo);
  }

  createOrbitPath(planetInfo) {
    const orbitGeometry = new THREE.RingGeometry(
      planetInfo.distance - 0.1,
      planetInfo.distance + 0.1,
      64
    );
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x666666,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = -Math.PI / 2;
    this.scene.add(orbit);
  }

  addSpecialFeatures(planetInfo) {
    if (planetInfo.name === 'Saturn') {
      // Saturn's rings
      const ringGeometry = new THREE.RingGeometry(
        planetInfo.size * 1.3,
        planetInfo.size * 2.2,
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xD2691E,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = -Math.PI / 2;
      rings.rotation.z = Math.PI / 12;
      this.mesh.add(rings);
    }

    if (planetInfo.name === 'Earth') {
      // Earth's moon
      const moonGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0xC0C0C0
      });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(2.5, 0, 0);
      this.mesh.add(moon);
    }
  }

  getMesh() {
    return this.mesh;
  }
}

export default Planet;