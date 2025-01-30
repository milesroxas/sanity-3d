import { Suspense } from "react";
import Canvas from "@/experience/Canvas";
import { SanityLive } from "@/sanity/lib/live";
import { fetchSanityScenes } from "../actions";

export default async function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scenes = await fetchSanityScenes();
  const mainScene = scenes[0]; // Or use appropriate logic to get the main scene

  return (
    <main className="relative h-screen w-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas scene={mainScene}>{children}</Canvas>
      </Suspense>
      <SanityLive />
    </main>
  );
}
