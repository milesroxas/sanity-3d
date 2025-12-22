import { Billboard } from '@/experience/baseModels/objects/Billboard';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import fencesData from '@/experience/data/fences.json';
import ScenePropsData from '@/experience/data/scene-props-2.json';
import streetPropsData from '@/experience/data/street-props-2.json';
import { FencesInstances, FencesInstances_Blender } from '@/experience/models/FencesInstances';
import {
  ScenePropsInstances,
  ScenePropsInstances_Blender,
} from '@/experience/models/ScenePropsInstances';
import {
  StreetPropsInstances,
  StreetPropsInstances_Blender,
} from '@/experience/models/StreetPropsInstances';

export function Props() {
  return (
    <>
      {/* Fences */}
      <FencesInstances useSharedMaterial={true} category="props">
        <FencesInstances_Blender instancesData={fencesData as BlenderExportData[]} />
      </FencesInstances>

      {/* Street props */}
      <StreetPropsInstances useSharedMaterial={true} category="props">
        <StreetPropsInstances_Blender instancesData={streetPropsData as BlenderExportData[]} />
      </StreetPropsInstances>

      {/* Scene props */}
      <ScenePropsInstances useSharedMaterial={true} category="props">
        <ScenePropsInstances_Blender instancesData={ScenePropsData as BlenderExportData[]} />
      </ScenePropsInstances>

      <Billboard />
    </>
  );
}
