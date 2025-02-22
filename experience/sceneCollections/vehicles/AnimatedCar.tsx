import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { CarOne } from "./CarOne";
import { folder, useControls } from "leva";
import { Line } from "@react-three/drei";

import pathData from "@/experience/scenes/mainScene/lib/car_1_path.json";

export function AnimatedCar() {
  const carRef = useRef<THREE.Group>(null);

  const speed = 15; // Units per second

  const { x, y, z, showPath } = useControls(
    "Car One",
    {
      position: folder(
        {
          x: { value: -70.3, min: -100, max: 100, step: 0.1 },
          y: { value: 2.5, min: -100, max: 100, step: 0.1 },
          z: { value: 79.6, min: -100, max: 100, step: 0.1 },
          showPath: { value: false, label: "Show Path" },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const curve = useMemo(() => {
    const points = pathData.points.map(
      (p) => new Vector3(p.x + x, p.y + y, p.z + z)
    );
    const curve = new CatmullRomCurve3(points, false, "centripetal", 0.1);
    return {
      curve,
      length: curve.getLength(),
    };
  }, [x, y, z]);
  const [distance, setDistance] = useState(curve.length * 0.2);

  useFrame((_, delta) => {
    if (!carRef.current) return;

    // Update distance based on speed
    const newDistance = (distance + speed * delta) % curve.length;
    setDistance(newDistance);

    // Get position at current distance
    const progress = newDistance / curve.length;
    const position = curve.curve.getPointAt(progress);
    const tangent = curve.curve.getTangentAt(progress);

    carRef.current.position.copy(position);
    carRef.current.quaternion.setFromUnitVectors(
      new Vector3(0, 0, 1),
      tangent.normalize()
    );
  });

  return (
    <>
      <group ref={carRef}>
        <CarOne />
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
