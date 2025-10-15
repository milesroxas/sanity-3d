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
  const { filteredStreetProps, windmillPropellers } = useMemo(() => {
    const propellers: BlenderExportData[] = [];
    const filtered = (streetPropsData as BlenderExportData[]).filter(item => {
      if (item.name === 'windmill-propeller') {
        propellers.push(item);
        return false;
      }
      return true;
    });

    return { filteredStreetProps: filtered, windmillPropellers: propellers };
  }, []);

  return (
    <group>
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
    </group>
  );
}
