This is a state management store created with Zustand that handles camera behavior in a 3D experience, likely built with Three.js.

## Store Structure

The store manages:

1. **Camera Properties**:

   - `position`: Current camera position (Vector3)
   - `target`: Current camera look-at target (Vector3)
   - `previousPosition` and `previousTarget`: Stores camera state for returning to previous views
   - `selectedPoi`: Currently selected point of interest

2. **State Properties**:

   - `controlType`: Toggles between 'Map', 'CameraControls', and 'Disabled' modes
   - `isAnimating`: Whether camera is currently in transition
   - `state`: Current camera state ('main', 'previous', 'current')
   - `isLoading`: Loading state flag
   - `firstTimeLoading`: First-time load flag
   - `currentPoiIndex`: Index of the current POI in a collection

3. **Initial Positions**:
   - `mainIntro`: Aerial position (y=300) for introduction
   - `main`: Lower position (y=85) for normal viewing

## Key Functions

1. **Camera Positioning**:

   - `setCamera`: Updates camera position and target
   - `setPreviousCamera`: Stores current position for later restoration
   - `restorePreviousCamera`: Returns to previous camera state
   - `resetToInitial`: Returns to starting aerial position
   - `syncCameraPosition`: Directly syncs camera without animation

2. **State Management**:

   - `setControlType`: Changes camera control mode
   - `setIsAnimating`: Updates animation state
   - `setIsLoading`: Controls loading state with debounce
   - `setSelectedPoi`: Updates selected point of interest
   - `setCurrentPoiIndex`: Updates index of current POI

3. **Animation**:

   - `startCameraTransition`: Smooth camera transitions with cubic easing
   - Animation happens over 4 seconds with easing in/out
   - When animation completes, controls are re-enabled after 100ms

4. **POI Navigation**:

   - `navigateToNextPoi`: Moves to next POI in sequence
   - `navigateToPreviousPoi`: Moves to previous POI in sequence
   - Wraps around when reaching the end/beginning

5. **Full Reset**:
   - `reset`: Completely resets camera and all state variables

## Flow Logic

The store handles several important flows:

1. **Initial Load**:

   - Starts at aerial view (`mainIntro`)
   - Smoothly transitions down to normal view (`main`)
   - After transition, enables map controls

2. **POI Navigation**:

   - Disables controls during camera movement
   - Shows loading state during transitions
   - Re-enables appropriate controls after transition
   - Integrates with `logoMarkerStore` to handle marker visibility

3. **State Restoration**:
   - Keeps track of previous positions
   - Provides methods to restore previous views
