import { useRef, useEffect } from "react";
import { PointerLockControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FirstPersonControls = ({ enabled = true, moveSpeed = 2 }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  
  // Keyboard state for WASD movement
  const keys = useRef({});
  
  // Reusable vectors for movement calculation (created once to avoid GC pressure)
  const frontVector = useRef(new THREE.Vector3(0, 0, -1));
  const sideVector = useRef(new THREE.Vector3(1, 0, 0));
  const moveDirection = useRef(new THREE.Vector3());
  const upVector = useRef(new THREE.Vector3(0, 1, 0));

  // Clean up pointer lock when disabled or unmounting
  useEffect(() => {
    return () => {
      // Release pointer lock on unmount or when disabled
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Release pointer lock if it's active
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, [enabled]);

  // Handle keyboard input for WASD movement
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      keys.current[event.key.toLowerCase()] = true;
    };

    const handleKeyUp = (event) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // Reset keys when unmounting or disabled
      keys.current = {};
    };
  }, [enabled]);

  // Handle WASD movement
  useFrame((state, delta) => {
    if (!enabled) return;

    // Get camera's forward and right directions
    camera.getWorldDirection(frontVector.current);
    frontVector.current.y = 0; // Keep movement horizontal
    frontVector.current.normalize();

    sideVector.current.crossVectors(frontVector.current, upVector.current);
    sideVector.current.normalize();

    // Calculate movement direction based on keys
    moveDirection.current.set(0, 0, 0);
    
    if (keys.current["w"] || keys.current["arrowup"]) {
      moveDirection.current.add(frontVector.current);
    }
    if (keys.current["s"] || keys.current["arrowdown"]) {
      moveDirection.current.sub(frontVector.current);
    }
    if (keys.current["a"] || keys.current["arrowleft"]) {
      moveDirection.current.sub(sideVector.current);
    }
    if (keys.current["d"] || keys.current["arrowright"]) {
      moveDirection.current.add(sideVector.current);
    }
    if (keys.current[" "]) { // Space
      moveDirection.current.y += 1;
    }
    if (keys.current["shift"]) { // Shift
      moveDirection.current.y -= 1;
    }

    // Normalize and apply movement
    if (moveDirection.current.length() > 0) {
      moveDirection.current.normalize();
      camera.position.addScaledVector(moveDirection.current, moveSpeed * delta);
    }
  });

  if (!enabled) return null;

  return <PointerLockControls ref={controlsRef} makeDefault />;
};

