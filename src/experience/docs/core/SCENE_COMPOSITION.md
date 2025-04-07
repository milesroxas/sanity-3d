# Scene Composition Pattern

## Overview

The scene composition pattern is used to organize complex 3D scenes into logical, maintainable components while maintaining our existing instancing system. This pattern helps manage scene complexity and improves code organization.

## Structure

```
scenes/
  mainScene/
    compositions/
      Environment.tsx    # Mountains, nature, etc.
      Buildings.tsx      # Houses, small buildings, etc.
      Props.tsx          # Fences, street props, etc.
      Vehicles.tsx       # Vehicle instances and animations
    components/          # Reusable scene components
    MainScene.tsx        # Main scene composition
```

## Key Concepts

### 1. Compositions

Compositions are logical groupings of related 3D elements that work together. Each composition:

- Maintains our existing instancing system
- Groups related instances together
- Handles its own data and configuration
- Can be independently maintained and tested

### 2. Instance Management

The composition pattern works alongside our existing instancing system:

```typescript
// Example from Buildings.tsx
<HousesInstances useSharedMaterial={true}>
  <HousesInstances_Blender instancesData={housesData} />
</HousesInstances>
```

### 3. Scene Organization

The main scene is composed of these logical groupings:

```typescript
const MainScene = () => {
  return (
    <>
      <MainSceneCameraSystem />
      <Environment />
      <Buildings />
      <Props />
      <Vehicles />
      <Effects />
      <LogoMarkers />
    </>
  );
};
```

## Benefits

1. **Maintainability**: Each composition is focused and easier to understand
2. **Organization**: Related instances are grouped logically
3. **Scalability**: Easy to add new instances to the appropriate composition
4. **Performance**: No changes to the underlying instance system
5. **Reusability**: Compositions can be reused in other scenes

## Best Practices

1. Keep compositions focused on a single responsibility
2. Maintain the existing instancing system within compositions
3. Use consistent naming and organization patterns
4. Document any composition-specific configurations
5. Keep the main scene file clean and focused on composition

## Example Usage

```typescript
// Environment.tsx
export function Environment() {
  return (
    <>
      <MountainInstances useSharedMaterial={true}>
        <MountainInstances_Blender instancesData={mountainData} />
      </MountainInstances>
      <NatureInstances useSharedMaterial={true}>
        <NatureInstances_Blender instancesData={natureData} />
      </NatureInstances>
    </>
  );
}
```

## Related Documentation

- [Instancing System](./INSTANCING.md)
- [Model Management](../baseModels/README.md)
