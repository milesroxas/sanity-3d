import { Vector3 } from 'three';
import { create } from 'zustand';

/**
 * POI Instance Store
 *
 * Manages state for global material texture transitions.
 * Tracks which POI is active for transitions.
 *
 * State Flow:
 * 1. User clicks logo marker → setActivePoi(slug, cameraTarget)
 * 2. useMaterialTextureTransition hook detects state change
 * 3. All instances transition from defaultTexture to activeTexture
 * 4. User navigates back → resetToDefault()
 *
 * Note: Texture paths are now fixed and pre-loaded for performance.
 * See TexturePreloader component for texture management.
 */
interface POIInstanceState {
  // Camera target position (where camera is looking at)
  cameraTargetPosition: Vector3 | null;

  // Currently active POI slug (e.g., "resort", "events")
  activePoi: string | null;

  // Transition radius in scene units
  // Instances within this distance from camera target will transition
  transitionRadius: number;

  // Transition animation state
  isTransitioning: boolean;

  // Actions
  setActivePoi: (slug: string, cameraTarget: Vector3) => void;
  setTransitionRadius: (radius: number) => void;
  startTransition: () => void;
  completeTransition: () => void;
  resetToDefault: () => void;
  reset: () => void;
}

export const usePoiInstanceStore = create<POIInstanceState>(set => ({
  // Initial State
  cameraTargetPosition: null,
  activePoi: null,
  transitionRadius: 80, // Default radius - adjust based on scene scale
  isTransitioning: false,

  // Actions
  setActivePoi: (slug, cameraTarget) =>
    set({
      activePoi: slug,
      cameraTargetPosition: cameraTarget.clone(),
      isTransitioning: true,
    }),

  setTransitionRadius: radius => set({ transitionRadius: radius }),

  startTransition: () => set({ isTransitioning: true }),

  completeTransition: () => set({ isTransitioning: false }),

  resetToDefault: () =>
    set({
      isTransitioning: true,
      activePoi: null,
      cameraTargetPosition: null,
    }),

  reset: () =>
    set({
      cameraTargetPosition: null,
      activePoi: null,
      isTransitioning: false,
    }),
}));
