import { useStreetPropsInstances } from '@/experience/models/StreetPropsInstances';
import { Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AnimatedWindmillPropellerProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  rotationSpeed?: number;
}

export function AnimatedWindmillPropeller({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  rotationSpeed = 0.8,
}: AnimatedWindmillPropellerProps) {
  const propellerRef = useRef<THREE.Group>(null);
  const streetProps = useStreetPropsInstances();
  const WindmillPropeller = streetProps['windmill-propeller'];

  // Create a unique phase offset for each instance (0–2π)
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (propellerRef.current) {
      // Add the offset to desynchronize each propeller
      propellerRef.current.rotation.z = (t + offset) * rotationSpeed;
    }
  });

  return (
    <WindmillPropeller>
      <group ref={propellerRef} position={position} rotation={rotation} scale={scale}>
        <Instance />
      </group>
    </WindmillPropeller>
  );
}
