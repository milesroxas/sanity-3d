import { BlenderExportData } from '@/experience/baseModels/shared/types';
import streetPropsData from '@/experience/data/intro-street-props.json';
import { useEffect } from 'react';

import {
  StreetPropsInstances,
  StreetPropsInstances_Blender,
  useStreetPropsInstances,
} from '@/experience/models/StreetPropsInstances';

// Child component that can access the context
function DebugInstances() {
  const instances = useStreetPropsInstances();

  // Log only on mount, not every frame
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Street props instances loaded:', Object.keys(instances).length, 'types');
    }
  }, []); // Remove instances dependency to prevent spam

  return null;
}

export function StreetProps() {
  return (
    <group>
      <StreetPropsInstances useSharedMaterial={true}>
        <DebugInstances />
        <StreetPropsInstances_Blender instancesData={streetPropsData as BlenderExportData[]} />
      </StreetPropsInstances>
    </group>
  );
}
