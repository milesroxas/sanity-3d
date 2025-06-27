import { BlenderExportData } from '@/experience/baseModels/shared/types';
import streetPropsData from '@/experience/data/intro-street-props.json';

import {
  StreetPropsInstances,
  StreetPropsInstances_Blender,
} from '@/experience/models/StreetPropsInstances';

export function StreetProps() {
  return (
    <group>
      <StreetPropsInstances useSharedMaterial={true}>
        <StreetPropsInstances_Blender instancesData={streetPropsData as BlenderExportData[]} />
      </StreetPropsInstances>
    </group>
  );
}
