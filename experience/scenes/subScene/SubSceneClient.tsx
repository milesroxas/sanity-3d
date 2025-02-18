"use client";

import SubSceneUI from "./SubSceneUI";

export default function SubSceneClient({ scene }: { scene: Sanity.Scene }) {
  return <SubSceneUI scene={scene} />;
}
