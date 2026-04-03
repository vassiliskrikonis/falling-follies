import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import Scene from "./Scene.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Leva } from "leva";
import { LoadingScreen } from "./LoadingScreen.jsx";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "back", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* TODO use <Center /> */}
    <Leva hidden />
    <KeyboardControls map={keyboardMap}>
      <Canvas
        shadows
        camera={{
          position: [-2.3, 2.1, 0.7],
          rotation: [-0.15, 0.08, -0.01],
          up: [0, 1, 0],
          near: 0.1,
          far: 1000,
          fov: 75,
        }}
      >
        <PointerLockControls />
        <Physics>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Physics>
      </Canvas>
    </KeyboardControls>
    <LoadingScreen />
  </React.StrictMode>
);
