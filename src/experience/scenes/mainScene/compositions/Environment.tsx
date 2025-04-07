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
      intensity: { value: 1.5, min: 0, max: 5, step: 0.1 },
      shadowIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
      shadowPosition: {
        value: { x: 10, y: 20, z: 15 },
        step: 1,
      },
      lightIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
      lightPosition: {
        value: { x: 10, y: 20, z: 15 },
        step: 1,
      },
      lightScale: { value: 10, min: 1, max: 20, step: 1 },
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
          environmentControls.shadowPosition.x,
          environmentControls.shadowPosition.y,
          environmentControls.shadowPosition.z,
        ]}
        intensity={environmentControls.shadowIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-camera-left={-200}
        shadow-camera-right={200}
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
