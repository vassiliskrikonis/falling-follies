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
import { ClickHandlerProvider } from "./ClickHandlerContext.jsx";
import { useEditor } from "./useEditor.js";
import { useSceneConfig } from "./useSceneConfig.js";

const App = () => {
  const { editorVisible, toggleEditor } = useEditor();
  const { resetSceneConfig } = useSceneConfig();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        toggleEditor();
      } else if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        resetSceneConfig();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleEditor, resetSceneConfig]);

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
        <ClickHandlerProvider>
          <App />
        </ClickHandlerProvider>
      </EditorProvider>
    </SceneConfigProvider>
  </React.StrictMode>
);
