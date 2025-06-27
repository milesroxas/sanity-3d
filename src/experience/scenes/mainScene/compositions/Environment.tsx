import { BlenderExportData } from '@/experience/baseModels/shared/types';
import mountainData from '@/experience/data/mountains.json';
import natureData from '@/experience/data/nature.json';
import {
  MountainInstances,
  MountainInstances_Blender,
} from '@/experience/models/MountainInstances';
import { NatureInstances, NatureInstances_Blender } from '@/experience/models/NatureInstances';
import { Environment as DreiEnvironment } from '@react-three/drei';
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

export function Environment() {
  const environmentControls = useControls(
    'mainSceneEnvironment',
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
      blur: { value: 0.9, min: 0, max: 1, step: 0.1 },
      intensity: { value: 1, min: 0, max: 5, step: 0.1 },
      lightIntensity: { value: 3, min: 0, max: 20, step: 0.1 },
      lightPosition: {
        value: { x: 10, y: 20, z: 10 },
        step: 1,
      },
    },
    { collapsed: true }
  );

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
      <directionalLight
        position={[
          environmentControls.lightPosition.x,
          environmentControls.lightPosition.y,
          environmentControls.lightPosition.z,
        ]}
        intensity={environmentControls.lightIntensity}
      />
      <MountainInstances useSharedMaterial={true}>
        <MountainInstances_Blender instancesData={mountainData as BlenderExportData[]} />
      </MountainInstances>

      <NatureInstances useSharedMaterial={true}>
        <NatureInstances_Blender instancesData={natureData as BlenderExportData[]} />
      </NatureInstances>
    </>
  );
}
