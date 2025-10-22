/**
 * Camera Store - Domain-Driven Design Implementation
 * This is the main store file that should be imported by domain layer components
 * UI components should use selectors from './camera/cameraSelectors' for optimal performance
 */

import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import gsap from 'gsap';
import { Vector3 } from 'three';
import { create } from 'zustand';
import { CAMERA_CONFIG, INITIAL_POSITIONS } from './camera/cameraConfig';
import type { CameraStore } from './camera/cameraTypes';

// Re-export domain types and config for convenience
export { CAMERA_CONFIG, INITIAL_POSITIONS } from './camera/cameraConfig';
export type { CameraState, ControlType, IntroPhase } from './camera/cameraTypes';

// Re-export backwards compatibility aliases
export const CAMERA_CONSTRAINTS = {
  bounds: CAMERA_CONFIG.constraints.bounds,
  maxDistance: CAMERA_CONFIG.constraints.distance.max,
  minDistance: CAMERA_CONFIG.constraints.distance.min,
};
export const ANGLE_LIMITS = CAMERA_CONFIG.constraints.angles;

export const useCameraStore = create<CameraStore>((set, get) => ({
  // Initial State
  position: INITIAL_POSITIONS.mainIntro.position.clone(),
  target: INITIAL_POSITIONS.mainIntro.target.clone(),
  previousPosition: null,
  previousTarget: null,
  controlType: 'Disabled',
  isAnimating: false,
  state: 'main',
  isLoading: true,
  selectedPoi: null,
  currentPoiIndex: 0,
  firstTimeLoading: true,
  introPhase: 'intro',
  activeTimeline: null,
  // Camera Actions
  resetToInitial: () => {
    useLogoMarkerStore.getState().setOtherMarkersVisible(false);

    // Reset to intro state and wait for loading to complete
    set({
      introPhase: 'intro',
      position: INITIAL_POSITIONS.mainIntro.position.clone(),
      target: INITIAL_POSITIONS.mainIntro.target.clone(),
      isAnimating: false,
      controlType: 'Disabled',
      isLoading: true,
    });
  },

  setPreviousCamera: (position, target) =>
    set({
      previousPosition: position.clone(),
      previousTarget: target.clone(),
    }),

  restorePreviousCamera: () =>
    set({
      position: get().previousPosition?.clone() || INITIAL_POSITIONS.main.position.clone(),
      target: get().previousTarget?.clone() || INITIAL_POSITIONS.main.target.clone(),
      previousPosition: null,
      previousTarget: null,
      controlType: 'Map',
      isAnimating: false,
      isLoading: false,
      state: 'main',
    }),

  setCamera: (position, target, state = 'current') =>
    set(prev => {
      if (get().isLoading) return prev;

      if (state === 'main') {
        return {
          position: position.clone(),
          target: target.clone(),
          isAnimating: true,
          isLoading: false,
          state,
        };
      }

      return {
        position: position.clone(),
        target: target.clone(),
        isAnimating: true,
        isLoading: false,
        state,
      };
    }),

  // State Actions
  setControlType: controlType => set({ controlType }),
  setIsAnimating: isAnimating => set({ isAnimating }),

  // Add debounce to prevent rapid loading state changes
  setIsLoading: isLoading => {
    // Only update if the state is actually changing to prevent unnecessary re-renders
    if (get().isLoading !== isLoading) {
      // If we're turning loading off, do it immediately and ensure controls are re-enabled
      if (!isLoading) {
        set({ isLoading });
        // Allow next frame(s) to settle before enabling controls
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const currentStore = get();
            if (
              currentStore.state === 'main' &&
              !currentStore.isAnimating &&
              currentStore.introPhase === 'complete'
            ) {
              set({ controlType: 'Map' });
            }
          });
        });
      } else {
        // When turning loading on, we can set it directly
        set({ isLoading });
      }
    }
  },

  setSelectedPoi: poi => set({ selectedPoi: poi }),

  beginIntroTransition: () => {
    const { introPhase, isAnimating, position, target } = get();

    console.log('[beginIntroTransition] CALLED', {
      introPhase,
      isAnimating,
      willRun: introPhase === 'intro' && !isAnimating,
    });

    if (introPhase !== 'intro' || isAnimating) {
      console.warn('[beginIntroTransition] BLOCKED - Guard condition failed', {
        introPhase,
        isAnimating,
        reason: introPhase !== 'intro' ? 'introPhase is not "intro"' : 'isAnimating is true',
      });
      return;
    }

    console.log('[beginIntroTransition] START', {
      position: `(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`,
      target: `(${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)})`,
    });

    useLogoMarkerStore.getState().setOtherMarkersVisible(false);

    // Atomic state update - only update state flags, not position/target
    // Don't clone position/target to avoid triggering unnecessary re-renders
    set({
      introPhase: 'transition',
      isAnimating: true,
      controlType: 'Disabled',
    });

    console.log('[beginIntroTransition] After set(), before GSAP');

    // Start GSAP animation with current position as starting point
    get().startCameraTransition(
      position,
      INITIAL_POSITIONS.main.position,
      target,
      INITIAL_POSITIONS.main.target
    );
  },

  // Animation using GSAP instead of animationUtils
  startCameraTransition: (startPos, endPos, startTarget, endTarget) => {
    // Position/target should already be set by caller to avoid race conditions
    // GSAP will handle updates during animation via onUpdate callback

    console.log('[startCameraTransition] Received:', {
      startPos: `(${startPos.x.toFixed(2)}, ${startPos.y.toFixed(2)}, ${startPos.z.toFixed(2)})`,
      startTarget: `(${startTarget.x.toFixed(2)}, ${startTarget.y.toFixed(2)}, ${startTarget.z.toFixed(2)})`,
      endPos: `(${endPos.x.toFixed(2)}, ${endPos.y.toFixed(2)}, ${endPos.z.toFixed(2)})`,
      endTarget: `(${endTarget.x.toFixed(2)}, ${endTarget.y.toFixed(2)}, ${endTarget.z.toFixed(2)})`,
    });

    // Kill any existing timeline to prevent conflicts
    const existingTimeline = get().activeTimeline;
    if (existingTimeline) {
      console.log('[startCameraTransition] Killing existing timeline');
      existingTimeline.kill();
    }

    // Create proxy objects for GSAP to animate
    const positionProxy = {
      x: startPos.x,
      y: startPos.y,
      z: startPos.z,
    };

    const targetProxy = {
      x: startTarget.x,
      y: startTarget.y,
      z: startTarget.z,
    };

    // Performance optimization: Use a single Vector3 instance for updates
    const newPosition = new Vector3();
    const newTarget = new Vector3();

    let frameCount = 0;
    // Create a GSAP timeline for better control
    const tl = gsap.timeline({
      onStart: () => {
        console.log('[GSAP Timeline] Started');
      },
      onUpdate: () => {
        // Update the store with the new position and target during animation
        // Reuse Vector3 instances instead of creating new ones each frame
        newPosition.set(positionProxy.x, positionProxy.y, positionProxy.z);
        newTarget.set(targetProxy.x, targetProxy.y, targetProxy.z);

        if (frameCount < 3) {
          console.log(`[GSAP Frame ${frameCount}]`, {
            position: `(${positionProxy.x.toFixed(2)}, ${positionProxy.y.toFixed(2)}, ${positionProxy.z.toFixed(2)})`,
            target: `(${targetProxy.x.toFixed(2)}, ${targetProxy.y.toFixed(2)}, ${targetProxy.z.toFixed(2)})`,
          });
        }
        frameCount++;

        // Clone vectors before setting to avoid reference issues
        set({ position: newPosition.clone(), target: newTarget.clone() });
      },
      onComplete: () => {
        console.log('[GSAP Timeline] Completed');

        set({
          introPhase: 'complete',
          firstTimeLoading: false,
          controlType: 'Map',
          activeTimeline: null, // Clear timeline reference
        });
        useLogoMarkerStore.getState().setOtherMarkersVisible(true);

        // Use the final values directly to avoid unnecessary object creation
        newPosition.copy(endPos);
        newTarget.copy(endTarget);

        set({
          isAnimating: false,
          position: newPosition,
          target: newTarget,
          previousPosition: startPos.clone(),
          previousTarget: startTarget.clone(),
        });

        // Use requestAnimationFrame instead of setTimeout for better timing
        requestAnimationFrame(() => {
          if (!get) return;
          set({ controlType: get().state === 'main' ? 'Map' : 'CameraControls' });
          useLogoMarkerStore.getState().setOtherMarkersVisible(true);
        });
      },
    });

    // Add animations to the timeline with performance optimizations
    tl.to(
      positionProxy,
      {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration: CAMERA_CONFIG.animation.introDuration,
        ease: CAMERA_CONFIG.animation.introEase,
        overwrite: 'auto', // Prevents conflicting animations
        lazy: false, // Improves accuracy for 3D animations
      },
      0
    );

    tl.to(
      targetProxy,
      {
        x: endTarget.x,
        y: endTarget.y,
        z: endTarget.z,
        duration: CAMERA_CONFIG.animation.introDuration,
        ease: CAMERA_CONFIG.animation.introEase,
        overwrite: 'auto',
        lazy: false,
      },
      0
    );

    console.log(
      '[GSAP Timeline] Duration:',
      tl.duration(),
      'seconds (configured:',
      CAMERA_CONFIG.animation.introDuration,
      's)'
    );

    // Store timeline in state to prevent it from being garbage collected
    set({ activeTimeline: tl });
  },

  // New action
  syncCameraPosition: (position, target) =>
    set({
      position: position.clone(),
      target: target.clone(),
    }),

  // Add new actions
  setCurrentPoiIndex: index => set({ currentPoiIndex: index }),

  navigateToNextPoi: points => {
    const { currentPoiIndex, position, target } = get();
    const nextIndex = (currentPoiIndex + 1) % points.length;
    const nextPoi = points[nextIndex];

    if (nextPoi.cameraPosition && nextPoi.cameraTarget) {
      // Atomic state update to prevent race conditions
      set({
        currentPoiIndex: nextIndex,
        isAnimating: true,
        controlType: 'Disabled',
        selectedPoi: nextPoi,
      });

      get().startCameraTransition(
        position,
        new Vector3(nextPoi.cameraPosition.x, nextPoi.cameraPosition.y, nextPoi.cameraPosition.z),
        target,
        new Vector3(nextPoi.cameraTarget.x, nextPoi.cameraTarget.y, nextPoi.cameraTarget.z)
      );
    }
  },

  navigateToPreviousPoi: points => {
    const { currentPoiIndex, position, target } = get();
    const previousIndex = currentPoiIndex === 0 ? points.length - 1 : currentPoiIndex - 1;
    const previousPoi = points[previousIndex];

    if (previousPoi.cameraPosition && previousPoi.cameraTarget) {
      // Atomic state update to prevent race conditions
      set({
        currentPoiIndex: previousIndex,
        isAnimating: true,
        controlType: 'Disabled',
        selectedPoi: previousPoi,
      });

      get().startCameraTransition(
        position,
        new Vector3(
          previousPoi.cameraPosition.x,
          previousPoi.cameraPosition.y,
          previousPoi.cameraPosition.z
        ),
        target,
        new Vector3(
          previousPoi.cameraTarget.x,
          previousPoi.cameraTarget.y,
          previousPoi.cameraTarget.z
        )
      );
    }
  },

  reset: () => {
    // Reset to initial intro state and wait for loading to complete
    useLogoMarkerStore.getState().setOtherMarkersVisible(false);
    set({
      position: INITIAL_POSITIONS.mainIntro.position.clone(),
      target: INITIAL_POSITIONS.mainIntro.target.clone(),
      controlType: 'Disabled',
      isAnimating: false,
      state: 'main',
      isLoading: true,
      currentPoiIndex: 0,
      firstTimeLoading: true,
      selectedPoi: null,
      previousPosition: null,
      previousTarget: null,
      introPhase: 'intro',
    });
  },
}));

/**
 * Re-export optimized selectors for UI components
 * Using these selectors prevents unnecessary re-renders by subscribing only to needed state slices
 *
 * @example
 * // BAD - subscribes to entire store, re-renders on every position update (60fps)
 * const { isLoading, introPhase } = useCameraStore();
 *
 * // GOOD - only subscribes to specific fields, re-renders only when they change
 * const isLoading = useCameraStore(selectIsLoading);
 * const introPhase = useCameraStore(selectIntroPhase);
 */
export {
  // Action Selectors
  selectBeginIntroTransition,
  // Camera State Selectors
  selectControlType,
  // POI Selectors
  selectCurrentPoiIndex,
  // UI Layer Selectors
  selectIntroPhase,
  selectIsAnimating,
  selectIsLoading,
  selectNavigateToNextPoi,
  selectNavigateToPreviousPoi,
  selectPosition,
  selectResetToInitial,
  selectSelectedPoi,
  selectSetCamera,
  selectSetControlType,
  selectSetCurrentPoiIndex,
  selectSetIsAnimating,
  selectSetSelectedPoi,
  selectStartCameraTransition,
  selectSyncCameraPosition,
  selectTarget,
} from './camera/cameraSelectors';
