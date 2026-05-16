import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

export const CameraRig = () => {
  const cameraControls = useControls("Camera", {
    position: { x: 0.1, y: 2.5, z: 2.9 },
    target: { x: 0, y: 1.7, z: 0 },
    maxDistance: 28,
  });
  const orbitControls = useRef();
  const { camera } = useThree();

  // Set initial camera position only on mount (empty deps) so it doesn't
  // reset when unrelated state changes (e.g. pause/resume) trigger re-renders.
  useEffect(() => {
    camera.position.copy(cameraControls.position);
    if (orbitControls.current) {
      orbitControls.current.target.copy(cameraControls.target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrbitControls
      ref={orbitControls}
      makeDefault
      maxDistance={cameraControls.maxDistance}
    />
  );
};
