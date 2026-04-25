import React, { Suspense, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Scene from "./Scene.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "./LoadingScreen.jsx";
import { GameMenu } from "./GameMenu.jsx";
import { MenuButton } from "./MenuButton.jsx";
import { Instructions } from "./Instructions.jsx";
import { usePreventSelect } from "./usePreventSelect.js";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [resetKey, setResetKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const restart = useCallback(() => setResetKey((k) => k + 1), []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleRestart = useCallback(() => {
    restart();
    setIsPaused(false);
  }, [restart]);

  const closeInstructions = useCallback(() => {
    setShowInstructions(false);
  }, []);

  const openInstructions = useCallback(() => {
    setShowInstructions(true);
  }, []);

  usePreventSelect();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "?") {
        setShowInstructions((s) => !s);
        return;
      }
      if (e.key === "Escape") {
        if (showInstructions) {
          closeInstructions();
          return;
        }
        setIsPaused((p) => !p);
        return;
      }
      if ((e.key === "r" || e.key === "R") && !isPaused && !showInstructions) {
        restart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [restart, isPaused, showInstructions, closeInstructions]);

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
      <GameMenu
        isOpen={isPaused}
        isPaused={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onHelp={openInstructions}
      />
      <Instructions isOpen={showInstructions} onClose={closeInstructions} />
      {!isPaused && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <MenuButton
              className="restart-button"
              size={20}
              onClick={restart}
              aria-label="Restart scene"
            >
              Restart
            </MenuButton>
            <MenuButton
              className="help-button"
              size={24}
              onClick={openInstructions}
              aria-label="Show instructions"
            >
              Help
            </MenuButton>
            <div className="inline-instructions">
              Drag to rotate · Right-drag to shift · Scroll to zoom · Click to disturb
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
