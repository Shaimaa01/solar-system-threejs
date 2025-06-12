import * as THREE from "three";
import { useEffect, useRef } from "react";
import Sun from "./Sun";
import Stars from "./Stars";
import CameraControls from "./CameraController";
import Planet from "./Planet";
import { planetData } from "./PlanetData";

const Scene = ({ isPlaying, isDarkTheme, planetSpeeds }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const planetsRef = useRef([]);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);
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
    if (!mountRef.current) return;

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
    mountRef.current.appendChild(renderer.domElement);

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

    // Create planets
    const planets = [];
    planetData.forEach((planetInfo) => {
      const planet = Planet(scene, planetInfo);
      planets.push(planet);
    });
    planetsRef.current = planets;

    // Setup camera controls
    const controls = CameraControls(camera, renderer);
    controlsRef.current = controls;

    // let lastTime = 0;
    // const animate = (currentTime) => {
    //   const deltaTime = (currentTime - lastTime) * 0.001;
    //   lastTime = currentTime;

    //   controls.update();

    //   // Always render, but only animate if playing
    //   if (isPlayingRef.current && deltaTime < 0.1) {
    //     if (sunRef.current) {
    //       sunRef.current.rotation.y += 0.003;
    //     }

    //     if (starsRef.current) {
    //       starsRef.current.rotation.y += 0.0001;
    //     }

    //     planetsRef.current.forEach((planet) => {
    //       const planetInfo = planet.userData;
    //       const speed =
    //         planetSpeedsRef.current[planetInfo.name] || planetInfo.speed;

    //       planetInfo.angle += speed * deltaTime * 4;
    //       planet.position.x = Math.cos(planetInfo.angle) * planetInfo.distance;
    //       planet.position.z = Math.sin(planetInfo.angle) * planetInfo.distance;

    //       planet.rotation.y += planetInfo.rotationSpeed;

    //       // Earth's moon
    //       if (planetInfo.name === "Earth" && planet.children.length > 0) {
    //         const moon = planet.children[0];
    //         moon.position.x = Math.cos(planetInfo.angle * 8) * 2.0;
    //         moon.position.z = Math.sin(planetInfo.angle * 8) * 2.0;
    //       }
    //     });
    //   }

    //   // Always render the scene
    //   renderer.render(scene, camera);
    //   animationIdRef.current = requestAnimationFrame(animate);
    // };

    // animate();

    // Place this entire block inside your main `useEffect` hook in Scene.js

    // --- Animation Loop ---

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
        sun.rotation.y += 0.002 * safeDeltaTime * 60;

        starsRef.current.rotation.y += 0.0005 * safeDeltaTime * 60;

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
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      // Clean up resources
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
  }, []); // Empty dependency array - scene only creates once

  // Handle theme changes
  useEffect(() => {
    if (sceneRef.current && starsRef.current) {
      sceneRef.current.background = new THREE.Color(
        isDarkTheme ? 0x000011 : 0x2d2d44,
      );
      starsRef.current.material.color.setHex(isDarkTheme ? 0xffffff : 0xcccccc);
    }
  }, [isDarkTheme]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default Scene;
