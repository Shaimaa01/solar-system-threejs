
import { useState } from "react";
import { Play, Pause, Settings, Sun, Moon } from "lucide-react";
import SolarSystem from "./components/SolarSystem";

const App = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden">
      <SolarSystem 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        showControls={showControls}
        setShowControls={setShowControls}
      />
    </div>
  );
};

export default App;
