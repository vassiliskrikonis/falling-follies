import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { applyMovement } from "./movement";

const DEAD_ZONE = 0.12;
const LOOK_SPEED = 2.5;

const CLICK_BUTTONS = [0, 2, 6, 7]; // A/Cross, X/Square, LT/L2, RT/R2

const CENTER = new THREE.Vector2(0, 0);

function applyDeadZone(value, threshold) {
  if (Math.abs(value) < threshold) return 0;
  return (value - Math.sign(value) * threshold) / (1 - threshold);
}

function fireClickAtCenter(raycaster, camera, scene) {
  raycaster.setFromCamera(CENTER, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  for (const hit of hits) {
    let obj = hit.object;
    while (obj) {
      const onClick = obj.__r3f?.handlers?.onClick;
      if (onClick) {
        onClick({ ...hit, stopPropagation() {} });
        return;
      }
      obj = obj.parent;
    }
  }
}

function getActiveGamepad(gamepads) {
  for (const gp of gamepads) {
    if (!gp) continue;
    // Only check first 4 axes (sticks) — extra axes (e.g. triggers, sensors)
    // can have non-zero resting values that cause false positives
    const hasInput =
      gp.axes.slice(0, 4).some((a) => Math.abs(a) > DEAD_ZONE) ||
      gp.buttons.some((b) => b.pressed);
    if (hasInput) return gp;
  }
  return null;
}

export function useGamepadMovement() {
  const { camera, raycaster, scene } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const prevButtonPressed = useRef(false);

  useFrame((_, delta) => {
    const gamepads = navigator.getGamepads();
    const gp = getActiveGamepad(gamepads);
    if (!gp) return;

    // Left stick movement
    let moveX = applyDeadZone(gp.axes[0], DEAD_ZONE);
    let moveY = applyDeadZone(gp.axes[1], DEAD_ZONE);

    // D-pad (standard mapping: buttons 12-15)
    if (gp.mapping === "standard") {
      if (gp.buttons[12]?.pressed) moveY = -1; // up
      if (gp.buttons[13]?.pressed) moveY = 1; // down
      if (gp.buttons[14]?.pressed) moveX = -1; // left
      if (gp.buttons[15]?.pressed) moveX = 1; // right
    }

    if (moveX || moveY) {
      applyMovement(camera, moveX, -moveY, delta); // Invert Y for typical gamepad layout
    }

    // Right stick look
    const lookX = applyDeadZone(gp.axes[2], DEAD_ZONE);
    const lookY = applyDeadZone(gp.axes[3], DEAD_ZONE);

    if (lookX || lookY) {
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= lookX * LOOK_SPEED * delta;
      euler.current.x -= lookY * LOOK_SPEED * delta;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    }

    // Button click (rising edge detection)
    const anyPressed = CLICK_BUTTONS.some((idx) => gp.buttons[idx]?.pressed);

    if (anyPressed && !prevButtonPressed.current) {
      fireClickAtCenter(raycaster, camera, scene);
    }

    prevButtonPressed.current = anyPressed;
  });
}
