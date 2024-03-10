import { useRef } from "react";
import { Ball } from "./Ball";
import { useSphericalJoint } from "@react-three/rapier";

export function Chain({ envMapIntensity, radius = 0.2, ...props }) {
  const base = useRef();
  const ball1 = useRef();
  const ball2 = useRef();
  const ball3 = useRef();

  useSphericalJoint(base, ball1, [
    [0, radius, 0],
    [0, -radius, 0],
  ]);
  useSphericalJoint(ball1, ball2, [
    [0, radius, 0],
    [0, -radius, 0],
  ]);
  useSphericalJoint(ball2, ball3, [
    [0, radius, 0],
    [0, -radius, 0],
  ]);

  return (
    <group {...props}>
      <Ball
        ref={base}
        radius={radius}
        envMapIntensity={envMapIntensity}
        castShadow
        half
        type={"fixed"}
      />
      <Ball
        ref={ball1}
        radius={radius}
        envMapIntensity={envMapIntensity}
        castShadow
        position-y={radius * 2}
      />
      <Ball
        ref={ball2}
        radius={radius}
        envMapIntensity={envMapIntensity}
        castShadow
        position-y={radius * 2 * 2}
      />
      <Ball
        ref={ball3}
        radius={radius}
        envMapIntensity={envMapIntensity}
        castShadow
        position-y={radius * 2 * 3}
      />
    </group>
  );
}
