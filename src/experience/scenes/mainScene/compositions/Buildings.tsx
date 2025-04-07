import { CompanyBldgs } from '@/experience/baseModels/buildings/CompanyBldgs';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import housesData from '@/experience/data/houses.json';
import smallBldgsData from '@/experience/data/smallBldgs.json';
import { HousesInstances, HousesInstances_Blender } from '@/experience/models/HousesInstances';
import {
  SmallBldgsInstances,
  SmallBldgsInstances_Blender,
} from '@/experience/models/SmallBldgsInstances';

export function Buildings() {
  return (
    <>
      <CompanyBldgs />

      <SmallBldgsInstances useSharedMaterial={false}>
        <SmallBldgsInstances_Blender instancesData={smallBldgsData as BlenderExportData[]} />
      </SmallBldgsInstances>

      <HousesInstances useSharedMaterial={true}>
        <HousesInstances_Blender instancesData={housesData as BlenderExportData[]} />
      </HousesInstances>
    </>
  );
}
