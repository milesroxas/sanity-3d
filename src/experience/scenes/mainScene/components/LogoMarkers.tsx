'use client';
import { useCursorStore } from '@/components/ui/cursorStore';
import { LogoMarker } from '@/experience/components/markers/LogoMarker';
import {
  selectSetControlType,
  selectSetIsAnimating,
  selectSyncCameraPosition,
  useCameraStore,
} from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { animateCameraMovement } from '@/experience/utils/animationUtils';
import { Float, Html, useCursor } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { PoiManager } from './PoiManager';

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
      useCursorStore.getState().setHoveringInteractive(true);
    }
  };

  const handlePointerLeave = () => {
    setHoveredMarkerId(null);
    useCursorStore.getState().setHoveringInteractive(false);
  };

  const handleClick = () => {
    if (otherMarkersVisible) {
      handleMarkerClick(poi);
      // Reset cursor state immediately after click
      useCursorStore.getState().setHoveringInteractive(false);
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
    selectedScene, // Get the selected child scene
  } = useLogoMarkerStore();

  // Use selectedScene if available (clicked child scene), otherwise use main scene
  const activeScene = selectedScene || scene;

  // Determine display mode: legacy (show all markers) or interactive (show POI buttons)
  const poiDisplayMode = activeScene.poiDisplayMode || 'legacy';
  const isInteractiveMode = poiDisplayMode === 'interactive';

  console.log('[LogoMarkers] Scene data:', {
    slug: activeScene.slug?.current,
    isChildScene: !!selectedScene,
    poiDisplayMode: activeScene.poiDisplayMode,
    rawMode: poiDisplayMode,
    isInteractiveMode,
    hasPointsOfInterest: !!activeScene.pointsOfInterest,
    pointsCount: activeScene.pointsOfInterest?.length || 0
  });

  // Filter scene references (logo markers) from POIs
  const sceneReferences = useMemo(() => {
    if (!scene.pointsOfInterest) return [];
    return scene.pointsOfInterest.filter(
      (poi): poi is Sanity.SceneReference =>
        poi._type === 'scenes' && !!poi.mainSceneMarkerPosition
    );
  }, [scene.pointsOfInterest]);

  // Performance optimization: Use individual selectors to prevent re-renders during camera animation
  const setControlType = useCameraStore(selectSetControlType);
  const setIsAnimating = useCameraStore(selectSetIsAnimating);
  const syncCameraPosition = useCameraStore(selectSyncCameraPosition);

  // Ref to track animation frames for cleanup
  const animationFrameRef = useRef<number | (() => void) | null>(null);

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
    };
  }, [clearAnimationFrame]);

  // Preload marker model on component mount with proper error handling
  useEffect(() => {
    // Force preload of marker model
    import('@/experience/components/markers/LogoMarker').catch(err => {
      console.error('Failed to preload LogoMarker:', err);
    });
  }, []);

  const handleMarkerClick = useCallback(
    (poi: any) => {
      if (!poi.mainSceneCameraPosition || !poi.mainSceneCameraTarget) {
        return;
      }

      // Clean up any existing animations
      clearAnimationFrame();

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
      let frameCount = 0;
      animationFrameRef.current = animateCameraMovement(
        startPosition,
        targetPos,
        startTarget,
        targetLookAt,
        (nextPosition, nextTarget) => {
          // Throttle store updates to every 3rd frame to reduce re-renders
          if (frameCount % 3 === 0) {
            syncCameraPosition(nextPosition, nextTarget);
          }
          frameCount++;
        },
        {
          duration: 2000,
          onComplete: () => {
            setIsAnimating(false);
            if (poi.slug?.current) {
              // Fetch the scene data, but don't auto-show content in interactive mode
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
    ]
  );

  // Handle camera animation when closing
  useEffect(() => {
    if (!shouldAnimateBack || !initialCameraPosition || !initialCameraTarget) {
      return;
    }

    // Clean up any existing animations before starting a new one
    clearAnimationFrame();

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
  ]);

  return (
    <group>
      {/* Logo Markers - Always render scene references from main scene */}
      {sceneReferences.map(poi => (
        <PoiMarker
          key={poi._id}
          poi={poi}
          hoveredMarkerId={hoveredMarkerId}
          setHoveredMarkerId={setHoveredMarkerId}
          handleMarkerClick={handleMarkerClick}
          otherMarkersVisible={otherMarkersVisible}
        />
      ))}

      {/* POI System - Only render in interactive mode, using activeScene (selectedScene if clicked) */}
      {isInteractiveMode && <PoiManager scene={activeScene} />}
    </group>
  );
}
