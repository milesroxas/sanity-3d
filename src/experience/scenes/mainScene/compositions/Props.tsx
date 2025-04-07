import { Billboard } from '@/experience/baseModels/objects/Billboard';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import fencesData from '@/experience/data/fences.json';
import festivalData from '@/experience/data/festival.json';
import streetPropsData from '@/experience/data/street-props.json';
import { FencesInstances, FencesInstances_Blender } from '@/experience/models/FencesInstances';
import {
  FestivalInstances,
  FestivalInstances_Blender,
} from '@/experience/models/FestivalInstances';
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

      <FestivalInstances useSharedMaterial={true}>
        <FestivalInstances_Blender instancesData={festivalData as BlenderExportData[]} />
      </FestivalInstances>

      <Billboard position={[21.090677, 3.260143, -0.0]} />
    </>
  );
}
