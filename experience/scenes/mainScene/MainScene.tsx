"use client";
import React, { useEffect, useRef } from "react";
import {
  Cloud,
  Clouds,
  Environment,
  Float,
  Lightformer,
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
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

interface MainSceneProps {
  scene: Sanity.Scene;
  onLoad?: () => void;
}

export default function MainScene({ scene, onLoad }: MainSceneProps) {
  useEffect(() => {
    // Call onLoad when the scene is ready
    onLoad?.();
  }, [onLoad]);

  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x += delta * 0.5; // Adjust speed by changing 0.5

      // Reset position when clouds move too far right
      if (cloudsRef.current.position.x > 200) {
        cloudsRef.current.position.x = -200;
      }
    }
  });

  return (
    <>
      <MainSceneCameraSystem />

      <MainSceneMarkers scene={scene} />

      <EffectComposer>
        <Vignette
          offset={0.3}
          darkness={0.2}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>

      <Environment
        preset="sunset"
        background
        environmentIntensity={1}
        backgroundBlurriness={0.9}
      ></Environment>

      <group position={[0, -0.2, 0]}>
        <WorldFloor />
      </group>
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
              volume={5}
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

      <Trees />
      {/* <CloudSimple /> */}
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
      <Lights />
    </>
  );
}
