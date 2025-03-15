import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface PerformanceSnapshot {
  fps: number;
  frameTime: number;
  memoryUsage: {
    geometries: number;
    textures: number;
    jsHeap?: number;
  };
  timestamp: number;
}

export function PerformanceComparison() {
  const [baselineSnapshot, setBaselineSnapshot] =
    useState<PerformanceSnapshot | null>(null);
  const [currentSnapshot, setCurrentSnapshot] =
    useState<PerformanceSnapshot | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const frameCount = useRef(0);
  const lastFrameTime = useRef(0);
  const totalFrameTime = useRef(0);
  const measurementStartTime = useRef(0);

  // Create UI for the performance comparison
  useEffect(() => {
    // Create container
    const container = document.createElement("div");
    container.id = "performance-comparison";
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.left = "10px";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    container.style.color = "white";
    container.style.padding = "15px";
    container.style.borderRadius = "5px";
    container.style.fontFamily = "monospace";
    container.style.fontSize = "14px";
    container.style.zIndex = "1000";
    container.style.width = "300px";

    // Create title
    const title = document.createElement("div");
    title.textContent = "Performance Comparison";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "10px";
    title.style.textAlign = "center";
    container.appendChild(title);

    // Create baseline button
    const baselineButton = document.createElement("button");
    baselineButton.textContent = "Take Baseline";
    baselineButton.style.padding = "5px 10px";
    baselineButton.style.marginRight = "10px";
    baselineButton.style.cursor = "pointer";
    baselineButton.onclick = () => {
      setIsRecording(true);
      measurementStartTime.current = performance.now();
      frameCount.current = 0;
      totalFrameTime.current = 0;

      // Record for 5 seconds
      setTimeout(() => {
        if (frameCount.current > 0) {
          const avgFps =
            frameCount.current /
            ((performance.now() - measurementStartTime.current) / 1000);
          const avgFrameTime = totalFrameTime.current / frameCount.current;

          // Get memory info
          const memoryInfo = (performance as any).memory
            ? {
                jsHeap:
                  (performance as any).memory.usedJSHeapSize / (1024 * 1024),
              }
            : {};

          const snapshot: PerformanceSnapshot = {
            fps: avgFps,
            frameTime: avgFrameTime,
            memoryUsage: {
              ...memoryInfo,
              geometries: 0, // Would need to get from renderer
              textures: 0,
            },
            timestamp: performance.now(),
          };

          setBaselineSnapshot(snapshot);
          setIsRecording(false);
        }
      }, 5000);
    };
    container.appendChild(baselineButton);

    // Create current button
    const currentButton = document.createElement("button");
    currentButton.textContent = "Take Current";
    currentButton.style.padding = "5px 10px";
    currentButton.style.cursor = "pointer";
    currentButton.onclick = () => {
      setIsRecording(true);
      measurementStartTime.current = performance.now();
      frameCount.current = 0;
      totalFrameTime.current = 0;

      // Record for 5 seconds
      setTimeout(() => {
        if (frameCount.current > 0) {
          const avgFps =
            frameCount.current /
            ((performance.now() - measurementStartTime.current) / 1000);
          const avgFrameTime = totalFrameTime.current / frameCount.current;

          // Get memory info
          const memoryInfo = (performance as any).memory
            ? {
                jsHeap:
                  (performance as any).memory.usedJSHeapSize / (1024 * 1024),
              }
            : {};

          const snapshot: PerformanceSnapshot = {
            fps: avgFps,
            frameTime: avgFrameTime,
            memoryUsage: {
              ...memoryInfo,
              geometries: 0,
              textures: 0,
            },
            timestamp: performance.now(),
          };

          setCurrentSnapshot(snapshot);
          setIsRecording(false);
        }
      }, 5000);
    };
    container.appendChild(currentButton);

    // Create results container
    const results = document.createElement("div");
    results.id = "performance-results";
    results.style.marginTop = "15px";
    results.style.fontSize = "12px";
    container.appendChild(results);

    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  // Update the results display whenever snapshots change
  useEffect(() => {
    const resultsElement = document.getElementById("performance-results");
    if (!resultsElement) return;

    if (!baselineSnapshot && !currentSnapshot) {
      resultsElement.innerHTML =
        "<p>Take baseline and current measurements to compare</p>";
      return;
    }

    let html = "";

    if (baselineSnapshot) {
      html += `
        <div style="margin-bottom: 10px;">
          <strong>Baseline:</strong><br>
          FPS: ${baselineSnapshot.fps.toFixed(1)}<br>
          Frame Time: ${baselineSnapshot.frameTime.toFixed(2)} ms<br>
          ${baselineSnapshot.memoryUsage.jsHeap ? `JS Heap: ${baselineSnapshot.memoryUsage.jsHeap.toFixed(1)} MB<br>` : ""}
        </div>
      `;
    }

    if (currentSnapshot) {
      html += `
        <div style="margin-bottom: 10px;">
          <strong>Current:</strong><br>
          FPS: ${currentSnapshot.fps.toFixed(1)}<br>
          Frame Time: ${currentSnapshot.frameTime.toFixed(2)} ms<br>
          ${currentSnapshot.memoryUsage.jsHeap ? `JS Heap: ${currentSnapshot.memoryUsage.jsHeap.toFixed(1)} MB<br>` : ""}
        </div>
      `;
    }

    if (baselineSnapshot && currentSnapshot) {
      const fpsDiff = currentSnapshot.fps - baselineSnapshot.fps;
      const frameTimeDiff =
        baselineSnapshot.frameTime - currentSnapshot.frameTime;
      const fpsPercent = (fpsDiff / baselineSnapshot.fps) * 100;
      const frameTimePercent =
        (frameTimeDiff / baselineSnapshot.frameTime) * 100;

      html += `
        <div style="margin-top: 10px; border-top: 1px solid #666; padding-top: 10px;">
          <strong>Improvement:</strong><br>
          FPS: ${fpsDiff.toFixed(1)} (${fpsPercent.toFixed(1)}%)<br>
          Frame Time: ${frameTimeDiff.toFixed(2)} ms (${frameTimePercent.toFixed(1)}%)<br>
        </div>
      `;
    }

    resultsElement.innerHTML = html;
  }, [baselineSnapshot, currentSnapshot]);

  // Measure frame times during recording
  useFrame(() => {
    if (!isRecording) return;

    const now = performance.now();

    if (lastFrameTime.current > 0) {
      const frameTime = now - lastFrameTime.current;
      totalFrameTime.current += frameTime;
    }

    lastFrameTime.current = now;
    frameCount.current++;
  });

  return null;
}
