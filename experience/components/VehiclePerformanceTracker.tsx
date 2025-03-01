import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

// Define the interface for vehicle performance data
interface VehiclePerformanceData {
  timestamp: number;
  frameTime: number; // Time to process a frame in ms
  memoryUsage: number; // Estimated memory usage in MB
}

export function VehiclePerformanceTracker({
  vehicleId,
  onDataCollected,
  sampleInterval = 5000, // ms
}: {
  vehicleId: string;
  onDataCollected?: (data: VehiclePerformanceData) => void;
  sampleInterval?: number;
}) {
  const lastSampleTime = useRef(0);
  const frameStartTime = useRef(0);
  const frameCount = useRef(0);
  const totalFrameTime = useRef(0);

  // Use a ref to track if we're currently measuring
  const isMeasuring = useRef(false);

  // Start measuring on component mount
  useEffect(() => {
    console.log(`Started tracking performance for vehicle: ${vehicleId}`);

    // Create a div to display the performance data
    const div = document.createElement("div");
    div.id = `vehicle-performance-${vehicleId}`;
    div.style.position = "absolute";
    div.style.bottom = "10px";
    div.style.right = "10px";
    div.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    div.style.color = "white";
    div.style.padding = "10px";
    div.style.fontFamily = "monospace";
    div.style.fontSize = "12px";
    div.style.zIndex = "1000";
    document.body.appendChild(div);

    return () => {
      console.log(`Stopped tracking performance for vehicle: ${vehicleId}`);
      document.body.removeChild(div);
    };
  }, [vehicleId]);

  useFrame(() => {
    const now = performance.now();

    // Start measuring this frame
    if (!isMeasuring.current) {
      frameStartTime.current = now;
      isMeasuring.current = true;
      return;
    }

    // Calculate frame time
    const frameTime = now - frameStartTime.current;
    totalFrameTime.current += frameTime;
    frameCount.current++;

    // Reset for next frame
    frameStartTime.current = now;

    // Sample at regular intervals
    if (now - lastSampleTime.current >= sampleInterval) {
      // Calculate average frame time
      const avgFrameTime = totalFrameTime.current / frameCount.current;

      // Estimate memory usage (this is a rough approximation)
      // In a real app, you'd need to use more sophisticated methods
      const memoryUsage = Math.random() * 10 + 20; // Placeholder value

      const performanceData: VehiclePerformanceData = {
        timestamp: now,
        frameTime: avgFrameTime,
        memoryUsage,
      };

      // Call the callback if provided
      if (onDataCollected) {
        onDataCollected(performanceData);
      }

      // Update the display
      const div = document.getElementById(`vehicle-performance-${vehicleId}`);
      if (div) {
        div.innerHTML = `
          Vehicle: ${vehicleId}<br>
          Avg Frame Time: ${avgFrameTime.toFixed(2)} ms<br>
          Est. Memory: ${memoryUsage.toFixed(2)} MB<br>
          Frames Measured: ${frameCount.current}<br>
        `;
      }

      // Reset counters
      lastSampleTime.current = now;
      totalFrameTime.current = 0;
      frameCount.current = 0;
    }
  });

  return null;
}
