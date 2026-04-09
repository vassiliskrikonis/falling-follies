import { useCallback, useRef } from "react";

const SIZE = 120;
const KNOB_SIZE = 48;
const MAX_RADIUS = (SIZE - KNOB_SIZE) / 2;

export function Joystick({ inputRef }) {
  const knobRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const activePointer = useRef(null);

  const updateInput = useCallback(
    (clientX, clientY) => {
      const dx = clientX - centerRef.current.x;
      const dy = clientY - centerRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamped = Math.min(dist, MAX_RADIUS);
      const angle = Math.atan2(dy, dx);

      const clampedX = Math.cos(angle) * clamped;
      const clampedY = Math.sin(angle) * clamped;

      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
      }

      inputRef.current.x = clampedX / MAX_RADIUS;
      inputRef.current.y = -(clampedY / MAX_RADIUS); // invert Y: up = forward = positive
    },
    [inputRef]
  );

  const onPointerDown = useCallback(
    (e) => {
      if (activePointer.current !== null) return;
      activePointer.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);

      const rect = e.currentTarget.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      updateInput(e.clientX, e.clientY);
    },
    [updateInput]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerId !== activePointer.current) return;
      updateInput(e.clientX, e.clientY);
    },
    [updateInput]
  );

  const onPointerUp = useCallback(
    (e) => {
      if (e.pointerId !== activePointer.current) return;
      activePointer.current = null;
      inputRef.current.x = 0;
      inputRef.current.y = 0;
      if (knobRef.current) {
        knobRef.current.style.transform = "translate(0px, 0px)";
      }
    },
    [inputRef]
  );

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "fixed",
        bottom: 32,
        left: 32,
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.15)",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        touchAction: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.4)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
