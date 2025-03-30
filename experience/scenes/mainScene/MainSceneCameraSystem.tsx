// MainSceneCameraSystem.tsx
import { MapControls, PerspectiveCamera, Box } from "@react-three/drei";
import { useControls, folder, useCreateStore, button } from "leva";
import { useRef, useEffect, useState, useMemo } from "react";
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3, MathUtils } from "three";
import {
  INITIAL_POSITIONS,
  useCameraStore,
} from "@/experience/scenes/store/cameraStore";

// Define boundary limits for camera movement
const BOUNDARY_LIMITS = {
  minX: -200,
  maxX: 200,
  minY: -400,
  maxY: 400,
  minZ: -80,
  maxZ: 400
};

// Define angle limits
const ANGLE_LIMITS = {
  minPolar: 0,          // Minimum polar angle (up/down rotation) in radians
  maxPolar: Math.PI / 2, // Maximum polar angle in radians
  minAzimuth: -Math.PI / 4, // Minimum azimuth angle (left/right rotation) in radians
  maxAzimuth: Math.PI / 4   // Maximum azimuth angle in radians
};

interface CameraControls {
  "Main Scene": {
    position: {
      positionX: number;
      positionY: number;
      positionZ: number;
    };
    target: {
      targetX: number;
      targetY: number;
      targetZ: number;
    };
    debug: {
      showTargetCube: boolean;
    };
  };
}

export function MainSceneCameraSystem() {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);
  const { controlType, isAnimating, position, target, syncCameraPosition } = useCameraStore();
  
  // Create a separate Leva store
  const levaStore = useCreateStore();
  
  // Add debug settings directly to main controls
  const showTargetCube = useControls({
    "Debug Options": folder({
      showTargetCube: {
        value: process.env.NEXT_PUBLIC_SITE_ENV === 'development',
        label: "Show Target Cube"
      },
      logCameraPosition: button(() => {
        console.log("%c --- Camera Debug Info ---", "font-weight: bold; color: #0066ff;");
        
        // Get the actual current camera position and target from refs
        let currentPosition, currentTarget;
        
        if (cameraRef.current && controlsRef.current) {
          currentPosition = cameraRef.current.position.clone();
          currentTarget = controlsRef.current.target.clone();
        } else {
          // Fall back to store values if refs aren't available
          currentPosition = position.clone();
          currentTarget = target.clone();
        }
        
        console.log("REAL-TIME Camera Position:", {
          x: currentPosition.x.toFixed(2),
          y: currentPosition.y.toFixed(2),
          z: currentPosition.z.toFixed(2)
        });
        
        console.log("REAL-TIME Camera Target:", {
          x: currentTarget.x.toFixed(2),
          y: currentTarget.y.toFixed(2),
          z: currentTarget.z.toFixed(2)
        });
        
        console.log("Camera JSON (for copying):", JSON.stringify({
          position: {
            x: parseFloat(currentPosition.x.toFixed(2)),
            y: parseFloat(currentPosition.y.toFixed(2)),
            z: parseFloat(currentPosition.z.toFixed(2))
          },
          target: {
            x: parseFloat(currentTarget.x.toFixed(2)),
            y: parseFloat(currentTarget.y.toFixed(2)),
            z: parseFloat(currentTarget.z.toFixed(2))
          }
        }, null, 2));
      })
    }, { collapsed: false })
  });

  // Create Leva controls with custom onChange handlers to prevent circular updates
  const controls = useControls(
    "Main Camera Controls",
    {
      "Main Scene": folder(
        {
          position: folder({
            positionX: {
              value: position.x,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: (value) => {
                if (isAnimating || isUpdatingRef.current) return;
                
                isUpdatingRef.current = true;
                const newPosition = position.clone();
                newPosition.x = value;
                syncCameraPosition(newPosition, target);
                isUpdatingRef.current = false;
              }
            },
            positionY: {
              value: position.y,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: (value) => {
                if (isAnimating || isUpdatingRef.current) return;
                
                isUpdatingRef.current = true;
                const newPosition = position.clone();
                newPosition.y = value;
                syncCameraPosition(newPosition, target);
                isUpdatingRef.current = false;
              }
            },
            positionZ: {
              value: position.z,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: (value) => {
                if (isAnimating || isUpdatingRef.current) return;
                
                isUpdatingRef.current = true;
                const newPosition = position.clone();
                newPosition.z = value;
                syncCameraPosition(newPosition, target);
                isUpdatingRef.current = false;
              }
            },
          }),
          target: folder({
            targetX: {
              value: target.x,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: (value) => {
                if (isAnimating || isUpdatingRef.current) return;
                
                isUpdatingRef.current = true;
                const newTarget = target.clone();
                newTarget.x = value;
                syncCameraPosition(position, newTarget);
                isUpdatingRef.current = false;
              }
            },
            targetY: {
              value: target.y,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: (value) => {
                if (isAnimating || isUpdatingRef.current) return;
                
                isUpdatingRef.current = true;
                const newTarget = target.clone();
                newTarget.y = value;
                syncCameraPosition(position, newTarget);
                isUpdatingRef.current = false;
              }
            },
            targetZ: {
              value: target.z,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: (value) => {
                if (isAnimating || isUpdatingRef.current) return;
                
                isUpdatingRef.current = true;
                const newTarget = target.clone();
                newTarget.z = value;
                syncCameraPosition(position, newTarget);
                isUpdatingRef.current = false;
              }
            },
          }),
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  ) as unknown as CameraControls;

  // Update Leva controls when store values change
  useEffect(() => {
    if (isUpdatingRef.current || isAnimating) return;
    
    // Use Leva's set method to update the control values without triggering onChange
    // This prevents the circular update loop
    isUpdatingRef.current = true;
    
    // Handle Leva UI updates manually here if needed
    
    isUpdatingRef.current = false;
  }, [position, target, isAnimating]);

  // Update camera position and orientation when store values change
  useEffect(() => {
    if (!cameraRef.current) return;
    
    // Clone position and target to avoid potential reference issues
    const newPosition = position.clone();
    const newTarget = target.clone();

    // Update camera position and orientation
    cameraRef.current.position.copy(newPosition);
    cameraRef.current.lookAt(newTarget);
  }, [position, target]);

  // Handle camera movement constraints
  const handleControlsChange = () => {
    if (!controlsRef.current || isAnimating || !cameraRef.current || isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    const currentPosition = cameraRef.current.position;
    const currentTarget = controlsRef.current.target;
    
    // Store original values before applying constraints
    const originalPosition = currentPosition.clone();
    const originalTarget = currentTarget.clone();
    
    // Apply boundary constraints individually
    let needsUpdate = false;
    
    // Check and apply X boundary
    if (currentPosition.x < BOUNDARY_LIMITS.minX) {
      currentPosition.x = BOUNDARY_LIMITS.minX;
      needsUpdate = true;
    } else if (currentPosition.x > BOUNDARY_LIMITS.maxX) {
      currentPosition.x = BOUNDARY_LIMITS.maxX;
      needsUpdate = true;
    }
    
    // Check and apply Y boundary
    if (currentPosition.y < BOUNDARY_LIMITS.minY) {
      currentPosition.y = BOUNDARY_LIMITS.minY;
      needsUpdate = true;
    } else if (currentPosition.y > BOUNDARY_LIMITS.maxY) {
      currentPosition.y = BOUNDARY_LIMITS.maxY;
      needsUpdate = true;
    }
    
    // Check and apply Z boundary
    if (currentPosition.z < BOUNDARY_LIMITS.minZ) {
      currentPosition.z = BOUNDARY_LIMITS.minZ;
      needsUpdate = true;
    } else if (currentPosition.z > BOUNDARY_LIMITS.maxZ) {
      currentPosition.z = BOUNDARY_LIMITS.maxZ;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      // Calculate how much the camera position changed due to constraints
      const positionDelta = new Vector3().subVectors(currentPosition, originalPosition);
      
      // If we hit a boundary, also move the target by the same amount
      // This prevents the camera from rotating when hitting a boundary
      currentTarget.add(positionDelta);
      
      // Sync the constrained position with the store
      syncCameraPosition(currentPosition, currentTarget);
    }
    
    isUpdatingRef.current = false;
  };

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[position.x, position.y, position.z]}
      />
      {showTargetCube.showTargetCube && (
        <Box 
          position={[target.x, target.y, target.z]} 
          args={[2, 2, 2]} 
          material-transparent
          material-opacity={0.7}
          material-color="#ff0000"
        />
      )}
      {controlType === "Map" && !isAnimating && (
        <MapControls
          ref={controlsRef}
          target={[target.x, target.y, target.z]}
          // Use the angle limits defined above
          maxPolarAngle={ANGLE_LIMITS.maxPolar}
          minPolarAngle={ANGLE_LIMITS.minPolar}
          maxAzimuthAngle={ANGLE_LIMITS.maxAzimuth}
          minAzimuthAngle={ANGLE_LIMITS.minAzimuth}
          // Prevent automatic adjustments when hitting angle limits
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.5}
          maxDistance={250}
          minDistance={10}
          onChange={handleControlsChange}
        />
      )}
    </>
  );
}
