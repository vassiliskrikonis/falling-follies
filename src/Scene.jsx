import { useMemo, useRef } from "react";
import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Arch } from "./Arch";
import { Column } from "./Column";
import { folder, useControls } from "leva";
import { Chain } from "./Chain";
import { Floor } from "./Floor";
import { toArray } from "./utils";
import { useThree } from "@react-three/fiber";
import { useSceneConfig } from "./useSceneConfig";
import { useEditor } from "./useEditor";
import { Ball } from "./Ball";

const Scene = () => {
  const { sceneConfig } = useSceneConfig();
  const { editorVisible } = useEditor();
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
      (sceneConfig.arches || []).map((props, i) => (
        <Arch key={i} envMapIntensity={envMapIntensity} castShadow {...props} />
      )),
    [envMapIntensity, sceneConfig.arches]
  );
  const columns = useMemo(
    () =>
      (sceneConfig.columns || []).map((props, i) => (
        <Column
          key={i}
          envMapIntensity={envMapIntensity}
          castShadow
          {...props}
        />
      )),
    [envMapIntensity, sceneConfig.columns]
  );
  const chains = useMemo(
    () =>
      (sceneConfig.chains || []).map((props, i) => {
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
    [envMapIntensity, sceneConfig.chains]
  );

  const balls = useMemo(
    () =>
      (sceneConfig.balls || []).map((props, i) => {
        const { radius, ...restProps } = props;
        return (
          <Ball
            key={i}
            radius={radius}
            envMapIntensity={envMapIntensity}
            castShadow
            {...restProps}
          />
        );
      }),
    [envMapIntensity, sceneConfig.balls]
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
  const orthoCameraRef = useRef();
  const { size } = useThree();

  // Calculate isometric camera position (30° elevation angle from horizontal)
  const isometricDistance = 15;
  const elevationAngle = Math.PI / 6; // 30 degrees
  const azimuthAngle = Math.PI / 4; // 45 degrees for isometric view
  const isometricPosition = useMemo(() => {
    const horizontalDistance = isometricDistance * Math.cos(elevationAngle);
    return [
      horizontalDistance * Math.cos(azimuthAngle),
      isometricDistance * Math.sin(elevationAngle),
      horizontalDistance * Math.sin(azimuthAngle),
    ];
  }, [elevationAngle, azimuthAngle]);

  // Orthographic camera frustum size
  const orthoSize = useMemo(() => {
    const aspect = size.width / size.height;
    return { left: -10 * aspect, right: 10 * aspect, top: 10, bottom: -10 };
  }, [size.width, size.height]);

  // Store initial perspective camera transform - centered in scene at eye level
  const initialPerspectivePosition = useRef([0, 2.5, 0]);
  const initialPerspectiveRotation = useRef([0, 0, 0]);
  const initialIsometricPosition = useRef(isometricPosition);

  return (
    <>
      <OrbitControls
        ref={orbitControls}
        makeDefault
        maxDistance={cameraControls.maxDistance}
        target={[
          cameraControls.target.x,
          cameraControls.target.y,
          cameraControls.target.z,
        ]}
      />
      {/* Perspective Camera for normal mode */}
      <perspectiveCamera
        makeDefault={!editorVisible}
        position={initialPerspectivePosition.current}
        rotation={initialPerspectiveRotation.current}
        up={[0, 1, 0]}
        fov={75}
        near={0.1}
        far={1000}
      />
      {/* Orthographic Camera for editor mode */}
      <OrthographicCamera
        ref={(ref) => {
          orthoCameraRef.current = ref;
          if (ref && !ref.userData?.positionInitialized) {
            // Only initialize position and rotation once on first mount
            ref.position.set(...initialIsometricPosition.current);
            ref.lookAt(0, 0, 0);
            if (!ref.userData) ref.userData = {};
            ref.userData.positionInitialized = true;
            // Store initial rotation to preserve it
            ref.userData.initialRotation = ref.rotation.clone();
          }
        }}
        makeDefault={editorVisible}
        left={orthoSize.left}
        right={orthoSize.right}
        top={orthoSize.top}
        bottom={orthoSize.bottom}
        near={0.1}
        far={1000}
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
      {balls}
      <Floor />
    </>
  );
};

export default Scene;
