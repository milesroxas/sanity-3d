"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import { useEffect } from "react";
import SubSceneUI from "./SubSceneUI";

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();

  useEffect(() => {
    setR3FContent(<SubSceneUI scene={scene} />);
    return () => setR3FContent(null);
  }, [setR3FContent, scene]);

  return null; // All R3F content is handled through context
}
