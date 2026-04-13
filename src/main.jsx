import React, { Suspense, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Scene from "./Scene.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "./LoadingScreen.jsx";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [resetKey, setResetKey] = useState(0);
  const restart = useCallback(() => setResetKey((k) => k + 1), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "r" || e.key === "R") restart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [restart]);

  return (
    <>
      {/* TODO use <Center /> */}
      <Leva hidden />
      <Canvas
        shadows
        camera={{
          position: [-2.3, 2.1, 0.7],
          rotation: [-0.15, 0.08, -0.01],
          up: [0, 1, 0],
          near: 0.1,
          far: 1000,
          fov: 75,
        }}
      >
        <Physics key={resetKey}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Physics>
      </Canvas>
      <LoadingScreen />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <button
            className="restart-button"
            onClick={restart}
            aria-label="Restart scene"
          >
            Restart
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
