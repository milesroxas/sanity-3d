import { Billboard } from '@/experience/baseModels/objects/Billboard';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import fencesData from '@/experience/data/fences.json';
import ScenePropsData from '@/experience/data/scene-props.json';
import streetPropsData from '@/experience/data/street-props.json';
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
      <FencesInstances useSharedMaterial={true}>
        <FencesInstances_Blender instancesData={fencesData as BlenderExportData[]} />
      </FencesInstances>

      <StreetPropsInstances useSharedMaterial={true}>
        <StreetPropsInstances_Blender instancesData={streetPropsData as BlenderExportData[]} />
      </StreetPropsInstances>

      <ScenePropsInstances useSharedMaterial={true}>
        <ScenePropsInstances_Blender instancesData={ScenePropsData as BlenderExportData[]} />
      </ScenePropsInstances>

      <Billboard />
    </>
  );
}
