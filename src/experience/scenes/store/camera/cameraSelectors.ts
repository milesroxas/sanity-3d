import { CameraStore } from './cameraTypes';

/**
 * Camera Selectors - Single source of truth for accessing camera state
 * Following FSD principles, these selectors ensure optimal re-render performance
 * by subscribing only to the specific state slices needed by each component
 *
 * NOTE: Selectors that return objects should be used with shallow equality comparison
 * to avoid infinite loops. Prefer using individual selectors when possible.
 */

// === UI Layer Selectors ===
// For components that need to know about intro state but not camera position updates

export const selectIsLoading = (state: CameraStore) => state.isLoading;
export const selectIntroPhase = (state: CameraStore) => state.introPhase;

// === Camera Position Selectors ===
// For 3D components that need real-time camera updates
// IMPORTANT: These return primitives/direct references, safe to use without shallow

export const selectPosition = (state: CameraStore) => state.position;
export const selectTarget = (state: CameraStore) => state.target;
export const selectControlType = (state: CameraStore) => state.controlType;
export const selectIsAnimating = (state: CameraStore) => state.isAnimating;

// === Action Selectors ===
// Actions never cause re-renders, safe to select individually
// These return stable function references

export const selectResetToInitial = (state: CameraStore) => state.resetToInitial;
export const selectBeginIntroTransition = (state: CameraStore) => state.beginIntroTransition;
export const selectSyncCameraPosition = (state: CameraStore) => state.syncCameraPosition;
export const selectSetControlType = (state: CameraStore) => state.setControlType;
export const selectSetIsAnimating = (state: CameraStore) => state.setIsAnimating;
export const selectSetCamera = (state: CameraStore) => state.setCamera;
export const selectStartCameraTransition = (state: CameraStore) => state.startCameraTransition;

// === POI Selectors ===

export const selectSelectedPoi = (state: CameraStore) => state.selectedPoi;
export const selectCurrentPoiIndex = (state: CameraStore) => state.currentPoiIndex;
export const selectSetSelectedPoi = (state: CameraStore) => state.setSelectedPoi;
export const selectSetCurrentPoiIndex = (state: CameraStore) => state.setCurrentPoiIndex;
export const selectNavigateToNextPoi = (state: CameraStore) => state.navigateToNextPoi;
export const selectNavigateToPreviousPoi = (state: CameraStore) => state.navigateToPreviousPoi;
