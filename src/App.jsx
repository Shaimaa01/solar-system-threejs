import { useState } from "react";
import SolarSystem from "./components/SolarSystem";

const App = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showControls, setShowControls] = useState(false);

  return (
      <SolarSystem
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        showControls={showControls}
        setShowControls={setShowControls}
      />

  );
};

export default App;
