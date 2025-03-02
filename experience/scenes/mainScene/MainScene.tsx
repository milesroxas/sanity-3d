"use client";
import React, { useEffect, useRef, useMemo } from "react";
import {
  Cloud,
  Clouds,
  Environment,
  Float,
  Instance,
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
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Vignette,
  Bloom,
  DepthOfField,
  BrightnessContrast,
  HueSaturation,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useControls } from "leva";
import { INITIAL_POSITIONS } from "@/experience/scenes/store/cameraStore";
import MainSceneProps from "@/experience/sceneCollections/props/MainSceneProps";
import { LevaInputs } from "leva";
import NatureScene from "@/experience/sceneCollections/NatureInstances";
import ParkedCars from "@/experience/sceneCollections/vehicles/ParkedCars";
import SceneTransition from "../components/SceneTransition";
import { useCameraStore } from "../store/cameraStore";
import { PerformanceMonitor } from "@/experience/components/PerformanceMonitor";
import { PerformanceComparison } from "@/experience/components/PerformanceComparison";

interface MainSceneProps {
  scene: Sanity.Scene;
  onLoad?: () => void;
}

export default function MainScene({ scene, onLoad }: MainSceneProps) {
  const { startCameraTransition } = useCameraStore();

  useEffect(() => {
    // Call onLoad when the scene is ready
    onLoad?.();

    // Animate camera from mainIntro to main position
    const mainIntro = INITIAL_POSITIONS.mainIntro;
    const main = INITIAL_POSITIONS.main;
    startCameraTransition(
      mainIntro.position,
      main.position,
      mainIntro.target,
      main.target
    );
  }, [onLoad, startCameraTransition]);

  const cloudsRef = useRef<THREE.Group>(null);

  const effectsControls = useControls(
    "Post Processing",
    {
      //     // Depth of Field
      //     focusDistance: {
      //       value: 150,
      //       min: 0,
      //       max: 300,
      //       step: 1,
      //       label: "Focus Distance",
      //       control: "slider",
      //     },
      //     focalLength: {
      //       value: 0.29,
      //       min: 0.01,
      //       max: 1,
      //       step: 0.01,
      //       label: "Focal Length",
      //       control: "slider",
      //     },
      //     bokehScale: {
      //       value: 4,
      //       min: 0,
      //       max: 20,
      //       step: 0.1,
      //       label: "Bokeh Scale",
      //       control: "slider",
      //     },

      //     // Vignette
      //     vignetteOffset: {
      //       value: 0.3,
      //       min: 0,
      //       max: 1,
      //       step: 0.05,
      //       label: "Vignette Offset",
      //       control: "slider",
      //     },
      //     vignetteDarkness: {
      //       value: 0.4,
      //       min: 0,
      //       max: 1,
      //       step: 0.05,
      //       label: "Vignette Darkness",
      //       control: "slider",
      //     },

      //     // Bloom
      bloomIntensity: {
        value: 0.07,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Bloom Intensity",
        control: "slider",
      },
      bloomThreshold: {
        value: 0.27,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Bloom Threshold",
        control: "slider",
      },

      //     brightness: {
      //       value: -0.12,
      //       min: -1,
      //       max: 1,
      //       step: 0.0001,
      //       label: "Brightness",
      //       control: "slider",
      //     },
      //     contrast: {
      //       value: 0.08,
      //       min: -1,
      //       max: 1,
      //       step: 0.0001,
      //       label: "Contrast",
      //       control: "slider",
      //     },
      //     saturation: {
      //       value: -0.06,
      //       min: -1,
      //       max: 1,
      //       step: 0.0001,
      //       label: "Saturation",
      //       control: "slider",
      //     },
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
      intensity: { value: 1.2, min: 0, max: 5, step: 0.1 },
    },
    { collapsed: true }
  );

  const fogControls = useControls(
    "Fog",
    {
      color: { value: "#f2e0c7", type: LevaInputs.COLOR },
      near: { value: -34, min: -100, max: 100, step: 1 },
      far: { value: 1240, min: 0, max: 2000, step: 10 },
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
      <group position={[-40, 0, 0]}>
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
              position={[80, 50, -20]}
              volume={10}
              color="white"
            />
            <Cloud
              segments={60}
              bounds={[12, 4, 4]}
              position={[-40, 50, -80]}
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
      <PerformanceMonitor />
      <PerformanceComparison />
      <MainSceneMarkers scene={scene} />
      <SceneTransition transition={false} color="#a5b4fc" />
      <fog
        attach="fog"
        args={[fogControls.color, fogControls.near, fogControls.far]}
      />

      <EffectComposer>
        <Bloom intensity={0.04} threshold={0.5} radius={2} />
      </EffectComposer>

      {cloudsGroup}

      <Environment
        preset={environmentControls.preset as EnvironmentProps["preset"]}
        background={environmentControls.background}
        backgroundBlurriness={environmentControls.blur}
        environmentIntensity={environmentControls.intensity}
      ></Environment>

      <group position={[0, -0.2, 0]}>
        <WorldFloor />
      </group>

      <Trees />
      <NatureScene />
      <ParkedCars />
      <AnimatedCar />
      <AnimatedVan />
      <AnimatedTractor />
      <AnimatedPlane />
      <GatedCommunity />
      <ResidentialProps />
      <HomesRightBuildings />
      <ConstructionBuildings />
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
