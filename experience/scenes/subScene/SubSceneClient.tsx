"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import { useEffect } from "react";
import SubScene from "./SubScene";
import SubSceneUI from "./SubSceneUI";

export default function SubSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();

  useEffect(() => {
    // Only set the R3F content (SubScene)
    setR3FContent(<SubScene scene={scene} />);
    return () => setR3FContent(null);
  }, [setR3FContent, scene]);

  // Return the UI component separately
  return <SubSceneUI scene={scene} />;
}
