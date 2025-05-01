'use client';
import { TempFloor } from '@/experience/baseModels/Ground/TempFloor';
import Effects from '@/experience/effects';
import { forwardRef } from 'react';
import { MainSceneCameraSystem } from './MainSceneCameraSystem';
import LogoMarkers from './components/LogoMarkers';
import { Buildings } from './compositions/Buildings';
import { Environment } from './compositions/Environment';
import { Props } from './compositions/Props';
import { Vehicles } from './compositions/Vehicles';

interface MainSceneProps {
  scene: Sanity.Scene;
}

const MainScene = forwardRef<any, MainSceneProps>(({ scene }, ref) => {
  return (
    <>
      <MainSceneCameraSystem />
      <TempFloor position={[0, -0.05, 0]} />
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
