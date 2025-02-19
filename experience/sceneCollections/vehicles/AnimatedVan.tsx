import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { CarOne } from "./CarOne";
import { folder, useControls } from "leva";
import { Line } from "@react-three/drei";

import pathData from "@/experience/scenes/mainScene/lib/van_1_path.json";
import { VanOne } from "./VanOne";

export function AnimatedVan() {
  const vanRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0.8);
  const speed = 0.05;

  const { x, y, z, showPath } = useControls(
    "Van One",
    {
      position: folder(
        {
          x: { value: 0, min: -100, max: 100, step: 0.1 },
          y: { value: 2.5, min: -100, max: 100, step: 0.1 },
          z: { value: 69.8, min: -100, max: 100, step: 0.1 },
          showPath: { value: false, label: "Show Path" },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const curve = useMemo(() => {
    // Create points from path data
    const points = pathData.points.map(
      (p) => new Vector3(p.x + x, p.y + y, p.z + z)
    );

    // Create curve with more tension for smoother interpolation
    const curve = new CatmullRomCurve3(points, false, "centripetal", 0.5);

    // Generate more points along the curve for smoother sampling
    return {
      curve,
      length: curve.getLength(),
      points: curve.getPoints(1000),
    };
  }, [x, y, z]);

  useFrame((_, delta) => {
    if (!vanRef.current) return;

    // Calculate new progress based on actual distance along curve
    const distanceToMove = delta * speed * curve.length;
    const newProgress = (progress + distanceToMove / curve.length) % 1;
    setProgress(newProgress);

    const position = curve.curve.getPoint(newProgress);
    const tangent = curve.curve.getTangent(newProgress);

    vanRef.current.position.copy(position);
    vanRef.current.quaternion.setFromUnitVectors(
      new Vector3(0, 0, 1),
      tangent.normalize()
    );
  });

  return (
    <>
      <group ref={vanRef}>
        <VanOne />
      </group>
      {showPath && <PathVisualizer curve={curve.curve} />}
    </>
  );
}

function PathVisualizer({ curve }: { curve: CatmullRomCurve3 }) {
  const points = useMemo(() => {
    return curve
      .getPoints(500)
      .map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [curve]);

  return (
    <group>
      <Line
        points={points}
        color="orange"
        lineWidth={2}
        dashed
        dashSize={0.5}
        gapSize={0.2}
      />
    </group>
  );
}
