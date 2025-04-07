'use client';
import { Canvas } from '@react-three/fiber';
import { createContext, ReactNode, Suspense, useContext, useState } from 'react';
import { Loading } from '../components/Loading';

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
        <div className="fixed inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out">
          <Loading />
          <Canvas shadows="soft">
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
