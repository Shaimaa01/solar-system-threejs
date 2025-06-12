import SolarSystem from "./components/SolarSystem";

const App = () => {
  return <SolarSystem />;

  // PlanetData.js
  const planetData = [
    {
      name: "Mercury",
      size: 0.4,
      distance: 12,
      speed: 0.04,
      color: 0x8c7853,
      description: "Closest to Sun",
    },
    {
      name: "Venus",
      size: 0.9,
      distance: 18,
      speed: 0.035,
      color: 0xffb649,
      description: "Hottest planet",
    },
    {
      name: "Earth",
      size: 1.0,
      distance: 25,
      speed: 0.03,
      color: 0x6b93d6,
      description: "Our home",
    },
    {
      name: "Mars",
      size: 0.5,
      distance: 35,
      speed: 0.024,
      color: 0xcd5c5c,
      description: "Red planet",
    },
    {
      name: "Jupiter",
      size: 3.0,
      distance: 55,
      speed: 0.013,
      color: 0xd2691e,
      description: "Largest planet",
    },
    {
      name: "Saturn",
      size: 2.5,
      distance: 75,
      speed: 0.009,
      color: 0xf4a460,
      description: "Ring planet",
    },
    {
      name: "Uranus",
      size: 1.8,
      distance: 95,
      speed: 0.006,
      color: 0x4fd0e3,
      description: "Ice giant",
    },
    {
      name: "Neptune",
      size: 1.7,
      distance: 115,
      speed: 0.005,
      color: 0x4169e1,
      description: "Windiest planet",
    },
  ];

  // Planet.js - Fixed for older PCs
  const createPlanet = (scene, planetInfo) => {
    // Use basic material for better compatibility
    const geometry = new THREE.SphereGeometry(planetInfo.size, 12, 12);
    const material = new THREE.MeshBasicMaterial({
      color: planetInfo.color,
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
      32 // Reduced segments
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
        16 // Reduced segments
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
      const moonMaterial = new THREE.MeshBasicMaterial({
        color: 0xc0c0c0,
      });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(2.0, 0, 0);
      mesh.add(moon);
    }

    return mesh;
  };

  // CameraController.js - Using OrbitControls (simulated)
  const setupCameraControls = (camera, renderer) => {
    // Simple orbit controls implementation
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let distance = camera.position.length();

    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseMove = (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      targetX -= deltaX * 0.005; // Reduced sensitivity
      targetY += deltaY * 0.005;

      targetY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetY)); // Limited vertical rotation

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onWheel = (event) => {
      distance = Math.max(30, Math.min(150, distance + event.deltaY * 0.05));
    };

    const update = () => {
      currentX += (targetX - currentX) * 0.05; // Smoother movement
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = Math.cos(currentY) * Math.sin(currentX) * distance;
      camera.position.y = Math.sin(currentY) * distance;
      camera.position.z = Math.cos(currentY) * Math.cos(currentX) * distance;

      camera.lookAt(0, 0, 0);
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("wheel", onWheel);

    return {
      update,
      dispose: () => {
        renderer.domElement.removeEventListener("mousedown", onMouseDown);
        renderer.domElement.removeEventListener("mouseup", onMouseUp);
        renderer.domElement.removeEventListener("mousemove", onMouseMove);
        renderer.domElement.removeEventListener("wheel", onWheel);
      },
    };
  };

  // Stars.js - Optimized
  const createStars = (scene, isDarkTheme) => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];

    // Reduced star count for performance
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

  // Sun.js - Fixed for older PCs
  const createSun = (scene) => {
    const sunGeometry = new THREE.SphereGeometry(2.5, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd44, // Bright yellow-orange
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    return sun;
  };

  // Scene.js - Optimized functional component
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

    useEffect(() => {
      if (!mountRef.current) return;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        50, // Reduced FOV
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 20, 80);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: false, // Allow software rendering
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(1); // Force low pixel ratio
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);

      // Simplified lighting - only ambient light for old PCs
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      scene.background = new THREE.Color(isDarkTheme ? 0x000005 : 0x1a1a2e);

      const stars = createStars(scene, isDarkTheme);
      starsRef.current = stars;

      const sun = createSun(scene);
      sunRef.current = sun;

      // Create planets
      const planets = [];
      planetData.forEach((planetInfo) => {
        const planet = createPlanet(scene, planetInfo);
        planets.push(planet);
      });
      planetsRef.current = planets;

      // Setup camera controls
      const controls = setupCameraControls(camera, renderer);
      controlsRef.current = controls;

      let lastTime = 0;
      const animate = (currentTime) => {
        const deltaTime = (currentTime - lastTime) * 0.001; // Convert to seconds
        lastTime = currentTime;

        controls.update();

        if (isPlaying && deltaTime < 0.1) {
          // Skip frame if too much time passed
          if (sunRef.current) {
            sunRef.current.rotation.y += 0.003;
          }

          if (starsRef.current) {
            starsRef.current.rotation.y += 0.0001;
          }

          planets.forEach((planet) => {
            const planetInfo = planet.userData;
            const speed = planetSpeeds[planetInfo.name] || planetInfo.speed;

            planetInfo.angle += speed * deltaTime * 4; // Reduced multiplier
            planet.position.x =
              Math.cos(planetInfo.angle) * planetInfo.distance;
            planet.position.z =
              Math.sin(planetInfo.angle) * planetInfo.distance;

            planet.rotation.y += planetInfo.rotationSpeed;

            // Earth's moon
            if (planetInfo.name === "Earth" && planet.children.length > 0) {
              const moon = planet.children[0];
              moon.position.x = Math.cos(planetInfo.angle * 8) * 2.0;
              moon.position.z = Math.sin(planetInfo.angle * 8) * 2.0;
            }
          });
        }

        renderer.render(scene, camera);
        animationIdRef.current = requestAnimationFrame(animate);
      };

      animate(0);

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
    }, [isPlaying, isDarkTheme, planetSpeeds]);

    return <div ref={mountRef} className="absolute inset-0" />;
  };

  // Controls.js - Functional component
  const Controls = ({
    isPlaying,
    setIsPlaying,
    isDarkTheme,
    setIsDarkTheme,
    showControls,
    setShowControls,
  }) => {
    return (
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        >
          {isDarkTheme ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  };

  // SpeedPanel.js - Functional component
  const SpeedPanel = ({ planetSpeeds, handleSpeedChange, resetSpeeds }) => {
    return (
      <div className="absolute top-4 left-4 mt-20 p-4 bg-black/70 backdrop-blur-sm text-white rounded-lg max-w-xs max-h-80 overflow-y-auto z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Planet Speeds</h3>
          <button
            onClick={resetSpeeds}
            className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        <div className="space-y-3">
          {planetData.map((planet) => (
            <div key={planet.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <label
                  className="text-xs font-medium"
                  style={{
                    color: `#${planet.color.toString(16).padStart(6, "0")}`,
                  }}
                >
                  {planet.name}
                </label>
                <span className="text-xs opacity-75">
                  {(planetSpeeds[planet.name] || planet.speed).toFixed(3)}x
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.08"
                step="0.001"
                value={planetSpeeds[planet.name] || planet.speed}
                onChange={(e) =>
                  handleSpeedChange(planet.name, parseFloat(e.target.value))
                }
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs opacity-60">{planet.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // SolarSystem.js - Main functional component

  const [isPlaying, setIsPlaying] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [planetSpeeds, setPlanetSpeeds] = useState(
    planetData.reduce((acc, planet) => {
      acc[planet.name] = planet.speed;
      return acc;
    }, {})
  );

  const handleSpeedChange = (planetName, newSpeed) => {
    setPlanetSpeeds((prev) => ({
      ...prev,
      [planetName]: newSpeed,
    }));
  };

  const resetSpeeds = () => {
    setPlanetSpeeds(
      planetData.reduce((acc, planet) => {
        acc[planet.name] = planet.speed;
        return acc;
      }, {})
    );
  };

  return (
    <div
      className={`w-full h-screen relative overflow-hidden ${
        isDarkTheme ? "bg-black" : "bg-slate-900"
      }`}
    >
      <Scene
        isPlaying={isPlaying}
        isDarkTheme={isDarkTheme}
        planetSpeeds={planetSpeeds}
      />

      <Controls
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        showControls={showControls}
        setShowControls={setShowControls}
      />

      {showControls && (
        <SpeedPanel
          planetSpeeds={planetSpeeds}
          handleSpeedChange={handleSpeedChange}
          resetSpeeds={resetSpeeds}
        />
      )}

      <div className="absolute bottom-4 left-4 text-white/70 text-sm z-10">
        <p>🖱️ Drag to rotate • 🔄 Scroll to zoom • ⚙️ Settings for controls</p>
        <p className="text-xs opacity-50">Optimized for older PCs</p>
      </div>

      <div className="absolute bottom-4 right-4 text-white/70 text-sm text-right z-10">
        <p className="font-semibold">3D Solar System</p>
        <p>🌍 Earth's Moon • 🪐 Saturn's Rings</p>
      </div>
    </div>
  );
};

export default App;
