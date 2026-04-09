import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const SENSITIVITY = 0.003;

export function TouchCameraControls() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const pointers = useRef(new Map());

  useEffect(() => {
    camera.rotation.order = "YXZ";
  }, [camera]);

  useEffect(() => {
    const el = gl.domElement;

    const onPointerDown = (e) => {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };

    const onPointerMove = (e) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;

      const deltaX = e.clientX - prev.x;
      const deltaY = e.clientY - prev.y;

      camera.rotation.y -= deltaX * SENSITIVITY;
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x - deltaY * SENSITIVITY)
      );

      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };

    const onPointerUp = (e) => {
      pointers.current.delete(e.pointerId);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [camera, gl]);

  return null;
}
