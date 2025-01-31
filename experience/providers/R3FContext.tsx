"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";

type R3FContextType = {
  setR3FContent: (content: ReactNode) => void;
};

const R3FContext = createContext<R3FContextType | null>(null);

export function R3FProvider({ children }: { children: ReactNode }) {
  const [r3fContent, setR3FContent] = useState<ReactNode>(null);

  return (
    <R3FContext.Provider value={{ setR3FContent }}>
      {/* Regular React components here */}
      {children}

      {/* Single Canvas instance */}
      <div className="relative left-0 top-0 w-full h-screen">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>{r3fContent}</Suspense>
        </Canvas>
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
