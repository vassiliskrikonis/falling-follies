export function isMobile() {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window
  );
}
