import { Vector3 } from 'three';
import { create } from 'zustand';

export type CameraState = 'main' | 'previous' | 'current';
export type ControlType = 'Map' | 'CameraControls' | 'Disabled';
export type IntroPhase = 'intro' | 'transition' | 'complete';

export interface CameraStore {
  // Camera Properties
  position: Vector3;
  target: Vector3;
  previousPosition: Vector3 | null;
  previousTarget: Vector3 | null;
  selectedPoi: any | null;
  introPhase: IntroPhase;

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
  beginIntroTransition: () => void;
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

  // Sync action
  syncCameraPosition: (position: Vector3, target: Vector3) => void;

  // POI navigation
  currentPoiIndex: number;
  setCurrentPoiIndex: (index: number) => void;
  navigateToNextPoi: (points: any[]) => void;
  navigateToPreviousPoi: (points: any[]) => void;

  // Store active GSAP timeline to prevent premature cleanup
  activeTimeline: gsap.core.Timeline | null;
}

export type CameraStoreCreator = ReturnType<typeof create<CameraStore>>;
