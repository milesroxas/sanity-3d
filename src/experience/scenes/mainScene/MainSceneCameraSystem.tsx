// MainSceneCameraSystem.tsx
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { Box, MapControls, PerspectiveCamera } from '@react-three/drei';
import { button, folder, useControls, useCreateStore } from 'leva';
import { useCallback, useEffect, useRef } from 'react';
import { MathUtils, PerspectiveCamera as ThreePerspectiveCamera } from 'three';

// Define boundary limits for camera movement
const BOUNDARY_LIMITS = {
  minX: -200,
  maxX: 200,
  minY: -400,
  maxY: 400,
  minZ: -80,
  maxZ: 400,
};

// Define angle limits
const ANGLE_LIMITS = {
  minPolar: 0, // Minimum polar angle (up/down rotation) in radians
  maxPolar: Math.PI / 2, // Maximum polar angle in radians
  minAzimuth: -Math.PI / 4, // Minimum azimuth angle (left/right rotation) in radians
  maxAzimuth: Math.PI / 4, // Maximum azimuth angle in radians
};

interface CameraControls {
  'Main Scene': {
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

  // Define callbacks for updating camera position/target
  // Using useCallback prevents these from being recreated on every render
  const updatePositionX = useCallback(
    (value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newPosition = position.clone();
      newPosition.x = value;

      // Schedule state update after render
      setTimeout(() => {
        syncCameraPosition(newPosition, target);
        isUpdatingRef.current = false;
      }, 0);
    },
    [isAnimating, position, target, syncCameraPosition]
  );

  const updatePositionY = useCallback(
    (value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newPosition = position.clone();
      newPosition.y = value;

      // Schedule state update after render
      setTimeout(() => {
        syncCameraPosition(newPosition, target);
        isUpdatingRef.current = false;
      }, 0);
    },
    [isAnimating, position, target, syncCameraPosition]
  );

  const updatePositionZ = useCallback(
    (value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newPosition = position.clone();
      newPosition.z = value;

      // Schedule state update after render
      setTimeout(() => {
        syncCameraPosition(newPosition, target);
        isUpdatingRef.current = false;
      }, 0);
    },
    [isAnimating, position, target, syncCameraPosition]
  );

  const updateTargetX = useCallback(
    (value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newTarget = target.clone();
      newTarget.x = value;

      // Schedule state update after render
      setTimeout(() => {
        syncCameraPosition(position, newTarget);
        isUpdatingRef.current = false;
      }, 0);
    },
    [isAnimating, position, target, syncCameraPosition]
  );

  const updateTargetY = useCallback(
    (value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newTarget = target.clone();
      newTarget.y = value;

      // Schedule state update after render
      setTimeout(() => {
        syncCameraPosition(position, newTarget);
        isUpdatingRef.current = false;
      }, 0);
    },
    [isAnimating, position, target, syncCameraPosition]
  );

  const updateTargetZ = useCallback(
    (value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newTarget = target.clone();
      newTarget.z = value;

      // Schedule state update after render
      setTimeout(() => {
        syncCameraPosition(position, newTarget);
        isUpdatingRef.current = false;
      }, 0);
    },
    [isAnimating, position, target, syncCameraPosition]
  );

  // Log camera position - defined with useCallback to prevent recreation
  const logCameraPosition = useCallback(() => {
    console.log('%c --- Camera Debug Info ---', 'font-weight: bold; color: #0066ff;');

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

    console.log('REAL-TIME Camera Position:', {
      x: currentPosition.x.toFixed(2),
      y: currentPosition.y.toFixed(2),
      z: currentPosition.z.toFixed(2),
    });

    console.log('REAL-TIME Camera Target:', {
      x: currentTarget.x.toFixed(2),
      y: currentTarget.y.toFixed(2),
      z: currentTarget.z.toFixed(2),
    });

    console.log(
      'Camera JSON (for copying):',
      JSON.stringify(
        {
          position: {
            x: parseFloat(currentPosition.x.toFixed(2)),
            y: parseFloat(currentPosition.y.toFixed(2)),
            z: parseFloat(currentPosition.z.toFixed(2)),
          },
          target: {
            x: parseFloat(currentTarget.x.toFixed(2)),
            y: parseFloat(currentTarget.y.toFixed(2)),
            z: parseFloat(currentTarget.z.toFixed(2)),
          },
        },
        null,
        2
      )
    );
  }, [position, target]);

  // Add debug settings directly to main controls
  const showTargetCube = useControls({
    'Debug Options': folder(
      {
        showTargetCube: {
          value: process.env.NEXT_PUBLIC_SITE_ENV === 'development',
          label: 'Show Target Cube',
        },
        logCameraPosition: button(logCameraPosition),
      },
      { collapsed: false }
    ),
  });

  // Create Leva controls with custom onChange handlers to prevent circular updates
  const controls = useControls(
    'Main Camera Controls',
    {
      'Main Scene': folder(
        {
          position: folder({
            positionX: {
              value: position.x,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: updatePositionX,
            },
            positionY: {
              value: position.y,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: updatePositionY,
            },
            positionZ: {
              value: position.z,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: updatePositionZ,
            },
          }),
          target: folder({
            targetX: {
              value: target.x,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: updateTargetX,
            },
            targetY: {
              value: target.y,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: updateTargetY,
            },
            targetZ: {
              value: target.z,
              min: -400,
              max: 400,
              step: 0.1,
              onChange: updateTargetZ,
            },
          }),
        },
        { collapsed: true }
      ),
    },
    { collapsed: true, store: levaStore }
  ) as unknown as CameraControls;

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
  const handleControlsChange = useCallback(() => {
    if (!controlsRef.current || isAnimating || !cameraRef.current || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const currentPosition = cameraRef.current.position;
    const currentTarget = controlsRef.current.target;

    // Store original values before applying constraints
    const originalPosition = currentPosition.clone();
    const originalTarget = currentTarget.clone();

    // Apply constraints
    currentPosition.x = MathUtils.clamp(
      currentPosition.x,
      BOUNDARY_LIMITS.minX,
      BOUNDARY_LIMITS.maxX
    );
    currentPosition.y = MathUtils.clamp(
      currentPosition.y,
      BOUNDARY_LIMITS.minY,
      BOUNDARY_LIMITS.maxY
    );
    currentPosition.z = MathUtils.clamp(
      currentPosition.z,
      BOUNDARY_LIMITS.minZ,
      BOUNDARY_LIMITS.maxZ
    );

    // Only sync to store if position actually changed due to constraints
    if (!originalPosition.equals(currentPosition) || !originalTarget.equals(currentTarget)) {
      // Use setTimeout to schedule the state update after render is complete
      setTimeout(() => {
        syncCameraPosition(currentPosition.clone(), currentTarget.clone());
      }, 0);
    }

    isUpdatingRef.current = false;
  }, [isAnimating, syncCameraPosition]);

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
      {controlType === 'Map' && !isAnimating && (
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
