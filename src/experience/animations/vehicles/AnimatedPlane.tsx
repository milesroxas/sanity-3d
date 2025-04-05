import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CatmullRomCurve3, Vector3 } from 'three';
import { Plane } from './Plane';

import pathData from '@/experience/scenes/mainScene/lib/plane_1_path.json';

export function AnimatedPlane() {
  const planeRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0.39);
  const speed = 0.02;

  const { x, y, z, showPath } = useControls(
    'Plane One',
    {
      position: folder(
        {
          x: { value: -70.3, min: -100, max: 100, step: 0.1 },
          y: { value: 2.5, min: -100, max: 100, step: 0.1 },
          z: { value: 10, min: -100, max: 100, step: 0.1 },
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
    // Create points from path data
    const points = pathData.points.map(
      p =>
        new Vector3(
          p.x + positionRef.current.x,
          p.y + positionRef.current.y,
          p.z + positionRef.current.z
        )
    );

    // Create curve with more tension for smoother interpolation
    const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.1);

    // Generate more points along the curve for smoother sampling
    return {
      curve,
      length: curve.getLength(),
      points: curve.getPoints(200),
    };
  }, [x, y, z]);

  // Create these outside the useFrame callback
  const positionVec = useMemo(() => new Vector3(), []);
  const tangentVec = useMemo(() => new Vector3(), []);
  const rightVec = useMemo(() => new Vector3(), []);
  const upVec = useMemo(() => new Vector3(0, 1, 0), []);
  const worldUpVec = useMemo(() => new Vector3(0, 1, 0), []); // Stable world up vector
  const lookAtMatrix = useMemo(() => new THREE.Matrix4(), []);

  // Previous tangent for smooth transitions
  const prevTangent = useRef(new Vector3(0, 0, 1));

  useFrame((_, delta) => {
    if (!planeRef.current) return;

    // Update ref directly instead of state
    progressRef.current = (progressRef.current + delta * speed) % 1;

    // Use the ref value directly
    curve.curve.getPointAt(progressRef.current, positionVec);
    curve.curve.getTangentAt(progressRef.current, tangentVec);

    // Ensure tangent is normalized
    tangentVec.normalize();

    // Smooth transition between tangents to prevent flickering
    tangentVec.lerp(prevTangent.current, 0.8);
    tangentVec.normalize();

    // Save current tangent for next frame
    prevTangent.current.copy(tangentVec);

    // The tangent is the forward direction (Z-axis in Three.js)
    // Calculate up vector (Y-axis) - try to keep it aligned with world up when possible
    upVec.copy(worldUpVec);

    // Calculate right vector (X-axis) from forward and up
    rightVec.crossVectors(upVec, tangentVec).normalize();

    // If right vector is too small (when tangent is nearly parallel to up),
    // use a fallback direction
    if (rightVec.lengthSq() < 0.1) {
      rightVec.set(1, 0, 0);
    }

    // Recalculate up vector to ensure it's perpendicular to forward and right
    upVec.crossVectors(tangentVec, rightVec).normalize();

    // Construct rotation matrix with the correct axes for a plane
    // For a plane, we want:
    // - X-axis (right) = rightVec
    // - Y-axis (up) = upVec
    // - Z-axis (forward) = tangentVec
    lookAtMatrix.makeBasis(rightVec, upVec, tangentVec);

    planeRef.current.position.copy(positionVec);
    planeRef.current.quaternion.setFromRotationMatrix(lookAtMatrix);
  });

  return (
    <>
      <group ref={planeRef} scale={[0.25, 0.25, 0.25]}>
        <Plane />
      </group>
      {showPath && <PathVisualizer curve={curve.curve} />}
    </>
  );
}

function PathVisualizer({ curve }: { curve: CatmullRomCurve3 }) {
  const points = useMemo(() => {
    return curve.getPoints(500).map(p => [p.x, p.y, p.z] as [number, number, number]);
  }, [curve]);

  return (
    <group>
      <Line points={points} color="orange" lineWidth={2} dashed dashSize={0.5} gapSize={0.2} />
    </group>
  );
}
