import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Scene from "./Scene.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import { LoadingScreen } from "./LoadingScreen.jsx";
import { EditorUI } from "./EditorUI.jsx";
import { SceneConfigProvider } from "./SceneConfigContext.jsx";
import { EditorProvider } from "./EditorContext.jsx";
import { useEditor } from "./useEditor.js";

const App = () => {
  const { editorVisible, toggleEditor } = useEditor();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        toggleEditor();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleEditor]);

  return (
    <>
      {/* TODO use <Center /> */}
      <Leva hidden />
      <Canvas
        shadows
      >
        <Physics>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Physics>
      </Canvas>
      <LoadingScreen />
      {editorVisible && <EditorUI />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SceneConfigProvider>
      <EditorProvider>
        <App />
      </EditorProvider>
    </SceneConfigProvider>
  </React.StrictMode>
);
