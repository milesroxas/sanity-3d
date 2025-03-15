"use client";
import { Float, Html, useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Vector3 } from "three";
import * as THREE from "three";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { useControls } from "leva";
import { useStoreContext } from "leva/plugin";
import { LogoMarker } from "@/experience/sceneCollections/markers/LogoMarker";

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
}: any) {
  const isHovered = hoveredMarkerId === poi._id;
  const [effectiveHoverState, setEffectiveHoverState] = useState(isHovered);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const HOVER_IN_DELAY = 50; // milliseconds delay for hover in (shorter than hover out)
  const HOVER_OUT_DELAY = 150; // milliseconds delay for hover out
  
  // Add refs for light animation
  const lightRef = useRef<THREE.RectAreaLight>(null);
  const lightAnimationRef = useRef<number | null>(null);
  const lightIntensityRef = useRef<number>(0);
  
  // Update hover state with delay for both hover in and out
  useEffect(() => {
    // Clear any existing timer
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    
    // Set a new timer for both hover in and out with different delays
    hoverTimerRef.current = setTimeout(() => {
      setEffectiveHoverState(isHovered);
      hoverTimerRef.current = null;
    }, isHovered ? HOVER_IN_DELAY : HOVER_OUT_DELAY);
    
    // Cleanup
    return () => {
      if (hoverTimerRef.current !== null) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, [isHovered]);

  useCursor(effectiveHoverState);

  // Use refs to track the actual DOM elements for direct manipulation
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  // Apply transitions directly when hover state changes
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    // Apply styles directly to avoid React re-renders during transition
    if (effectiveHoverState) {
      containerRef.current.style.backgroundColor = 'rgba(74, 222, 128, 0.8)';
      containerRef.current.style.transform = 'scale(1.25)';
      textRef.current.style.transform = 'scale(1.5)';
    } else {
      containerRef.current.style.backgroundColor = 'rgba(34, 197, 94, 0.8)';
      containerRef.current.style.transform = 'scale(1)';
      textRef.current.style.transform = 'scale(1)';
    }
  }, [effectiveHoverState]);

  // Animate light intensity
  useEffect(() => {
    if (!lightRef.current) return;
    
    // Cancel any ongoing animation
    if (lightAnimationRef.current !== null) {
      cancelAnimationFrame(lightAnimationRef.current);
      lightAnimationRef.current = null;
    }
    
    const targetIntensity = effectiveHoverState ? 100 : 0;
    const startIntensity = lightIntensityRef.current;
    const startTime = Date.now();
    const duration = 400; // Match the 400ms transition of other elements
    
    const animateLight = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use the same cubic-bezier timing function
      const t = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const newIntensity = startIntensity + (targetIntensity - startIntensity) * t;
      lightIntensityRef.current = newIntensity;
      
      if (lightRef.current) {
        lightRef.current.intensity = newIntensity;
      }
      
      if (progress < 1) {
        lightAnimationRef.current = requestAnimationFrame(animateLight);
      } else {
        lightAnimationRef.current = null;
      }
    };
    
    lightAnimationRef.current = requestAnimationFrame(animateLight);
    
    return () => {
      if (lightAnimationRef.current !== null) {
        cancelAnimationFrame(lightAnimationRef.current);
      }
    };
  }, [effectiveHoverState]);

  return (
    <Float
      key={poi._id}
      speed={10}
      rotationIntensity={0}
      floatIntensity={1}
      floatingRange={[-0.1, 0.1]}
    >
      <group
        position={toPosition(poi.mainSceneMarkerPosition)}
        onClick={() => handleMarkerClick(poi)}
        onPointerEnter={() => setHoveredMarkerId(poi._id)}
        onPointerLeave={() => setHoveredMarkerId(null)}
      >
        {/* Invisible hitbox to ensure consistent hover behavior */}
        <mesh 
          visible={false} 
          position={[0, 0, 0]} 
          scale={[10, 10, 10]}
          onPointerEnter={() => setHoveredMarkerId(poi._id)}
          onPointerLeave={() => setHoveredMarkerId(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        <Html transform>
          <div
            ref={containerRef}
            className="backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.8)',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              transformOrigin: 'center center',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerClick(poi);
            }}
          >
            <h3 
              ref={textRef}
              className="text-6xl text-white font-bold"
              style={{
                transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center center',
                display: 'block',
              }}
            >
              {poi.title}
            </h3>
          </div>
        </Html>
        <group position={[0, -3, 0]}>
          <rectAreaLight
            ref={lightRef}
            position={[0, 5, 40]}
            width={20}
            height={20}
            color="#36A837"
            intensity={lightIntensityRef.current}
          />
          <LogoMarker 
            isHovered={effectiveHoverState} 
            position={[0, 0, 0]}
            scale={1}
          />
        </group>
      </group>
    </Float>
  );
}

export default function LogoMarkers({ scene }: { scene: Sanity.Scene }) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const store = useStoreContext();
  const router = useRouter();
  const { camera } = useThree();

  const debugMarkerPos = useControls(
    "Main Scene Debug Marker",
    {
      markerX: { value: 0, min: -200, max: 200, step: 0.1 },
      markerY: { value: 0, min: -200, max: 200, step: 0.1 },
      markerZ: { value: 0, min: -200, max: 200, step: 0.1 },
    },
    { collapsed: true }
  );

  // Preload marker model on component mount
  useEffect(() => {
    // Force preload of marker model
    import("@/experience/sceneCollections/markers/LogoMarker").then(() => {
      console.log("Marker model preloaded");
    });
  }, []);

  const handleMarkerClick = (poi: any) => {
    if (!poi.mainSceneCameraPosition || !poi.mainSceneCameraTarget) {
      console.warn("Missing camera position or target:", poi);
      return;
    }

    // Create target vectors
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

    useCameraStore.getState().setControlType("Disabled");

    useCameraStore.getState().setPreviousCamera(targetPos, targetLookAt);

    const startTime = Date.now();
    const duration = 2000;
    const startPos = camera.position.clone();
    const startTarget = camera.position
      .clone()
      .add(camera.getWorldDirection(new Vector3()).multiplyScalar(100));

    useCameraStore.getState().setIsAnimating(true);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic easing
      const t =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newPosition = new Vector3().lerpVectors(startPos, targetPos, t);
      const newTarget = new Vector3().lerpVectors(startTarget, targetLookAt, t);

      useCameraStore.getState().syncCameraPosition(newPosition, newTarget);

      if (progress >= 1) {
        useCameraStore.getState().setIsLoading(true);

        router.push(`/experience/${poi.slug.current}`);
      } else {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <group>
      {scene.pointsOfInterest?.map((poi) => {
        if (
          "_type" in poi &&
          poi._type === "scenes" &&
          "mainSceneMarkerPosition" in poi &&
          poi.mainSceneMarkerPosition &&
          "slug" in poi
        ) {
          return (
            <PoiMarker
              key={poi._id}
              poi={poi}
              hoveredMarkerId={hoveredMarkerId}
              setHoveredMarkerId={setHoveredMarkerId}
              handleMarkerClick={handleMarkerClick}
            />
          );
        }
        return null;
      })}

      {store?.get("hidden") === false && (
        <Float
          speed={10}
          rotationIntensity={0}
          floatIntensity={1}
          floatingRange={[-0.1, 0.1]}
        >
          <group
            position={[
              debugMarkerPos.markerX,
              debugMarkerPos.markerY,
              debugMarkerPos.markerZ,
            ]}
          >
            {/* Invisible hitbox for debug marker */}
            <mesh 
              visible={false} 
              position={[0, 0, 0]} 
              scale={[10, 10, 10]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
            
            <Html transform>
              <div 
                className="backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.8)',
                  transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'center center',
                }}
              >
                <h3 
                  className="text-2xl text-white font-bold"
                  style={{
                    transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center center',
                    display: 'block',
                  }}
                >
                  Debug Marker
                </h3>
              </div>
            </Html>
            <group position={[0, -3, 0]}>
              <LogoMarker isHovered={false} position={[0, 0, 0]} scale={1} />
            </group>
          </group>
        </Float>
      )}
    </group>
  );
}
