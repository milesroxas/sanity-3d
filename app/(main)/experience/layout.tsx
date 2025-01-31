import { Suspense } from "react";
import Canvas from "@/experience/Canvas";
import { SanityLive } from "@/sanity/lib/live";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative h-screen w-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas>{children}</Canvas>
      </Suspense>
      <SanityLive />
    </main>
  );
}
