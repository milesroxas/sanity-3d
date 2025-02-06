import { create } from "zustand";
import { Vector3 } from "three";
import { PointOfInterest } from "@/experience/scenes/subScene/components/SubSceneMarkers";

type CameraState = "main" | "previous" | "current" | "subscene";
type ControlType = "Map" | "CameraControls" | "Disabled";

interface CameraStore {
  // Camera Properties
  position: Vector3;
  target: Vector3;
  previousPosition: Vector3 | null;
  previousTarget: Vector3 | null;
  selectedPoi: PointOfInterest | null;

  // State Properties
  controlType: ControlType;
  isAnimating: boolean;
  state: CameraState;
  isSubscene: boolean;
  isLoading: boolean;

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
  setIsSubscene: (state: boolean) => void;
  setIsLoading: (state: boolean) => void;
  setSelectedPoi: (poi: PointOfInterest | null) => void;

  // New action
  syncCameraPosition: (position: Vector3, target: Vector3) => void;

  // Add to CameraStore interface
  currentPoiIndex: number;
  setCurrentPoiIndex: (index: number) => void;
  navigateToNextPoi: (points: PointOfInterest[]) => void;
  navigateToPreviousPoi: (points: PointOfInterest[]) => void;
}

export const INITIAL_POSITIONS = {
  main: {
    position: new Vector3(-10, 60, 200),
    target: new Vector3(-10, 10, 50),
  },
  subscene: {
    position: new Vector3(-20, 10, 40),
    target: new Vector3(0, 4.5, 7.0),
  },
} as const;

export const useCameraStore = create<CameraStore>((set, get) => ({
  // Initial State
  position: INITIAL_POSITIONS.main.position.clone(),
  target: INITIAL_POSITIONS.main.target.clone(),
  previousPosition: null,
  previousTarget: null,
  controlType: "Map",
  isAnimating: false,
  state: "main",
  isSubscene: false,
  isLoading: false,
  selectedPoi: null,
  currentPoiIndex: 0,

  // Camera Actions
  resetToInitial: () => {
    if (get().isLoading) return;
    const initial = INITIAL_POSITIONS[get().isSubscene ? "subscene" : "main"];
    set({
      position: initial.position.clone(),
      target: initial.target.clone(),
      isAnimating: false,
      controlType: get().isSubscene ? "CameraControls" : "Map",
    });
  },

  setPreviousCamera: (position, target) =>
    set({
      previousPosition: position.clone(),
      previousTarget: target.clone(),
    }),

  restorePreviousCamera: () =>
    set({
      position:
        get().previousPosition?.clone() ||
        INITIAL_POSITIONS.main.position.clone(),
      target:
        get().previousTarget?.clone() || INITIAL_POSITIONS.main.target.clone(),
      previousPosition: null,
      previousTarget: null,
      controlType: "Map",
      isAnimating: false,
      isSubscene: false,
      isLoading: false,
      state: "main",
    }),

  setCamera: (position, target, state = "current") =>
    set((prev) => {
      if (get().isLoading) return prev;

      if (state === "subscene") {
        return {
          position: INITIAL_POSITIONS.subscene.position.clone(),
          target: INITIAL_POSITIONS.subscene.target.clone(),
          isAnimating: false,
          isLoading: false,
          state,
          isSubscene: true,
          controlType: "CameraControls",
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
  setControlType: (controlType) => set({ controlType }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSubscene: (isSubscene) =>
    set({
      isSubscene,
      isLoading: false,
      ...(isSubscene && {
        position: INITIAL_POSITIONS.subscene.position.clone(),
        target: INITIAL_POSITIONS.subscene.target.clone(),
        controlType: "CameraControls",
      }),
    }),
  setSelectedPoi: (poi) => set({ selectedPoi: poi }),

  // Animation
  startCameraTransition: (startPos, endPos, startTarget, endTarget) => {
    set({
      controlType: "Disabled",
      isAnimating: true,
      isLoading: false,
    });

    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        set({
          isAnimating: false,
          isLoading: false,
          position: endPos.clone(),
          target: endTarget.clone(),
          previousPosition: startPos.clone(),
          previousTarget: startTarget.clone(),
        });
      } else {
        const t =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const newPosition = new Vector3().lerpVectors(startPos, endPos, t);
        const newTarget = new Vector3().lerpVectors(startTarget, endTarget, t);

        set({ position: newPosition, target: newTarget });
        requestAnimationFrame(animate);
      }
    };

    animate();
  },

  // New action
  syncCameraPosition: (position, target) =>
    set({
      position: position.clone(),
      target: target.clone(),
    }),

  // Add new actions
  setCurrentPoiIndex: (index) => set({ currentPoiIndex: index }),

  navigateToNextPoi: (points) => {
    const currentIndex = get().currentPoiIndex;
    const nextIndex = (currentIndex + 1) % points.length;
    const nextPoi = points[nextIndex];

    console.log("NavigateToNextPoi:", { currentIndex, nextIndex, nextPoi });

    if (nextPoi.cameraPosition && nextPoi.cameraTarget) {
      console.log("Starting camera transition to next POI");
      set({ currentPoiIndex: nextIndex });
      get().startCameraTransition(
        get().position,
        new Vector3(
          nextPoi.cameraPosition.x,
          nextPoi.cameraPosition.y,
          nextPoi.cameraPosition.z
        ),
        get().target,
        new Vector3(
          nextPoi.cameraTarget.x,
          nextPoi.cameraTarget.y,
          nextPoi.cameraTarget.z
        )
      );
      get().setSelectedPoi(nextPoi);
    } else {
      console.warn("Missing camera position or target for next POI:", nextPoi);
    }
  },

  navigateToPreviousPoi: (points) => {
    const currentIndex = get().currentPoiIndex;
    const previousIndex =
      currentIndex === 0 ? points.length - 1 : currentIndex - 1;
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
}));
