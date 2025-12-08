import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useClickHandler } from "./ClickHandlerContext";

export function Column({ castShadow = false, envMapIntensity, ...props }) {
  const { nodes } = useGLTF("/column.glb");
  const controls = useControls("Column", {
    color: "#9ceb6b",
    metalness: 0.6,
    roughness: 0.5,
  });

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        ...controls,
        envMapIntensity,
      }),
    [controls, envMapIntensity]
  );

  const rigidBody = useRef();
  const { registerClickHandler } = useClickHandler();

  // Create click handler for column
  const handleColumnClick = useCallback(() => {
    if (rigidBody.current) {
      const mass = rigidBody.current.mass();
      rigidBody.current.addForce(
        {
          x: 0,
          y: 10 * mass,
          z: 0,
        },
        true
      );
      rigidBody.current.applyTorqueImpulse(
        {
          x: 0,
          y: Math.random() * mass * 3,
          z: 0,
        },
        true
      );
    }
  }, []);

  // Register click handler
  useEffect(() => {
    const unregister = registerClickHandler(handleColumnClick);
    return unregister;
  }, [registerClickHandler, handleColumnClick]);

  return (
    <RigidBody ref={rigidBody} {...props}>
      <mesh
        castShadow={castShadow}
        geometry={nodes.Mesh_29.geometry}
        material={material}
        onClick={handleColumnClick}
      />
    </RigidBody>
  );
}

useGLTF.preload("/column.glb");
