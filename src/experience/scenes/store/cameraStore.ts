import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { animateCameraMovement } from '@/experience/utils/animationUtils';
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
    position: new Vector3(-16.4, 300, 160),
    target: new Vector3(-20.15, 10, 50),
  },
  main: {
    position: new Vector3(-16.4, 85.39, 239.66),
    target: new Vector3(-20.15, 18, -1.06),
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

    // Start the transition to main position immediately
    get().startCameraTransition(
      INITIAL_POSITIONS.mainIntro.position,
      INITIAL_POSITIONS.main.position,
      INITIAL_POSITIONS.mainIntro.target,
      INITIAL_POSITIONS.main.target
    );
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

  // Animation
  startCameraTransition: (startPos, endPos, startTarget, endTarget) => {
    // Force clean state for the intro animation
    set({
      controlType: 'Disabled',
      isAnimating: true,
      isLoading: false,
    });

    animateCameraMovement(
      startPos,
      endPos,
      startTarget,
      endTarget,
      (position, target) => {
        // Update the store with the new position and target
        set({ position, target });
      },
      {
        duration: 4000,
        onComplete: () => {
          set({
            isAnimating: false,
            position: endPos.clone(),
            target: endTarget.clone(),
            previousPosition: startPos.clone(),
            previousTarget: startTarget.clone(),
          });

          setTimeout(() => {
            if (!get) return;
            set({ controlType: get().state === 'main' ? 'Map' : 'CameraControls' });
            useLogoMarkerStore.getState().setOtherMarkersVisible(true);
          }, 100);
        },
      }
    );
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

    // Give the camera a moment to update before starting animation
    setTimeout(() => {
      set({ isLoading: false });
      get().startCameraTransition(
        startPos,
        INITIAL_POSITIONS.main.position,
        startTarget,
        INITIAL_POSITIONS.main.target
      );
    }, 50);
  },
}));
