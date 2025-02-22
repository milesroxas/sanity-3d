"use client";

import SubSceneUI from "./SubSceneUI";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function SubSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Force dark theme when component mounts
    setTheme("dark");

    // Store the previous theme
    const previousTheme = localStorage.getItem("theme") || "system";

    return () => {
      // Restore previous theme when component unmounts
      setTheme(previousTheme);
    };
  }, [setTheme]);

  return <SubSceneUI scene={scene} />;
}
