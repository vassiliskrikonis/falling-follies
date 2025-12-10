import "./EditorUI.css";
import { useSceneConfig } from "./useSceneConfig";
import { useEditor } from "./useEditor";
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
  const { lockMode, toggleLockMode, selectedTool, setSelectedTool } = useEditor();
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

  const handleToolClick = (tool) => {
    if (lockMode) {
      // In lock mode, select the tool
      setSelectedTool(tool);
    } else {
      // Normal mode, add object immediately
      switch (tool) {
        case 'arc':
          addArc();
          break;
        case 'column':
          addColumn();
          break;
        case 'chain':
          addChain();
          break;
        case 'ball':
          addBall();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="editor-ui">
      <div className="editor-toolbar">
        <button
          className={`editor-button ${lockMode ? 'editor-button-active' : ''}`}
          onClick={toggleLockMode}
          title={lockMode ? "Disable Lock Mode" : "Enable Lock Mode"}
          aria-label={lockMode ? "Disable Lock Mode" : "Enable Lock Mode"}
        >
          {lockMode ? '🔒' : '🔓'}
        </button>
      </div>
      <div className="editor-toolbar">
        <button
          className={`editor-button ${lockMode && selectedTool === 'arc' ? 'editor-button-active' : ''}`}
          onClick={() => handleToolClick('arc')}
          title="Add Arc"
          aria-label="Add Arc"
        >
          🏛️
        </button>
        <button
          className={`editor-button ${lockMode && selectedTool === 'column' ? 'editor-button-active' : ''}`}
          onClick={() => handleToolClick('column')}
          title="Add Column"
          aria-label="Add Column"
        >
          💈
        </button>
        <button
          className={`editor-button ${lockMode && selectedTool === 'chain' ? 'editor-button-active' : ''}`}
          onClick={() => handleToolClick('chain')}
          title="Add Chain"
          aria-label="Add Chain"
        >
          ⛓️
        </button>
        <button
          className={`editor-button ${lockMode && selectedTool === 'ball' ? 'editor-button-active' : ''}`}
          onClick={() => handleToolClick('ball')}
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
