import { Cylinder } from "@react-three/drei";
import { folder, useControls } from "leva";
import { createRef, useEffect, useMemo, useRef } from "react";
import { Arc } from "./Arc";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useHoverEffect } from "./useHoverEffect";

const toArray = ({ x, y, z }) => [x, y, z];

export function Arch({ castShadow = false, envMapIntensity, ...props }) {
  const generalControls = useControls("Arch", {
    columns: { value: 12, min: 4, max: 20, step: 2 },
  });
  const roofControls = useControls("Arch", {
    roof: folder({ offset: { x: 0, y: -0.02, z: 0 } }),
  });
  const columnControls = useControls("Arch", {
    column: folder({
      color: "#5db1f5",
      metalness: { value: 1, min: 0, max: 1 },
      roughness: { value: 0.3, min: 0, max: 1 },
      radius: 0.05,
      height: 3,
    }),
  });

  const columnMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: columnControls.color,
        metalness: columnControls.metalness,
        roughness: columnControls.roughness,
        envMapIntensity,
      }),
    [
      columnControls.color,
      columnControls.metalness,
      columnControls.roughness,
      envMapIntensity,
    ]
  );

  const segments = generalControls.columns / 2 - 1;
  const range = 2.5;
  const step = (range * 2) / segments;
  const positions = [];

  for (let i = 0; i <= segments; i++) {
    const z = -range + i * step;
    positions.push({
      x: -(1 - columnControls.radius),
      y: columnControls.height / 2,
      z,
    });
    positions.push({
      x: 1 - columnControls.radius,
      y: columnControls.height / 2,
      z,
    });
  }

  const roofHoverHandlers = useHoverEffect(null);

  const roofRef = useRef();
  const columnRefs = useRef(
    Array.from({ length: generalControls.columns }).map(() => createRef())
  );

  // sleep columns
  useEffect(() => {
    roofRef.current.sleep();
    columnRefs.current.forEach((ref) => {
      ref.current.sleep();
    });
  }, []);

  return (
    <group {...props} dispose={null}>
      <RigidBody
        ref={roofRef}
        colliders="trimesh"
        position={toArray(roofControls.offset)}
        position-y={roofControls.offset.y + columnControls.height}
      >
        <Arc
          castShadow={castShadow}
          onClick={() => {
            const mass = roofRef.current.mass();
            roofRef.current.applyImpulse({ x: 0, y: 3 * mass, z: 0 }, true);
          }}
          {...roofHoverHandlers}
        />
      </RigidBody>
      {positions.map((p, i) => (
        <RigidBody
          key={i}
          ref={columnRefs.current[i]}
          position={toArray(p)}
          colliders={false}
        >
          <Cylinder
            castShadow={castShadow}
            args={[
              columnControls.radius,
              columnControls.radius,
              columnControls.height,
            ]}
            material={columnMaterial}
          />
          <CylinderCollider
            args={[columnControls.height / 2, columnControls.radius]}
          />
        </RigidBody>
      ))}
    </group>
  );
}
