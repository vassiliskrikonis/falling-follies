/**
 * Visual indicator for the camera position and orientation
 * Renders an inverted pyramid (cone) with the base pointing in the direction the camera is looking
 * Position and rotation are handled by PivotControls parent
 */
export const CameraIndicator = () => {
  return (
    <group>
      {/* Inverted pyramid: cone with base pointing forward (negative Z direction)
          Rotate 90 degrees around X axis so the base faces forward instead of up */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#004444"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Small sphere at the tip (back of camera) to make it more visible */}
      <mesh position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

