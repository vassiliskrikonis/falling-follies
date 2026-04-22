export function useHoverEffect() {
  return {
    onPointerOver(e) {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut() {
      document.body.style.cursor = "auto";
    },
  };
}
