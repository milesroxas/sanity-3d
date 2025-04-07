# Performant Model Instancing System

## Overview

Our instancing system provides a performant way to render multiple instances of 3D models while maintaining material consistency and type safety.

## Core Concepts

### 1. Material Sharing

The base model file (e.g., `Vehicles.tsx`) defines all materials once. For optimal performance:

- Material sharing is enabled by default (`useSharedMaterial={true}`)
- Custom materials (like `LogoWrap`) are preserved when needed
- Shared materials reduce memory usage and improve performance

### 2. Type-Safe Instance Management

The system uses TypeScript's mapped types for enhanced type safety:

```typescript
type VehicleType = 'car-sedan' | 'patrol-car' | 'truck';
type VehiclesInstances = ModelInstances & {
  [K in VehicleType]: ModelInstanceComponent;
};
```

### 3. Instance Creation

Create instances using the `createModelInstancing` utility:

```typescript
const VehiclesInstancing = createModelInstancing<VehiclesInstances>(
  MODEL_PATH,
  mapVehiclesNodes,
  mapBlenderNamesToTypes
);
```

## Usage

### 1. Create a Base Model

```typescript
export function Vehicles(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/vehicles.glb');
  const sharedMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      {/* Use shared material for most meshes */}
      <mesh
        geometry={nodes['car-sedan'].geometry}
        material={sharedMaterial}
      />
      {/* Preserve custom materials when needed */}
      <mesh
        geometry={nodes['patrol-car_2'].geometry}
        material={materials.LogoWrap}
      />
    </group>
  );
}
```

### 2. Create Instances

```typescript
// Material sharing is enabled by default
<VehiclesInstances>
  <VehiclesInstances_Blender instancesData={blenderData} />
</VehiclesInstances>

// Only specify useSharedMaterial if you need to disable it
<VehiclesInstances useSharedMaterial={false}>
  <VehiclesInstances_Blender instancesData={blenderData} />
</VehiclesInstances>
```

### 3. Use Instances in Components

```typescript
const { CarSedan, PatrolCar } = useVehiclesInstances();
return <CarSedan position={[0, 0, 0]} />;
```

## Best Practices

1. **Material Management**

   - Material sharing is enabled by default - no need to specify it
   - Only set `useSharedMaterial={false}` if you need custom materials per instance
   - Define shared materials in base models
   - Preserve custom materials only when necessary
   - Leverage `createSharedAtlasMaterial` for optimization

2. **Type Safety**

   - Use string union types for model types
   - Implement proper name mapping functions
   - Leverage TypeScript's type system

3. **Performance**
   - Group related models in single GLB files
   - Use instancing for repeated models
   - Share materials across instances (default behavior)
   - Minimize custom material variations

## Related Documentation

- [Scene Composition](./SCENE_COMPOSITION.md)
- [Material System](../MATERIALS.md)
