import { Circle, MeshReflectorMaterial } from "@react-three/drei";
import { LevaInputs, folder, useControls } from "leva";
import { RigidBody } from "@react-three/rapier";
import { forwardRef } from "react";

export const Floor = forwardRef(function Floor(props, ref) {
  const mirrorControls = useControls("Floor", {
    mirror: folder({
      color: "#bebebe",
      blur: [0, 0],
      mixBlur: 1,
      mixStrength: 1,
      mixContrast: 1,
      resolution: 2048,
      mirror: { type: LevaInputs.SELECT, options: [0, 1], value: 1 },
      depthScale: 0,
      minDepthThreshold: 0,
      maxDepthThreshold: 0,
      distortion: 1,
      debug: { type: LevaInputs.SELECT, options: [0, 1, 2, 3, 4], value: 0 },
      reflectorOffset: 0,
    }),
  });

  return (
    <RigidBody
      position={[0, -0.001, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      type="fixed"
      {...props}
    >
      <Circle ref={ref} receiveShadow args={[22]}>
        <MeshReflectorMaterial {...mirrorControls} />
      </Circle>
    </RigidBody>
  );
});
