'use client';
import { INITIAL_POSITIONS, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { createContext, ReactNode, Suspense, useContext, useMemo, useState } from 'react';
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
  const { dprFactor, declined } = usePerfStore();
  const isAnimating = useCameraStore(state => state.isAnimating);
  const isLandingAnimating = useLandingCameraStore(state => state.isAnimating);

  const dynamicDpr = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    // While the intro camera is animating, freeze DPR to a stable value derived from base
    if (isAnimating) {
      const frozen = Math.max(1, Math.min(2, base));
      return Math.round(frozen * 2) / 2; // half-step granularity
    }
    // After animation ends, allow adaptive scaling
    const scaled = base * (declined ? 0.9 : 1) * (dprFactor || 1);
    const clamped = Math.max(1, Math.min(2, scaled));
    return Math.round(clamped * 4) / 4;
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
        <div className="fixed inset-0 z-40 overflow-hidden transition-opacity duration-1000 ease-in-out">
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
              ms={200}
              iterations={3}
              factor={0.85}
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

        {/* Portal container for modals */}
        <div id="modal-portal" className="pointer-events-none fixed inset-0 z-40" />
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
