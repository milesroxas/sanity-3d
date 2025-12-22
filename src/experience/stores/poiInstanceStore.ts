import { Vector3 } from 'three';
import { create } from 'zustand';

/**
 * POI Instance Store
 *
 * Manages state for proximity-based instance texture transitions.
 * Tracks which POI is active, where the camera is looking, and which textures to use.
 *
 * State Flow:
 * 1. User clicks logo marker → setActivePoi(slug, cameraTarget, textures)
 * 2. ProximityInstanceGroup calculates distances from cameraTargetPosition
 * 3. Near instances transition to activeTexture, far instances stay on defaultTexture
 * 4. User navigates back → resetToDefault()
 */
interface POIInstanceState {
  // Camera target position (where camera is looking at)
  cameraTargetPosition: Vector3 | null;

  // Currently active POI slug (e.g., "resort", "events")
  activePoi: string | null;

  // Transition radius in scene units
  // Instances within this distance from camera target will transition
  transitionRadius: number;

  // Texture paths for current POI
  defaultTexture: string;
  activeTexture: string;

  // Transition animation state
  isTransitioning: boolean;

  // Actions
  setActivePoi: (
    slug: string,
    cameraTarget: Vector3,
    defaultTex: string,
    activeTex: string
  ) => void;
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
  defaultTexture: '/textures/color-atlas-muted-1.jpg',
  activeTexture: '/textures/color-atlas-new2.png',
  isTransitioning: false,

  // Actions
  setActivePoi: (slug, cameraTarget, defaultTex, activeTex) =>
    set({
      activePoi: slug,
      cameraTargetPosition: cameraTarget.clone(),
      defaultTexture: defaultTex,
      activeTexture: activeTex,
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
      defaultTexture: '/textures/color-atlas-muted-1.jpg',
      activeTexture: '/textures/color-atlas-new2.png',
      isTransitioning: false,
    }),
}));
