import { CompanyBldgs } from '@/experience/baseModels/buildings/CompanyBldgs';
import { FestivalBuildings } from '@/experience/baseModels/buildings/FestivalBuildings';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import cityBldgsData from '@/experience/data/city-buildings.json';
import constructionData from '@/experience/data/construction.json';
import housesData from '@/experience/data/houses.json';
import smallBldgsData from '@/experience/data/smallBldgs.json';
import {
  CityBldgsInstances,
  CityBldgsInstances_Blender,
} from '@/experience/models/CityBldgsInstances';
import {
  ConstructionInstances,
  ConstructionInstances_Blender,
} from '@/experience/models/ConstructionInstances';
import { HousesInstances, HousesInstances_Blender } from '@/experience/models/HousesInstances';
import {
  SmallBldgsInstances,
  SmallBldgsInstances_Blender,
} from '@/experience/models/SmallBldgsInstances';

export function Buildings() {
  return (
    <>
      <SmallBldgsInstances useSharedMaterial={true} category="buildings">
        <SmallBldgsInstances_Blender instancesData={smallBldgsData as BlenderExportData[]} />
      </SmallBldgsInstances>

      <HousesInstances category="buildings">
        <HousesInstances_Blender instancesData={housesData as BlenderExportData[]} />
      </HousesInstances>

      <CityBldgsInstances useSharedMaterial={true} category="buildings">
        <CityBldgsInstances_Blender instancesData={cityBldgsData as BlenderExportData[]} />
      </CityBldgsInstances>

      <ConstructionInstances useSharedMaterial={true} category="buildings">
        <ConstructionInstances_Blender instancesData={constructionData as BlenderExportData[]} />
      </ConstructionInstances>

      <CompanyBldgs />
      <FestivalBuildings />
    </>
  );
}
