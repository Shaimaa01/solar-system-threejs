import  { useState } from "react";
import Scene from "./Scene";
import Controls from "./Controls";
import SpeedPanel from "./SpeedPanel";
import { planetData } from "./planetData";

const SolarSystem = () => {
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

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm">
        <p>
          🖱️ Move mouse to rotate • 🔄 Scroll to zoom • ⚙️ Settings for speed
          controls
        </p>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 text-white/70 text-sm text-right">
        <p className="font-semibold">3D Solar System Simulation</p>
        <p>🌍 Earth's Moon • 🪐 Saturn's Rings • ✨ Realistic Orbits</p>
        <p className="text-xs mt-1">
          Theme: {isDarkTheme ? "Deep Space" : "Nebula Space"}
        </p>
      </div>
    </div>
  );
};

export default SolarSystem;
