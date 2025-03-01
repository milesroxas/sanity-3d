import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Stats from "three/examples/jsm/libs/stats.module.js";

export function PerformanceMonitor() {
  const [stats] = useState(() => new Stats());

  useEffect(() => {
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // Position the stats panel in the top-right corner
    const statsDom = stats.dom;
    statsDom.style.position = "absolute";
    statsDom.style.top = "0px";
    statsDom.style.right = "0px";
    statsDom.style.left = "auto";

    return () => {
      document.body.removeChild(stats.dom);
    };
  }, [stats]);

  useFrame(() => {
    stats.update();
  });

  return null;
}
