"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Loading } from "../scenes/components/Loading";

type R3FContextType = {
  setR3FContent: (content: ReactNode) => void;
};

const R3FContext = createContext<R3FContextType | null>(null);

export function R3FProvider({ children }: { children: ReactNode }) {
  const [r3fContent, setR3FContent] = useState<ReactNode>(null);

  return (
    <R3FContext.Provider value={{ setR3FContent }}>
      <div className="relative w-full h-full">
        {/* Regular React components in a properly constrained container */}
        <div className="absolute mx-auto z-50">
          <Loading />
          {children}
        </div>

        {/* Canvas positioned behind the UI */}
        <div className="fixed inset-0">
          <Canvas shadows>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>{r3fContent}</Suspense>
          </Canvas>
        </div>
      </div>
    </R3FContext.Provider>
  );
}

export function useR3F() {
  const context = useContext(R3FContext);
  if (!context) {
    throw new Error("useR3F must be used within an R3FProvider");
  }
  return context;
}
