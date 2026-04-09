import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const MOVE_SPEED = 5;

export function useMovement(getInput) {
  const camera = useThree((state) => state.camera);
  const forward = useRef(new THREE.Vector3());
  const sideways = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const input = getInput();

    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    sideways.current.crossVectors(forward.current, camera.up).normalize();

    camera.position.addScaledVector(forward.current, input.y * MOVE_SPEED * delta);
    camera.position.addScaledVector(sideways.current, input.x * MOVE_SPEED * delta);
  });
}
