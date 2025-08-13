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
  - A fixed `<Canvas>` with Drei `PerformanceMonitor` wired to `scenes/store/perfStore.ts`.
  - A high-Z UI layer for React DOM.
  - A portal container for modal overlays.
  - The 3D scene is injected dynamically via `setR3FContent`.

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
export default function MainScene({ scene }: { scene: Sanity.Scene }) {
  return (
    <>
      <MainSceneCameraSystem />
      <TempFloor position={[0, -0.05, 0]} />
      <Effects />
      <Environment />
      <Buildings />
      <Props />
      <Vehicles />
      <LogoMarkers scene={scene} />
    </>
  );
}
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
  - `MainSceneClient.tsx`: Bridges app state and R3F. Resets camera, injects `<MainScene />` via `useR3F().setR3FContent`, and manages content overlays.

    Example (from `src/experience/scenes/mainScene/MainSceneClient.tsx`):

```tsx
const { setR3FContent } = useR3F();
useEffect(() => {
  resetToInitial();
  setSelectedScene(null);
  setR3FContent(<MainScene scene={memoizedScene} />);
  setIsReady(true);
  return () => {
    setR3FContent(null);
    setSelectedScene(null);
    if (!isLoading) resetToInitial();
  };
}, [setR3FContent, setSelectedScene, resetToInitial, isLoading, memoizedScene]);
```
  - `MainScene.tsx`: Adds `MainSceneCameraSystem`, `TempFloor`, `Effects`, then mounts `Environment`, `Buildings`, `Props`, `Vehicles`, and `LogoMarkers`.
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
<VehiclesInstances useSharedMaterial={false}>
  <VehiclesInstances_Blender instancesData={parkedCarsData as BlenderExportData[]} />
  <vehicles.AnimatedCar pathOffset={0} />
  <vehicles.AnimatedPlane pathOffset={0.3} scale={0.8} />
</VehiclesInstances>
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
  - Introductory 3D composition and helper components (e.g., `LandingCameraSystem`, `IntroGroundPlane`, `Billboard`, `VideoModal`), with responsive UX controls (`hooks/useResponsiveConfig.ts`) and Leva-configurable controls under `config/`.

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

- `scenes/store/perfStore.ts`: Receives performance signals from Drei `PerformanceMonitor` (declined FPS, DPR factor). Consumers can reduce cost under degraded conditions.

  Usage in animations (from `src/experience/animations/vehicles/components/AnimatedCar.tsx`):

```tsx
const declined = usePerfStore(state => state.declined);
{!declined && (
  <Truck
    animation={{ path: SHARED_PATH_POINTS, speed: 8, loop: true, pathOffset: (pathOffset + 0.75) % 1 }}
  />
)}
```

- `scenes/store/logoMarkerStore.ts`: Manages selected Sanity scene, drawer visibility, load state, initial camera restore data, hover/visibility for markers, and `fetchAndSetScene(slug)`.

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

### Loading and performance

- `components/Loading.tsx` listens to Drei `useProgress` and coordinates:
  - Temporarily hides other markers while assets load.
  - Fades in/out with GSAP and triggers the intro camera transition from `mainIntro` to `main` via the camera store.
  - Re-enables controls after transitions complete.

- The provider’s `PerformanceMonitor` updates `perfStore` (declined/DPR factor). Consumers (e.g., animated vehicles) can react to reduce load.

 Device-aware rendering (from `src/experience/scenes/mainScene/hooks/useDeviceProfile.ts`):

```tsx
export function useRenderProfile(): RenderProfile {
  const device = useDeviceType();
  return useMemo(() => RENDER_PROFILES[device], [device]);
}
```

Example usage in `Vehicles` composition:

```tsx
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
```

### Integration points

- Wrap pages with `R3FProvider` (see `app/(main)/experience/layout.tsx` and `scenes/landing/LandingPage.tsx`). Inject scenes using `useR3F().setR3FContent(<MainScene ... />)`.
- Sanity integration: `LogoMarkers` fetches per-POI scene content via `logoMarkerStore.fetchAndSetScene` and renders in `LogoMarkerContent`/`MarkerContentOverlay`.
- Public assets: GLBs under `public/models/`, HDRs under `public/textures/`, and atlases under `public/textures/`.

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
- Development-only controls (Leva) are hidden in production via `NEXT_PUBLIC_SITE_ENV`.

### Reference docs

- `docs/core/INSTANCING.md` — Performance-focused instancing system
- `docs/core/SCENE_COMPOSITION.md` — Composition pattern and scene organization
- `utils/README.md` — Materials and shadows utilities


