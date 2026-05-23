import { Circle, MeshReflectorMaterial } from "@react-three/drei";
import { LevaInputs, folder, useControls } from "leva";
import { RigidBody } from "@react-three/rapier";
import { useLayoutEffect, useRef } from "react";

export function Floor(props) {
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

  // Workaround for a one-frame "scene projected flat onto the floor" glitch on
  // load. MeshReflectorMaterial builds its reflection plane from this mesh's
  // matrixWorld on its first frame. The RigidBody sets the -PI/2 rotation as a
  // local transform immediately, but matrixWorld isn't recomputed from it until
  // the first render — so the reflector's first frame reflects against a
  // degenerate (sideways) plane. Force the world matrix up-to-date before that
  // first frame runs.
  const floorRef = useRef(null);
  useLayoutEffect(() => {
    floorRef.current?.updateWorldMatrix(true, false);
  }, []);

  return (
    <RigidBody
      position={[0, -0.001, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      type="fixed"
      {...props}
    >
      <Circle ref={floorRef} receiveShadow args={[22]}>
        <MeshReflectorMaterial {...mirrorControls} />
      </Circle>
    </RigidBody>
  );
}
