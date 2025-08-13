# Responsive Rendering (Mobile vs Desktop)

This guide explains how to control which 3D elements render on mobile, tablet, and desktop in the main experience scene. The approach is fully typed, centralized, and reuses existing responsive patterns (viewport width inside the R3F canvas).

## Where things live

- Hook: `src/experience/scenes/mainScene/hooks/useDeviceProfile.ts`
- Usage:
  - `src/experience/scenes/mainScene/MainScene.tsx`
  - `src/experience/scenes/mainScene/compositions/Vehicles.tsx`

## What it does

- Determines `DeviceType` from the R3F viewport width: 'mobile' | 'tablet' | 'desktop'.
- Maps `DeviceType` to a `RenderProfile` with simple boolean flags.
- Components opt in with concise gates (e.g., `includeAnimatedVehicles`).

## How to adjust what renders per device

Edit the `RENDER_PROFILES` object in `useDeviceProfile.ts`. The current flags are:

- `includeEnvironment`
- `includeProps`
- `includeLogoMarkers`
- `includeAnimatedVehicles`

Toggle any of these to true/false per device as needed.

## How to add a new toggle (non-redundant)

1. Add a boolean to the `RenderProfile` type in `useDeviceProfile.ts`.
2. Add default values for all three devices in `RENDER_PROFILES`.
3. In the target component file, import `useRenderProfile` and gate the render with your new flag.

Notes:

- Keep gates at composition boundaries (e.g., `MainScene.tsx`, `compositions/*`) to avoid sprinkling logic deep in leaf components.
- Do not introduce `window` checks; the hook uses R3F’s viewport width and is already Canvas-safe.

## Recommended device breakpoints

- Mobile: width < 768
- Tablet: 768 ≤ width < 1024
- Desktop: width ≥ 1024

These match existing patterns in `landing/hooks/useResponsiveConfig.ts`.

## Testing

- Resize the browser to switch device types; verify layers appear/disappear as expected.
- Use the existing Performance Monitor (DPR changes) to assess gains when disabling heavier features on mobile.

## Best practices

- Centralize toggles in `useDeviceProfile.ts` to avoid multiple `isMobile` checks.
- Prefer gating whole compositions for clarity (e.g., vehicles’ animated paths, environment, props, markers).
- Keep types in sync: always update both the `RenderProfile` type and `RENDER_PROFILES` when adding a flag.
