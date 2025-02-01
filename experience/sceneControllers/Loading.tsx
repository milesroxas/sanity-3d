"use client";
import { useCameraStore } from "./store/cameraStore";

export function Loading() {
  const { isLoading } = useCameraStore();

  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-black backdrop-blur-sm flex items-center justify-center pointer-events-none z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-xl font-medium">Loading...</p>
      </div>
    </div>
  );
}
