import { BlenderExportData } from '@/experience/baseModels/shared/types';
import groundData from '@/experience/data/ground-2.json';
import { GroundInstances, GroundInstances_Blender } from '@/experience/models/GroundInstances';

export function Ground() {
  return (
    <GroundInstances useSharedMaterial={true}>
      <GroundInstances_Blender instancesData={groundData as BlenderExportData[]} />
    </GroundInstances>
  );
}
