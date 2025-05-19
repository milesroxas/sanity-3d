// MainSceneCameraSystem.tsx
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { Box, MapControls, PerspectiveCamera } from '@react-three/drei';
import { button, folder, useControls, useCreateStore } from 'leva';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MathUtils, PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';

// Define boundary limits for camera movement
const BOUNDARY_LIMITS = {
  minX: -200,
  maxX: 200,
  minY: -400,
  maxY: 400,
  minZ: -200,
  maxZ: 400,
};

// Define angle limits
const ANGLE_LIMITS = {
  minPolar: 0, // Minimum polar angle (up/down rotation) in radians
  maxPolar: Math.PI / 2, // Maximum polar angle in radians
  minAzimuth: -Math.PI / 4, // Minimum azimuth angle (left/right rotation) in radians
  maxAzimuth: Math.PI / 4, // Maximum azimuth angle in radians
};

// Typed debounce utility function
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function MainSceneCameraSystem() {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const { controlType, isAnimating, position, target, syncCameraPosition, startCameraTransition } =
    useCameraStore();

  // Create a separate Leva store - only in development
  const levaStore = useCreateStore();

  // Memoize position and target as Vector3 to avoid recreation
  const positionVector = useMemo(
    () => new Vector3(position.x, position.y, position.z),
    [position.x, position.y, position.z]
  );

  const targetVector = useMemo(
    () => new Vector3(target.x, target.y, target.z),
    [target.x, target.y, target.z]
  );

  // Clean up animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Optimized position update handlers that use a single debounced function
  const updatePosition = useCallback(
    debounce((axis: 'x' | 'y' | 'z', value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newPosition = position.clone();
      newPosition[axis] = value;

      syncCameraPosition(newPosition, target);
      isUpdatingRef.current = false;
    }, 16), // ~60fps debounce
    [isAnimating, position, target, syncCameraPosition]
  );

  // Optimized target update handlers that use a single debounced function
  const updateTarget = useCallback(
    debounce((axis: 'x' | 'y' | 'z', value: number) => {
      if (isAnimating || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      const newTarget = target.clone();
      newTarget[axis] = value;

      syncCameraPosition(position, newTarget);
      isUpdatingRef.current = false;
    }, 16), // ~60fps debounce
    [isAnimating, position, target, syncCameraPosition]
  );

  // Log camera position - defined with useCallback to prevent recreation
  const logCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;

    console.log('%c --- Camera Debug Info ---', 'font-weight: bold; color: #0066ff;');

    // Get the actual current camera position and target from refs
    let currentPosition, currentTarget;

    if (cameraRef.current && controlsRef.current) {
      currentPosition = cameraRef.current.position;
      currentTarget = controlsRef.current.target;
    } else {
      // Fall back to store values if refs aren't available
      currentPosition = position;
      currentTarget = target;
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

  // Only show debug controls in development
  const isDevelopment = process.env.NEXT_PUBLIC_SITE_ENV === 'development';

  // Add debug settings - only when in development mode
  const showTargetCube = isDevelopment
    ? useControls({
        'Debug Options': folder(
          {
            showTargetCube: {
              value: false, // Default to off for better performance
              label: 'Show Target Cube',
            },
            logCameraPosition: button(logCameraPosition),
          },
          { collapsed: true }
        ),
      })
    : { showTargetCube: false };

  // Create Leva controls - only when in development mode
  const controls = isDevelopment
    ? useControls(
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
                  onChange: v => updatePosition('x', v),
                },
                positionY: {
                  value: position.y,
                  min: -400,
                  max: 400,
                  step: 0.1,
                  onChange: v => updatePosition('y', v),
                },
                positionZ: {
                  value: position.z,
                  min: -400,
                  max: 400,
                  step: 0.1,
                  onChange: v => updatePosition('z', v),
                },
              }),
              target: folder({
                targetX: {
                  value: target.x,
                  min: -400,
                  max: 400,
                  step: 0.1,
                  onChange: v => updateTarget('x', v),
                },
                targetY: {
                  value: target.y,
                  min: -400,
                  max: 400,
                  step: 0.1,
                  onChange: v => updateTarget('y', v),
                },
                targetZ: {
                  value: target.z,
                  min: -400,
                  max: 400,
                  step: 0.1,
                  onChange: v => updateTarget('z', v),
                },
              }),
            },
            { collapsed: true }
          ),
        },
        { collapsed: true, store: levaStore }
      )
    : null;

  // Update camera position and orientation when store values change - optimized with memoized values
  useEffect(() => {
    if (!cameraRef.current) return;

    // Use memoized vectors directly
    cameraRef.current.position.copy(positionVector);
    cameraRef.current.lookAt(targetVector);
  }, [positionVector, targetVector, isAnimating, controlType]);

  // Debounced version of the controls change handler
  const debouncedHandleControlsChange = useCallback(
    debounce(() => {
      if (!controlsRef.current || isAnimating || !cameraRef.current || isUpdatingRef.current)
        return;

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
        syncCameraPosition(currentPosition, currentTarget);
      }

      isUpdatingRef.current = false;
    }, 32), // At least 30fps
    [isAnimating, syncCameraPosition, controlType]
  );

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[position.x, position.y, position.z]}
      />
      {isDevelopment && showTargetCube.showTargetCube && (
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
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.5}
          maxDistance={250}
          minDistance={10}
          onChange={debouncedHandleControlsChange}
          enabled={!isAnimating && controlType === 'Map'}
        />
      )}
    </>
  );
}
