
import { RotateCcw } from "lucide-react";
import { planetData } from "./PlanetData";

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

export default SpeedPanel;
