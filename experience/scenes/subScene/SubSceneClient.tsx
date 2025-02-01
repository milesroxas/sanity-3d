"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import { useEffect } from "react";
import SubScene from "./SubScene";
import SubSceneUI from "./SubSceneUI";

export default function SubSceneClient({ scene }: { scene: Sanity.Scene }) {
  return <SubSceneUI scene={scene} />;
}
