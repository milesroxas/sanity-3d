/**
 * Camera Domain - Public API
 *
 * This is the single entry point for the camera domain following Domain-Driven Design principles.
 * Import from this file to ensure proper separation of concerns and optimal performance.
 *
 * @example
 * // UI Components (prevent unnecessary re-renders)
 * import { useCameraStore, selectIsLoading, selectIntroPhase } from '@/experience/scenes/store/camera';
 * const isLoading = useCameraStore(selectIsLoading);
 * const introPhase = useCameraStore(selectIntroPhase);
 *
 * @example
 * // 3D Components (need real-time camera updates)
 * import { useCameraStore, selectCameraState } from '@/experience/scenes/store/camera';
 * const { position, target, isAnimating, controlType } = useCameraStore(selectCameraState);
 *
 * @example
 * // Configuration
 * import { CAMERA_CONFIG, CAMERA_CONSTRAINTS } from '@/experience/scenes/store/camera';
 */

// Core store
export { useCameraStore } from '../cameraStore';

// Domain types
export type { CameraState, CameraStore, ControlType, IntroPhase } from './cameraTypes';

// Configuration (single source of truth for camera constants)
export { ANGLE_LIMITS, CAMERA_CONFIG, CAMERA_CONSTRAINTS, INITIAL_POSITIONS } from './cameraConfig';

// Selectors (for optimal performance - single source of truth for state access)
export {
  // Action Selectors (stable function references)
  selectBeginIntroTransition,
  // Camera State Selectors (return direct references, safe to use)
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
} from './cameraSelectors';
