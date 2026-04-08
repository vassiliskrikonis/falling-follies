import * as THREE from "three";

export const MOVE_SPEED = 5;

const forward = new THREE.Vector3();
const sideways = new THREE.Vector3();

export function applyMovement(camera, moveX, moveY, delta) {
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  sideways.crossVectors(forward, camera.up).normalize();

  if (moveX) camera.position.addScaledVector(sideways, moveX * MOVE_SPEED * delta);
  if (moveY) camera.position.addScaledVector(forward, moveY * MOVE_SPEED * delta);
}
