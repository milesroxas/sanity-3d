"use client";
import React, { useEffect } from "react";
import { Environment } from "@react-three/drei";

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
import { CloudSimple } from "@/experience/sceneCollections/clouds/CloudSimple";
import { AnimatedTractor } from "@/experience/sceneCollections/vehicles/AnimatedTractor";

interface MainSceneProps {
  scene: Sanity.Scene;
  onLoad?: () => void;
}

export default function MainScene({ scene, onLoad }: MainSceneProps) {
  useEffect(() => {
    // Call onLoad when the scene is ready
    onLoad?.();
  }, [onLoad]);

  return (
    <>
      <MainSceneCameraSystem />

      <MainSceneMarkers scene={scene} />
      <Environment preset="sunset" />
      <group position={[0, -0.2, 0]}>
        <WorldFloor />
      </group>
      <Trees />
      <CloudSimple />
      <AnimatedCar />
      <AnimatedTractor />
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
      <Lights />
    </>
  );
}
