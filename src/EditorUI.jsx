import "./EditorUI.css";
import { useSceneConfig } from "./useSceneConfig";

export const EditorUI = () => {
  const { addArc, addColumn, addChain, addBall, copySceneConfig } =
    useSceneConfig();

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
      </div>
    </div>
  );
};
