import { BlenderExportData } from '@/experience/baseModels/shared/types';
import mountainData from '@/experience/data/mountains.json';
import natureData from '@/experience/data/nature.json';
import {
  MountainInstances,
  MountainInstances_Blender,
} from '@/experience/models/MountainInstances';
import { NatureInstances, NatureInstances_Blender } from '@/experience/models/NatureInstances';

export function Environment() {
  return (
    <>
      <MountainInstances useSharedMaterial={true}>
        <MountainInstances_Blender instancesData={mountainData as BlenderExportData[]} />
      </MountainInstances>

      <NatureInstances useSharedMaterial={true}>
        <NatureInstances_Blender instancesData={natureData as BlenderExportData[]} />
      </NatureInstances>
    </>
  );
}
