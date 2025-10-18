import { windmill } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import streetPropsData from '@/experience/data/intro-street-props.json';
import { useMemo } from 'react';

import {
  StreetPropsInstances,
  StreetPropsInstances_Blender,
} from '@/experience/models/StreetPropsInstances';

export function StreetProps() {
  // Filter out windmill propellers to render them animated instead
  const {
    filteredStreetProps,
    windmillPropellers,
    tileRoadStraight,
    tileRoadMainroadIntersectionT,
    mainroadStraight,
  } = useMemo(() => {
    const propellers: BlenderExportData[] = [];
    const tileRoadStraight: BlenderExportData[] = [];
    const tileRoadMainroadIntersectionT: BlenderExportData[] = [];
    const mainroadStraight: BlenderExportData[] = [];
    const filtered = (streetPropsData as BlenderExportData[]).filter(item => {
      if (item.name === 'windmill-propeller') {
        propellers.push(item);
        return false;
      }
      if (item.name === 'tile-road-straight') {
        tileRoadStraight.push(item);
        return false;
      }
      if (item.name === 'tile-road-mainroad-intersection-t') {
        tileRoadMainroadIntersectionT.push(item);
        return false;
      }
      if (item.name === 'mainroad-straight') {
        mainroadStraight.push(item);
        return false;
      }
      return true;
    });

    return {
      filteredStreetProps: filtered,
      windmillPropellers: propellers,
      tileRoadStraight,
      tileRoadMainroadIntersectionT,
      mainroadStraight,
    };
  }, []);

  return (
    <group position={[0, 0, 0]}>
      <StreetPropsInstances useSharedMaterial={true}>
        <StreetPropsInstances_Blender instancesData={filteredStreetProps} />
        {windmillPropellers.map((propeller, index) => (
          <windmill.AnimatedWindmillPropeller
            key={`windmill-${index}`}
            position={propeller.position}
            rotation={propeller.rotation}
            scale={propeller.scale}
          />
        ))}
      </StreetPropsInstances>
      <StreetPropsInstances useSharedMaterial={true}>
        <StreetPropsInstances_Blender instancesData={tileRoadStraight} />
      </StreetPropsInstances>
      <StreetPropsInstances useSharedMaterial={true}>
        <StreetPropsInstances_Blender instancesData={tileRoadMainroadIntersectionT} />
      </StreetPropsInstances>
      <StreetPropsInstances useSharedMaterial={true}>
        <StreetPropsInstances_Blender instancesData={mainroadStraight} />
      </StreetPropsInstances>
    </group>
  );
}
