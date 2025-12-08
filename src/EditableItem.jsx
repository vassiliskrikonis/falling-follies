import { useRef } from "react";
import { PivotControls } from "@react-three/drei";
import { createMatrixFromTransform, decomposeMatrix } from "./utils";
import { DeleteButton } from "./DeleteButton";
import * as THREE from "three";

/**
 * Wrapper component that adds PivotControls to an item when in editor mode
 */
export const EditableItem = ({
  children,
  editorVisible,
  initialProps,
  onTransformEnd,
  onDelete,
  index,
}) => {
  const groupRef = useRef();
  const lastTransformRef = useRef(null);

  const { position, rotation, scale } = initialProps;
  const initialMatrix = createMatrixFromTransform(
    position || [0, 0, 0],
    rotation || [0, 0, 0],
    scale || 1
  );

  const handleDragEnd = (l, deltaL, w) => {
    // Use requestAnimationFrame to ensure the matrix is updated after drag ends
    requestAnimationFrame(() => {
      // Try to get the world matrix from the group ref first
      let matrix = null;
      
      if (groupRef.current) {
        // Update the world matrix
        groupRef.current.updateMatrixWorld(true);
        // Get the world matrix from the group
        matrix = groupRef.current.matrixWorld.clone();
      }
      
      // Fallback to world matrix from callback, then local matrix
      if (!matrix) {
        matrix = w || l;
      }

      if (matrix && matrix instanceof THREE.Matrix4) {
        try {
          const transform = decomposeMatrix(matrix);
          lastTransformRef.current = transform;
          onTransformEnd(index, transform);
        } catch (error) {
          console.error("Error updating transform:", error, { l, w, matrix });
        }
      } else {
        console.warn("Invalid matrix in onDragEnd:", { l, w, matrix });
      }
    });
  };

  if (!editorVisible) {
    // When not in editor, render children with all props (including position/rotation/scale)
    return <>{children}</>;
  }

  // When in editor, wrap with PivotControls
  // Children should already have transform props removed in Scene.jsx
  return (
    <PivotControls
      autoTransform
      matrix={initialMatrix}
      scale={1}
      lineWidth={2.5}
      annotations={true}
      onDragEnd={handleDragEnd}
    >
      <group ref={groupRef}>
        {children}
        {editorVisible && onDelete && <DeleteButton onDelete={onDelete} />}
      </group>
    </PivotControls>
  );
};

