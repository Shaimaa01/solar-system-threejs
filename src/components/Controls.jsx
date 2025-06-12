import { Play, Pause, Settings, Moon, Sun } from "lucide-react";

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

export default Controls;
