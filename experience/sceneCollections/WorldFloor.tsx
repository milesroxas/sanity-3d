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

function WorldFloor() {
  return (
    <>
      <GroundHomesRight />
      <GroundGatedCommunity />
      <GroundConstruction />
      <GroundShops />
      <GroundHomesOuter />
      <GroundEvents />
      <GroundCompany />
      <GroundResort />
      <GroundFarm />
    </>
  );
}

export default WorldFloor;
