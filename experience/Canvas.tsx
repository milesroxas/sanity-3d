"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import { Html } from "@react-three/drei";
import { Leva } from "leva";
import { ReactNode, Suspense, useEffect } from "react";

export default function Experience({ children }: { children: ReactNode }) {
  const { setR3FContent } = useR3F();

  useEffect(() => {
    setR3FContent(
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense
          fallback={
            <Html>
              <div>Loading...</div>
            </Html>
          }
        >
          {children}
        </Suspense>
      </>
    );

    // Cleanup when component unmounts
    return () => setR3FContent(null);
  }, [setR3FContent, children]);

  return <Leva hidden={process.env.NODE_ENV === "production"} />;
}
