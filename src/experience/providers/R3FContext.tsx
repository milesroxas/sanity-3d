'use client';
import { PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { createContext, ReactNode, Suspense, useContext, useState } from 'react';
import { Loading } from '../components/Loading';
import { usePerfStore } from '../scenes/store/perfStore';

type R3FContextType = {
  setR3FContent: (content: ReactNode) => void;
};

const R3FContext = createContext<R3FContextType | null>(null);

export function R3FProvider({ children }: { children: ReactNode }) {
  const [r3fContent, setR3FContent] = useState<ReactNode>(null);

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
            camera={{ far: 1000 }}
            gl={{
              antialias: true,
            }}
          >
            <PerformanceMonitor
              onDecline={() => usePerfStore.getState().setDeclined(true)}
              onIncline={() => usePerfStore.getState().setDeclined(false)}
              onChange={({ factor }) => usePerfStore.getState().setDprFactor(factor)}
            >
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
