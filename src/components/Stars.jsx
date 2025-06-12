
import * as THREE from "three";

const Stars = (scene, isDarkTheme) => {
  const starsGeometry = new THREE.BufferGeometry();
  const starsVertices = [];

  for (let i = 0; i < 800; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );
  const starsMaterial = new THREE.PointsMaterial({
    color: isDarkTheme ? 0xffffff : 0x888888,
    size: 1.5,
  });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
  return stars;
};

export default Stars;
