import {
  ANGLE_LIMITS,
  CAMERA_CONSTRAINTS,
  selectControlType,
  selectIsAnimating,
  selectPosition,
  selectSyncCameraPosition,
  selectTarget,
  useCameraStore,
} from '@/experience/scenes/store/cameraStore';
import { Box, MapControls, PerspectiveCamera } from '@react-three/drei';
import { button, folder, useControls } from 'leva';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { MathUtils, PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';

// Typed debounce utility function
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
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

  // Performance optimization: Use individual selectors to only subscribe to needed state
  // This prevents re-renders when unrelated store fields change and avoids object creation
  const controlType = useCameraStore(selectControlType);
  const isAnimating = useCameraStore(selectIsAnimating);
  const position = useCameraStore(selectPosition);
  const target = useCameraStore(selectTarget);

  // Actions don't cause re-renders, can be selected separately
  const syncCameraPosition = useCameraStore(selectSyncCameraPosition);

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


  // Position update handlers - use refs to avoid stale closures
  const updatePosition = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    // Always check fresh state from store to avoid stale closures
    const currentStore = useCameraStore.getState();
    if (currentStore.isAnimating || isUpdatingRef.current) return;

    const newPosition = currentStore.position.clone();
    newPosition[axis] = value;

    currentStore.syncCameraPosition(newPosition, currentStore.target);
  }, []); // No dependencies - always use fresh store state

  // Target update handlers - use refs to avoid stale closures
  const updateTarget = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    // Always check fresh state from store to avoid stale closures
    const currentStore = useCameraStore.getState();
    if (currentStore.isAnimating || isUpdatingRef.current) return;

    const newTarget = currentStore.target.clone();
    newTarget[axis] = value;

    currentStore.syncCameraPosition(currentStore.position, newTarget);
  }, []); // No dependencies - always use fresh store state

  // Log camera position - defined with useCallback to prevent recreation
  const logCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;

    const currentStore = useCameraStore.getState();
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

    console.log('Camera State:', {
      isAnimating: currentStore.isAnimating,
      controlType: currentStore.controlType,
      state: currentStore.state,
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

  // Add debug settings
  const debugControls = useControls(
    'Debug Options',
    {
      showTargetCube: {
        value: false, // Default to off for better performance
        label: 'Show Target Cube',
      },
      logCameraPosition: button(logCameraPosition),
    },
    { collapsed: true }
  );

  // Create Leva controls - these will automatically update when the store changes
  useControls(
    'Main Camera Controls',
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
  );

  // Update camera position and orientation when store values change
  // Use useLayoutEffect to run synchronously before browser paint to avoid visual snap
  useLayoutEffect(() => {
    if (!cameraRef.current) return;

    cameraRef.current.position.copy(positionVector);
    cameraRef.current.lookAt(targetVector);
    cameraRef.current.updateMatrixWorld();
  }, [positionVector, targetVector]);

  // Debounced store sync to prevent excessive store updates
  const debouncedSyncToStore = useMemo(
    () =>
      debounce((position: Vector3, target: Vector3) => {
        if (isUpdatingRef.current) return;
        isUpdatingRef.current = true;
        syncCameraPosition(position, target);
        isUpdatingRef.current = false;
      }, 32), // At least 30fps
    [syncCameraPosition]
  );

  // Immediate handler that applies constraints on every change
  const handleControlsChange = useCallback(() => {
    if (!controlsRef.current || isAnimating || !cameraRef.current || isUpdatingRef.current)
      return;

    const currentPosition = cameraRef.current.position;
    const currentTarget = controlsRef.current.target;

    // Track if any clamping occurred
    let wasClamped = false;

    // Apply constraints to camera position (single source of truth)
    const clampedPosX = MathUtils.clamp(
      currentPosition.x,
      CAMERA_CONSTRAINTS.bounds.minX,
      CAMERA_CONSTRAINTS.bounds.maxX
    );
    const clampedPosY = MathUtils.clamp(
      currentPosition.y,
      CAMERA_CONSTRAINTS.bounds.minY,
      CAMERA_CONSTRAINTS.bounds.maxY
    );
    const clampedPosZ = MathUtils.clamp(
      currentPosition.z,
      CAMERA_CONSTRAINTS.bounds.minZ,
      CAMERA_CONSTRAINTS.bounds.maxZ
    );

    if (
      clampedPosX !== currentPosition.x ||
      clampedPosY !== currentPosition.y ||
      clampedPosZ !== currentPosition.z
    ) {
      wasClamped = true;
      currentPosition.set(clampedPosX, clampedPosY, clampedPosZ);
    }

    // Apply constraints to target position to prevent panning beyond scene boundaries
    // This is crucial for limiting drag/pan interactions
    const clampedTargetX = MathUtils.clamp(
      currentTarget.x,
      CAMERA_CONSTRAINTS.bounds.minX,
      CAMERA_CONSTRAINTS.bounds.maxX
    );
    const clampedTargetY = MathUtils.clamp(
      currentTarget.y,
      CAMERA_CONSTRAINTS.bounds.minY,
      CAMERA_CONSTRAINTS.bounds.maxY
    );
    const clampedTargetZ = MathUtils.clamp(
      currentTarget.z,
      CAMERA_CONSTRAINTS.bounds.minZ,
      CAMERA_CONSTRAINTS.bounds.maxZ
    );

    if (
      clampedTargetX !== currentTarget.x ||
      clampedTargetY !== currentTarget.y ||
      clampedTargetZ !== currentTarget.z
    ) {
      wasClamped = true;
      currentTarget.set(clampedTargetX, clampedTargetY, clampedTargetZ);
    }

    // If we clamped, force update the controls to reflect the new constrained position
    if (wasClamped && controlsRef.current) {
      controlsRef.current.update();
    }

    // Debounce the store sync to avoid too many updates
    debouncedSyncToStore(currentPosition, currentTarget);
  }, [isAnimating, debouncedSyncToStore]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[position.x, position.y, position.z]}
        fov={45}
      />
      {debugControls.showTargetCube && (
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
          // Angle constraints for camera orientation
          maxPolarAngle={ANGLE_LIMITS.maxPolar}
          minPolarAngle={ANGLE_LIMITS.minPolar}
          maxAzimuthAngle={ANGLE_LIMITS.maxAzimuth}
          minAzimuthAngle={ANGLE_LIMITS.minAzimuth}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.5}
          // Distance constraints derived from camera positions (single source of truth)
          maxDistance={CAMERA_CONSTRAINTS.maxDistance}
          minDistance={CAMERA_CONSTRAINTS.minDistance}
          onChange={handleControlsChange}
          enabled={!isAnimating && controlType === 'Map'}
        />
      )}
    </>
  );
}
