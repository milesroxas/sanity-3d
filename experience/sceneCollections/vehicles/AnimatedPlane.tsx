import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { Plane } from "./Plane";
import { folder, useControls } from "leva";
import { Line } from "@react-three/drei";

import pathData from "@/experience/scenes/mainScene/lib/plane_1_path.json";

export function AnimatedPlane() {
  const planeRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0.8);
  const speed = 0.02;

  const { x, y, z, showPath } = useControls(
    "Plane One",
    {
      position: folder(
        {
          x: { value: -70.3, min: -100, max: 100, step: 0.1 },
          y: { value: 2.5, min: -100, max: 100, step: 0.1 },
          z: { value: 10, min: -100, max: 100, step: 0.1 },
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
    const curve = new CatmullRomCurve3(points, false, "centripetal", 0.1);

    // Generate more points along the curve for smoother sampling
    return {
      curve,
      length: curve.getLength(),
      points: curve.getPoints(1000),
    };
  }, [x, y, z]);

  useFrame((_, delta) => {
    if (!planeRef.current) return;

    // Calculate new progress based on actual distance along curve
    const distanceToMove = delta * speed * curve.length;
    const newProgress = (progress + distanceToMove / curve.length) % 1;
    setProgress(newProgress);

    const position = curve.curve.getPoint(newProgress);
    const tangent = curve.curve.getTangent(newProgress);

    // Create a matrix to orient the plane
    const matrix = new THREE.Matrix4();
    const up = new Vector3(0, 0, 1); // Keep the plane level
    const axis = new Vector3().crossVectors(up, tangent).normalize();
    const radians = Math.acos(up.dot(tangent));

    matrix.makeRotationAxis(axis, radians);

    planeRef.current.position.copy(position);
    planeRef.current.quaternion.setFromRotationMatrix(matrix);
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
