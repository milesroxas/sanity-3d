import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import type * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { folder, useControls } from "leva";
import { Line } from "@react-three/drei";

import pathData from "@/experience/scenes/mainScene/lib/tractor_1_path.json";
import { TractorOne } from "./TractorOne";

export function AnimatedTractor() {
  const tractorRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const speed = 0.03;

  const { x, y, z, showPath } = useControls(
    "Tractor",
    {
      position: folder(
        {
          x: { value: -127.5, min: -300, max: 300, step: 0.1 },
          y: { value: 3.0, min: -300, max: 300, step: 0.1 },
          z: { value: 58.4, min: -300, max: 300, step: 0.1 },
        },
        { collapsed: true }
      ),
      showPath: { value: false, label: "Show Path" },
    },
    { collapsed: true }
  );

  const positionRef = useRef({ x, y, z });

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

    const curve = new CatmullRomCurve3(points, false, "centripetal", 0.5);

    return {
      curve,
      length: curve.getLength(),
      points: curve.getPoints(1000),
    };
  }, [positionRef.current.x, positionRef.current.y, positionRef.current.z]);

  const positionVec = useMemo(() => new Vector3(), []);
  const tangentVec = useMemo(() => new Vector3(), []);
  const referenceVec = useMemo(() => new Vector3(0, 0, 1), []);

  useFrame((_, delta) => {
    if (!tractorRef.current) return;

    progressRef.current = (progressRef.current + delta * speed) % 1;

    curve.curve.getPointAt(progressRef.current, positionVec);
    curve.curve.getTangentAt(progressRef.current, tangentVec);

    tractorRef.current.position.copy(positionVec);
    tractorRef.current.quaternion.setFromUnitVectors(
      referenceVec,
      tangentVec.normalize()
    );
  });

  return (
    <>
      <group ref={tractorRef}>
        <TractorOne />
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
