import { vehicles } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import mountainData from '@/experience/data/intro-mountain.json';
import { AnimatedClouds } from '@/experience/effects/components/Clouds';
import {
  MountainInstances,
  MountainInstances_Blender,
} from '@/experience/models/MountainInstances';

import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { DesertModels } from '@/experience/scenes/landing/compositions/DesertModels';
import { StreetProps } from '@/experience/scenes/landing/compositions/StreetProps';
import { Environment as DreiEnvironment, useTexture } from '@react-three/drei';
import { useControls } from 'leva';
import { IntroGrass } from './IntroGrass';
import { IntroGroundPlane } from './IntroGroundPlane';

import { Effects } from './Effects';

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
    'landingEnvironment',
    {
      useCustomHDR: { value: true },
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
      blur: { value: 0.3, min: 0, max: 1, step: 0.1 },
      intensity: { value: 0.3, min: 0, max: 5, step: 0.1 },
      lightIntensity: { value: 3, min: 0, max: 10, step: 0.1 },
      lightPosition: {
        value: { x: 10, y: 20, z: 15 },
        step: 1,
      },
    },
    { collapsed: true }
  );

  const grassPosition = useControls('Intro Grass', {
    x: { value: 0, min: -500, max: 500, step: 0.1 },
    y: { value: 0, min: -10, max: 10, step: 0.01 },
    z: { value: 0, min: -500, max: 500, step: 0.1 },
  });

  return (
    <>
      <DreiEnvironment
        {...(environmentControls.useCustomHDR
          ? { files: '/textures/desert-clear-sky.hdr' }
          : { preset: environmentControls.preset })}
        background={environmentControls.background}
        backgroundBlurriness={environmentControls.blur}
        environmentIntensity={environmentControls.intensity}
      />

      <Effects />

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

      <StreetProps />

      <group position={[grassPosition.x, grassPosition.y, grassPosition.z]}>
        <IntroGrass />
      </group>

      <IntroGroundPlane />
    </>
  );
}

// Preload the HDR texture for better performance
useTexture.preload('/textures/desert-clear-sky.hdr');
