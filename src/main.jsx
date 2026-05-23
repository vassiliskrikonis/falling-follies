import React, { Suspense, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Scene from "./Scene.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import { AnimatePresence, motion } from "framer-motion";
import { CONTROLS_ENTER, CONTROLS_EXIT } from "./transitions.js";
import { LoadingScreen } from "./LoadingScreen.jsx";
import { CameraRig } from "./CameraRig.jsx";
import { GameMenu } from "./GameMenu.jsx";
import { MenuButton } from "./MenuButton.jsx";
import { Instructions } from "./Instructions.jsx";
import { StartScreen } from "./StartScreen.jsx";
import { usePreventSelect } from "./usePreventSelect.js";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [resetKey, setResetKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const restart = useCallback(() => setResetKey((k) => k + 1), []);
  const dismissIntro = useCallback(() => setShowIntro(false), []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleRestart = useCallback(() => {
    restart();
    setIsPaused(false);
    setShowIntro(true);
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
        setIsPaused((p) => {
          if (!p) dismissIntro();
          return !p;
        });
        return;
      }
      if ((e.key === "r" || e.key === "R") && !isPaused && !showInstructions) {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRestart, isPaused, showInstructions, closeInstructions, dismissIntro]);

  return (
    <>
      {/* TODO use <Center /> */}
      <Leva hidden />
      <Canvas shadows>
        <CameraRig key={`camera-${resetKey}`} />
        <Physics key={`physics-${resetKey}`}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Physics>
      </Canvas>
      <LoadingScreen onExitComplete={() => setIsLoaded(true)} />
      <StartScreen isOpen={showIntro && isLoaded} onDismiss={dismissIntro} />
      <GameMenu
        isOpen={isPaused}
        isPaused={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onHelp={openInstructions}
      />
      <Instructions isOpen={showInstructions} onClose={closeInstructions} />
      {!isPaused && !showIntro && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: CONTROLS_ENTER }}
            exit={{ opacity: 0, transition: CONTROLS_EXIT }}
          >
            <MenuButton
              className="restart-button"
              size={20}
              onClick={handleRestart}
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
