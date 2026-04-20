import { Environment, OrbitControls } from "@react-three/drei";
import { Arch } from "./Arch";
import { Column } from "./Column";
import { folder, useControls } from "leva";
import { Chain } from "./Chain";
import { Floor } from "./Floor";
import { useEffect, useMemo, useRef } from "react";
import { toArray } from "./utils";
import { useThree } from "@react-three/fiber";
import sceneConfig from "./sceneConfig.json";

const Scene = () => {
  const controls = useControls("Environment", {
    ambientLight: 1.5,
    envMapIntensity: { value: 0.7, min: 0, max: 12 },
    floorSize: 30,
  });
  const directionalLightControls = useControls("Environment", {
    "Directional light": folder({
      intensity: 4.5,
      position: { x: 9, y: 11, z: 7 },
    }),
  });
  const { envMapIntensity } = controls;

  const arches = useMemo(
    () =>
      sceneConfig.arches.map((props, i) => (
        <Arch key={i} envMapIntensity={envMapIntensity} castShadow {...props} />
      )),
    [envMapIntensity]
  );
  const columns = useMemo(
    () =>
      sceneConfig.columns.map((props, i) => (
        <Column
          key={i}
          envMapIntensity={envMapIntensity}
          castShadow
          {...props}
        />
      )),
    [envMapIntensity]
  );
  const chains = useMemo(
    () =>
      sceneConfig.chains.map((props, i) => {
        const { radius, ...restProps } = props;
        return (
          <Chain
            key={i}
            radius={radius}
            envMapIntensity={envMapIntensity}
            castShadow
            {...restProps}
          />
        );
      }),
    [envMapIntensity]
  );

  const cameraControls = useControls("Camera", {
    position: {
      x: 0.1,
      y: 2.5,
      z: 2.9,
    },
    target: { x: 0, y: 1.7, z: 0 },
    maxDistance: 28,
  });
  const orbitControls = useRef();
  const { camera } = useThree();
  // Set initial camera position only on mount (empty deps) so it doesn't
  // reset when unrelated state changes (e.g. pause/resume) trigger re-renders.
  useEffect(() => {
    camera.position.copy(cameraControls.position);
    if (orbitControls.current) {
      orbitControls.current.target.copy(cameraControls.target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <OrbitControls
        ref={orbitControls}
        makeDefault
        maxDistance={cameraControls.maxDistance}
      />
      <Environment
        ground={{ height: 0, radius: 28, scale: 100 }}
        files={"./kloofendal_48d_partly_cloudy_puresky_2k.hdr"}
      />
      <directionalLight
        castShadow
        position={toArray(directionalLightControls.position)}
        intensity={directionalLightControls.intensity}
        shadow-camera-top={7}
      />

      {arches}
      {columns}
      {chains}
      <Floor />
    </>
  );
};

export default Scene;
