import { Html } from "@react-three/drei";

export const DeleteButton = ({ onDelete, position = [0, 2, 0] }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Html
      position={position}
      center
      style={{ pointerEvents: "auto" }}
    >
      <button
        onClick={handleDelete}
        style={{
          background: "#dc2626",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          transition: "all 0.2s ease",
          padding: 0,
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#b91c1c";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#dc2626";
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Delete"
        aria-label="Delete item"
      >
        ×
      </button>
    </Html>
  );
};

