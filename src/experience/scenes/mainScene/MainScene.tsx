'use client';
import { forwardRef } from 'react';

import Effects from '@/experience/effects';
import { MainSceneCameraSystem } from '@/experience/scenes/mainScene/MainSceneCameraSystem';

import LogoMarkers from './components/LogoMarkers';

import smallBldgsData from '@/experience/data/smallBldgs.json';
import {
  SmallBldgsInstances,
  SmallBldgsInstances_Blender,
} from '@/experience/models/SmallBldgsInstances';

import fencesData from '@/experience/data/fences.json';
import { FencesInstances, FencesInstances_Blender } from '@/experience/models/FencesInstances';

import { BlenderExportData } from '@/experience/baseModels/shared/types';

interface MainSceneProps {
  scene: Sanity.Scene;
}

const MainScene = forwardRef<any, MainSceneProps>(({ scene }, ref) => {
  return (
    <>
      <MainSceneCameraSystem />
      <Effects />

      {/* Small Buildings - using mixed material handling */}
      <SmallBldgsInstances useSharedMaterial={false}>
        <SmallBldgsInstances_Blender instancesData={smallBldgsData as BlenderExportData[]} />
      </SmallBldgsInstances>

      <FencesInstances useSharedMaterial={true}>
        <FencesInstances_Blender instancesData={fencesData as BlenderExportData[]} />
      </FencesInstances>

      <LogoMarkers scene={scene} />
    </>
  );
});

// Display name for React DevTools
MainScene.displayName = 'MainScene';

export default MainScene;
