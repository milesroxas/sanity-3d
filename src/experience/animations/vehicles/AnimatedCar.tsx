import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type * as THREE from 'three';
import { CatmullRomCurve3, Vector3 } from 'three';
import { useCarControls } from './carControls';
import { CarOne } from './CarOne';

import pathData from '@/experience/scenes/mainScene/lib/car_1_path.json';

// Set this to true to enable Leva controls
const USE_LEVA_CONTROLS = false;

export function AnimatedCar() {
  const carRef = useRef<THREE.Group>(null);
  const distanceRef = useRef(0.2); // Replace state with ref
  const speed = 12; // Units per second

  // Always call the hook, but only use its result if needed
  const levaControls = useCarControls();

  // Use either Leva controls or hardcoded values
  const controls = USE_LEVA_CONTROLS
    ? levaControls
    : {
        x: -70.3,
        y: 2.5,
        z: 79.6,
        showPath: false,
        visible: true,
      };

  // Store position in a ref to avoid recalculating the curve
  const positionRef = useRef({ x: controls.x, y: controls.y, z: controls.z });

  // Only recalculate when position changes significantly
  useEffect(() => {
    if (
      Math.abs(positionRef.current.x - controls.x) > 0.1 ||
      Math.abs(positionRef.current.y - controls.y) > 0.1 ||
      Math.abs(positionRef.current.z - controls.z) > 0.1
    ) {
      positionRef.current = { x: controls.x, y: controls.y, z: controls.z };
    }
  }, [controls.x, controls.y, controls.z]);

  // Create a stable reference to the position for the curve calculation
  const stablePosition = useMemo(() => {
    return {
      x: positionRef.current.x,
      y: positionRef.current.y,
      z: positionRef.current.z,
    };
  }, [positionRef.current.x, positionRef.current.y, positionRef.current.z]);

  // Use the stable reference for the curve calculation
  const curve = useMemo(() => {
    const points = pathData.points.map(
      p => new Vector3(p.x + stablePosition.x, p.y + stablePosition.y, p.z + stablePosition.z)
    );
    const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.1);
    return {
      curve,
      length: curve.getLength(),
    };
  }, [stablePosition]);

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
    carRef.current.quaternion.setFromUnitVectors(referenceVec, tangentVec.normalize());
  });

  return (
    <>
      {controls.visible && (
        <group ref={carRef}>
          <CarOne />
        </group>
      )}
      {controls.showPath && <PathVisualizer curve={curve.curve} />}
    </>
  );
}

function PathVisualizer({ curve }: { curve: CatmullRomCurve3 }) {
  const points = useMemo(
    () => curve.getPoints(500).map(p => [p.x, p.y, p.z] as [number, number, number]),
    [curve]
  );

  return <Line points={points} color="orange" lineWidth={2} dashed dashSize={0.5} gapSize={0.2} />;
}
