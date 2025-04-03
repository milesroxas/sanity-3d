import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import type * as THREE from 'three';
import { CatmullRomCurve3, Vector3 } from 'three';
import { folder, useControls } from 'leva';
import { Line } from '@react-three/drei';

import pathData from '@/experience/scenes/mainScene/lib/van_1_path.json';
import { PatrolCar } from './PatrolCar';

export function AnimatedPatrolTwo() {
  const patrolRef = useRef<THREE.Group>(null);
  // Change starting position to 0.3 = 30% along the path
  const distanceRef = useRef(0.3); // Value between 0 and 1 representing position along the path
  const speed = 14; // Units per second

  const { x, y, z, showPath } = useControls(
    'Patrol Two',
    {
      position: folder(
        {
          x: { value: 0, min: -100, max: 100, step: 0.1 },
          y: { value: 2.5, min: -100, max: 100, step: 0.1 },
          z: { value: 69.8, min: -100, max: 100, step: 0.1 },
          showPath: { value: false, label: 'Show Path' },
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
      p =>
        new Vector3(
          p.x + positionRef.current.x,
          p.y + positionRef.current.y,
          p.z + positionRef.current.z
        )
    );
    const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.5);
    return {
      curve,
      length: curve.getLength(),
    };
  }, [x, y, z]); // Fixed dependency array to properly track position changes

  // Create reusable vector objects
  const positionVec = useMemo(() => new Vector3(), []);
  const tangentVec = useMemo(() => new Vector3(), []);
  const referenceVec = useMemo(() => new Vector3(0, 0, 1), []);

  useFrame((_, delta) => {
    if (!patrolRef.current) return;

    // Update distance ref directly - no state updates
    distanceRef.current = (distanceRef.current + speed * delta) % curve.length;

    // Get position at current distance
    const progress = distanceRef.current / curve.length;

    // Use the reusable vectors
    curve.curve.getPointAt(progress, positionVec);
    curve.curve.getTangentAt(progress, tangentVec);

    patrolRef.current.position.copy(positionVec);
    patrolRef.current.quaternion.setFromUnitVectors(referenceVec, tangentVec.normalize());
  });

  return (
    <>
      <group ref={patrolRef}>
        <PatrolCar />
      </group>
      {showPath && <PathVisualizer curve={curve.curve} />}
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
