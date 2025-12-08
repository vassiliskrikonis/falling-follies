import { useMemo, useRef, useEffect } from "react";
import {
  Environment,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  PivotControls,
} from "@react-three/drei";
import { Arch } from "./Arch";
import { Column } from "./Column";
import { folder, useControls } from "leva";
import { Chain } from "./Chain";
import { Floor } from "./Floor";
import { toArray, removeTransformProps, createMatrixFromTransform, decomposeMatrix } from "./utils";
import { useThree } from "@react-three/fiber";
import { useSceneConfig } from "./useSceneConfig";
import { useEditor } from "./useEditor";
import { Ball } from "./Ball";
import { EditableItem } from "./EditableItem";
import { CameraIndicator } from "./CameraIndicator";
import * as THREE from "three";

const Scene = () => {
  const { sceneConfig, updateArc, updateColumn, updateChain, updateBall, updateCamera, deleteArc, deleteColumn, deleteChain, deleteBall } = useSceneConfig();
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
      (sceneConfig.arches || []).map((props, i) => {
        // When in editor, remove transform props since PivotControls handles them
        const archProps = editorVisible ? removeTransformProps(props) : props;
        return (
          <EditableItem
            key={i}
            editorVisible={editorVisible}
            initialProps={props}
            onTransformEnd={updateArc}
            onDelete={() => deleteArc(i)}
            index={i}
          >
            <Arch 
              envMapIntensity={envMapIntensity} 
              castShadow 
              {...archProps}
            />
          </EditableItem>
        );
      }),
    [envMapIntensity, sceneConfig.arches, editorVisible, updateArc, deleteArc]
  );
  const columns = useMemo(
    () =>
      (sceneConfig.columns || []).map((props, i) => {
        // When in editor, remove transform props since PivotControls handles them
        const columnProps = editorVisible ? removeTransformProps(props) : props;
        return (
          <EditableItem
            key={i}
            editorVisible={editorVisible}
            initialProps={props}
            onTransformEnd={updateColumn}
            onDelete={() => deleteColumn(i)}
            index={i}
          >
            <Column 
              envMapIntensity={envMapIntensity} 
              castShadow 
              {...columnProps}
            />
          </EditableItem>
        );
      }),
    [envMapIntensity, sceneConfig.columns, editorVisible, updateColumn, deleteColumn]
  );
  const chains = useMemo(
    () =>
      (sceneConfig.chains || []).map((props, i) => {
        // When in editor, remove transform props since PivotControls handles them
        const chainProps = editorVisible ? removeTransformProps(props) : props;
        return (
          <EditableItem
            key={i}
            editorVisible={editorVisible}
            initialProps={props}
            onTransformEnd={updateChain}
            onDelete={() => deleteChain(i)}
            index={i}
          >
            <Chain
              radius={props.radius}
              envMapIntensity={envMapIntensity}
              castShadow
              {...chainProps}
            />
          </EditableItem>
        );
      }),
    [envMapIntensity, sceneConfig.chains, editorVisible, updateChain, deleteChain]
  );

  const balls = useMemo(
    () =>
      (sceneConfig.balls || []).map((props, i) => {
        // When in editor, remove transform props since PivotControls handles them
        const ballProps = editorVisible ? removeTransformProps(props) : props;
        return (
          <EditableItem
            key={i}
            editorVisible={editorVisible}
            initialProps={props}
            onTransformEnd={updateBall}
            onDelete={() => deleteBall(i)}
            index={i}
          >
            <Ball
              radius={props.radius}
              envMapIntensity={envMapIntensity}
              castShadow
              {...ballProps}
            />
          </EditableItem>
        );
      }),
    [envMapIntensity, sceneConfig.balls, editorVisible, updateBall, deleteBall]
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

  const initialIsometricPosition = useRef(isometricPosition);
  const perspectiveCameraRef = useRef();
  const cameraGroupRef = useRef();

  // Sync PerspectiveCamera with config when in view mode
  useEffect(() => {
    if (!editorVisible && perspectiveCameraRef.current && sceneConfig.camera) {
      perspectiveCameraRef.current.position.set(...sceneConfig.camera.position);
      perspectiveCameraRef.current.rotation.set(...sceneConfig.camera.rotation);
    }
  }, [sceneConfig.camera, editorVisible]);

  // Handle camera transform end (similar to EditableItem)
  const handleCameraTransformEnd = (l, deltaL, w) => {
    requestAnimationFrame(() => {
      let matrix = null;
      
      if (cameraGroupRef.current) {
        cameraGroupRef.current.updateMatrixWorld(true);
        matrix = cameraGroupRef.current.matrixWorld.clone();
      }
      
      if (!matrix) {
        matrix = w || l;
      }

      if (matrix && matrix instanceof THREE.Matrix4) {
        try {
          const transform = decomposeMatrix(matrix);
          updateCamera(transform);
        } catch (error) {
          console.error("Error updating camera transform:", error, { l, w, matrix });
        }
      } else {
        console.warn("Invalid matrix in camera onDragEnd:", { l, w, matrix });
      }
    });
  };

  // Camera initial matrix for PivotControls
  const cameraInitialMatrix = useMemo(() => {
    if (!sceneConfig.camera) return null;
    return createMatrixFromTransform(
      sceneConfig.camera.position || [0, 0, 0],
      sceneConfig.camera.rotation || [0, 0, 0],
      1
    );
  }, [sceneConfig.camera]);

  return (
    <>
      {editorVisible && (
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
      )}
      {/* Perspective Camera for normal mode */}
      <PerspectiveCamera
        ref={perspectiveCameraRef}
        {...(!editorVisible && sceneConfig.camera ? {
          position: sceneConfig.camera.position,
          rotation: sceneConfig.camera.rotation,
        } : {})}
        makeDefault={!editorVisible}
        fov={75}
        near={0.1}
        far={1000}
      />
      {/* Camera indicator with PivotControls in editor mode */}
      {editorVisible && sceneConfig.camera && cameraInitialMatrix && (
        <PivotControls
          autoTransform
          matrix={cameraInitialMatrix}
          scale={1}
          lineWidth={2.5}
          annotations={true}
          onDragEnd={handleCameraTransformEnd}
        >
          <group ref={cameraGroupRef}>
            <CameraIndicator />
          </group>
        </PivotControls>
      )}
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
