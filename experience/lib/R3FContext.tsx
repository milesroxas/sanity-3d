// contexts/R3FContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

type R3FContextType = {
  setR3FContent: (content: ReactNode) => void;
};

const R3FContext = createContext<R3FContextType | null>(null);

export function R3FProvider({ children }: { children: ReactNode }) {
  const [r3fContent, setR3FContent] = useState<ReactNode>(null);

  return (
    <R3FContext.Provider value={{ setR3FContent }}>
      <Canvas>{r3fContent}</Canvas>
      {children}
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
