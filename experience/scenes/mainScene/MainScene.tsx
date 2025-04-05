'use client';
import { useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useMemo, useState, forwardRef } from 'react';
import { Environment, type EnvironmentProps } from '@react-three/drei';

import { MainSceneCameraSystem } from '@/experience/scenes/mainScene/MainSceneCameraSystem';
import Effects from '@/experience/effects';

import { useControls } from 'leva';
import { INITIAL_POSITIONS } from '@/experience/scenes/store/cameraStore';

import { useCameraStore } from '../store/cameraStore';

import { setupInstancedShadowUpdates } from '@/experience/utils/instancedShadows';

import LogoMarkers from './components/LogoMarkers';

import {
  SmallBldgsInstances,
  SmallBldgsInstances_Blender,
} from '@/experience/models/SmallBldgsInstances';
import smallBldgsData from '@/experience/data/smallBldgs.json';

import { FencesInstances, FencesInstances_Blender } from '@/experience/models/FencesInstances';
import fencesData from '@/experience/data/fences.json';

import { BlenderExportData } from '@/experience/baseModels/shared/types';

interface MainSceneProps {
  scene: Sanity.Scene;
  onLoad?: () => void;
  startTransitionsAfterLoad?: boolean;
}

export interface MainSceneRef {
  startCameraTransition: () => void;
}

const MainScene = forwardRef<MainSceneRef, MainSceneProps>(
  ({ scene, onLoad, startTransitionsAfterLoad = false }, ref) => {
    const { startCameraTransition, setIsLoading } = useCameraStore();
    const { scene: threeScene } = useThree();
    const [isLoaded, setIsLoaded] = useState(false);

    // Handle all loading in a single effect
    useEffect(() => {
      // Signal loading start
      setIsLoading(true);

      // Setup shadow updates for instanced meshes
      const cleanup = setupInstancedShadowUpdates(threeScene);

      // Set a timeout to allow models to load and trigger a shadow update
      const loadingTimeout = setTimeout(() => {
        // Trigger shadow update
        window.dispatchEvent(new CustomEvent('shadow-update'));

        // Mark the scene as loaded
        setIsLoaded(true);

        // If we should start camera transitions automatically
        if (!startTransitionsAfterLoad) {
          const mainIntro = INITIAL_POSITIONS.mainIntro;
          const main = INITIAL_POSITIONS.main;
          startCameraTransition(mainIntro.position, main.position, mainIntro.target, main.target);
        }

        // Signal loading complete
        setIsLoading(false);

        // Notify parent that loading is complete
        onLoad?.();
      }, 1000);

      return () => {
        cleanup();
        clearTimeout(loadingTimeout);
      };
    }, [threeScene, startCameraTransition, onLoad, startTransitionsAfterLoad, setIsLoading]);

    // Expose the camera transition function through ref
    React.useImperativeHandle(ref, () => ({
      startCameraTransition: () => {
        if (isLoaded) {
          const mainIntro = INITIAL_POSITIONS.mainIntro;
          const main = INITIAL_POSITIONS.main;
          startCameraTransition(mainIntro.position, main.position, mainIntro.target, main.target);
        }
      },
    }));

    const effectsControls = useControls(
      'Post Processing',
      {
        bloomIntensity: {
          value: 0.04,
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Bloom Intensity',
          control: 'slider',
        },
        bloomThreshold: {
          value: 0.4,
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Bloom Threshold',
          control: 'slider',
        },
      },
      { collapsed: true }
    );

    const environmentControls = useControls(
      'Environment',
      {
        preset: {
          value: 'sunset',
          options: [
            'sunset',
            'dawn',
            'night',
            'warehouse',
            'forest',
            'apartment',
            'studio',
            'city',
            'park',
            'lobby',
          ],
        },
        background: { value: true },
        blur: { value: 0.9, min: 0, max: 1, step: 0.1 },
        intensity: { value: 0.8, min: 0, max: 5, step: 0.1 },
      },
      { collapsed: true }
    );

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

        {/* 
        <EffectComposer>
          <Bloom 
            intensity={effectsControls.bloomIntensity} 
            threshold={effectsControls.bloomThreshold} 
            radius={2} 
          />
        </EffectComposer> */}

        <Environment
          preset={environmentControls.preset as EnvironmentProps['preset']}
          background={environmentControls.background}
          backgroundBlurriness={environmentControls.blur}
          environmentIntensity={environmentControls.intensity}
        />

        {/* <group position={[0, -0.2, 0]}>
          <WorldFloor />
        </group> */}

        {/* <Trees />
        <NatureScene />
        <ShopsParkedCars />
        <EventsParkedCars />
        <MainSceneCommercialBldgs position={[0, 0, 0]} />
        <AnimatedCar />
        <AnimatedVan />
        <Billboard />
        <AnimatedPlane />
        <AnimatedTruckFlatBed />
        <AnimatedPatrolOne />
        <AnimatedPatrolTwo />
        <GatedCommunity />
        <ResidentialProps />
        <HomesRightBuildings />
        <HomesOuterLeft />
        <ConstructionBuildings />
        <Crane />
        <Excavator position={[-20, 0, -30]} />
        <CompanyBuildings />
        <HomesOuterBuildings />

        <BusStops />
        <ResortBuildings />

        <FarmBuildings />
        <Mountains />
        <MainSceneProps />
        <Lights />
        <ParkedPatrolCars /> */}
      </>
    );
  }
);

// Display name for React DevTools
MainScene.displayName = 'MainScene';

export default MainScene;
