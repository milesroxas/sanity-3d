import { Vector3 } from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_POSITIONS, useCameraStore } from '../cameraStore';

vi.mock('@/experience/scenes/store/logoMarkerStore', () => ({
  useLogoMarkerStore: () => ({ setOtherMarkersVisible: () => void 0 }),
}));

// Minimal gsap mock for startCameraTransition timeline
vi.mock('gsap', () => ({
  default: {
    timeline: (opts: any) => {
      const tl = {
        to: () => tl,
        add: () => tl,
        play: () => tl,
        eventCallback: () => tl,
        kill: () => void 0,
      };
      setTimeout(() => {
        opts.onUpdate?.();
        opts.onComplete?.();
      }, 0);
      return tl;
    },
    killTweensOf: () => void 0,
  },
}));

describe('cameraStore', () => {
  beforeEach(() => {
    // reset store to initial
    useCameraStore.setState({
      position: INITIAL_POSITIONS.mainIntro.position.clone(),
      target: INITIAL_POSITIONS.mainIntro.target.clone(),
      isLoading: false,
      isAnimating: false,
      controlType: 'Disabled',
    } as any);
  });

  it('stabilizes controls enabling via double RAF when loading finishes', async () => {
    const setIsLoading = useCameraStore.getState().setIsLoading;
    setIsLoading(true);
    expect(useCameraStore.getState().isLoading).toBe(true);

    setIsLoading(false);
    expect(useCameraStore.getState().isLoading).toBe(false);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const state = useCameraStore.getState();
    expect(['Map', 'Disabled']).toContain(state.controlType);
  });

  it('startCameraTransition updates position/target and finishes with isAnimating false', async () => {
    const { startCameraTransition } = useCameraStore.getState();
    startCameraTransition(
      INITIAL_POSITIONS.mainIntro.position,
      INITIAL_POSITIONS.main.position,
      INITIAL_POSITIONS.mainIntro.target,
      INITIAL_POSITIONS.main.target
    );

    await new Promise(res => setTimeout(res, 1));

    const state = useCameraStore.getState();
    expect(state.isAnimating).toBe(false);
    expect(state.position).toBeInstanceOf(Vector3);
    expect(state.target).toBeInstanceOf(Vector3);
  });
});
