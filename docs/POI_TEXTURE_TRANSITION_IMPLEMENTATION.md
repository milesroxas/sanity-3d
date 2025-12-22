# POI Texture Transition Implementation Guide

## Overview

This document provides a step-by-step guide for implementing proximity-based shader texture transitions for instances in the 3D experience. When users click on a logo marker, only instances near the camera target will transition from a default (muted) texture to an active texture using a noise-based shader animation.

---

## Features

- ✅ **Proximity-based transitions** - Only instances near camera target transition
- ✅ **Shader-based animation** - Smooth noise-dissolve effect synced to camera timing (2000ms)
- ✅ **No Blender modifications** - Works with existing JSON exports
- ✅ **Leverages drei** - Uses `shaderMaterial`, `useTexture`, and `Instance` from drei
- ✅ **CMS configurable** - Texture paths and transition radius configurable per POI
- ✅ **Performance optimized** - GPU-based transitions, dynamic instance grouping

---

## Architecture

```
User clicks logo marker
    ↓
Camera animates to POI (2000ms)
    ↓
Store tracks: camera target position, active POI, textures
    ↓
ProximityInstanceGroup calculates distance for each instance
    ↓
Split instances:
  - NEAR instances (within radius) → Transition shader material
  - FAR instances (outside radius) → Default muted material
    ↓
GSAP animates shader uProgress: 0 → 1 (2000ms, synced with camera)
    ↓
Noise-based dissolve from muted texture → active texture
```

---

## File Structure

```
src/experience/
├── materials/
│   └── TextureTransitionMaterial.ts          [NEW] Custom shader material
├── stores/
│   └── poiInstanceStore.ts                   [NEW] POI state management
├── components/
│   └── ProximityInstanceGroup.tsx            [NEW] Proximity filtering component
├── scenes/
│   └── mainScene/
│       ├── components/
│       │   └── LogoMarkers.tsx               [MODIFY] Add camera target tracking
│       └── compositions/
│           ├── Props.tsx                     [MODIFY] Use proximity groups
│           ├── Buildings.tsx                 [MODIFY] Use proximity groups
│           ├── Ground.tsx                    [MODIFY] Use proximity groups
│           └── Vehicles.tsx                  [MODIFY] Use proximity groups
└── utils/
    └── materialUtils.ts                      [MODIFY] Add transition helpers
```

---

## Implementation Steps

### Step 1: Create Custom Shader Material

**File:** `src/experience/materials/TextureTransitionMaterial.ts`

**Purpose:** Define the shader material that handles noise-based texture transitions.

**Implementation:**
1. Import `shaderMaterial` from `@react-three/drei`
2. Define uniforms for:
   - `uTextureDefault` - The default/muted texture
   - `uTextureActive` - The active texture
   - `uProgress` - Transition progress (0 = default, 1 = active)
   - `uNoiseScale` - Controls noise detail
   - `uNoiseStrength` - Controls noise influence on transition
   - `uTime` - For animated noise
3. Write vertex shader (simple UV pass-through)
4. Write fragment shader with:
   - Simple noise function
   - Fractal Brownian Motion (fbm) for organic transitions
   - Mix between textures based on progress + noise
5. Register material with R3F using `extend()`
6. Add TypeScript declarations

**Key Code:**
```typescript
export const TextureTransitionMaterial = shaderMaterial(
  { /* uniforms */ },
  /* vertex shader */,
  /* fragment shader */
);

extend({ TextureTransitionMaterial });
```

---

### Step 2: Create POI Instance Store

**File:** `src/experience/stores/poiInstanceStore.ts`

**Purpose:** Centralize state management for POI transitions.

**State:**
- `cameraTargetPosition: Vector3 | null` - Where camera is looking
- `activePoi: string | null` - Currently active POI slug
- `transitionRadius: number` - Distance threshold for transitions
- `defaultTexture: string` - Path to default texture
- `activeTexture: string` - Path to active texture
- `isTransitioning: boolean` - Animation state flag

**Actions:**
- `setActivePoi(slug, cameraTarget, defaultTex, activeTex)` - Activate a POI
- `setTransitionRadius(radius)` - Update transition radius
- `startTransition()` - Begin transition animation
- `completeTransition()` - Mark transition complete
- `resetToDefault()` - Return to default state
- `reset()` - Clear all state

**Default Values:**
- `transitionRadius: 80` (adjust based on scene scale)
- `defaultTexture: '/textures/color-atlas-muted-1.jpg'`
- `activeTexture: '/textures/color-atlas-new2.png'`

---

### Step 3: Create Proximity Instance Group Component

**File:** `src/experience/components/ProximityInstanceGroup.tsx`

**Purpose:** Filter instances by proximity and apply appropriate materials.

**Props:**
- `instancesData: BlenderExportData[]` - Array of instance data from JSON
- `InstanceComponent: any` - The drei Instance wrapper component
- `children?: React.ReactNode` - Fallback for far instances

**Logic Flow:**
1. Get camera target position and radius from store
2. Load default and active textures using `useTexture`
3. Calculate distance from each instance position to camera target
4. Split instances into two arrays:
   - `nearInstances` - distance ≤ radius
   - `farInstances` - distance > radius
5. Render near instances with transition shader material
6. Render far instances with default material (via children)
7. Animate shader `uProgress` uniform using GSAP (2000ms)
8. Update `uTime` uniform in `useFrame` for animated noise

**Distance Calculation:**
```typescript
const instancePos = new THREE.Vector3(...instance.position);
const distance = instancePos.distanceTo(cameraTargetPosition);
```

**Key Features:**
- Dynamic instance splitting on every camera target change
- Automatic material assignment based on proximity
- Console logging for debugging (shows near/far split counts)

---

### Step 4: Update Logo Marker Click Handler

**File:** `src/experience/scenes/mainScene/components/LogoMarkers.tsx`

**Changes:**
1. Import `usePoiInstanceStore`
2. Get `setActivePoi` action from store
3. In `handleMarkerClick`:
   - Extract camera target position from POI data
   - Extract texture paths from POI (or use defaults)
   - Call `setActivePoi(slug, cameraTarget, defaultTex, activeTex)`
4. In `useEffect` for `shouldAnimateBack`:
   - Call `resetToDefault()` to clear POI state

**Code Location:**
- Line ~255: `handleMarkerClick` function
- Line ~329: `shouldAnimateBack` effect

**Example:**
```typescript
const cameraTarget = new Vector3(
  poi.mainSceneCameraTarget.x,
  poi.mainSceneCameraTarget.y,
  poi.mainSceneCameraTarget.z
);

const defaultTex = poi.instanceTextures?.defaultTexture || '/textures/color-atlas-muted-1.jpg';
const activeTex = poi.instanceTextures?.activeTexture || '/textures/color-atlas-new2.png';

setActivePoi(poi.slug.current, cameraTarget, defaultTex, activeTex);
```

---

### Step 5: Update Scene Compositions

**Files to Modify:**
- `src/experience/scenes/mainScene/compositions/Props.tsx`
- `src/experience/scenes/mainScene/compositions/Buildings.tsx`
- `src/experience/scenes/mainScene/compositions/Ground.tsx`
- `src/experience/scenes/mainScene/compositions/Vehicles.tsx`

**Pattern for Each Composition:**

**Before:**
```tsx
<FencesInstances useSharedMaterial={true} category="props">
  <FencesInstances_Blender instancesData={fencesData as BlenderExportData[]} />
</FencesInstances>
```

**After:**
```tsx
<FencesInstances useSharedMaterial={true} category="props">
  <ProximityInstanceGroup
    instancesData={fencesData as BlenderExportData[]}
    InstanceComponent={FencesInstances}
  >
    <FencesInstances_Blender instancesData={fencesData as BlenderExportData[]} />
  </ProximityInstanceGroup>
</FencesInstances>
```

**Wrap Each Instance Group:**
- Import `ProximityInstanceGroup`
- Wrap each `*Instances_Blender` component
- Pass `instancesData` and `InstanceComponent` props
- Keep original component as children (fallback for far instances)

---

### Step 6: Extend Sanity CMS Schema (Optional)

**File:** `src/sanity/schemas/documents/scenes.ts`

**Add to POI object fields (around line 116):**

```typescript
{
  name: 'instanceTextures',
  title: 'Instance Textures Configuration',
  description: 'Configure which textures instances should use when this POI is active',
  type: 'object',
  fields: [
    {
      name: 'defaultTexture',
      title: 'Default Texture (Before Click)',
      type: 'string',
      initialValue: '/textures/color-atlas-muted-1.jpg',
      options: {
        list: [
          { title: 'Muted 1', value: '/textures/color-atlas-muted-1.jpg' },
          { title: 'Muted', value: '/textures/color-atlas-muted.jpg' },
        ],
      },
    },
    {
      name: 'activeTexture',
      title: 'Active Texture (After Camera Arrives)',
      type: 'string',
      initialValue: '/textures/color-atlas-new2.png',
      options: {
        list: [
          { title: 'Color New 2', value: '/textures/color-atlas-new2.png' },
          { title: 'Color Emission Night', value: '/textures/color-atlas-emission-night.png' },
          { title: 'Color Specular', value: '/textures/color-atlas-specular.png' },
        ],
      },
    },
  ],
},
{
  name: 'transitionRadius',
  title: 'Instance Transition Radius',
  type: 'number',
  description: 'How far from camera target should instances transition? (in scene units)',
  initialValue: 80,
  validation: (Rule: any) => Rule.min(10).max(500),
}
```

**Add to Scene Reference (Logo Marker) fields as well** if you want per-marker configuration.

---

## Configuration

### Transition Radius

The `transitionRadius` determines how far from the camera target instances will transition.

**Adjust globally:**
```typescript
usePoiInstanceStore.getState().setTransitionRadius(100);
```

**Adjust per POI via CMS:**
Add `transitionRadius` field to POI schema (see Step 6).

**Recommended values:**
- Small scenes: 30-50
- Medium scenes: 60-100
- Large scenes: 100-200

### Shader Parameters

**Noise Scale (`uNoiseScale`):**
- Controls detail level of noise pattern
- Default: `5.0`
- Lower = larger noise patterns
- Higher = finer noise details

**Noise Strength (`uNoiseStrength`):**
- Controls how much noise affects transition edge
- Default: `0.3`
- Lower = sharper transition edge
- Higher = more organic/irregular transition

**Adjust in:** `src/experience/materials/TextureTransitionMaterial.ts`

---

## Testing Checklist

### Basic Functionality
- [ ] Click logo marker → camera animates to POI
- [ ] Instances near camera target transition to active texture
- [ ] Instances far from camera target stay in default texture
- [ ] Transition animation lasts 2000ms (same as camera)
- [ ] Transition has smooth noise-based dissolve effect

### Edge Cases
- [ ] Click different logo markers → different instances transition
- [ ] Click back/close → instances return to default texture
- [ ] No active POI → all instances use default texture
- [ ] Rapid clicking → animations don't overlap/glitch

### Performance
- [ ] No frame drops during transition
- [ ] Proximity calculation doesn't cause lag
- [ ] Memory usage stable (no texture leaks)

### CMS Integration (if implemented)
- [ ] Custom textures per POI work correctly
- [ ] Custom transition radius per POI works
- [ ] Default values apply when not specified

---

## Debugging

### Enable Console Logging

In `ProximityInstanceGroup.tsx`, look for:
```typescript
console.log(`Proximity split: ${near.length} near, ${far.length} far (radius: ${transitionRadius})`);
```

**Expected output:**
```
Proximity split: 23 near, 157 far (radius: 80)
```

### Visual Debugging

**Add helper spheres to visualize transition radius:**

```tsx
// In ProximityInstanceGroup.tsx, add after useMemo:
{cameraTargetPosition && (
  <mesh position={cameraTargetPosition}>
    <sphereGeometry args={[transitionRadius, 32, 32]} />
    <meshBasicMaterial color="red" wireframe opacity={0.2} transparent />
  </mesh>
)}
```

### Common Issues

**Issue: All instances transition globally**
- Check that `ProximityInstanceGroup` is receiving correct `instancesData`
- Verify `cameraTargetPosition` is set correctly in store
- Check distance calculation logic

**Issue: No instances transition**
- Verify `transitionRadius` is large enough
- Check that `activePoi` is set in store
- Verify texture paths are correct

**Issue: Transition doesn't animate smoothly**
- Check GSAP timeline is not being killed prematurely
- Verify `isTransitioning` state is managed correctly
- Check `uProgress` uniform is being updated

**Issue: Textures not loading**
- Verify texture paths in `/public/textures/` directory
- Check browser console for 404 errors
- Ensure textures are configured correctly (flipY, colorSpace)

---

## Performance Optimization

### Reduce Proximity Calculations

Currently, proximity is recalculated on every state change. For very large datasets (10,000+ instances), consider:

1. **Spatial indexing** - Use octree or grid-based spatial partitioning
2. **Debounced calculations** - Only recalculate after camera settles
3. **Worker threads** - Move distance calculations to web worker

### Texture Memory Management

- Preload textures on app initialization
- Reuse texture instances across materials
- Use texture compression (e.g., basis universal)

### Shader Optimization

- Reduce noise octaves in `fbm()` function (currently 4, can reduce to 2-3)
- Use simpler noise functions for lower-end devices
- Consider LOD-based shader complexity

---

## Future Enhancements

### 1. Per-Category Transitions
Allow different transition effects for different instance categories (buildings, props, vehicles).

### 2. Easing Curve Configuration
Expose easing curve to CMS for different transition feels (bounce, elastic, etc.).

### 3. Multiple Transition Zones
Support multiple active POIs with overlapping transition zones.

### 4. Distance-Based Falloff
Instead of binary near/far, gradually reduce transition intensity based on distance.

### 5. Custom Shader Effects
Allow different shader effects per POI (dissolve, wipe, pixelate, etc.).

---

## Resources

- [drei documentation](https://drei.docs.pmnd.rs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GLSL Noise Functions](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)
- [GSAP Documentation](https://greensock.com/docs/)

---

## Troubleshooting Support

If you encounter issues during implementation:

1. Check console for error messages
2. Verify all files are created in correct locations
3. Ensure imports are correct
4. Test with simple case (single instance group) first
5. Add console.log statements to track state flow
6. Use React DevTools to inspect store state

---

## Version History

- **v1.0** - Initial implementation (2025-01-21)
  - Proximity-based transitions
  - Noise-based shader dissolve
  - CMS integration support
