"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import MainScene from "@/experience/scenes/mainScene/MainScene";
import { useEffect } from "react";

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();

  useEffect(() => {
    setR3FContent(<MainScene scene={scene} />);
    return () => setR3FContent(null);
  }, [setR3FContent, scene]);

  return null; // All R3F content is handled through context
}
