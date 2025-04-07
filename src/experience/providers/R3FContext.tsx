'use client';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { createContext, ReactNode, Suspense, useContext, useState } from 'react';
import { Loading } from '../components/Loading';

type R3FContextType = {
  setR3FContent: (content: ReactNode) => void;
};

const R3FContext = createContext<R3FContextType | null>(null);

export function R3FProvider({ children }: { children: ReactNode }) {
  const [r3fContent, setR3FContent] = useState<ReactNode>(null);
  const environmentControls = useControls(
    'Environment',
    {
      preset: {
        value: 'sunset',
        options: [
          'sunset',
          'dawn',
          'night',
          'warehouse',
          'forest',
          'apartment',
          'studio',
          'city',
          'park',
          'lobby',
        ],
      },
      background: { value: true },
      blur: { value: 0.9, min: 0, max: 1, step: 0.1 },
      intensity: { value: 1.5, min: 0, max: 5, step: 0.1 },
    },
    { collapsed: true }
  );
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
        <div className="fixed inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out">
          <Loading />
          <Canvas shadows="soft">
            <Environment
              preset={'sunset'}
              background={environmentControls.background}
              backgroundBlurriness={environmentControls.blur}
              environmentIntensity={environmentControls.intensity}
            />
            <Suspense>{r3fContent}</Suspense>
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
