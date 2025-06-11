import  { useEffect, useRef } from "react";
import * as THREE from "three";
import { planetData } from "./PlanetData";
import CameraController from "./CameraController";
import Stars from "./Stars";
import Sun from "./Sun";
import Planet from "./Planet";

const Scene = ({ isPlaying, isDarkTheme, planetSpeeds }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const planetsRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());
  const animationIdRef = useRef(null);
  const sunRef = useRef(null);
  const starsRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 30, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
    //   powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1.5, 200);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Theme setup
    scene.background = new THREE.Color(isDarkTheme ? 0x000008 : 0x1a1a2e);

    // Create stars
    const stars = new Stars(scene, isDarkTheme);
    starsRef.current = stars.getStars();

    // Create sun
    const sun = new Sun(scene);
    sunRef.current = sun.getSun();

    // Create planets
    const planets = [];
    planetData.forEach((planetInfo) => {
      const planet = new Planet(scene, planetInfo);
      planets.push(planet.getMesh());
    });
    planetsRef.current = planets;

    // Camera controller
    const cameraController = new CameraController(camera);

    // Animation loop
    const animate = () => {
      cameraController.update();

      if (isPlaying) {
        const delta = clockRef.current.getDelta();

        // Sun rotation
        if (sunRef.current) {
          sunRef.current.rotation.y += 0.005;
        }

        // Stars rotation
        if (starsRef.current) {
          starsRef.current.rotation.y += 0.0001;
        }

        // Planet animation
        planets.forEach((planet) => {
          const planetInfo = planet.userData;
          const speed = planetSpeeds[planetInfo.name] || planetInfo.speed;

          // Orbital motion
          planetInfo.angle += speed * delta * 8;
          planet.position.x = Math.cos(planetInfo.angle) * planetInfo.distance;
          planet.position.z = Math.sin(planetInfo.angle) * planetInfo.distance;

          // Planet self-rotation
          planet.rotation.y += planetInfo.rotationSpeed;

          // Special animations for moons and rings
          if (planetInfo.name === "Earth" && planet.children.length > 0) {
            const moon = planet.children[0];
            moon.position.x = Math.cos(planetInfo.angle * 12) * 2.5;
            moon.position.z = Math.sin(planetInfo.angle * 12) * 2.5;
          }
        });
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      cameraController.dispose();

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPlaying, isDarkTheme, planetSpeeds]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default Scene;
