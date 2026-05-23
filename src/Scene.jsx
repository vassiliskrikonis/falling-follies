import { Environment } from "@react-three/drei";
import { Arch } from "./Arch";
import { Column } from "./Column";
import { folder, useControls } from "leva";
import { Chain } from "./Chain";
import { Floor } from "./Floor";
import { useMemo } from "react";
import { toArray } from "./utils";
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
        <Arch
          key={`arch-${i}`}
          envMapIntensity={envMapIntensity}
          castShadow
          {...props}
        />
      )),
    [envMapIntensity]
  );
  const columns = useMemo(
    () =>
      sceneConfig.columns.map((props, i) => (
        <Column
          key={`column-${i}`}
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
            key={`chain-${i}`}
            radius={radius}
            envMapIntensity={envMapIntensity}
            castShadow
            {...restProps}
          />
        );
      }),
    [envMapIntensity]
  );

  return (
    <>
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
