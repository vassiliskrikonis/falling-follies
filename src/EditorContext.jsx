import { createContext, useState, useCallback } from "react";

export const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
  const [editorVisible, setEditorVisible] = useState(false);
  const [lockMode, setLockMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const toggleEditor = useCallback(() => {
    setEditorVisible((prev) => !prev);
  }, []);

  const toggleLockMode = useCallback(() => {
    setLockMode((prev) => !prev);
    // Clear selected tool when disabling lock mode
    if (lockMode) {
      setSelectedTool(null);
    }
  }, [lockMode]);

  return (
    <EditorContext.Provider
      value={{
        editorVisible,
        setEditorVisible,
        toggleEditor,
        lockMode,
        toggleLockMode,
        selectedTool,
        setSelectedTool,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

