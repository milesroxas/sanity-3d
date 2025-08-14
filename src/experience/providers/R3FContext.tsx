'use client';
import { INITIAL_POSITIONS, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  createContext,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { Loading } from '../components/Loading';
import { useLandingCameraStore } from '../scenes/landing/store/landingCameraStore';
import { usePerfStore } from '../scenes/store/perfStore';

type R3FContextType = {
  setR3FContent: (content: ReactNode) => void;
};

const R3FContext = createContext<R3FContextType | null>(null);

export function R3FProvider({ children }: { children: ReactNode }) {
  const [r3fContent, setR3FContent] = useState<ReactNode>(null);
  const { dprFactor, declined, reset } = usePerfStore();
  const isAnimating = useCameraStore(state => state.isAnimating);
  const isLandingAnimating = useLandingCameraStore(state => state.isAnimating);

  // Cleanup performance store on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Ref to track stable DPR and prevent oscillation
  const stableDprRef = useRef<number>(
    typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  );
  const lastStableDprUpdateRef = useRef<number>(0);

  const dynamicDpr = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const now = Date.now();

    // While any camera is animating, use a completely stable DPR to prevent jitter
    if (isAnimating || isLandingAnimating) {
      // Use a cached stable value based on device capabilities
      const frozen = Math.max(1, Math.min(2, base));
      const stabilized = Math.round(frozen * 2) / 2; // half-step granularity
      stableDprRef.current = stabilized;
      lastStableDprUpdateRef.current = now;
      return stabilized;
    }

    // Apply hysteresis: only update if enough time has passed since last animation
    const timeSinceLastUpdate = now - lastStableDprUpdateRef.current;
    if (timeSinceLastUpdate < 3000) {
      // 3 second cooldown after animations
      return stableDprRef.current;
    }

    // Calculate new DPR with performance factors
    const perfMultiplier = declined ? 0.85 : 1; // Less aggressive reduction
    const factorMultiplier = Math.max(0.75, Math.min(1.1, dprFactor)); // Constrain factor range
    const scaled = base * perfMultiplier * factorMultiplier;
    const clamped = Math.max(1, Math.min(2, scaled));
    const rounded = Math.round(clamped * 4) / 4; // quarter-step granularity

    // Only update stable ref if the change is significant (hysteresis)
    const change = Math.abs(rounded - stableDprRef.current);
    if (change > 0.2) {
      stableDprRef.current = rounded;
      lastStableDprUpdateRef.current = now;
    }

    return stableDprRef.current;
  }, [dprFactor, declined, isAnimating, isLandingAnimating]);

  return (
    <R3FContext.Provider
      value={{
        setR3FContent,
      }}
    >
      <div className="relative h-full w-full">
        {/* Regular React components in a properly constrained container */}
        <div className="absolute z-50 mx-auto">{children}</div>

        {/* Canvas positioned behind the UI */}
        <div 
          className="fixed inset-0 z-40 overflow-hidden transition-opacity duration-1000 ease-in-out"
          data-r3f-container
        >
          <Loading />
          <Canvas
            dpr={dynamicDpr}
            camera={{
              position: [
                INITIAL_POSITIONS.mainIntro.position.x,
                INITIAL_POSITIONS.mainIntro.position.y,
                INITIAL_POSITIONS.mainIntro.position.z,
              ],
              far: 1000,
            }}
            onCreated={({ gl, camera }) => {
              // Renderer quality settings to reduce aliasing/banding while keeping perf reasonable
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              (gl as any).outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMappingExposure = 1.0;
              (gl as any).physicallyCorrectLights = true;
              // Increase default texture anisotropy for crisper textures at oblique angles
              THREE.Texture.DEFAULT_ANISOTROPY = gl.capabilities.getMaxAnisotropy();

              camera.position.set(
                INITIAL_POSITIONS.mainIntro.position.x,
                INITIAL_POSITIONS.mainIntro.position.y,
                INITIAL_POSITIONS.mainIntro.position.z
              );
              camera.lookAt(
                INITIAL_POSITIONS.mainIntro.target.x,
                INITIAL_POSITIONS.mainIntro.target.y,
                INITIAL_POSITIONS.mainIntro.target.z
              );
            }}
            gl={{
              antialias: false,
              powerPreference: 'high-performance',
            }}
          >
            <PerformanceMonitor
              ms={1000}
              iterations={5}
              factor={0.9}
              onDecline={() => usePerfStore.getState().setDeclined(true)}
              onIncline={() => usePerfStore.getState().setDeclined(false)}
              onChange={({ factor }) => usePerfStore.getState().setDprFactor(factor)}
            >
              {/* Avoid AdaptiveDpr to prevent DPR oscillation; DPR handled via dynamicDpr */}
              <AdaptiveEvents />
              <Suspense fallback={null}>{r3fContent}</Suspense>
            </PerformanceMonitor>
          </Canvas>
        </div>
      </div>
    </R3FContext.Provider>
  );
}

export function useR3F() {
  const context = useContext(R3FContext);
  if (!context) {
    throw new Error('useR3F must be used within an R3FProvider');
  }
  return context;
}
