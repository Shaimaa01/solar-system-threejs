
import {planetData} from "./PlanetData";
import { useState } from "react";
import Scene from "./Scene";
import Controls from "./Controls";
import SpeedPanel from "./SpeedPanel";

const SolarSystem = ({ 
  isPlaying, 
  setIsPlaying, 
  isDarkTheme, 
  setIsDarkTheme, 
  showControls, 
  setShowControls 
}) => {
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

export default SolarSystem;
