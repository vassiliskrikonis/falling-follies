import { useRef } from "react";
import { Ball } from "./Ball";
import { useSphericalJoint } from "@react-three/rapier";
import { useHoverEffect } from "./useHoverEffect";

export function Chain({ envMapIntensity, radius = 0.2, ...props }) {
  const base = useRef();
  const ball1 = useRef();
  const ball2 = useRef();
  const ball3 = useRef();

  const { hovered, ...hoverHandlers } = useHoverEffect();

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
    <group {...props} {...hoverHandlers}>
      <Ball
        ref={base}
        radius={radius}
        envMapIntensity={envMapIntensity}
        hovered={hovered}
        castShadow
        half
        type={"fixed"}
      />
      <Ball
        ref={ball1}
        radius={radius}
        envMapIntensity={envMapIntensity}
        hovered={hovered}
        castShadow
        position-y={radius * 2}
      />
      <Ball
        ref={ball2}
        radius={radius}
        envMapIntensity={envMapIntensity}
        hovered={hovered}
        castShadow
        position-y={radius * 2 * 2}
      />
      <Ball
        ref={ball3}
        radius={radius}
        envMapIntensity={envMapIntensity}
        hovered={hovered}
        castShadow
        position-y={radius * 2 * 3}
      />
    </group>
  );
}
