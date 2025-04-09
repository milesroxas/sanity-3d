# Store Audit Analysis

## Overview of Stores

The codebase uses Zustand for state management with several main stores:

1. `useSceneStore` (`src/experience/scenes/store/sceneStore.ts`)
2. `useLogoMarkerStore` (`src/experience/scenes/store/logoMarkerStore.ts`)
3. `useCameraStore` (`src/experience/scenes/store/cameraStore.ts`)

## Store Analysis

### 1. Scene Store (`useSceneStore`)

**Purpose**: Manages scene transitions and model states
**Key States**:

- `modelRotation`
- `isTransitioning`
- `opacity`
- `poiActive`
- `initialRevealComplete`
- `isInitialReveal`

**Usage Analysis**:

- Well-utilized for scene transitions and animations
- All states appear to be actively used
- No vestigial code found

### 2. Logo Marker Store (`useLogoMarkerStore`)

**Purpose**: Manages marker interactions and scene selection
**Key States**:

- `selectedScene`
- `isContentVisible`
- `isLoading`
- `shouldAnimateBack`
- `initialCameraPosition`
- `initialCameraTarget`
- `otherMarkersVisible`
- `hoveredMarkerId`

**Usage Analysis**:

- All states are actively used in the marker system
- The store is well-integrated with the camera system
- No unused states or functions found

### 3. Camera Store (`useCameraStore`)

**Purpose**: Manages camera positioning and transitions
**Key States**:

- `position`
- `target`
- `previousPosition`
- `previousTarget`
- `controlType`
- `isAnimating`
- `state`
- `isLoading`
- `selectedPoi`
- `currentPoiIndex`

**Usage Analysis**:

- Complex store with many interconnected states
- All states appear to be actively used
- Well-integrated with the scene and marker systems

## Potential Technical Debt

1. **Camera Controls Store** (`src/experience/scenes/store/cameraControls.ts`):

   - This appears to be a development-only store for camera debugging
   - Contains many configuration options that might not be needed in production
   - Consider moving these controls to a development-only environment

2. **Console Logging**:

   - Several console.log statements in the stores could be removed in production
   - Particularly in `logoMarkerStore.ts` and `cameraStore.ts`

3. **Type Definitions**:
   - Some type definitions could be more specific (e.g., `any` types in camera store)
   - Consider adding more specific types for POI and camera states

## Recommendations

1. **Development vs Production**:

   - Move camera controls to a development-only environment
   - Remove console.log statements in production builds

2. **Type Safety**:

   - Replace `any` types with more specific interfaces
   - Add proper typing for POI and camera states

3. **Code Organization**:

   - Consider splitting the camera store into smaller, more focused stores
   - The camera store has grown quite large and handles multiple concerns

4. **Performance Optimization**:
   - Review the animation frame handling in stores
   - Consider using requestAnimationFrame more efficiently

## Conclusion

Overall, the store architecture is well-designed and actively used. There is minimal technical debt, with most issues being related to development tools and type safety rather than unused code. The main areas for improvement are:

1. Better separation of development and production code
2. Enhanced type safety
3. Potential store refactoring for better maintainability

No significant vestigial code was found in the stores. The stores are actively used and well-integrated with the rest of the application.
