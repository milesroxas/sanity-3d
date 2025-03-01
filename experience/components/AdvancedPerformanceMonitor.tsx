import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface PerformanceData {
  timestamp: number;
  fps: number;
  memory: {
    geometries: number;
    textures: number;
  };
  renderTime: number;
}

export function AdvancedPerformanceMonitor({
  visible = true,
  showGraph = true,
  logToConsole = false,
  sampleInterval = 1000, // ms
  historyLength = 60, // number of samples to keep
}: {
  visible?: boolean;
  showGraph?: boolean;
  logToConsole?: boolean;
  sampleInterval?: number;
  historyLength?: number;
}) {
  const { gl } = useThree();
  const [performanceHistory, setPerformanceHistory] = useState<
    PerformanceData[]
  >([]);
  const lastTime = useRef(0);
  const frameCount = useRef(0);
  const lastSampleTime = useRef(0);
  const renderTime = useRef(0);

  // Create a clock to measure time
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    // Reset the clock when the component mounts
    clock.current.start();
    lastTime.current = clock.current.getElapsedTime() * 1000;
    lastSampleTime.current = lastTime.current;

    // Create a div for text display if visible
    if (visible) {
      const div = document.createElement("div");
      div.id = "performance-monitor";
      div.style.position = "absolute";
      div.style.top = "10px";
      div.style.left = "10px";
      div.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      div.style.color = "white";
      div.style.padding = "10px";
      div.style.fontFamily = "monospace";
      div.style.fontSize = "12px";
      div.style.zIndex = "1000";
      div.style.pointerEvents = "none";
      document.body.appendChild(div);

      return () => {
        document.body.removeChild(div);
      };
    }
  }, [visible]);

  useFrame(() => {
    const currentTime = clock.current.getElapsedTime() * 1000;
    const deltaTime = currentTime - lastTime.current;
    lastTime.current = currentTime;

    // Increment frame counter
    frameCount.current++;

    // Measure render time
    const startRender = performance.now();

    // After render (next frame), calculate render time
    renderTime.current = performance.now() - startRender;

    // Sample at regular intervals
    if (currentTime - lastSampleTime.current >= sampleInterval) {
      const fps = Math.round(
        (frameCount.current * 1000) / (currentTime - lastSampleTime.current)
      );
      frameCount.current = 0;

      // Get memory info
      const memory = {
        geometries: (gl as any).info?.memory?.geometries || 0,
        textures: (gl as any).info?.memory?.textures || 0,
      };

      // Create new data point
      const newDataPoint: PerformanceData = {
        timestamp: currentTime,
        fps,
        memory,
        renderTime: renderTime.current,
      };

      // Update history
      setPerformanceHistory((prev) => {
        const newHistory = [...prev, newDataPoint];
        if (newHistory.length > historyLength) {
          return newHistory.slice(newHistory.length - historyLength);
        }
        return newHistory;
      });

      // Update display
      if (visible) {
        const div = document.getElementById("performance-monitor");
        if (div) {
          div.innerHTML = `
            FPS: ${fps}<br>
            Render Time: ${renderTime.current.toFixed(2)} ms<br>
            Geometries: ${memory.geometries}<br>
            Textures: ${memory.textures}<br>
          `;
        }
      }

      // Log to console if enabled
      if (logToConsole) {
        console.log("Performance:", {
          fps,
          renderTime: renderTime.current,
          memory,
        });
      }

      lastSampleTime.current = currentTime;
    }
  });

  // Render graph if enabled
  if (!showGraph) return null;

  // Prepare graph data
  const fpsPoints = performanceHistory.map((data, i) => {
    const x = (i / (historyLength - 1)) * 2 - 1; // Map to [-1, 1]
    const y = (data.fps / 120) * 0.5; // Normalize FPS (assuming max 120 FPS)
    return [x, y, 0] as [number, number, number];
  });

  const renderTimePoints = performanceHistory.map((data, i) => {
    const x = (i / (historyLength - 1)) * 2 - 1; // Map to [-1, 1]
    const y = (data.renderTime / 33) * 0.5 - 0.5; // Normalize render time (assuming 33ms = 30 FPS)
    return [x, y, 0] as [number, number, number];
  });

  return (
    <group position={[0, 0, -5]} scale={[0.5, 0.5, 0.5]}>
      {/* FPS Graph */}
      {fpsPoints.length > 1 && (
        <Line points={fpsPoints} color="green" lineWidth={2} />
      )}

      {/* Render Time Graph */}
      {renderTimePoints.length > 1 && (
        <Line points={renderTimePoints} color="red" lineWidth={2} />
      )}

      {/* Graph labels */}
      <group position={[-1, 0.6, 0]}>
        <mesh>
          <planeGeometry args={[0.2, 0.05]} />
          <meshBasicMaterial color="green" />
        </mesh>
      </group>

      <group position={[-1, -0.6, 0]}>
        <mesh>
          <planeGeometry args={[0.2, 0.05]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
    </group>
  );
}
