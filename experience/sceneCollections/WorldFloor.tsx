import React from "react";
import { GroundGatedCommunity } from "./ground/models/GroundGatedCommunity";
import { GroundHomesRight } from "./ground/models/GroundHomesRight";
import { GroundConstruction } from "./ground/models/GroundConstruction";
import { GroundShops } from "./ground/models/GroundShops";
import { GroundHomesOuter } from "./ground/models/GroundHomesOuter";
import { GroundEvents } from "./ground/models/GroundEvents";
import { GroundResort } from "./ground/models/GroundResort";
import { GroundFarm } from "./ground/models/GroundFarm";
import { GroundCompany } from "./ground/models/GroundCompany";
import { addShadowsToModel } from "../utils/shadows";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GroundPlane } from "./ground/models/GroundPlane";

function WorldFloor() {
  const groupRef = useRef<THREE.Group>(null);

  // Apply shadow properties to all children after mounting
  useEffect(() => {
    if (groupRef.current) {
      // Only receive shadows, don't cast them (floors should receive but not cast)
      addShadowsToModel(groupRef.current, false, true);
    }
  }, []);

  return (
    <group ref={groupRef}>
      <GroundHomesRight />
      <GroundGatedCommunity />
      <GroundConstruction />
      <GroundShops />
      <GroundHomesOuter />
      <GroundEvents />
      <GroundCompany />
      <GroundResort />
      <GroundFarm />
      <GroundPlane />
    </group>
  );
}

export default WorldFloor;
