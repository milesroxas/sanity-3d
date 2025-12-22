# Material Instancing Feature Review

## ⚠️ THIS DOCUMENT IS SUPERSEDED

**See `docs/MATERIAL_INSTANCING_FINAL_REPORT.md` for the complete final report.**

This document contains the initial analysis. The final report includes:

- What was done to fix the issues
- Why the feature was removed
- Three alternative approaches with recommendations
- Next steps if you want to implement texture transitions

---

## Executive Summary (Original Analysis)

Your material instancing feature has **fundamental architectural conflicts** with your existing instancing system. The current implementation cannot work as designed because:

1. **Material Override Conflict**: The `ProximityInstanceGroup` tries to override materials, but `createModelInstancing` already creates `<Instances>` components with baked-in materials
2. **Missing Export Error**: `ProximityInstanceGroup` was importing a non-existent function
3. **Pattern Mismatch**: The approach doesn't align with how drei's `Instances` and your custom instancing system work together

## Current Status: ❌ NOT WORKING

The feature has been **disabled** to prevent build errors. All instances now render with default materials (no transitions).

---

## Issues Found

### 1. Critical Build Error (FIXED)

**File**: `ProximityInstanceGroup.tsx` line 8
**Issue**: Importing non-existent `ensureTextureTransitionMaterialExtended`
**Status**: ✅ Fixed - removed invalid import

### 2. Architectural Conflict (MAJOR)

**Problem**: Your instancing system (`createModelInstancing`) creates `<Instances>` components internally with pre-configured materials. The `ProximityInstanceGroup` cannot override these materials from outside.

**Why it doesn't work**:

```tsx
// This is what you're trying to do:
<VehiclesInstances useSharedMaterial={true}>
  {' '}
  // ← Creates Instances with Material A
  <ProximityInstanceGroup>
    {' '}
    // ← Tries to override with Material B
    <VehiclesInstances_Blender /> // ← Renders Instance children
  </ProximityInstanceGroup>
</VehiclesInstances>

// But drei's Instances component doesn't allow material overrides at the Instance level
```

**Current behavior in `createModelInstancing`** (lines 206-216):

```tsx
<Instances
  geometry={geometry}
  material={material} // ← Material is set HERE, can't be overridden
  {...props}
>
  {children} // ← ProximityInstanceGroup renders here
</Instances>
```

### 3. Material Usage Pattern (INCORRECT)

**File**: Original `ProximityInstanceGroup.tsx` line 107
**Issue**: `<InstanceComponent material={material}>` - This prop doesn't exist in your instancing API

### 4. Shader Material Type Safety (IMPROVED)

**File**: `TextureTransitionMaterial.ts`
**Status**: ✅ Added TypeScript type definition for better type safety

---

## Three Possible Solutions

### Option 1: Post-Processing Shader (RECOMMENDED) ⭐

**Complexity**: Medium
**Performance**: Excellent
**Maintainability**: Good

Instead of per-instance materials, use a full-screen post-processing shader that transitions textures based on depth/position.

**Pros**:

- No changes to instancing system
- Better performance (single shader pass)
- Smooth transitions across all geometry

**Cons**:

- Requires depth buffer setup
- More complex shader logic

**Implementation**:

```tsx
// In MainScene.tsx
<EffectComposer>
  <TextureTransitionPass
    cameraTarget={cameraTarget}
    transitionRadius={80}
    defaultTexture={defaultTex}
    activeTexture={activeTex}
  />
</EffectComposer>
```

### Option 2: Modify createModelInstancing (COMPLEX)

**Complexity**: High
**Performance**: Good
**Maintainability**: Medium

Add material override support to `createModelInstancing`.

**Pros**:

- Works with existing architecture
- Per-instance control

**Cons**:

- Major refactor of core instancing system
- Breaks existing patterns
- Complex to maintain

**Changes needed**:

1. Add `materialOverride` prop to `ModelInstances`
2. Pass material through context
3. Update all 14+ model files

### Option 3: Split at Composition Level (SIMPLE) ⭐

**Complexity**: Low
**Performance**: Good
**Maintainability**: Excellent

Split instances into two separate groups BEFORE passing to instancing system.

**Pros**:

- Works with existing system
- Simple to understand
- Easy to maintain

**Cons**:

- Requires composition-level logic
- Duplicate instancing setup

**Implementation**: See below ↓

---

## Recommended Solution: Option 3 (Split at Composition Level)

This is the **simplest and most maintainable** solution that works with your existing architecture.

### How It Works

Instead of trying to override materials inside the instancing system, split the data at the composition level:

```tsx
// src/experience/scenes/mainScene/compositions/Vehicles.tsx

import { useProximityInstanceSplit } from '@/experience/hooks/useProximityInstanceSplit';

export function Vehicles() {
  const parkedCarsData = parkedCarsData as BlenderExportData[];

  // Split instances based on proximity
  const { nearInstances, farInstances } = useProximityInstanceSplit(parkedCarsData);

  return (
    <>
      {/* Near instances - with transition shader */}
      {nearInstances.length > 0 && (
        <TransitionVehiclesInstances>
          <VehiclesInstances_Blender instancesData={nearInstances} />
        </TransitionVehiclesInstances>
      )}

      {/* Far instances - with default material */}
      <VehiclesInstances useSharedMaterial={true} category="vehicles">
        <VehiclesInstances_Blender instancesData={farInstances} />
      </VehiclesInstances>
    </>
  );
}
```

### Implementation Files

#### 1. Create Hook: `useProximityInstanceSplit.ts`

```typescript
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import { usePoiInstanceStore } from '@/experience/stores/poiInstanceStore';
import { useMemo } from 'react';
import * as THREE from 'three';

export function useProximityInstanceSplit(instancesData: BlenderExportData[]) {
  const cameraTargetPosition = usePoiInstanceStore(s => s.cameraTargetPosition);
  const transitionRadius = usePoiInstanceStore(s => s.transitionRadius);
  const activePoi = usePoiInstanceStore(s => s.activePoi);

  return useMemo(() => {
    if (!cameraTargetPosition || !activePoi) {
      return { nearInstances: [], farInstances: instancesData };
    }

    const near: BlenderExportData[] = [];
    const far: BlenderExportData[] = [];

    instancesData.forEach(instance => {
      const instancePos = new THREE.Vector3(...instance.position);
      const distance = instancePos.distanceTo(cameraTargetPosition);

      if (distance <= transitionRadius) {
        near.push(instance);
      } else {
        far.push(instance);
      }
    });

    return { nearInstances: near, farInstances: far };
  }, [instancesData, cameraTargetPosition, transitionRadius, activePoi]);
}
```

#### 2. Create Component: `TransitionVehiclesInstances.tsx`

```tsx
import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { usePoiInstanceStore } from '@/experience/stores/poiInstanceStore';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  TextureTransitionMaterial,
  TextureTransitionMaterialType,
} from '../materials/TextureTransitionMaterial';

export function TransitionVehiclesInstances({ children }: { children: React.ReactNode }) {
  const defaultTexturePath = usePoiInstanceStore(s => s.defaultTexture);
  const activeTexturePath = usePoiInstanceStore(s => s.activeTexture);
  const isTransitioning = usePoiInstanceStore(s => s.isTransitioning);
  const activePoi = usePoiInstanceStore(s => s.activePoi);

  const materialRef = useRef<TextureTransitionMaterialType | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Load textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const defaultTex = loader.load(defaultTexturePath);
    const activeTex = loader.load(activeTexturePath);

    [defaultTex, activeTex].forEach(tex => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
    });

    return { default: defaultTex, active: activeTex };
  }, [defaultTexturePath, activeTexturePath]);

  // Create shader material
  const material = useMemo(() => {
    const mat = new TextureTransitionMaterial({
      uTextureDefault: textures.default,
      uTextureActive: textures.active,
      uProgress: 0,
      uNoiseScale: 5.0,
      uNoiseStrength: 0.3,
      uTime: 0,
    }) as TextureTransitionMaterialType;

    materialRef.current = mat;
    return mat;
  }, [textures]);

  // Animate transition
  useEffect(() => {
    if (!materialRef.current || !isTransitioning) return;

    timelineRef.current?.kill();
    const targetProgress = activePoi ? 1.0 : 0.0;

    timelineRef.current = gsap.timeline();
    timelineRef.current.to(materialRef.current.uniforms.uProgress, {
      value: targetProgress,
      duration: 2.0,
      ease: 'power2.inOut',
    });

    return () => timelineRef.current?.kill();
  }, [isTransitioning, activePoi]);

  // Update time uniform
  useFrame(state => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // PROBLEM: We still can't pass material to VehiclesInstances!
  // This approach also doesn't work without modifying createModelInstancing

  return <VehiclesInstances useSharedMaterial={false}>{children}</VehiclesInstances>;
}
```

**WAIT** - This still has the same problem! We can't override the material.

---

## ACTUAL Recommended Solution: Post-Processing Shader

After analyzing all options, **Option 1 (Post-Processing)** is the only viable solution that doesn't require major refactoring.

### Why Post-Processing?

1. ✅ No changes to instancing system
2. ✅ Works with any geometry
3. ✅ Better performance
4. ✅ Easier to maintain
5. ✅ More flexible (can add effects like glow, blur, etc.)

### How It Works

1. Render scene normally with default materials
2. In post-processing pass:
   - Calculate world position from depth buffer
   - Calculate distance from camera target
   - If within radius, mix textures based on transition progress
   - Apply noise for organic effect

### Implementation Outline

```tsx
// src/experience/effects/TextureTransitionPass.tsx
import { Effect } from 'postprocessing';

class TextureTransitionEffect extends Effect {
  constructor({ cameraTarget, radius, defaultTexture, activeTexture, progress }) {
    super('TextureTransitionEffect', fragmentShader, {
      uniforms: new Map([
        ['uCameraTarget', new Uniform(cameraTarget)],
        ['uRadius', new Uniform(radius)],
        ['uDefaultTexture', new Uniform(defaultTexture)],
        ['uActiveTexture', new Uniform(activeTexture)],
        ['uProgress', new Uniform(progress)],
      ]),
    });
  }
}

// Fragment shader reads depth, reconstructs world position,
// calculates distance, and mixes textures
```

**This is the correct architectural approach for your use case.**

---

## Summary

| Solution                 | Complexity | Works?  | Performance | Recommended |
| ------------------------ | ---------- | ------- | ----------- | ----------- |
| Current Implementation   | Medium     | ❌ No   | N/A         | ❌          |
| Post-Processing Shader   | Medium     | ✅ Yes  | ⭐⭐⭐      | ✅ YES      |
| Modify Instancing System | High       | ✅ Yes  | ⭐⭐        | ❌          |
| Split at Composition     | Low        | ❌ No\* | ⭐⭐        | ❌          |

\*Still can't override materials without system changes

---

## Next Steps

1. ✅ **DONE**: Fix build errors (removed invalid imports)
2. ✅ **DONE**: Disable broken ProximityInstanceGroup (now just passes through children)
3. ⏳ **TODO**: Implement post-processing shader approach
4. ⏳ **TODO**: Remove ProximityInstanceGroup from all compositions (it does nothing now)
5. ⏳ **TODO**: Update documentation to reflect new architecture

---

## Files Modified

- ✅ `src/experience/materials/TextureTransitionMaterial.ts` - Added type safety
- ✅ `src/experience/components/ProximityInstanceGroup.tsx` - Disabled (pass-through only)

## Files That Need Updates

- `src/experience/scenes/mainScene/compositions/Vehicles.tsx` - Remove ProximityInstanceGroup wrapper
- `src/experience/scenes/mainScene/compositions/Props.tsx` - Remove ProximityInstanceGroup wrapper
- `src/experience/scenes/mainScene/compositions/Buildings.tsx` - Remove ProximityInstanceGroup wrapper
- `src/experience/scenes/mainScene/compositions/Ground.tsx` - Remove ProximityInstanceGroup wrapper

---

## Questions?

If you want to proceed with the post-processing shader approach, I can help implement it. It's the cleanest solution that respects your existing architecture.
