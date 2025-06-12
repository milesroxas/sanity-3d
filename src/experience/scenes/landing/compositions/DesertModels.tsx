import { BlenderExportData } from '@/experience/baseModels/shared/types';
import natureData from '@/experience/data/intro-nature.json';
import { NatureInstances, NatureInstances_Blender } from '@/experience/models/NatureInstances';

export function DesertModels() {
  return (
    <group>
      <NatureInstances useSharedMaterial={true}>
        <NatureInstances_Blender instancesData={natureData as BlenderExportData[]} />
      </NatureInstances>
    </group>
  );
}
