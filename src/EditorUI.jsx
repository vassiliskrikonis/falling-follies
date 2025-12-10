import "./EditorUI.css";
import { useSceneConfig } from "./useSceneConfig";
import { useRef } from "react";

export const EditorUI = () => {
  const {
    addArc,
    addColumn,
    addChain,
    addBall,
    copySceneConfig,
    exportSceneConfig,
    importSceneConfig,
  } = useSceneConfig();
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result;
        if (jsonString) {
          importSceneConfig(jsonString);
        }
      } catch (error) {
        console.error("Failed to read file:", error);
      }
    };
    reader.onerror = () => {
      console.error("Failed to read file");
    };
    reader.readAsText(file);

    // Reset input so the same file can be selected again
    event.target.value = "";
  };

  return (
    <div className="editor-ui">
      <div className="editor-toolbar">
        <button
          className="editor-button"
          onClick={addArc}
          title="Add Arc"
          aria-label="Add Arc"
        >
          🏛️
        </button>
        <button
          className="editor-button"
          onClick={addColumn}
          title="Add Column"
          aria-label="Add Column"
        >
          💈
        </button>
        <button
          className="editor-button"
          onClick={addChain}
          title="Add Chain"
          aria-label="Add Chain"
        >
          ⛓️
        </button>
        <button
          className="editor-button"
          onClick={addBall}
          title="Add Ball"
          aria-label="Add Ball"
        >
          ⚪
        </button>
      </div>
      <div className="editor-toolbar">
        <button
          className="editor-button"
          onClick={copySceneConfig}
          title="Copy Scene Config"
          aria-label="Copy Scene Config"
        >
          📋
        </button>
        <button
          className="editor-button"
          onClick={exportSceneConfig}
          title="Export Scene Config"
          aria-label="Export Scene Config"
        >
          💾
        </button>
        <button
          className="editor-button"
          onClick={handleImportClick}
          title="Import Scene Config"
          aria-label="Import Scene Config"
        >
          📥
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
