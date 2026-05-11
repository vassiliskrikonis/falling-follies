import { useState } from "react";

export function useHoverEffect() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    onPointerOver(e) {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut() {
      setHovered(false);
      document.body.style.cursor = "auto";
    },
  };
}
