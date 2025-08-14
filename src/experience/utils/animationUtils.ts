import { Vector3 } from 'three';

type AnimationCallback = (position: Vector3, target: Vector3) => void;
type CleanupCallback = () => void;

interface AnimationOptions {
  duration?: number;
  easing?: (progress: number) => number;
  onComplete?: () => void;
}

/**
 * Cubic easing function used throughout the application
 */
export const cubicEasing = (progress: number): number => {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

/**
 * Animates camera movement between two positions and targets
 * @returns A cleanup function to cancel the animation
 */
export const animateCameraMovement = (
  startPos: Vector3,
  endPos: Vector3,
  startTarget: Vector3,
  endTarget: Vector3,
  callback: AnimationCallback,
  options: AnimationOptions = {}
): CleanupCallback => {
  const { duration = 2000, easing = cubicEasing, onComplete } = options;

  const startTime = performance.now();
  let animationFrameId: number | null = null;

  const animate = () => {
    const now = performance.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1) {
      // Ensure we're exactly at the end position
      callback(endPos.clone(), endTarget.clone());

      if (onComplete) {
        onComplete();
      }
    } else {
      const t = easing(progress);

      const newPosition = new Vector3().lerpVectors(startPos, endPos, t);
      const newTarget = new Vector3().lerpVectors(startTarget, endTarget, t);

      callback(newPosition, newTarget);
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  // Return cleanup function
  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};
