import { createContext, useState, useCallback } from "react";

export const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
  const [editorVisible, setEditorVisible] = useState(false);

  const toggleEditor = useCallback(() => {
    setEditorVisible((prev) => !prev);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        editorVisible,
        setEditorVisible,
        toggleEditor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

