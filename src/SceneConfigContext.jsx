import { createContext, useState, useCallback } from "react";
import sceneConfigData from "./sceneConfig.json";

export const SceneConfigContext = createContext(null);

export const SceneConfigProvider = ({ children }) => {
  const [sceneConfig, setSceneConfig] = useState({
    ...sceneConfigData,
    balls: sceneConfigData.balls || [],
    camera: sceneConfigData.camera,
  });

  const addArc = useCallback(() => {
    setSceneConfig((prev) => ({
      ...prev,
      arches: [
        ...prev.arches,
        {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
        },
      ],
    }));
  }, []);

  const addColumn = useCallback(() => {
    setSceneConfig((prev) => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
        },
      ],
    }));
  }, []);

  const addChain = useCallback(() => {
    setSceneConfig((prev) => ({
      ...prev,
      chains: [
        ...prev.chains,
        {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
          radius: 0.4,
        },
      ],
    }));
  }, []);

  const addBall = useCallback(() => {
    setSceneConfig((prev) => ({
      ...prev,
      balls: [
        ...(prev.balls || []),
        {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
          radius: 0.2,
        },
      ],
    }));
  }, []);

  const updateArc = useCallback((index, transform) => {
    setSceneConfig((prev) => {
      const newArches = [...prev.arches];
      if (newArches[index]) {
        newArches[index] = {
          ...newArches[index],
          position: transform.position,
          rotation: transform.rotation,
          scale: transform.scale,
        };
      }
      return {
        ...prev,
        arches: newArches,
      };
    });
  }, []);

  const updateColumn = useCallback((index, transform) => {
    setSceneConfig((prev) => {
      const newColumns = [...prev.columns];
      if (newColumns[index]) {
        newColumns[index] = {
          ...newColumns[index],
          position: transform.position,
          rotation: transform.rotation,
          scale: transform.scale,
        };
      }
      return {
        ...prev,
        columns: newColumns,
      };
    });
  }, []);

  const updateChain = useCallback((index, transform) => {
    setSceneConfig((prev) => {
      const newChains = [...prev.chains];
      if (newChains[index]) {
        newChains[index] = {
          ...newChains[index],
          position: transform.position,
          rotation: transform.rotation,
          scale: transform.scale,
        };
      }
      return {
        ...prev,
        chains: newChains,
      };
    });
  }, []);

  const updateBall = useCallback((index, transform) => {
    setSceneConfig((prev) => {
      const newBalls = [...(prev.balls || [])];
      if (newBalls[index]) {
        newBalls[index] = {
          ...newBalls[index],
          position: transform.position,
          rotation: transform.rotation,
          scale: transform.scale,
        };
      }
      return {
        ...prev,
        balls: newBalls,
      };
    });
  }, []);

  const deleteArc = useCallback((index) => {
    setSceneConfig((prev) => {
      const newArches = [...prev.arches];
      newArches.splice(index, 1);
      return {
        ...prev,
        arches: newArches,
      };
    });
  }, []);

  const deleteColumn = useCallback((index) => {
    setSceneConfig((prev) => {
      const newColumns = [...prev.columns];
      newColumns.splice(index, 1);
      return {
        ...prev,
        columns: newColumns,
      };
    });
  }, []);

  const deleteChain = useCallback((index) => {
    setSceneConfig((prev) => {
      const newChains = [...prev.chains];
      newChains.splice(index, 1);
      return {
        ...prev,
        chains: newChains,
      };
    });
  }, []);

  const deleteBall = useCallback((index) => {
    setSceneConfig((prev) => {
      const newBalls = [...(prev.balls || [])];
      newBalls.splice(index, 1);
      return {
        ...prev,
        balls: newBalls,
      };
    });
  }, []);

  const updateCamera = useCallback((transform) => {
    setSceneConfig((prev) => ({
      ...prev,
      camera: {
        position: transform.position,
        rotation: transform.rotation,
      },
    }));
  }, []);

  const copySceneConfig = useCallback(async () => {
    try {
      const configToCopy = {
        camera: sceneConfig.camera,
        arches: sceneConfig.arches,
        columns: sceneConfig.columns,
        chains: sceneConfig.chains,
        ...(sceneConfig.balls && sceneConfig.balls.length > 0
          ? { balls: sceneConfig.balls }
          : {}),
      };
      const jsonString = JSON.stringify(configToCopy, null, 2);
      await navigator.clipboard.writeText(jsonString);
      
      // Show feedback (you could enhance this with a toast notification)
      const button = document.querySelector(".editor-copy-button");
      if (button) {
        const originalText = button.textContent;
        button.textContent = "✓";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to copy scene config:", err);
    }
  }, [sceneConfig]);

  return (
    <SceneConfigContext.Provider
      value={{
        sceneConfig,
        addArc,
        addColumn,
        addChain,
        addBall,
        updateArc,
        updateColumn,
        updateChain,
        updateBall,
        updateCamera,
        copySceneConfig,
        deleteArc,
        deleteColumn,
        deleteChain,
        deleteBall,
      }}
    >
      {children}
    </SceneConfigContext.Provider>
  );
};

