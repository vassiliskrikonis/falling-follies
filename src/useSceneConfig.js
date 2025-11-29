import { useContext } from "react";
import { SceneConfigContext } from "./SceneConfigContext";

export const useSceneConfig = () => {
  const context = useContext(SceneConfigContext);
  if (!context) {
    throw new Error("useSceneConfig must be used within SceneConfigProvider");
  }
  return context;
};

