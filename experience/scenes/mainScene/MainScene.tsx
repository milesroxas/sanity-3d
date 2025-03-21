"use client";
import React, { useEffect, useRef, useMemo, useState, forwardRef } from "react";
import {
  Cloud,
  Clouds,
  Environment,
  Float,
  type EnvironmentProps,
} from "@react-three/drei";
import WorldFloor from "@/experience/sceneCollections/WorldFloor";
import GatedCommunity from "@/experience/sceneCollections/gatedCommunity/GatedCommunity";
import { Mountains } from "@/experience/sceneCollections/mountains/Mountains";
import Lights from "@/experience/sceneCollections/lights/Lights";
import Trees from "@/experience/sceneCollections/trees/Trees";
import { ConstructionBuildings } from "@/experience/sceneCollections/construction/models/ConstructionBuildings";
import { CompanyBuildings } from "@/experience/sceneCollections/company/models/CompanyBuildings";
import { ShopsBuildings } from "@/experience/sceneCollections/shops/ShopsMainScene";
import { ResortBuildings } from "@/experience/sceneCollections/resort/models/ResortBuildings";
import { HomesRightBuildings } from "@/experience/sceneCollections/homesRight/models/HomesRightBuildings";
import { EventsBuildings } from "@/experience/sceneCollections/events/models/EventsBuildings";
import { FarmBuildings } from "@/experience/sceneCollections/farm/models/FarmBuildings";
import MainSceneMarkers from "@/experience/scenes/mainScene/components/MainSceneMarkers";
import { ResidentialProps } from "@/experience/sceneCollections/gatedCommunity/models/ResidentialProps";
import { AnimatedCar } from "@/experience/sceneCollections/vehicles/AnimatedCar";
import { MainSceneCameraSystem } from "@/experience/scenes/mainScene/MainSceneCameraSystem";
import { HomesOuterBuildings } from "@/experience/sceneCollections/homesOuter/models/HomesOuterBuildings";
import { AnimatedTractor } from "@/experience/sceneCollections/vehicles/AnimatedTractor";
import { AnimatedVan } from "@/experience/sceneCollections/vehicles/AnimatedVan";
import { AnimatedPlane } from "@/experience/sceneCollections/vehicles/AnimatedPlane";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
import { useControls } from "leva";
import { INITIAL_POSITIONS } from "@/experience/scenes/store/cameraStore";
import MainSceneProps from "@/experience/sceneCollections/props/MainSceneProps";
import NatureScene from "@/experience/sceneCollections/NatureInstances";
import ShopsParkedCars from "@/experience/sceneCollections/vehicles/ShopsParkedCars";
import SceneTransition from "../components/SceneTransition";
import { useCameraStore } from "../store/cameraStore";
import EventsParkedCars from "@/experience/sceneCollections/vehicles/EventsParkedCars";
import { setupInstancedShadowUpdates } from "@/experience/utils/instancedShadows";
import { MainSceneCommercialBldgs } from "@/experience/sceneCollections/commercialBldgs/mainSceneCommercialBldgs";
import { HomesOuterLeft } from "@/experience/sceneCollections/homesOuterLeft/homesOuterLeft";
import { AnimatedTruckFlatBed } from "@/experience/sceneCollections/vehicles/AnimatedTruckFlatBed";
import { Crane } from "@/experience/sceneCollections/construction/models/Crane";
import { Excavator } from "@/experience/sceneCollections/construction/models/Excavator";
import LogoMarkers from "./components/LogoMarkers";

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
    const cloudsRef = useRef<THREE.Group>(null);

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
          startCameraTransition(
            mainIntro.position,
            main.position,
            mainIntro.target,
            main.target
          );
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
          startCameraTransition(
            mainIntro.position,
            main.position,
            mainIntro.target,
            main.target
          );
        } else {
          console.warn("Cannot start camera transition - scene not fully loaded");
        }
      }
    }));

    const effectsControls = useControls(
      "Post Processing",
      {
        bloomIntensity: {
          value: 0.04,
          min: 0,
          max: 1,
          step: 0.01,
          label: "Bloom Intensity",
          control: "slider",
        },
        bloomThreshold: {
          value: 0.4,
          min: 0,
          max: 1,
          step: 0.01,
          label: "Bloom Threshold",
          control: "slider",
        },
      },
      { collapsed: true }
    );

    const environmentControls = useControls(
      "Environment",
      {
        preset: {
          value: "sunset",
          options: [
            "sunset",
            "dawn",
            "night",
            "warehouse",
            "forest",
            "apartment",
            "studio",
            "city",
            "park",
            "lobby",
          ],
        },
        background: { value: true },
        blur: { value: 0.9, min: 0, max: 1, step: 0.1 },
        intensity: { value: 0.7, min: 0, max: 5, step: 0.1 },
      },
      { collapsed: true }
    );

    const fogControls = useControls(
      "Fog",
      {
        color: { value: "#ffffff" },
        near: { value: 80, min: -100, max: 100, step: 1 },
        far: { value: 1000, min: 0, max: 2000, step: 10 },
      },
      { collapsed: true }
    );

    useFrame((state, delta) => {
      if (cloudsRef.current) {
        cloudsRef.current.position.x += delta * 0.8;

        // Reset position when clouds move too far right
        if (cloudsRef.current.position.x > 200) {
          cloudsRef.current.position.x = -200;
        }
      }
    });

    const cloudsGroup = useMemo(
      () => (
        <group ref={cloudsRef} position={[-40, 0, 0]}>
          <Float
            speed={0.8}
            floatIntensity={0.3}
            rotationIntensity={0.1}
            floatingRange={[-0.08, 0.4]}
          >
            <Clouds material={THREE.MeshBasicMaterial}>
              <Cloud
                segments={20}
                scale={0.8}
                bounds={[12, 2, 2]}
                position={[0, 60, 50]}
                volume={10}
                color="white"
              />
              <Cloud
                segments={50}
                scale={1}
                bounds={[8, 2, 2]}
                position={[-80, 60, 0]}
                volume={10}
                color="white"
              />
              <Cloud
                segments={50}
                bounds={[20, 4, 2]}
                position={[80, 60, -20]}
                volume={10}
                color="white"
              />
              <Cloud
                segments={60}
                bounds={[12, 4, 4]}
                position={[-40, 60, -80]}
                volume={10}
                scale={0.5}
                color="white"
              />
            </Clouds>
          </Float>
        </group>
      ),
      []
    );

    return (
      <>
        <MainSceneCameraSystem />
        <LogoMarkers scene={scene} />
        <SceneTransition transition={false} color="#a5b4fc" />
        <fog
          attach="fog"
          args={[fogControls.color, fogControls.near, fogControls.far]}
        />

        <EffectComposer>
          <Bloom 
            intensity={effectsControls.bloomIntensity} 
            threshold={effectsControls.bloomThreshold} 
            radius={2} 
          />
        </EffectComposer>

        {cloudsGroup}

        <Environment
          preset={environmentControls.preset as EnvironmentProps["preset"]}
          background={environmentControls.background}
          backgroundBlurriness={environmentControls.blur}
          environmentIntensity={environmentControls.intensity}
        ></Environment>

        <group position={[0, -0.2, 0]}>
          <WorldFloor  />
        </group>

        <Trees />
        <NatureScene />
        <ShopsParkedCars />
        <EventsParkedCars />
        <MainSceneCommercialBldgs position={[0, 0, 0]} />
        <AnimatedCar />
        <AnimatedVan />
        <AnimatedTractor />
        <AnimatedPlane />
        <AnimatedTruckFlatBed />
        <GatedCommunity />
        <ResidentialProps />
        <HomesRightBuildings />
        <HomesOuterLeft />
        <ConstructionBuildings />
        <Crane />
        <Excavator position={[-20, 0, -30]} />
        <CompanyBuildings />
        <HomesOuterBuildings />
        <ShopsBuildings />
        <ResortBuildings />
        <EventsBuildings />
        <FarmBuildings />
        <Mountains />
        <MainSceneProps />
        <Lights />
      </>
    );
  }
);

// Display name for React DevTools
MainScene.displayName = "MainScene";

export default MainScene;
