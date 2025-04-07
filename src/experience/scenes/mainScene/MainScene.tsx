'use client';
import { forwardRef } from 'react';

import Effects from '@/experience/effects';
import { MainSceneCameraSystem } from '@/experience/scenes/mainScene/MainSceneCameraSystem';

import LogoMarkers from './components/LogoMarkers';

import { BlenderExportData } from '@/experience/baseModels/shared/types';

import housesData from '@/experience/data/houses.json';
import { HousesInstances, HousesInstances_Blender } from '@/experience/models/HousesInstances';

import smallBldgsData from '@/experience/data/smallBldgs.json';
import {
  SmallBldgsInstances,
  SmallBldgsInstances_Blender,
} from '@/experience/models/SmallBldgsInstances';

import streetPropsData from '@/experience/data/street-props.json';
import {
  StreetPropsInstances,
  StreetPropsInstances_Blender,
} from '@/experience/models/StreetPropsInstances';

import fencesData from '@/experience/data/fences.json';
import { FencesInstances, FencesInstances_Blender } from '@/experience/models/FencesInstances';

import festivalData from '@/experience/data/festival.json';
import {
  FestivalInstances,
  FestivalInstances_Blender,
} from '@/experience/models/FestivalInstances';

import mountainData from '@/experience/data/mountains.json';
import {
  MountainInstances,
  MountainInstances_Blender,
} from '@/experience/models/MountainInstances';

import natureData from '@/experience/data/nature.json';
import { NatureInstances, NatureInstances_Blender } from '@/experience/models/NatureInstances';

import { CompanyBldgs } from '@/experience/baseModels/buildings/CompanyBldgs';

interface MainSceneProps {
  scene: Sanity.Scene;
}

const MainScene = forwardRef<any, MainSceneProps>(({ scene }, ref) => {
  return (
    <>
      <MainSceneCameraSystem />
      <Effects />

      <CompanyBldgs />

      <MountainInstances useSharedMaterial={true}>
        <MountainInstances_Blender instancesData={mountainData as BlenderExportData[]} />
      </MountainInstances>

      <SmallBldgsInstances useSharedMaterial={false}>
        <SmallBldgsInstances_Blender instancesData={smallBldgsData as BlenderExportData[]} />
      </SmallBldgsInstances>

      <NatureInstances
        useSharedMaterial={true}
        materialOptions={{
          metalness: 0.0,
          roughness: 0.9,
          envMapIntensity: 0.6,
        }}
      >
        <NatureInstances_Blender instancesData={natureData as BlenderExportData[]} />
      </NatureInstances>

      <HousesInstances useSharedMaterial={true}>
        <HousesInstances_Blender instancesData={housesData as BlenderExportData[]} />
      </HousesInstances>

      <FencesInstances useSharedMaterial={true}>
        <FencesInstances_Blender instancesData={fencesData as BlenderExportData[]} />
      </FencesInstances>

      <StreetPropsInstances useSharedMaterial={true}>
        <StreetPropsInstances_Blender instancesData={streetPropsData as BlenderExportData[]} />
      </StreetPropsInstances>

      <FestivalInstances useSharedMaterial={true}>
        <FestivalInstances_Blender instancesData={festivalData as BlenderExportData[]} />
      </FestivalInstances>

      <LogoMarkers scene={scene} />
    </>
  );
});

// Display name for React DevTools
MainScene.displayName = 'MainScene';

export default MainScene;
