import { AnimatePresence, motion, easeOut } from "framer-motion";
import { MenuButton } from "./MenuButton.jsx";
import "./GameMenu.css";

export const GameMenu = ({ isOpen, onResume, onRestart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="game-menu game-menu--paused"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: easeOut } }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: easeOut } }}
        >
          <img
            className="menu-logo"
            src="/PFP_screen_logo_white.webp"
            alt="Falling Follies logo"
          />
          <div className="menu-buttons">
            <MenuButton onClick={onResume}>Resume</MenuButton>
            <MenuButton onClick={onRestart}>Restart</MenuButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
