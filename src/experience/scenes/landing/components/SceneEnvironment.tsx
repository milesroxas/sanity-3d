import { BlenderExportData } from '@/experience/baseModels/shared/types';
import mountainData from '@/experience/data/intro-mountain.json';
import {
  MountainInstances,
  MountainInstances_Blender,
} from '@/experience/models/MountainInstances';
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
      <MountainInstances useSharedMaterial={true}>
        <MountainInstances_Blender instancesData={mountainData as BlenderExportData[]} />
      </MountainInstances>
    </>
  );
}
