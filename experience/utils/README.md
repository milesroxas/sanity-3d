# Shadow Utilities

This directory contains utility functions and components to help manage shadows in your 3D scene.

## Available Utilities

### `addShadowsToModel`

Recursively adds shadow properties to all meshes in a model.

```typescript
import { addShadowsToModel } from '@/experience/utils/shadows';

// In your component
useEffect(() => {
  if (modelRef.current) {
    addShadowsToModel(modelRef.current);
  }
}, []);
```

### `addShadowsToGLTFNodes`

Adds shadow properties to all meshes in a GLTF model's nodes.

```typescript
import { addShadowsToGLTFNodes } from '@/experience/utils/shadows';

export function MyModel() {
  const { nodes } = useGLTF('/models/my-model.glb');

  // Add shadows to all nodes
  addShadowsToGLTFNodes(nodes);

  return (
    // Your component JSX
  );
}
```

### `withShadows` Higher-Order Component

Wraps a component and adds shadow properties to all meshes within it.

```typescript
import { withShadows } from '@/experience/utils/withShadows';

// Your original component
function MyComponent(props) {
  return (
    // Your component JSX
  );
}

// Export with shadows
export default withShadows(MyComponent);

// Or with custom shadow settings
export default withShadows(MyComponent, true, false); // cast but don't receive
```

## Material Utilities

The `materialUtils.ts` file provides a utility function for sharing texture maps across models:

```tsx
import { createMaterialWithTextureMap } from '../utils/materialUtils';

// In your model component:
export function MyModel(props) {
  const { nodes, materials } = useGLTF('/models/my-model.glb');

  // Create a material that uses the shared texture atlas
  const myMaterial = createMaterialWithTextureMap(materials['TEXTURE-NAME']);

  return (
    // Use the material in your meshes
  );
}
```

## GLTF Model Types and Material Utilities

This project uses standardized types and utilities for working with GLTF models and materials, especially for handling the shared texture atlas pattern.

### Types

The `experience/types/modelTypes.ts` file contains standardized types for GLTF models:

- `ObjectMap`: Standard structure as per drei documentation for nodes and materials
- `GLTFModel`: Base type for all GLTF models (GLTF & ObjectMap)
- `MeshGLTFModel`: Simplified type for when all nodes are meshes
- `MaterialMap`: Type for materials map

### Material Utilities

The `experience/utils/materialUtils.ts` file provides utilities for working with materials:

#### Shared Texture Atlas

We use a shared texture atlas (`LOWPOLY-COLORS`) across multiple models. The `createSharedAtlasMaterial` function makes it easy to access this shared material:

```tsx
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';

export function MyModel(props) {
  const { nodes, materials } = useGLTF('/path/to/model.glb') as unknown as MeshGLTFModel;

  // Get the shared texture atlas material
  const sharedMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes['some-node'].geometry}
        material={sharedMaterial} // Using shared material
      />
    </group>
  );
}
```

#### Model-Specific Materials

For model-specific materials, access them directly from the materials object:

```tsx
<mesh geometry={nodes['some-node'].geometry} material={materials.someModelSpecificMaterial} />
```

### Typing GLTF Models

For most models, use the simplified approach:

```tsx
import { MeshGLTFModel } from '@/experience/types/modelTypes';

// Basic type when you don't need specific material typing
type GLTFResult = MeshGLTFModel;

// Extended type when you need specific material typing
type GLTFResult = MeshGLTFModel & {
  materials: {
    ['SPECIFIC-MATERIAL']: THREE.MeshStandardMaterial;
  };
};

export function MyModel(props) {
  const { nodes, materials } = useGLTF('/path/to/model.glb') as unknown as GLTFResult;
  // ...
}
```

The `as unknown as GLTFResult` pattern is needed due to TypeScript's type checking rules when converting between types that don't directly overlap.

## Best Practices

1. **Performance**: Not all objects need to cast shadows. Consider only enabling shadow casting for larger objects.

2. **Ground Objects**: Ground objects should typically receive shadows but not cast them.

3. **Small Details**: Small detail objects often don't need to cast shadows.

4. **Transparent Objects**: Be careful with transparent objects and shadows, as they can cause visual artifacts.

5. **Shadow Quality vs Performance**: Higher shadow map sizes give better quality but impact performance.
