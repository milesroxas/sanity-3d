import { PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { useLandingCameraStore } from '../store/landingCameraStore';

export function LandingCameraSystem() {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const { position, target } = useLandingCameraStore();

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[position.x, position.y, position.z]}
      lookAt={[target.x, target.y, target.z]}
    />
  );
}
