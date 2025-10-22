# Camera Domain - Domain-Driven Design Implementation

This directory contains the camera domain implementation following Domain-Driven Design (DDD) and Feature-Sliced Design (FSD) principles.

## 🎯 Purpose

The camera domain manages all camera-related state, configuration, and behavior in the 3D experience. By following DDD principles, we ensure:

- **Single Source of Truth**: All camera configuration and state access patterns are centralized
- **Optimal Performance**: Components subscribe only to the state they need via selectors
- **Maintainability**: Clear separation of concerns makes the codebase easier to understand and modify
- **Type Safety**: Full TypeScript support with proper type definitions

## 📁 Structure

```
camera/
├── index.ts              # Public API - import from here
├── cameraTypes.ts        # TypeScript types and interfaces
├── cameraConfig.ts       # Constants and configuration (single source of truth)
├── cameraSelectors.ts    # State access patterns (prevents unnecessary re-renders)
└── README.md            # This file
```

## 🚀 Usage

### For UI Components (Intro Overlay, Client Components)

UI components typically need to know about intro/loading state but DON'T need real-time camera position updates. Using selectors prevents 360 unnecessary re-renders during the 6-second intro animation.

```tsx
// ❌ BAD - Subscribes to entire store, re-renders 60 times per second during animation
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
const { isLoading, introPhase } = useCameraStore();

// ✅ GOOD - Only subscribes to needed fields, re-renders only when they change
import {
  useCameraStore,
  selectIsLoading,
  selectIntroPhase,
} from '@/experience/scenes/store/camera';
const isLoading = useCameraStore(selectIsLoading);
const introPhase = useCameraStore(selectIntroPhase);
```

### For 3D Components (Camera System, Scene Components)

3D components need real-time camera updates and SHOULD re-render when position/target change.

```tsx
import {
  useCameraStore,
  selectPosition,
  selectTarget,
  selectIsAnimating,
  selectControlType,
} from '@/experience/scenes/store/camera';

const position = useCameraStore(selectPosition);
const target = useCameraStore(selectTarget);
const isAnimating = useCameraStore(selectIsAnimating);
const controlType = useCameraStore(selectControlType);
```

### For Action-Only Components

Components that only trigger camera actions without reading state.

```tsx
import { useCameraStore, selectBeginIntroTransition } from '@/experience/scenes/store/camera';

const beginIntroTransition = useCameraStore(selectBeginIntroTransition);
// Call it: beginIntroTransition();
```

### Accessing Configuration

```tsx
import { CAMERA_CONFIG, CAMERA_CONSTRAINTS } from '@/experience/scenes/store/camera';

// Use constants
const maxDistance = CAMERA_CONSTRAINTS.maxDistance;
const introDuration = CAMERA_CONFIG.animation.introDuration;
```

## 🎨 Design Principles

### 1. Single Source of Truth

All camera configuration lives in `cameraConfig.ts`. No magic numbers scattered throughout the codebase.

```ts
// All camera positions, constraints, and animation settings in one place
export const CAMERA_CONFIG = {
  positions: { ... },
  constraints: { ... },
  animation: { ... },
} as const;
```

### 2. Selector Pattern

All state access goes through individual selectors in `cameraSelectors.ts`. This ensures:

- Components only re-render when their specific data changes
- No object creation overhead (avoids "getSnapshot should be cached" errors)
- Consistent state access patterns across the application
- Easy to optimize performance by modifying selectors

```ts
// Individual selectors return primitives or direct references
export const selectIsLoading = (state: CameraStore) => state.isLoading;
export const selectIntroPhase = (state: CameraStore) => state.introPhase;
```

### 3. Layered Architecture

- **Domain Layer** (`cameraStore.ts`): Core business logic and state management
- **Configuration Layer** (`cameraConfig.ts`): Constants and settings
- **Type Layer** (`cameraTypes.ts`): Type definitions and interfaces
- **Access Layer** (`cameraSelectors.ts`): Optimized state access patterns
- **Public API** (`index.ts`): Clean, documented interface for consumers

## 🐛 Performance Impact

### Before Optimization

```tsx
// MainSceneClient.tsx
const { resetToInitial, isLoading, introPhase } = useCameraStore();
```

**Result**: Component re-renders every frame during camera animation (60fps × 6 seconds = 360 re-renders)

### After Optimization

```tsx
// MainSceneClient.tsx
const resetToInitial = useCameraStore(selectResetToInitial);
const isLoading = useCameraStore(selectIsLoading);
const introPhase = useCameraStore(selectIntroPhase);
```

**Result**: Component only re-renders when `isLoading` or `introPhase` actually change (~3 re-renders total)

## 📊 Available Selectors

All selectors return primitives or direct object references (not new objects) to avoid React's "getSnapshot should be cached" error.

### UI Layer Selectors

- `selectIsLoading` - Loading flag
- `selectIntroPhase` - Intro phase

### Camera State Selectors

- `selectPosition` - Camera position (Vector3)
- `selectTarget` - Camera target (Vector3)
- `selectControlType` - Control type ('Map' | 'CameraControls' | 'Disabled')
- `selectIsAnimating` - Animation state

### Action Selectors

- `selectResetToInitial` - Reset camera to intro position
- `selectBeginIntroTransition` - Start intro transition
- `selectSyncCameraPosition` - Sync camera position
- `selectSetControlType` - Set control type
- `selectSetIsAnimating` - Set animation state
- `selectSetCamera` - Set camera position/target
- `selectStartCameraTransition` - Start camera transition animation

### POI Selectors

- `selectSelectedPoi` - Currently selected POI
- `selectCurrentPoiIndex` - Current POI index
- `selectSetSelectedPoi` - Set selected POI
- `selectSetCurrentPoiIndex` - Set POI index
- `selectNavigateToNextPoi` - Navigate to next POI
- `selectNavigateToPreviousPoi` - Navigate to previous POI

## 🔄 Migration Guide

If you have existing code that uses the camera store:

1. **Identify what state the component needs**
   - Does it need camera position? Use `selectCameraState`
   - Does it only need intro state? Use `selectIntroPhase` and `selectIsLoading`
   - Does it only call actions? Use individual action selectors

2. **Update imports**

   ```ts
   // Before
   import { useCameraStore } from '@/experience/scenes/store/cameraStore';

   // After
   import { useCameraStore, selectIsLoading } from '@/experience/scenes/store/camera';
   ```

3. **Update usage**

   ```ts
   // Before
   const { isLoading } = useCameraStore();

   // After
   const isLoading = useCameraStore(selectIsLoading);
   ```

## 🎓 Learn More

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Zustand Best Practices](https://github.com/pmndrs/zustand#selecting-multiple-state-slices)
