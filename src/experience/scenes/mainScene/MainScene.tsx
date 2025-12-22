'use client';

import Effects from '@/experience/effects';
import { useMaterialTextureTransition } from '@/experience/hooks/useMaterialTextureTransition';
import { forwardRef } from 'react';
import { MainSceneCameraSystem } from './MainSceneCameraSystem';
import LogoMarkers from './components/LogoMarkers';
import { Buildings } from './compositions/Buildings';
import { Environment } from './compositions/Environment';
import { Ground } from './compositions/Ground';
import { Props } from './compositions/Props';
import { Vehicles } from './compositions/Vehicles';
import { useRenderProfile } from './hooks/useDeviceProfile';

interface MainSceneProps {
  scene: Sanity.Scene;
}

const MainScene = forwardRef<any, MainSceneProps>(({ scene }, ref) => {
  const profile = useRenderProfile();
  
  // Enable global material texture transitions
  // This hook manages texture swapping when POIs are clicked
  useMaterialTextureTransition();
  
  return (
    <>
      <MainSceneCameraSystem />
      {/* <TempFloor position={[0, -0.05, 0]} /> */}
      <Effects />
      {profile.includeEnvironment && <Environment />}
      <Ground />
      <Buildings />
      {profile.includeProps && <Props />}
      {/* Optionally omit animated vehicles on mobile profile for intro perf */}
      {profile.includeAnimatedVehicles && <Vehicles />}

      {profile.includeLogoMarkers && <LogoMarkers scene={scene} />}
    </>
  );
});

// Display name for React DevTools
MainScene.displayName = 'MainScene';

export default MainScene;
