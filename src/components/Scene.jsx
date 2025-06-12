import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import Sun from "./Sun";
import Stars from "./Stars";
import Planet from "./Planet";
import { planetData } from "./PlanetData";

const Scene = ({ isPlaying, isDarkTheme, planetSpeeds }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const planetsRef = useRef([]);
  const sunRef = useRef(null);
  const starsRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const planetSpeedsRef = useRef(planetSpeeds);
  const isDarkThemeRef = useRef(isDarkTheme);

  // Update refs whenever props change
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    planetSpeedsRef.current = planetSpeeds;
    isDarkThemeRef.current = isDarkTheme;
  }, [isPlaying, isDarkTheme, planetSpeeds]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 20, 80);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    // Improved lighting for better planet colors
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 2.0, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Additional directional light for better illumination
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    scene.background = new THREE.Color(isDarkTheme ? 0x000011 : 0x2d2d44);

    const stars = Stars(scene, isDarkTheme);
    starsRef.current = stars;

    const sun = Sun(scene);
    sunRef.current = sun;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 30;
    controls.maxDistance = 250;

    // Create planets
    const planets = [];
    planetData.forEach((planetInfo) => {
      const planet = Planet(scene, planetInfo);
      planets.push(planet);
    });
    planetsRef.current = planets;

    let animationId = null;
    let lastTime = 0;

    const animate = (currentTime) => {
      if (lastTime === 0) {
        lastTime = currentTime;
      }

      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const safeDeltaTime = Math.min(deltaTime, 0.1);

      controls.update();

      if (isPlayingRef.current) {
        if (sunRef.current) {
          sunRef.current.rotation.y += 0.003;
        }

        if (starsRef.current) {
          starsRef.current.rotation.y += 0.0001;
        }

        planets.forEach((planet) => {
          const planetInfo = planet.userData;

          const speed =
            planetSpeedsRef.current[planetInfo.name] || planetInfo.speed;

          planetInfo.angle += speed * safeDeltaTime * 5;

          planet.position.x = Math.cos(planetInfo.angle) * planetInfo.distance;
          planet.position.z = Math.sin(planetInfo.angle) * planetInfo.distance;

          planet.rotation.y += planetInfo.rotationSpeed * safeDeltaTime * 60;

          if (planetInfo.name === "Earth" && planet.children[0]) {
            const moon = planet.children[0];

            moon.position.x = Math.cos(planetInfo.angle * 12) * 2.0;
            moon.position.z = Math.sin(planetInfo.angle * 12) * 2.0;
          }
        });
      }

      renderer.render(scene, camera);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      currentMount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });

      renderer.dispose();
    };
  }, [isDarkTheme]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default Scene;
