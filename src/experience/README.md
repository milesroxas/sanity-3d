## Experience System

High-level documentation for the 3D experience layer built with React Three Fiber (R3F), Drei, Zustand, GSAP, and Leva. This directory hosts scene composition, performant model instancing, camera and marker systems, effects, and supporting utilities.

### Directory overview

```
src/experience
  animations/           # Reusable animation components (e.g., vehicles)
  baseModels/           # Base GLTF-driven model components and shared instancing factory
  components/           # Shared experience UI (e.g., Loading) and markers
  data/                 # JSON placements and paths (Blender export + custom)
  docs/                 # Detailed subsystem docs (instancing, scene composition)
  effects/              # Fog, clouds, post-processing
  examples/             # Demonstrations (reference only)
  models/               # Typed instancing wrappers for GLBs (Houses, Vehicles, etc.)
  providers/            # R3F context provider and Canvas composition
  scenes/               # Scene implementations (main scene, landing)
  types/                # Shared TypeScript types for models and R3F
  utils/                # Material, animation, shadow, and model helpers
```

### Core architecture

- **Provider and Canvas**: `providers/R3FContext.tsx` exposes `R3FProvider` and `useR3F()` to mount an app-wide `<Canvas>` behind regular React UI. The provider renders:
  - A fixed `<Canvas>` with advanced `PerformanceMonitor` wired to `scenes/store/perfStore.ts` for stable, non-jittery performance management.
  - Sophisticated Dynamic Device Pixel Ratio (DPR) calculation with hysteresis, animation-aware freezing, and page visibility handling to prevent oscillation.
  - A high-Z UI layer for React DOM with proper z-index management.
  - A portal container for modal overlays.
  - The 3D scene is injected dynamically via `setR3FContent`.
  - Page visibility tracking to prevent performance monitoring during focus changes.

  Example (from `src/app/(main)/experience/layout.tsx`):

```tsx
'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';
  return (
    <R3FProvider>
      <main className="mt-8">{children}</main>
      <Leva hidden={isProduction} />
    </R3FProvider>
  );
}
```

- **Scene composition**: Scenes are organized using the composition pattern (see `docs/core/SCENE_COMPOSITION.md`). Each scene is built from cohesive composition units: `Environment`, `Buildings`, `Props`, `Vehicles`, `Effects`, and feature components (e.g., `LogoMarkers`).

  Example (from `src/experience/scenes/mainScene/MainScene.tsx`):

```tsx
const MainScene = forwardRef<any, MainSceneProps>(({ scene }, ref) => {
  const profile = useRenderProfile();
  return (
    <>
      <MainSceneCameraSystem />
      <TempFloor position={[0, -0.05, 0]} />
      <Effects />
      {profile.includeEnvironment && <Environment />}
      <Buildings />
      {profile.includeProps && <Props />}
      {profile.includeAnimatedVehicles && <Vehicles />}
      {profile.includeLogoMarkers && <LogoMarkers scene={scene} />}
    </>
  );
});
```

- **Instancing system**: Centralized, type-safe instancing factory (see `docs/core/INSTANCING.md` and `baseModels/shared/createModelInstances.tsx`). Key points:
  - Single GLB per model group; nodes mapped to typed instance keys.
  - Optional `useSharedMaterial` to use a shared atlas material for performance.
  - Multi-part models supported; special materials (e.g., logo wraps) are preserved even when sharing is enabled.
  - Data sources: Blender export JSON or project JSON via `InstancesFromBlenderExport` and `InstancesFromJSON`.
  - Animated instances supported with path-based motion and optional `pathOffset`.

  Export pattern (from `src/experience/models/VehiclesInstances.tsx`):

```tsx
const MODEL_PATH = '/models/vehicles.glb';
const mapVehiclesNodes = (nodes: Record<string, THREE.Object3D>) => ({
  'car-sedan-red': nodes['car-sedan-red'],
  'plane-passenger': nodes['plane-passenger'],
  // ...
});

export const VehiclesInstancing = createModelInstancing<VehiclesInstances>(
  MODEL_PATH,
  mapVehiclesNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: VehiclesInstances,
  useInstances: useVehiclesInstances,
  InstancesFromBlenderExport: VehiclesInstances_Blender,
  InstancesFromJSON: VehiclesInstancesFromJSON,
} = VehiclesInstancing;
```

- **Effects**: `effects/` composes fog, cloud animation, and post-processing.

### Scenes

- **Main Scene** (`scenes/mainScene/`)
  - `MainSceneClient.tsx`: Bridges app state and R3F. Resets camera, injects `<MainScene />` via `useR3F().setR3FContent`, and manages content overlays with proper loading states and animations.

    Example (from `src/experience/scenes/mainScene/MainSceneClient.tsx`):

```tsx
useLayoutEffect(() => {
  // Synchronously set camera store to intro before paint to avoid first-frame flashes
  resetToInitial();
  setIsReady(false);
  setSelectedScene(null);
  // Then set the content and make it visible
  setR3FContent(<MainScene scene={memoizedScene} />);
  setIsReady(true);
  // Cleanup when unmounting
  return () => {
    setR3FContent(null);
    setSelectedScene(null);
    // Only reset on unmount if we're not in loading state
    if (!isLoading) {
      resetToInitial();
    }
  };
}, [setR3FContent, setSelectedScene, resetToInitial, isLoading, memoizedScene]);
```

- `MainScene.tsx`: Uses device-specific render profiles to conditionally mount components. Adds `MainSceneCameraSystem`, `TempFloor`, `Effects`, then conditionally mounts `Environment`, `Buildings`, `Props`, `Vehicles`, and `LogoMarkers` based on device capabilities.
- `MainSceneCameraSystem.tsx`: Owns the default `PerspectiveCamera` and Drei `MapControls` when interactive. Synchronizes position/target with `scenes/store/cameraStore.ts`, applies movement boundaries and angle constraints, and exposes development-only Leva debug controls.
- Compositions:
  - `compositions/Environment.tsx`: Drei `Environment` (HDR/preset via Leva) plus `MountainInstances` and `NatureInstances` using Blender-export JSON from `data/`.
  - `compositions/Buildings.tsx`: `SmallBldgsInstances`, `HousesInstances`, `CityBldgsInstances`, `ConstructionInstances`, plus base model groups `CompanyBldgs` and `FestivalBuildings`.
  - `compositions/Props.tsx`: `FencesInstances`, `StreetPropsInstances`, `ScenePropsInstances`, plus `Billboard`.
  - `compositions/Vehicles.tsx`: Static vehicles from JSON and animated vehicles from `animations/vehicles`.

  Data-driven instancing (from `src/experience/scenes/mainScene/compositions/Buildings.tsx`):

```tsx
<HousesInstances>
  <HousesInstances_Blender instancesData={housesData as BlenderExportData[]} />
</HousesInstances>
```

    Animated vehicles (from `src/experience/scenes/mainScene/compositions/Vehicles.tsx`):

```tsx
export function Vehicles() {
  const { includeAnimatedVehicles } = useRenderProfile();
  return (
    <VehiclesInstances useSharedMaterial={false}>
      {/* Static vehicles from JSON data */}
      <VehiclesInstances_Blender instancesData={parkedCarsData as BlenderExportData[]} />
      {/* Animated vehicles */}
      {includeAnimatedVehicles && (
        <>
          <vehicles.AnimatedCar pathOffset={0} />
          <vehicles.AnimatedPlane pathOffset={0.3} scale={0.8} />
        </>
      )}
    </VehiclesInstances>
  );
}
```

- Markers and content:
  - `components/LogoMarkers.tsx`: Floating 3D markers with HTML labels. Animates camera to POI, fetches Sanity scene content, manages visibility and hover state, and restores camera when closing.
  - `components/LogoMarkerContent.tsx` and `components/MarkerContentOverlay.tsx`: GSAP-powered drawer/overlay to display Sanity-driven content and blocks.

  Marker click camera animation (from `src/experience/scenes/mainScene/components/LogoMarkers.tsx`):

```tsx
animationFrameRef.current = animateCameraMovement(
  currentPosition,
  targetPos,
  currentTarget,
  targetLookAt,
  (position, target) => {
    syncCameraPosition(position, target);
  },
  {
    duration: 2000,
    onComplete: () => {
      setIsAnimating(false);
      if (poi.slug?.current) fetchAndSetScene(poi.slug.current);
    },
  }
);
```

- **Landing Scene** (`scenes/landing/`)
  - Sophisticated introductory 3D composition with advanced camera system, responsive configuration, and interactive elements. Features include:
    - `LandingScene.tsx`: Main scene component with mouse-following camera, entrance/exit animations, and responsive text positioning
    - `LandingPage.tsx`: Wrapper component that provides R3F context and custom cursor
    - `LandingWrapper.tsx`: Handles video modal integration and portal management
    - Responsive configuration system (`hooks/useResponsiveConfig.ts`) with device-specific positioning
    - Advanced camera controls with mouse tracking, UI damping, and video-aware behavior
    - Leva-configurable controls under `config/` for development and debugging
    - Video modal system with fullscreen playback capabilities

### Stores (Zustand)

- `scenes/store/cameraStore.ts`: Single source of truth for camera position/target, control mode, animation state, loading state, selected POI, and POI navigation helpers. Provides:
  - Initial anchor positions (`INITIAL_POSITIONS`), `resetToInitial()`, `setCamera()`, `startCameraTransition()` (GSAP timeline), `syncCameraPosition()`.
  - Control mode transitions between `'Disabled'` and `'Map'` with guarded updates during animations/loading.

  Example transition (from `src/experience/components/Loading.tsx`):

```tsx
cameraStore.setCamera(
  INITIAL_POSITIONS.mainIntro.position.clone(),
  INITIAL_POSITIONS.mainIntro.target.clone(),
  'main'
);
cameraStore.startCameraTransition(
  INITIAL_POSITIONS.mainIntro.position,
  INITIAL_POSITIONS.main.position,
  INITIAL_POSITIONS.mainIntro.target,
  INITIAL_POSITIONS.main.target
);
```

- `scenes/store/perfStore.ts`: Advanced performance monitoring store with debounced updates and intelligent threshold detection. Features:
  - **Debounced Performance Changes**: 2-second debounce delay prevents rapid oscillation between performance states.
  - **Minimum Change Threshold**: Only updates DPR factor when change is ≥ 0.15 to prevent micro-adjustments.
  - **Timeout Management**: Proper cleanup of debounce timeouts to prevent memory leaks.
  - **Reset Functionality**: Clean reset method for component unmounting and state cleanup.

  The store receives signals from Drei `PerformanceMonitor` and consumers can reduce cost under degraded conditions.

  Usage in animations (from `src/experience/animations/vehicles/components/AnimatedCar.tsx`):

```tsx
const declined = usePerfStore(state => state.declined);
{
  !declined && (
    <Truck
      animation={{
        path: SHARED_PATH_POINTS,
        speed: 8,
        loop: true,
        pathOffset: (pathOffset + 0.75) % 1,
      }}
    />
  );
}
```

- `scenes/store/logoMarkerStore.ts`: Manages selected Sanity scene, drawer visibility, load state, initial camera restore data, hover/visibility for markers, and `fetchAndSetScene(slug)`. Provides:
  - Scene selection and content visibility management
  - Loading state coordination with camera animations
  - Marker hover state and visibility controls
  - Camera state restoration for smooth transitions
  - Sanity scene fetching with error handling

- `scenes/store/landingCameraStore.ts`: Dedicated store for landing scene camera state and animations. Manages:
  - Animation state and completion tracking
  - Mouse tracking enable/disable functionality
  - Video playback state coordination
  - Entrance/exit animation control

- `scenes/store/expandedContentStore.ts`: Manages expanded content state for detailed views and overlays.

### Instanced models

- Typed instancing modules under `models/` define each group’s type unions and node mappings, then export:
  - `ModelInstances` component (accepts `useSharedMaterial?: boolean`).
  - `useInstances()` hook for programmatic instance creation.
  - `InstancesFromBlenderExport` and `InstancesFromJSON` for data-driven placement.
  - Example groups include: `VehiclesInstances`, `HousesInstances`, `CityBldgsInstances`, `ConstructionInstances`, `SmallBldgsInstances`, `FencesInstances`, `StreetPropsInstances`, `ScenePropsInstances`, `NatureInstances`, `MountainInstances`.

- Data formats (see `baseModels/shared/types.ts`):
  - `ModelInstanceData` (internal JSON format) and `BlenderExportData` (Blender-derived), both supporting position, rotation, scale, and custom fields.

- Animation support (path following):
  - Instance components accept an `animation` prop with `path`, `speed`, `loop`, and `pathOffset`.
  - Shared paths are defined under `animations/vehicles/lib/` (`sharedPath`, `trafficPathTwo`, `planePath`).
  - Specialized animated wrappers live in `animations/vehicles/components/` and consume `useVehiclesInstances()`.

  Plane example (from `src/experience/animations/vehicles/components/AnimatedPlane.tsx`):

```tsx
const vehicles = useVehiclesInstances();
const Plane = vehicles['plane-passenger'];
return (
  <Plane
    animation={{ path: PLANE_PATH_POINTS, speed: 10, loop: true, pathOffset }}
    scale={[scale, scale, scale]}
  />
);
```

### Utilities

- Materials and textures: `utils/materialUtils.ts`
  - Shared atlas material (LOWPOLY-COLORS) with optional specular/emission maps.
  - `configureMaterialForInstancing()` ensures materials are suitable for instancing.
  - See `utils/README.md` for usage and best practices.

- Animation helpers: `utils/animationUtils.ts`
  - `animateCameraMovement()` with cubic easing and a cleanup function for controlled transitions.

  Provider performance wiring (from `src/experience/providers/R3FContext.tsx`):

```tsx
<PerformanceMonitor
  ms={1000}
  iterations={5}
  factor={0.9}
  onDecline={() => usePerfStore.getState().setDeclined(true)}
  onIncline={() => usePerfStore.getState().setDeclined(false)}
  onChange={({ factor }) => usePerfStore.getState().setDprFactor(factor)}
>
  <Suspense fallback={null}>{r3fContent}</Suspense>
</PerformanceMonitor>
```

- Shadows: `utils/shadows.ts`, `utils/instancedShadows.ts`, `utils/withShadows.tsx`

- Model helpers: `utils/modelUtils.ts` (e.g., Blender name normalization), `utils/modelPreloader.ts`, `utils/modelCache.ts`.

### Effects

- `effects/` composes `Fog`, animated `Clouds`, and `PostProcessing`. Mounted early in `MainScene` to apply globally.

### Performance Monitoring System

The experience includes a robust performance monitoring system designed to maintain smooth animations and prevent jittery DPR (Device Pixel Ratio) changes.

#### Key Features

- **Stable DPR Management**: Uses hysteresis and animation-aware freezing to prevent oscillation
- **Debounced Updates**: 2-second debounce delay prevents rapid performance state changes
- **Animation-First Design**: Completely stable DPR during camera animations
- **Page Visibility Handling**: Prevents performance monitoring during focus changes
- **Memory Safe**: Proper timeout cleanup prevents memory leaks

#### DPR Calculation Strategy

The `R3FProvider` implements a sophisticated DPR calculation that:

1. **Animation Freeze**: During camera animations (`isAnimating` or `isLandingAnimating`) or when page is not visible, DPR is frozen to a stable value based on device capabilities
2. **Hysteresis**: After animations end, a 3-second cooldown period prevents immediate DPR changes
3. **Threshold Gating**: Only updates when changes are significant (>0.2) to prevent micro-adjustments
4. **Constrained Ranges**: Performance multiplier (0.85-1.0) and factor range (0.75-1.1) prevent extreme values
5. **Page Visibility**: Tracks page visibility to prevent performance monitoring during focus changes

```tsx
// Dynamic DPR with hysteresis and page visibility (from R3FContext.tsx)
const dynamicDpr = useMemo(() => {
  const base = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const now = Date.now();

  // While any camera is animating or page is not visible, use a completely stable DPR
  if (isAnimating || isLandingAnimating || !isPageVisible) {
    // Use a cached stable value based on device capabilities
    const frozen = Math.max(1, Math.min(2, base));
    const stabilized = Math.round(frozen * 2) / 2; // half-step granularity
    stableDprRef.current = stabilized;
    lastStableDprUpdateRef.current = now;
    return stabilized;
  }

  // Apply hysteresis: only update if enough time has passed since last animation
  const timeSinceLastUpdate = now - lastStableDprUpdateRef.current;
  if (timeSinceLastUpdate < 3000) {
    // 3 second cooldown after animations or visibility changes
    return stableDprRef.current;
  }

  // Calculate new DPR with performance factors
  const perfMultiplier = declined ? 0.85 : 1; // Less aggressive reduction
  const factorMultiplier = Math.max(0.75, Math.min(1.1, dprFactor)); // Constrain factor range
  const scaled = base * perfMultiplier * factorMultiplier;
  const clamped = Math.max(1, Math.min(2, scaled));
  const rounded = Math.round(clamped * 4) / 4; // quarter-step granularity

  // Only update stable ref if the change is significant (hysteresis)
  const change = Math.abs(rounded - stableDprRef.current);
  if (change > 0.2) {
    stableDprRef.current = rounded;
    lastStableDprUpdateRef.current = now;
  }

  return stableDprRef.current;
}, [dprFactor, declined, isAnimating, isLandingAnimating, isPageVisible]);
```

#### Performance Store Implementation

The `perfStore` includes sophisticated debouncing to prevent rapid oscillation:

```tsx
// Debounced performance updates (from perfStore.ts)
const DEBOUNCE_DELAY = 2000; // 2 seconds
const MIN_FACTOR_CHANGE = 0.15; // Minimum significant change

setDprFactor: dprFactor => {
  const change = Math.abs(current - dprFactor);
  if (change < MIN_FACTOR_CHANGE) return; // Ignore small changes

  // Debounce to prevent jitter
  const newTimeoutId = window.setTimeout(() => {
    set({ dprFactor, lastChangeTime: now, debounceTimeoutId: null });
  }, DEBOUNCE_DELAY);
};
```

#### PerformanceMonitor Configuration

Updated to be less aggressive and more stable:

- **Measurement Window**: Increased from 200ms to 1000ms for stable readings
- **Iterations**: Increased from 3 to 5 for better accuracy
- **Factor Threshold**: Raised from 0.85 to 0.9 for less aggressive reduction

#### Testing

The performance monitoring system includes comprehensive unit tests (`scenes/store/__tests__/perfStore.test.ts`) that verify:

- Debouncing behavior for both declined state and DPR factor changes
- Minimum change thresholds to prevent micro-adjustments
- Proper timeout cleanup and memory leak prevention
- Reset functionality for component lifecycle management

Run tests with: `pnpm test perfStore`

### Responsive Rendering System

The experience includes a sophisticated responsive rendering system that automatically adjusts content based on device capabilities and screen size.

#### Device Detection and Profiles

The system uses `useDeviceType()` to detect device type based on screen width:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Each device type has a corresponding `RenderProfile` that controls which components are rendered:

```tsx
const RENDER_PROFILES: Record<DeviceType, RenderProfile> = {
  mobile: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: false, // Disabled for performance
  },
  tablet: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: true,
  },
  desktop: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: true,
  },
};
```

#### Landing Scene Responsive Configuration

The landing scene includes advanced responsive configuration with device-specific positioning and scaling:

- **Responsive Text**: Dynamic text sizing and positioning based on screen size
- **Camera Positioning**: Device-specific camera positions and targets
- **Mouse Influence**: Adjusted mouse tracking sensitivity per device
- **Content Scaling**: Responsive scaling for 3D elements and UI components

### Loading and performance

- `components/Loading.tsx` listens to Drei `useProgress` and coordinates:
  - Temporarily hides other markers while assets load.
  - Fades in/out with GSAP and triggers the intro camera transition from `mainIntro` to `main` via the camera store.
  - Re-enables controls after transitions complete.

- The provider's advanced `PerformanceMonitor` updates `perfStore` with debounced performance signals. Consumers (e.g., animated vehicles) can react to reduce load under degraded conditions.

Device-aware rendering (from `src/experience/scenes/mainScene/hooks/useDeviceProfile.ts`):

```tsx
export type RenderProfile = {
  includeEnvironment: boolean;
  includeProps: boolean;
  includeLogoMarkers: boolean;
  includeAnimatedVehicles: boolean;
};

const RENDER_PROFILES: Record<DeviceType, RenderProfile> = {
  mobile: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: false,
  },
  tablet: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: true,
  },
  desktop: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: true,
  },
};

export function useRenderProfile(): RenderProfile {
  const device = useDeviceType();
  return useMemo(() => RENDER_PROFILES[device], [device]);
}
```

Example usage in `Vehicles` composition:

```tsx
export function Vehicles() {
  const { includeAnimatedVehicles } = useRenderProfile();
  return (
    <VehiclesInstances useSharedMaterial={false}>
      <VehiclesInstances_Blender instancesData={parkedCarsData as BlenderExportData[]} />
      {includeAnimatedVehicles && (
        <>
          <vehicles.AnimatedCar pathOffset={0} />
          <vehicles.AnimatedPlane pathOffset={0.3} scale={0.8} />
        </>
      )}
    </VehiclesInstances>
  );
}
```

### Integration points

- Wrap pages with `R3FProvider` (see `app/(main)/experience/layout.tsx` and `scenes/landing/LandingPage.tsx`). Inject scenes using `useR3F().setR3FContent(<MainScene ... />)`.
- Sanity integration: `LogoMarkers` fetches per-POI scene content via `logoMarkerStore.fetchAndSetScene` and renders in `LogoMarkerContent`/`MarkerContentOverlay`.
- Landing page integration: `LandingPage` provides R3F context and custom cursor, with `LandingWrapper` handling video modal integration.
- Public assets: GLBs under `public/models/`, HDRs under `public/textures/`, and atlases under `public/textures/`.
- Responsive design: Device-specific rendering profiles automatically adjust content based on screen size and device capabilities.

### Adding new content

- New instanced group
  - Add a typed wrapper in `models/` with node mapping and optional Blender name mapping.
  - Reference Blender or JSON placements from `data/` using the provided instance rendering components.
  - Mount within the appropriate scene composition (e.g., `Buildings`, `Props`, `Environment`).

- New animated instance
  - Create a small wrapper under `animations/` that consumes the relevant `use...Instances()` hook and provides `animation` with a shared or custom path.

### Conventions and best practices

- Prefer `useSharedMaterial` for single-material meshes; disable it when a model relies on special materials (e.g., decals).
- Keep large placements in JSON and render via `InstancesFrom*` with batching (`batchSize`) for memory and render stability.
- Avoid toggling store flags during camera animations; use the camera store actions which handle debouncing and control-mode transitions.
- **Performance Monitoring**: The system automatically handles DPR stability during animations. Avoid manual DPR adjustments or frequent performance state changes.
- **Animation-Aware Components**: Check animation states (`isAnimating`, `isLandingAnimating`) before triggering performance-sensitive operations.
- **Cleanup**: Always use the `reset()` method from `perfStore` when unmounting components to prevent memory leaks from debounce timeouts.
- **Device-Aware Rendering**: Use `useRenderProfile()` to conditionally render components based on device capabilities for optimal performance.
- **Responsive Design**: Implement responsive configurations for landing scene components using `useResponsiveConfig()`.
- **Page Visibility**: Handle page visibility changes to prevent camera glitches during focus changes.
- Development-only controls (Leva) are hidden in production via `NEXT_PUBLIC_SITE_ENV`.

### Reference docs

- `docs/core/INSTANCING.md` — Performance-focused instancing system
- `docs/core/SCENE_COMPOSITION.md` — Composition pattern and scene organization
- `docs/core/RESPONSIVE_RENDERING.md` — Device-aware rendering and responsive configuration
- `utils/README.md` — Materials and shadows utilities
