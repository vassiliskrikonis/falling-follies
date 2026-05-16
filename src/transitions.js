import { easeOut } from "framer-motion";

// Shared easing curve for all fade transitions
const ease = easeOut;

// Base durations (seconds)
const FAST = 0.3;
const MEDIUM = 0.5;
const SLOW = 0.6;
const BEAT = 0.4;

// Loading screen — long fade-out that drives the loading → start sequence
export const LOADING_EXIT = { duration: 1, ease };

// Standard overlay panels (GameMenu, Instructions)
export const OVERLAY_ENTER = { duration: FAST, ease };
export const OVERLAY_EXIT = { duration: MEDIUM, ease };

// Start screen — gated on LoadingScreen's onExitComplete (see main.jsx)
export const START_ENTER = { duration: BEAT };
export const START_EXIT = { duration: SLOW };

// In-game controls — wait for the start screen to fully fade out, plus a beat
export const CONTROLS_ENTER = {
  duration: MEDIUM,
  delay: START_EXIT.duration + BEAT,
};
export const CONTROLS_EXIT = { duration: FAST };
