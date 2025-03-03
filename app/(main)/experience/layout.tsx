// app/experience/layout.tsx
"use client";
import { R3FProvider } from "@/experience/providers/R3FContext";
import { ReactNode } from "react";
import { Leva } from "leva";

export default function ExperienceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

  return (
    <R3FProvider>
      {/* Non-R3F components render here */}

      <main className="mt-8">{children}</main>

      {/* <Leva hidden={isProduction} /> */}
      <Leva hidden={isProduction} />
    </R3FProvider>
  );
}
