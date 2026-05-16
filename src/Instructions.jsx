import { AnimatePresence, motion } from "framer-motion";
import { MenuButton } from "./MenuButton.jsx";
import "./Instructions.css";
import { OVERLAY_ENTER, OVERLAY_EXIT } from "./transitions.js";

export const Instructions = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="instructions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: OVERLAY_ENTER }}
          exit={{ opacity: 0, transition: OVERLAY_EXIT }}
          onClick={onClose}
        >
          <div
            className="instructions__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="instructions__group">
              <div className="instructions__label">Camera</div>
              <div className="instructions__items">
                Drag to rotate · Right-drag to shift · Scroll to zoom
              </div>
            </div>
            <div className="instructions__group">
              <div className="instructions__label">Objects</div>
              <div className="instructions__items">
                Click to disturb
              </div>
            </div>
            <div className="instructions__group">
              <div className="instructions__label">Keys</div>
              <div className="instructions__items">
                <kbd>Esc</kbd> Pause · <kbd>R</kbd> Restart · <kbd>?</kbd> Help
              </div>
            </div>
            <div className="instructions__footer">
              <MenuButton size={20} onClick={onClose}>
                Got it
              </MenuButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
