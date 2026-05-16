import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";
import { AnimatePresence, motion } from "framer-motion";
import { LOADING_EXIT } from "./transitions.js";

export const LoadingScreen = ({ onExitComplete }) => {
  const { progress, active } = useProgress();

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {active && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: LOADING_EXIT }}
        >
          <span className="loading-status">Loading {progress.toFixed(2)}%</span>
          <h1 className="intro-title">Falling Follies</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
