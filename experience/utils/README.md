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

## Best Practices

1. **Performance**: Not all objects need to cast shadows. Consider only enabling shadow casting for larger objects.

2. **Ground Objects**: Ground objects should typically receive shadows but not cast them.

3. **Small Details**: Small detail objects often don't need to cast shadows.

4. **Transparent Objects**: Be careful with transparent objects and shadows, as they can cause visual artifacts.

5. **Shadow Quality vs Performance**: Higher shadow map sizes give better quality but impact performance. 