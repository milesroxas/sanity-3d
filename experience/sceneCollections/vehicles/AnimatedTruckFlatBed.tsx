import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import type * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { TruckFlatBed } from "./TruckFlatBed";
import { folder, useControls } from "leva";
import { Line } from "@react-three/drei";

import pathData from "@/experience/scenes/mainScene/lib/truck_flatbed_path.json";

export function AnimatedTruckFlatBed() {
  const carRef = useRef<THREE.Group>(null);
  const distanceRef = useRef(0); // Replace state with ref
  const speed = 15; // Units per second

  const { x, y, z, showPath } = useControls(
    "Truck Flatbed",
    {
      position: folder(
        {
          x: { value: 0.0, min: -100, max: 100, step: 0.1 },
          y: { value: 2.8, min: -100, max: 100, step: 0.1 },
          z: { value: -16.3, min: -100, max: 100, step: 0.1 },
          showPath: { value: false, label: "Show Path" },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  // Store position in a ref to avoid recalculating the curve
  const positionRef = useRef({ x, y, z });

  // Only recalculate when position changes significantly
  useEffect(() => {
    if (
      Math.abs(positionRef.current.x - x) > 0.1 ||
      Math.abs(positionRef.current.y - y) > 0.1 ||
      Math.abs(positionRef.current.z - z) > 0.1
    ) {
      positionRef.current = { x, y, z };
    }
  }, [x, y, z]);

  const curve = useMemo(() => {
    const points = pathData.points.map(
      (p) =>
        new Vector3(
          p.x + positionRef.current.x,
          p.y + positionRef.current.y,
          p.z + positionRef.current.z
        )
    );
    const curve = new CatmullRomCurve3(points, false, "centripetal", 0.1);
    return {
      curve,
      length: curve.getLength(),
    };
  }, [positionRef.current.x, positionRef.current.y, positionRef.current.z]);

  // Create reusable vector objects
  const positionVec = useMemo(() => new Vector3(), []);
  const tangentVec = useMemo(() => new Vector3(), []);
  const referenceVec = useMemo(() => new Vector3(0, 0, 1), []);

  useFrame((_, delta) => {
    if (!carRef.current) return;

    // Update distance ref directly - no state updates
    distanceRef.current = (distanceRef.current + speed * delta) % curve.length;

    // Get position at current distance
    const progress = distanceRef.current / curve.length;

    // Use the reusable vectors
    curve.curve.getPointAt(progress, positionVec);
    curve.curve.getTangentAt(progress, tangentVec);

    carRef.current.position.copy(positionVec);
    carRef.current.quaternion.setFromUnitVectors(
      referenceVec,
      tangentVec.normalize()
    );
  });

  return (
    <>
      <group ref={carRef}>
        <TruckFlatBed />
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
