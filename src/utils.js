import * as THREE from "three";

export const toArray = ({ x, y, z }) => [x, y, z];

/**
 * Removes transform props (position, rotation, scale) from an object
 */
export const removeTransformProps = (props) => {
  const { position, rotation, scale, ...rest } = props;
  return rest;
};

/**
 * Decomposes a THREE.Matrix4 into position, rotation (Euler), and scale
 * @param matrix - The matrix to decompose
 * @returns Object with position, rotation, and scale
 */
export const decomposeMatrix = (matrix) => {
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  matrix.decompose(position, quaternion, scale);

  // Extract Euler angles from the quaternion
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return {
    position: [position.x, position.y, position.z],
    rotation: [euler.x, euler.y, euler.z],
    scale:
      scale.x === scale.y && scale.y === scale.z
        ? scale.x
        : [scale.x, scale.y, scale.z],
  };
};

/**
 * Creates a THREE.Matrix4 from position, rotation, and scale
 * @param position - Position array [x, y, z]
 * @param rotation - Rotation array [x, y, z] in radians
 * @param scale - Scale number or array [x, y, z]
 * @returns THREE.Matrix4
 */
export const createMatrixFromTransform = (position, rotation, scale) => {
  const matrix = new THREE.Matrix4();
  const pos = new THREE.Vector3(...position);
  const rot = new THREE.Euler(...rotation);
  const scl = Array.isArray(scale)
    ? new THREE.Vector3(...scale)
    : new THREE.Vector3(scale, scale, scale);

  matrix.compose(pos, new THREE.Quaternion().setFromEuler(rot), scl);
  return matrix;
};
