"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Suspense,
  useEffect,
} from "react";
import { Canvas } from "@react-three/fiber";

type R3FContextType = {
  setR3FContent: (content: ReactNode) => void;
  setAssetsLoaded: (loaded: boolean) => void;
  assetsLoaded: boolean;
  canvasOpacity: number;
};

const R3FContext = createContext<R3FContextType | null>(null);

export function R3FProvider({ children }: { children: ReactNode }) {
  const [r3fContent, setR3FContent] = useState<ReactNode>(null);
  const [canvasOpacity, setCanvasOpacity] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Control canvas visibility based on assets being loaded
  useEffect(() => {
    if (assetsLoaded) {
      // Start fade-in once assets are loaded with a short delay
      const timer = setTimeout(() => {
        console.log("Starting canvas fade-in");
        setCanvasOpacity(1);
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      // When assets aren't loaded, ensure canvas is hidden
      setCanvasOpacity(0);
    }
  }, [assetsLoaded]);

  return (
    <R3FContext.Provider value={{ 
      setR3FContent, 
      setAssetsLoaded, 
      assetsLoaded, 
      canvasOpacity 
    }}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Regular React components in a properly constrained container */}
        <div className="absolute mx-auto z-50">
          {children}
        </div>

        {/* Canvas positioned behind the UI */}
        <div 
          className="fixed inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out"
          style={{ 
            opacity: canvasOpacity, 
            pointerEvents: canvasOpacity > 0.5 ? 'auto' : 'none'  // Increased threshold for pointer events
          }}
        >
          <Canvas shadows="soft">
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
