import { vehicles } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import mountainData from '@/experience/data/intro-mountain.json';
import { AnimatedClouds } from '@/experience/effects/components/Clouds';
import {
  MountainInstances,
  MountainInstances_Blender,
} from '@/experience/models/MountainInstances';
import { Ground } from '@/experience/scenes/landing/compositions/Ground';

import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { DesertModels } from '@/experience/scenes/landing/compositions/DesertModels';
import { Environment as DreiEnvironment, Effects } from '@react-three/drei';
import { useControls } from 'leva';

type EnvironmentPreset =
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'forest'
  | 'apartment'
  | 'studio'
  | 'city'
  | 'park'
  | 'lobby';

export function SceneEnvironment() {
  const environmentControls = useControls(
    'Environment',
    {
      preset: {
        value: 'sunset' as EnvironmentPreset,
        options: [
          'sunset',
          'dawn',
          'night',
          'warehouse',
          'forest',
          'apartment',
          'studio',
          'city',
          'park',
          'lobby',
        ] as EnvironmentPreset[],
      },
      background: { value: true },
      blur: { value: 0.9, min: 0, max: 1, step: 0.1 },
      intensity: { value: 1.2, min: 0, max: 5, step: 0.1 },
      lightIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
      lightPosition: {
        value: { x: 10, y: 20, z: 15 },
        step: 1,
      },
    },
    { collapsed: true }
  );

  return (
    <>
      <Effects />

      <ambientLight intensity={0.05} />

      <DreiEnvironment
        preset={environmentControls.preset}
        background={environmentControls.background}
        backgroundBlurriness={environmentControls.blur}
        environmentIntensity={environmentControls.intensity}
      />

      <directionalLight
        position={[
          environmentControls.lightPosition.x,
          environmentControls.lightPosition.y,
          environmentControls.lightPosition.z,
        ]}
        intensity={environmentControls.lightIntensity}
      />

      <AnimatedClouds />

      <VehiclesInstances useSharedMaterial={false}>
        <vehicles.AnimatedPlane pathOffset={0.85} scale={0.3} />
      </VehiclesInstances>

      <DesertModels />

      <MountainInstances useSharedMaterial={true}>
        <MountainInstances_Blender instancesData={mountainData as BlenderExportData[]} />
      </MountainInstances>

      <Ground />
      <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#DCBF9A" transparent opacity={1} />
      </mesh>
    </>
  );
}
