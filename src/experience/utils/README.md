# Utility Functions

This directory contains utility functions and components to help manage various aspects of your 3D scene.

## Material Utilities

The `materialUtils.ts` file provides utilities for working with materials and textures in your 3D scene, with a focus on shared texture atlases.

### Shared Texture Atlas System

Our project uses a shared texture atlas approach for efficient rendering. The main color atlas is `color-atlas-new2.png`, with additional maps for specular highlights (`color-atlas-specular.png`) and emission effects (`color-atlas-emission-night.png`).

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
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export function MyComponent() {
  const { nodes, materials } = useGLTF('/models/my-model.glb');

  // Create base material
  const LowpolyMaterial = useMemo(() => createSharedAtlasMaterial(materials), [materials]);

  // Load additional texture maps
  const { specularMap, emissionMap } = useTexture({
    specularMap: '/textures/color-atlas-specular.png',
    emissionMap: '/textures/color-atlas-emission-night.png',
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

### Available Functions

#### `createMaterialWithTextureMap(sourceMaterial, options)`

Creates a material that uses a texture map from a source material.

- `sourceMaterial`: The material containing the texture map
- `options`: Additional material options (optional)

#### `createSharedAtlasMaterial(materials, options)`

Creates a material using the project-wide shared texture atlas (LOWPOLY-COLORS).

- `materials`: Materials from GLTF model
- `options`: Additional material options (optional)

#### `configureMaterialForInstancing(material, options)`

Configures a material for instancing with proper normal handling.

- `material`: The material to configure
- `options`: Additional material options (optional)

### Best Practices

1. **Preload Textures**: Use `useTexture.preload()` to preload textures for better performance.
2. **Apply Textures in Effects**: Always apply textures to materials in useEffect hooks to avoid React render-time state updates.
3. **Memoize Materials**: Use useMemo for material creation to prevent unnecessary recreations.
4. **Consistent UV Settings**: Use the same gridSize, repeat, and offset settings for all texture maps.

## Shadow Utilities

The shadow utilities help manage shadows in your 3D scene.

### Available Functions

#### `addShadowsToModel(model)`

Recursively adds shadow properties to all meshes in a model.

#### `addShadowsToGLTFNodes(nodes)`

Adds shadow properties to all meshes in a GLTF model's nodes.

#### `withShadows(Component, castShadow, receiveShadow)`

HOC that wraps a component and adds shadow properties to all meshes within it.
