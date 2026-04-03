import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const MOVE_SPEED = 5;

export function useKeyboardMovement() {
  const camera = useThree((state) => state.camera);
  const [, getKeys] = useKeyboardControls();
  const forward = useRef(new THREE.Vector3());
  const sideways = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const keys = getKeys();

    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    sideways.current.crossVectors(forward.current, camera.up).normalize();

    if (keys.forward) camera.position.addScaledVector(forward.current, MOVE_SPEED * delta);
    if (keys.back) camera.position.addScaledVector(forward.current, -MOVE_SPEED * delta);
    if (keys.left) camera.position.addScaledVector(sideways.current, -MOVE_SPEED * delta);
    if (keys.right) camera.position.addScaledVector(sideways.current, MOVE_SPEED * delta);
  });
}
