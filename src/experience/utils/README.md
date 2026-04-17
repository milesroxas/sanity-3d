# Utility Functions

This directory contains utility functions and components to help manage various aspects of your 3D scene.

## Material Utilities

The `materialUtils.ts` file provides utilities for working with materials and textures in your 3D scene, with a focus on shared texture atlases.

### Shared Texture Atlas System

The project uses a shared texture atlas for efficient rendering. **All public-folder atlas URLs live in one place:** export `SHARED_ATLAS_TEXTURES` from `materialUtils.ts` (`colorMap`, `specularMap`, `emissionMap`). The color atlas file is `color-atlas-muted-1.jpg`; specular and emission maps are `color-atlas-specular.png` and `color-atlas-emission-night.png`.

GLTF materials that already embed the atlas are keyed by **`SHARED_TEXTURE_KEY`** (`LOWPOLY-COLORS`); use `createMaterialWithTextureMap` when reading the map from a loaded material.

To load all three maps in a hook, use **`useSharedTextures`** (`@/experience/models/hooks/useSharedTextures`), which wraps `useTexture` with `SHARED_ATLAS_TEXTURES`.

#### Basic Usage

```tsx
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';

export function MyComponent() {
  const { nodes, materials } = useGLTF('/models/my-model.glb');
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return <mesh geometry={nodes.myMesh.geometry} material={LowpolyMaterial} />;
}
```

#### Advanced Usage with PBR Maps

For components that need specular and emission effects, load the additional texture maps with drei's `useTexture`:

```tsx
import {
  SHARED_ATLAS_TEXTURES,
  createSharedAtlasMaterial,
} from '@/experience/utils/materialUtils';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export function MyComponent() {
  const { nodes, materials } = useGLTF('/models/my-model.glb');

  // Create base material
  const LowpolyMaterial = useMemo(() => createSharedAtlasMaterial(materials), [materials]);

  // Load additional texture maps (paths from SHARED_ATLAS_TEXTURES — do not hardcode URLs)
  const { specularMap, emissionMap } = useTexture({
    specularMap: SHARED_ATLAS_TEXTURES.specularMap,
    emissionMap: SHARED_ATLAS_TEXTURES.emissionMap,
  });

  // Apply textures in an effect
  useEffect(() => {
    if (specularMap && LowpolyMaterial) {
      const gridSize = 8;
      specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
      specularMap.repeat.set(1 / gridSize, 1 / gridSize);
      specularMap.offset.set(5 / gridSize, 1 - (1 + 1) / gridSize);
      LowpolyMaterial.roughnessMap = specularMap;
      LowpolyMaterial.needsUpdate = true;
    }

    if (emissionMap && LowpolyMaterial) {
      const gridSize = 8;
      emissionMap.wrapS = emissionMap.wrapT = THREE.RepeatWrapping;
      emissionMap.repeat.set(1 / gridSize, 1 / gridSize);
      emissionMap.offset.set(5 / gridSize, 1 - (1 + 1) / gridSize);
      LowpolyMaterial.emissiveMap = emissionMap;
      LowpolyMaterial.emissive = new THREE.Color(0xffffff);
      LowpolyMaterial.emissiveIntensity = 0.5;
      LowpolyMaterial.needsUpdate = true;
    }
  }, [LowpolyMaterial, specularMap, emissionMap]);

  return <mesh geometry={nodes.myMesh.geometry} material={LowpolyMaterial} />;
}
```

### Configuration exports

- **`SHARED_ATLAS_TEXTURES`**: `{ colorMap, specularMap, emissionMap }` — use everywhere you need atlas file paths.
- **`SHARED_TEXTURE_KEY`**: Material name used in GLTF for embedded atlas materials.
- **`MATERIAL_MODE`**: `'textured'` | `'basic'` — in `basic` mode, shared helpers use untextured materials (`CATEGORY_COLORS` when a category is passed).
- **`CATEGORY_COLORS`**: Optional tint keys (`ground`, `buildings`, `vehicles`, `nature`, `props`, `default`) for basic mode.

### Available Functions

#### `createBasicMaterial(color?, options)`

Creates a simple `MeshStandardMaterial` without the atlas (used when `MATERIAL_MODE === 'basic'` or as a building block).

#### `createMaterialWithTextureMap(sourceMaterial, options)`

Creates a material that uses the `map` from a source material (respects `MATERIAL_MODE`).

- `sourceMaterial`: The material containing the texture map
- `options`: Additional material options (optional)

#### `createSharedAtlasMaterial(materials?, options, category?)`

Creates a material using the shared color atlas from `SHARED_ATLAS_TEXTURES.colorMap` (or a basic material when `MATERIAL_MODE === 'basic'`).

- `materials`: Materials from GLTF model (optional)
- `options`: Additional material options (optional)
- `category`: Optional key into `CATEGORY_COLORS` for basic mode

#### `configureMaterialForInstancing(material, options)`

Configures a material for instancing with proper normal handling.

- `material`: The material to configure
- `options`: Additional material options (optional)

### Best Practices

1. **Single source of truth**: Import `SHARED_ATLAS_TEXTURES` (or `useSharedTextures`) instead of duplicating `/textures/...` strings.
2. **Preload**: `materialUtils` preloads the color atlas via `useTexture.preload(SHARED_ATLAS_TEXTURES.colorMap)`; add similar preloads for other assets only where needed.
3. **Apply textures in effects**: Apply maps to materials in `useEffect` when wiring extra maps after load, to avoid render-time churn.
4. **Memoize materials**: Use `useMemo` for material creation to avoid unnecessary recreations.
5. **Consistent UV settings**: Keep grid size, repeat, and offset aligned across maps on the same mesh.

## Shadow Utilities

The shadow utilities help manage shadows in your 3D scene.

### Available Functions

#### `addShadowsToModel(model)`

Recursively adds shadow properties to all meshes in a model.

#### `addShadowsToGLTFNodes(nodes)`

Adds shadow properties to all meshes in a GLTF model's nodes.

#### `withShadows(Component, castShadow, receiveShadow)`

HOC that wraps a component and adds shadow properties to all meshes within it.
