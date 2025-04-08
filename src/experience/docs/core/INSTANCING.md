# Performant Model Instancing System

## Overview

Our instancing system provides a performant way to render multiple instances of 3D models while maintaining material consistency and type safety. It efficiently handles both simple and complex models, including those with multiple materials and animated instances.

## Core Concepts

### 1. Material Handling

The base model file (e.g., `Vehicles.tsx`) defines all materials once. For optimal performance:

- Material sharing is enabled by default (`useSharedMaterial={true}`)
- To preserve custom materials (like `LogoWrap`), disable material sharing with `useSharedMaterial={false}`
- Multi-material models are supported through proper node mapping

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

## Setup Process

### 1. Create a \*Type.tsx file in the `/models` directory

Follow the pattern from existing files like `VehiclesInstances.tsx`:

1. Define a union type for all model variants
2. Create a mapped type extending `ModelInstances`
3. Implement node mapping function
4. Implement Blender name mapping function
5. Export the instancing components and hooks

### 2. Create or Ensure an Appropriate GLB File

- Group related models in a single GLB
- Name objects consistently (use kebab-case like `car-sedan`)
- For multi-part models, use consistent naming (e.g., `patrol-car_1`, `patrol-car_2`)

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
      {/* For multi-part models, keep each part with its unique material */}
      <group position={[-20.532, 0, 0]} scale={1.317}>
        <mesh
          geometry={nodes['patrol-car_1'].geometry}
          material={sharedMaterial}
        />
        <mesh
          geometry={nodes['patrol-car_2'].geometry}
          material={materials.LogoWrap}
        />
      </group>
    </group>
  );
}
```

### 2. Using Instances in Scenes

There are multiple ways to use model instances:

#### A. Using Blender Export Data

```typescript
// Material sharing is enabled by default
<VehiclesInstances>
  <VehiclesInstances_Blender instancesData={blenderData} />
</VehiclesInstances>

// Disable material sharing to preserve custom materials
<VehiclesInstances useSharedMaterial={false}>
  <VehiclesInstances_Blender instancesData={specialModelsData} />
</VehiclesInstances>
```

#### B. Using JSON Data

```typescript
<VehiclesInstances>
  <VehiclesInstancesFromJSON instancesData={jsonData} />
</VehiclesInstances>
```

#### C. Programmatic Creation

```typescript
function CityStreet() {
  const { CarSedan, Truck } = useVehiclesInstances();

  return (
    <>
      <CarSedan position={[0, 0, 0]} rotation={[0, Math.PI/4, 0]} />
      <Truck>
        {/* Create multiple instances of the same model */}
        <Instance position={[10, 0, 0]} />
        <Instance position={[-10, 0, 0]} rotation={[0, Math.PI, 0]} />
      </Truck>
    </>
  );
}
```

## Animated Instances

The system supports animated instances that follow a path. There are two ways to use animated instances:

### 1. Directly using the animation prop

```typescript
// Define a path
const pathPoints: [number, number, number][] = [
  [0, 0, 0],
  [10, 0, 10],
  [20, 0, 0],
  [10, 0, -10]
];

// Create an animated instance
<Car
  animation={{
    path: pathPoints,
    speed: 2,
    loop: true
  }}
  onUpdate={(position, rotation) => {
    // Optional: do something with the updated position/rotation
    console.log(position, rotation);
  }}
/>
```

### 2. Using pre-configured animation components

For commonly used animations, we create specialized components that handle path data and offsets:

```typescript
// In animations/vehicles/components/AnimatedCar.tsx
export function AnimatedCar({ pathOffset = 0 }: { pathOffset?: number }) {
  const vehicles = useVehiclesInstances();
  const CarSedanRed = vehicles['car-sedan-red'];

  return (
    <CarSedanRed
      animation={{
        path: SHARED_PATH_POINTS,
        speed: 8,
        loop: true,
        pathOffset
      }}
    />
  );
}

// In a scene component:
<vehicles.AnimatedCar pathOffset={0.5} /> // Start halfway through the path
```

Note: When using specialized animation components, pass the `pathOffset` as a prop to the component itself, not in the animation object directly.

## Multi-Material Models

For models with multiple materials (like a model with a special logo texture):

1. **In the Node Mapping Function:**

```typescript
const mapVehiclesNodes = (nodes: Record<string, THREE.Object3D>) => {
  // For multi-part models, create a group and add all parts
  const patrolCar = new THREE.Group();

  if (nodes['patrol-car_1'] instanceof THREE.Mesh && nodes['patrol-car_2'] instanceof THREE.Mesh) {
    // Add clones to preserve the original meshes
    patrolCar.add(nodes['patrol-car_1'].clone());
    patrolCar.add(nodes['patrol-car_2'].clone());

    // Match the transform from the original model
    patrolCar.position.set(-20.532, 0, 0);
    patrolCar.scale.set(1.317, 1.317, 1.317);
  }

  return {
    'car-sedan': nodes['car-sedan'],
    'patrol-car': patrolCar,
    // Other models...
  };
};
```

2. **When Using Models with Multiple Materials:**

```typescript
// Use useSharedMaterial={false} to preserve special materials
<VehiclesInstances useSharedMaterial={false}>
  <VehiclesInstances_Blender instancesData={carsWithLogoData} />
</VehiclesInstances>
```

## Data Formats

### Blender Export Format

```typescript
interface BlenderExportData {
  name: string; // Object name in Blender
  position: [x, y, z]; // World position
  rotation: [x, y, z]; // Rotation in radians
  scale: [x, y, z]; // Scale factors
  [key: string]: any; // Additional custom data
}
```

### JSON Format

```typescript
interface ModelInstanceData {
  type: string; // Model type name
  position: [x, y, z]; // World position
  rotation?: [x, y, z]; // Optional rotation in radians
  scale?: number | [x, y, z]; // Optional scale (single number or vector)
  [key: string]: any; // Additional custom data
}
```

## Best Practices

1. **Material Management**

   - Keep `useSharedMaterial={true}` (default) for models with a single material
   - Use `useSharedMaterial={false}` for models with multiple materials
   - Group multi-material model parts together in your node mapping function

2. **Type Safety**

   - Use string union types for model types
   - Implement proper name mapping functions
   - Leverage TypeScript's type system

3. **Performance**
   - Group related models in single GLB files
   - Use instancing for repeated models
   - Share materials across single-material instances
   - Process large datasets in batches (all instancing components support a `batchSize` prop)

## Examples

See the `/examples` directory for complete implementation examples:

- `BuildingBlenderExportExample.tsx` - Using Blender export data
- `AnimatedPathExample.tsx` - Creating animated instances

## Sample Implementation

A full sample implementation can be found at:
`/models/SampleInstances.tsx`

## Related Documentation

- [Scene Composition](./SCENE_COMPOSITION.md)
- [Material System](./MATERIALS.md)
