'use client';
import { LogoMarker } from '@/experience/components/markers/LogoMarker';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { animateCameraMovement } from '@/experience/utils/animationUtils';
import { Float, Html, useCursor } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';

type MarkerPosition = {
  x: number;
  y: number;
  z: number;
};

type Position = [number, number, number];

const toPosition = (marker: MarkerPosition): Position => {
  return [marker.x, marker.y, marker.z];
};

// Individual marker component to handle its own hover state
function PoiMarker({
  poi,
  hoveredMarkerId,
  setHoveredMarkerId,
  handleMarkerClick,
  otherMarkersVisible,
}: any) {
  const isHovered = hoveredMarkerId === poi._id;

  // Add refs for light animation
  const lightRef = useRef<THREE.RectAreaLight>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);

  // Use refs to track the actual DOM elements for direct manipulation
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Apply cursor effect
  useCursor(isHovered && otherMarkersVisible);

  // Apply transitions directly when hover state changes
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Apply styles directly to avoid React re-renders during transition
    if (isHovered && otherMarkersVisible) {
      containerRef.current.style.backgroundColor = 'rgba(74, 222, 128, 0.8)';
      containerRef.current.style.transform = 'scale(1.25)';
      textRef.current.style.transform = 'scale(1)';
    } else {
      containerRef.current.style.backgroundColor = 'rgba(34, 197, 94, 0.8)';
      containerRef.current.style.transform = 'scale(1.125)';
      textRef.current.style.transform = 'scale(1)';
    }

    // Update light intensity
    if (lightRef.current) {
      lightRef.current.intensity = isHovered && otherMarkersVisible ? 100 : 0;
    }
  }, [isHovered, otherMarkersVisible]);

  // Handle marker visibility
  const opacity = otherMarkersVisible ? 1 : 0;

  // Event handlers
  const handlePointerEnter = () => {
    if (otherMarkersVisible) {
      setHoveredMarkerId(poi._id);
    }
  };

  const handlePointerLeave = () => {
    setHoveredMarkerId(null);
  };

  const handleClick = () => {
    if (otherMarkersVisible) {
      handleMarkerClick(poi);
    }
  };

  // Get the marker position
  const markerPosition = toPosition(poi.mainSceneMarkerPosition);

  return (
    <group>
      {/* Single hitbox for 3D interaction */}
      <mesh
        ref={hitboxRef}
        visible={otherMarkersVisible}
        position={[markerPosition[0], markerPosition[1], markerPosition[2]]}
        scale={[15, 15, 15]}
        // Use a minimal, non-duplicated pointer handler set to avoid double-trigger jitter
        onPointerEnter={otherMarkersVisible ? handlePointerEnter : undefined}
        onPointerLeave={otherMarkersVisible ? handlePointerLeave : undefined}
        onClick={otherMarkersVisible ? handleClick : undefined}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* reduce Float workload slightly during intro; still visible */}
      <Float speed={4} rotationIntensity={0} floatIntensity={0.6} floatingRange={[-0.08, 0.08]}>
        <group position={markerPosition}>
          {/* Logo marker with light */}
          <group position={[0, 0, 0]}>
            <rectAreaLight
              ref={lightRef}
              position={[0, 5, 40]}
              width={20}
              height={20}
              color="#36A837"
              intensity={isHovered && otherMarkersVisible ? 80 : 0}
            />
            <LogoMarker isHovered={isHovered} position={[0, 0, 0]} scale={0.7} opacity={opacity} />
          </group>

          {/* HTML element positioned below the marker */}
          <group position={[0, -5, 0]}>
            <Html
              distanceFactor={30}
              zIndexRange={[100, 0]}
              occlude={false}
              prepend
              center
              style={{
                width: 'auto',
                minWidth: '200px',
                pointerEvents: 'none',
                opacity: opacity,
                transition: 'opacity 0.6s ease-in-out',
              }}
            >
              <div
                ref={containerRef}
                className="rounded-lg px-4 py-2 backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'center center',
                  cursor: 'default',
                  opacity: opacity,
                  touchAction: 'none',
                  minWidth: '200px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                <h3
                  ref={textRef}
                  className="text-center text-6xl font-bold text-white lg:text-8xl"
                  style={{
                    transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center center',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                >
                  {poi.title}
                </h3>
              </div>
            </Html>
          </group>
        </group>
      </Float>
    </group>
  );
}

export default function LogoMarkers({ scene }: { scene: Sanity.Scene }) {
  const { camera } = useThree();
  const {
    fetchAndSetScene,
    shouldAnimateBack,
    setShouldAnimateBack,
    initialCameraPosition,
    initialCameraTarget,
    setInitialCameraState,
    otherMarkersVisible,
    setOtherMarkersVisible,
    hoveredMarkerId,
    setHoveredMarkerId,
  } = useLogoMarkerStore();
  const { setControlType, setIsAnimating, syncCameraPosition } = useCameraStore();

  // Refs to track animation frames and timeouts for cleanup
  const animationFrameRef = useRef<number | (() => void) | null>(null);
  const timeoutRefs = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  // Helper to safely set timeouts that we can clean up
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(callback, delay);
    timeoutRefs.current.push(timeoutId);
    return timeoutId;
  }, []);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  // Clear animation frame
  const clearAnimationFrame = useCallback(() => {
    if (typeof animationFrameRef.current === 'function') {
      animationFrameRef.current();
      animationFrameRef.current = null;
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Reset hover state when markers visibility changes
  useEffect(() => {
    setHoveredMarkerId(null);
  }, [otherMarkersVisible, setHoveredMarkerId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAnimationFrame();
      clearAllTimeouts();
    };
  }, [clearAnimationFrame, clearAllTimeouts]);

  // Preload marker model on component mount with proper error handling
  useEffect(() => {
    let isMounted = true;
    // Force preload of marker model
    import('@/experience/components/markers/LogoMarker').catch(err => {
      console.error('Failed to preload LogoMarker:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkerClick = useCallback(
    (poi: any) => {
      if (!poi.mainSceneCameraPosition || !poi.mainSceneCameraTarget) {
        return;
      }

      // Clean up any existing animations or timeouts
      clearAnimationFrame();
      clearAllTimeouts();

      // First, fade out all markers
      setOtherMarkersVisible(false);

      // Store the exact camera state from the live Three camera to avoid any store debounce lag
      const startPosition = camera.position.clone();
      const startTarget = new Vector3();
      camera.getWorldDirection(startTarget);
      startTarget.multiplyScalar(100).add(startPosition);
      setInitialCameraState(startPosition, startTarget);

      // Create target vectors for where we want to animate TO
      const targetPos = new Vector3(
        poi.mainSceneCameraPosition.x,
        poi.mainSceneCameraPosition.y,
        poi.mainSceneCameraPosition.z
      );

      const targetLookAt = new Vector3(
        poi.mainSceneCameraTarget.x,
        poi.mainSceneCameraTarget.y,
        poi.mainSceneCameraTarget.z
      );

      setControlType('Disabled');
      setIsAnimating(true);

      // Start camera animation immediately; marker fade runs in parallel
      animationFrameRef.current = animateCameraMovement(
        startPosition,
        targetPos,
        startTarget,
        targetLookAt,
        (nextPosition, nextTarget) => {
          syncCameraPosition(nextPosition, nextTarget);
        },
        {
          duration: 2000,
          onComplete: () => {
            setIsAnimating(false);
            if (poi.slug?.current) {
              fetchAndSetScene(poi.slug.current);
            }
          },
        }
      );
    },
    [
      camera,
      setInitialCameraState,
      setControlType,
      setIsAnimating,
      syncCameraPosition,
      fetchAndSetScene,
      setOtherMarkersVisible,
      clearAnimationFrame,
      clearAllTimeouts,
    ]
  );

  // Handle camera animation when closing
  useEffect(() => {
    if (!shouldAnimateBack || !initialCameraPosition || !initialCameraTarget) {
      return;
    }

    // Clean up any existing animations before starting a new one
    clearAnimationFrame();
    clearAllTimeouts();

    // Disable controls during animation
    setControlType('Disabled');
    setIsAnimating(true);

    // Get the current camera state from live Three camera for exactness
    const startPos = camera.position.clone();
    const startTarget = new Vector3();
    camera.getWorldDirection(startTarget);
    startTarget.multiplyScalar(100).add(camera.position);

    // Create our own animation loop for full control
    animationFrameRef.current = animateCameraMovement(
      startPos,
      initialCameraPosition,
      startTarget,
      initialCameraTarget,
      (position, target) => {
        syncCameraPosition(position, target);
      },
      {
        duration: 2500,
        onComplete: () => {
          syncCameraPosition(initialCameraPosition, initialCameraTarget);

          const restoreTarget = () => {
            camera.lookAt(initialCameraTarget);
          };

          restoreTarget();
          setIsAnimating(false);
          setControlType('Map');
          setShouldAnimateBack(false);
          setOtherMarkersVisible(true);
          requestAnimationFrame(restoreTarget);
        },
      }
    );

    // Clean up function to handle component unmounting during animation
    return () => {
      clearAnimationFrame();
      clearAllTimeouts();
    };
  }, [
    shouldAnimateBack,
    camera,
    initialCameraPosition,
    initialCameraTarget,
    setShouldAnimateBack,
    setControlType,
    setIsAnimating,
    syncCameraPosition,
    clearAnimationFrame,
    clearAllTimeouts,
    safeSetTimeout,
  ]);

  return (
    <group>
      {scene.pointsOfInterest?.map((poi, index) => {
        if (
          '_type' in poi &&
          poi._type === 'scenes' &&
          'mainSceneMarkerPosition' in poi &&
          poi.mainSceneMarkerPosition &&
          'slug' in poi
        ) {
          return (
            <PoiMarker
              key={poi._id}
              poi={poi}
              hoveredMarkerId={hoveredMarkerId}
              setHoveredMarkerId={setHoveredMarkerId}
              handleMarkerClick={handleMarkerClick}
              otherMarkersVisible={otherMarkersVisible}
            />
          );
        }
        return null;
      })}
    </group>
  );
}
