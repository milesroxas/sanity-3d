'use client';
import { TempFloor } from '@/experience/baseModels/Ground/TempFloor';
import LogoMarkers from '@/experience/components/markers/LogoMarkers';
import Effects from '@/experience/effects';
import { forwardRef } from 'react';
import { Buildings } from './compositions/Buildings';
import { Environment } from './compositions/Environment';
import { Props } from './compositions/Props';
import { Vehicles } from './compositions/Vehicles';
import { MainSceneCameraSystem } from './MainSceneCameraSystem';

interface MainSceneProps {
  scene: Sanity.Scene;
}

const MainScene = forwardRef<any, MainSceneProps>(({ scene }, ref) => {
  return (
    <>
      <MainSceneCameraSystem />
      <TempFloor position={[0, -1, 0]} />
      <Environment />
      <Buildings />
      <Props />
      <Vehicles />
      <Effects />
      <LogoMarkers scene={scene} />
    </>
  );
});

// Display name for React DevTools
MainScene.displayName = 'MainScene';

export default MainScene;
