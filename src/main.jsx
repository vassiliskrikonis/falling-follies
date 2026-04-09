import React, { Suspense, useRef } from "react";
import ReactDOM from "react-dom/client";
import Scene from "./Scene.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Leva } from "leva";
import { LoadingScreen } from "./LoadingScreen.jsx";
import { isMobile } from "./useIsMobile.js";
import { TouchCameraControls } from "./TouchCameraControls.jsx";
import { Joystick } from "./Joystick.jsx";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "back", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
];

const mobile = isMobile();

function App() {
  const joystickRef = useRef({ x: 0, y: 0 });

  return (
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
          {mobile ? <TouchCameraControls /> : <PointerLockControls />}
          <Physics>
            <Suspense fallback={null}>
              <Scene isMobile={mobile} joystickRef={joystickRef} />
            </Suspense>
          </Physics>
        </Canvas>
      </KeyboardControls>
      {!mobile && <div className="crosshair" />}
      {mobile && <Joystick inputRef={joystickRef} />}
      <LoadingScreen />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
