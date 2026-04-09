import { useKeyboardControls } from "@react-three/drei";
import { useCallback } from "react";
import { useMovement } from "./useMovement";

export function useKeyboardMovement(isMobile, joystickRef) {
  const [, getKeys] = useKeyboardControls();

  const getInput = useCallback(() => {
    if (isMobile) {
      return { x: joystickRef.current.x, y: joystickRef.current.y };
    }
    const k = getKeys();
    return {
      x: (k.right ? 1 : 0) - (k.left ? 1 : 0),
      y: (k.forward ? 1 : 0) - (k.back ? 1 : 0),
    };
  }, [isMobile, joystickRef, getKeys]);

  useMovement(getInput);
}
