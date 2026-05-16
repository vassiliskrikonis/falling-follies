import { AnimatePresence, motion } from "framer-motion";
import { MenuButton } from "./MenuButton.jsx";
import "./GameMenu.css";
import { OVERLAY_ENTER, OVERLAY_EXIT } from "./transitions.js";

export const GameMenu = ({ isOpen, onResume, onRestart, onHelp }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="game-menu game-menu--paused"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: OVERLAY_ENTER }}
          exit={{ opacity: 0, transition: OVERLAY_EXIT }}
        >
          <div>
            <h1 className="intro-title">Falling Follies</h1>
            <p className="intro-subtitle" style={{ marginTop: 8 }}>A shifting world of unstable forms</p>
          </div>
          <div className="menu-buttons">
            <MenuButton onClick={onResume}>Resume</MenuButton>
            <MenuButton onClick={onRestart}>Restart</MenuButton>
            <MenuButton onClick={onHelp}>Help</MenuButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
