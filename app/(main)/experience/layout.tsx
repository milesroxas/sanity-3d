import { Suspense } from "react";
import Experience from "@/app/experience/Experience";

export default async function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative h-screen w-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Experience />
      </Suspense>
      {children}
    </main>
  );
}
