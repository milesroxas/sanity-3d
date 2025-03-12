// MainSceneCameraSystem.tsx
import { MapControls, PerspectiveCamera } from "@react-three/drei";
import { useControls, folder } from "leva";
import { useRef, useEffect } from "react";
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3, MathUtils } from "three";
import {
  INITIAL_POSITIONS,
  useCameraStore,
} from "@/experience/scenes/store/cameraStore";

// Define boundary limits for camera movement
const BOUNDARY_LIMITS = {
  minX: -300,
  maxX: 300,
  minY: -100,
  maxY: 200,
  minZ: -60,
  maxZ: 160
};

// Define angle limits
const ANGLE_LIMITS = {
  minPolar: 0,          // Minimum polar angle (up/down rotation) in radians
  maxPolar: Math.PI / 2, // Maximum polar angle in radians
  minAzimuth: -Math.PI / 4, // Minimum azimuth angle (left/right rotation) in radians
  maxAzimuth: Math.PI / 4   // Maximum azimuth angle in radians
};

export function MainSceneCameraSystem() {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const { controlType, isAnimating, position, target } = useCameraStore();

  const { positionX, positionY, positionZ, targetX, targetY, targetZ } =
    useControls(
      "Main Camera Controls",
      {
        "Main Scene": folder(
          {
            position: folder({
              positionX: {
                value: INITIAL_POSITIONS.main.position.x,
                min: -200,
                max: 200,
                step: 0.1,
              },
              positionY: {
                value: INITIAL_POSITIONS.main.position.y,
                min: -200,
                max: 200,
                step: 0.1,
              },
              positionZ: {
                value: INITIAL_POSITIONS.main.position.z,
                min: -200,
                max: 200,
                step: 0.1,
              },
            }),
            target: folder({
              targetX: {
                value: INITIAL_POSITIONS.main.target.x,
                min: -200,
                max: 200,
                step: 0.1,
              },
              targetY: {
                value: INITIAL_POSITIONS.main.target.y,
                min: -200,
                max: 200,
                step: 0.1,
              },
              targetZ: {
                value: INITIAL_POSITIONS.main.target.z,
                min: -200,
                max: 200,
                step: 0.1,
              },
            }),
          },
          { collapsed: true }
        ),
      },
      { collapsed: true }
    );

  useEffect(() => {
    if (!cameraRef.current) return;
    const newPosition = isAnimating ? position : position.clone();
    const newTarget = isAnimating ? target : target.clone();

    cameraRef.current.position.copy(newPosition);
    cameraRef.current.lookAt(newTarget);
  }, [isAnimating, position, target]);

  // Handle camera movement constraints
  const handleControlsChange = () => {
    if (!controlsRef.current || isAnimating || !cameraRef.current) return;
    
    const currentPosition = cameraRef.current.position;
    const currentTarget = controlsRef.current.target;
    
    console.log("Controls change - Position:", currentPosition.toArray());
    console.log("Controls change - Target:", currentTarget.toArray());
    
    // Store original values before applying constraints
    const originalPosition = currentPosition.clone();
    const originalTarget = currentTarget.clone();
    
    // Apply boundary constraints individually
    let needsUpdate = false;
    
    // Check and apply X boundary
    if (currentPosition.x < BOUNDARY_LIMITS.minX) {
      console.log("Hit minX boundary");
      currentPosition.x = BOUNDARY_LIMITS.minX;
      needsUpdate = true;
    } else if (currentPosition.x > BOUNDARY_LIMITS.maxX) {
      console.log("Hit maxX boundary");
      currentPosition.x = BOUNDARY_LIMITS.maxX;
      needsUpdate = true;
    }
    
    // Check and apply Y boundary
    if (currentPosition.y < BOUNDARY_LIMITS.minY) {
      console.log("Hit minY boundary");
      currentPosition.y = BOUNDARY_LIMITS.minY;
      needsUpdate = true;
    } else if (currentPosition.y > BOUNDARY_LIMITS.maxY) {
      console.log("Hit maxY boundary");
      currentPosition.y = BOUNDARY_LIMITS.maxY;
      needsUpdate = true;
    }
    
    // Check and apply Z boundary
    if (currentPosition.z < BOUNDARY_LIMITS.minZ) {
      console.log("Hit minZ boundary");
      currentPosition.z = BOUNDARY_LIMITS.minZ;
      needsUpdate = true;
    } else if (currentPosition.z > BOUNDARY_LIMITS.maxZ) {
      console.log("Hit maxZ boundary");
      currentPosition.z = BOUNDARY_LIMITS.maxZ;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      // Calculate how much the camera position changed due to constraints
      const positionDelta = new Vector3().subVectors(currentPosition, originalPosition);
      
      // If we hit a boundary, also move the target by the same amount
      // This prevents the camera from rotating when hitting a boundary
      currentTarget.add(positionDelta);
      
      console.log("Adjusted target to prevent rotation:", currentTarget.toArray());
    }
  };

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={
          isAnimating
            ? [position.x, position.y, position.z]
            : [positionX, positionY, positionZ]
        }
      />
      {controlType === "Map" && !isAnimating && (
        <MapControls
          ref={controlsRef}
          target={[targetX, targetY, targetZ]}
          // Use the angle limits defined above
          maxPolarAngle={ANGLE_LIMITS.maxPolar}
          minPolarAngle={ANGLE_LIMITS.minPolar}
          maxAzimuthAngle={ANGLE_LIMITS.maxAzimuth}
          minAzimuthAngle={ANGLE_LIMITS.minAzimuth}
          // Prevent automatic adjustments when hitting angle limits
          enableDamping={true}
          dampingFactor={0.07}
          rotateSpeed={0.5}
          maxDistance={200}
          minDistance={10}
          onChange={handleControlsChange}
        />
      )}
    </>
  );
}
