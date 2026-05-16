import { AnimatePresence, motion } from "framer-motion";
import { MenuButton } from "./MenuButton.jsx";
import { START_ENTER, START_EXIT } from "./transitions.js";

export const StartScreen = ({ isOpen, onDismiss }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="intro-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: START_ENTER }}
          exit={{ opacity: 0, transition: START_EXIT }}
        >
          <h1 className="intro-title">Falling Follies</h1>
          <p className="intro-subtitle">A shifting world of unstable forms</p>
          <MenuButton
            size={28}
            onClick={onDismiss}
            style={{ position: "absolute", bottom: "20%" }}
          >
            Start
          </MenuButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
