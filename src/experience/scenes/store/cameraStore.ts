import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import gsap from 'gsap';
import { Vector3 } from 'three';
import { create } from 'zustand';

type CameraState = 'main' | 'previous' | 'current';
type ControlType = 'Map' | 'CameraControls' | 'Disabled';

interface CameraStore {
  // Camera Properties
  position: Vector3;
  target: Vector3;
  previousPosition: Vector3 | null;
  previousTarget: Vector3 | null;
  selectedPoi: any | null;

  // State Properties
  controlType: ControlType;
  isAnimating: boolean;
  state: CameraState;
  isLoading: boolean;
  firstTimeLoading: boolean;
  // Camera Actions
  setCamera: (position: Vector3, target: Vector3, state?: CameraState) => void;
  setPreviousCamera: (position: Vector3, target: Vector3) => void;
  restorePreviousCamera: () => void;
  resetToInitial: () => void;
  startCameraTransition: (
    startPos: Vector3,
    endPos: Vector3,
    startTarget: Vector3,
    endTarget: Vector3
  ) => void;

  // State Actions
  setControlType: (type: ControlType) => void;
  setIsAnimating: (state: boolean) => void;
  setIsLoading: (state: boolean) => void;
  setSelectedPoi: (poi: any | null) => void;
  reset: () => void;

  // New action
  syncCameraPosition: (position: Vector3, target: Vector3) => void;

  // Add to CameraStore interface
  currentPoiIndex: number;
  setCurrentPoiIndex: (index: number) => void;
  navigateToNextPoi: (points: any[]) => void;
  navigateToPreviousPoi: (points: any[]) => void;
}

export const INITIAL_POSITIONS = {
  mainIntro: {
    position: new Vector3(-606.4, 120, 80),
    target: new Vector3(-20.15, 50, 0),
  },
  main: {
    position: new Vector3(-16.4, 45, 250),
    target: new Vector3(-20.15, 22, -1.06),
  },
} as const;

export const useCameraStore = create<CameraStore>((set, get) => ({
  // Initial State
  position: INITIAL_POSITIONS.mainIntro.position.clone(),
  target: INITIAL_POSITIONS.mainIntro.target.clone(),
  previousPosition: null,
  previousTarget: null,
  controlType: 'Disabled',
  isAnimating: true,
  state: 'main',
  isLoading: false,
  selectedPoi: null,
  currentPoiIndex: 0,
  firstTimeLoading: true,

  // Camera Actions
  resetToInitial: () => {
    // Always start from mainIntro and animate to main
    set({
      position: INITIAL_POSITIONS.mainIntro.position.clone(),
      target: INITIAL_POSITIONS.mainIntro.target.clone(),
      isAnimating: true,
      controlType: 'Disabled',
    });

    // Delay one frame to ensure renderer/canvas settled to avoid flicker, then start
    requestAnimationFrame(() => {
      get().startCameraTransition(
        INITIAL_POSITIONS.mainIntro.position,
        INITIAL_POSITIONS.main.position,
        INITIAL_POSITIONS.mainIntro.target,
        INITIAL_POSITIONS.main.target
      );
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
        setTimeout(() => {
          if (get().state === 'main' && !get().isAnimating) {
            set({ controlType: 'Map' });
          }
        }, 150);
      } else {
        // When turning loading on, we can set it directly
        set({ isLoading });
      }
    }
  },

  setSelectedPoi: poi => set({ selectedPoi: poi }),

  // Animation using GSAP instead of animationUtils
  startCameraTransition: (startPos, endPos, startTarget, endTarget) => {
    // Force clean state for the intro animation
    set({
      controlType: 'Disabled',
      isAnimating: true,
      isLoading: false,
    });

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

    // Create a GSAP timeline for better control
    const tl = gsap.timeline({
      onUpdate: () => {
        // Update the store with the new position and target during animation
        // Reuse Vector3 instances instead of creating new ones each frame
        newPosition.set(positionProxy.x, positionProxy.y, positionProxy.z);
        newTarget.set(targetProxy.x, targetProxy.y, targetProxy.z);
        set({ position: newPosition, target: newTarget });
      },
      onComplete: () => {
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
        duration: 6,
        ease: 'power2.inOut',
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
        duration: 6,
        ease: 'power2.inOut',
        overwrite: 'auto',
        lazy: false,
      },
      0
    );

    // Stabilize DPR during the first 0.75s of the intro movement to avoid flicker
    tl.add(() => {
      // lock animating flag to true early (already true), then release a bit later
    }, 0);
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
    const currentIndex = get().currentPoiIndex;
    const nextIndex = (currentIndex + 1) % points.length;
    const nextPoi = points[nextIndex];

    if (nextPoi.cameraPosition && nextPoi.cameraTarget) {
      set({ currentPoiIndex: nextIndex });
      get().startCameraTransition(
        get().position,
        new Vector3(nextPoi.cameraPosition.x, nextPoi.cameraPosition.y, nextPoi.cameraPosition.z),
        get().target,
        new Vector3(nextPoi.cameraTarget.x, nextPoi.cameraTarget.y, nextPoi.cameraTarget.z)
      );
      get().setSelectedPoi(nextPoi);
    }
  },

  navigateToPreviousPoi: points => {
    const currentIndex = get().currentPoiIndex;
    const previousIndex = currentIndex === 0 ? points.length - 1 : currentIndex - 1;
    const previousPoi = points[previousIndex];

    if (previousPoi.cameraPosition && previousPoi.cameraTarget) {
      set({ currentPoiIndex: previousIndex });
      get().startCameraTransition(
        get().position,
        new Vector3(
          previousPoi.cameraPosition.x,
          previousPoi.cameraPosition.y,
          previousPoi.cameraPosition.z
        ),
        get().target,
        new Vector3(
          previousPoi.cameraTarget.x,
          previousPoi.cameraTarget.y,
          previousPoi.cameraTarget.z
        )
      );
      get().setSelectedPoi(previousPoi);
    }
  },

  reset: () => {
    const startPos = INITIAL_POSITIONS.mainIntro.position.clone();
    const startTarget = INITIAL_POSITIONS.mainIntro.target.clone();

    // Immediately set the camera to the starting position to prevent any flash
    set({
      // Set position and target immediately
      position: startPos.clone(),
      target: startTarget.clone(),

      // Reset all other state properties
      controlType: 'Disabled',
      isAnimating: true,
      state: 'main',
      isLoading: true, // Set to true while initializing
      currentPoiIndex: 0,
      firstTimeLoading: true,
      selectedPoi: null,
      previousPosition: null,
      previousTarget: null,
    });

    // Start transition immediately without timeouts
    set({ isLoading: false });
    get().startCameraTransition(
      startPos,
      INITIAL_POSITIONS.main.position,
      startTarget,
      INITIAL_POSITIONS.main.target
    );
  },
}));
