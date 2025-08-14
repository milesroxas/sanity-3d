import { Vector3 } from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { animateCameraMovement } from '../animationUtils';

describe('animateCameraMovement', () => {
  let now = 0;

  beforeEach(() => {
    now = 0;
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    vi.useRealTimers();
    (performance.now as any).mockRestore?.();
  });

  it('interpolates from start to end and calls onComplete', () => {
    const startPos = new Vector3(0, 0, 0);
    const endPos = new Vector3(10, 10, 10);
    const startTarget = new Vector3(0, 0, 0);
    const endTarget = new Vector3(10, 0, 0);

    const positions: Vector3[] = [];
    const targets: Vector3[] = [];
    const onComplete = vi.fn();

    const cleanup = animateCameraMovement(
      startPos,
      endPos,
      startTarget,
      endTarget,
      (p, t) => {
        positions.push(p.clone());
        targets.push(t.clone());
      },
      { duration: 1000, onComplete }
    );

    // Drive the RAF loop
    for (let i = 0; i <= 10; i++) {
      now = i * 100;
      vi.advanceTimersByTime(16);
      requestAnimationFrame(() => {});
    }

    // Ensure last entry equals end
    const lastPos = positions[positions.length - 1];
    const lastTarget = targets[targets.length - 1];
    expect(lastPos.x).toBeCloseTo(10, 1);
    expect(lastPos.y).toBeCloseTo(10, 1);
    expect(lastPos.z).toBeCloseTo(10, 1);
    expect(lastTarget.x).toBeCloseTo(10, 1);
    expect(onComplete).toHaveBeenCalled();

    cleanup();
  });
});
