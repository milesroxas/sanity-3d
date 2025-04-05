# Performant Model Instancing System

This system simplifies the process of creating and managing instanced 3D models in your project. It leverages drei's instancing capabilities for optimal rendering while respecting material setups from your base models.

## Project Organization

For optimal organization, follow this folder structure:

```
/models                    <- Your 3D model files (.glb, .gltf)
  /small-buildings.glb
  /trees.glb
  /vehicles.glb

/experience
  /baseModels              <- Core model definitions
    /buildings             <- Grouped by category
      /SmallBldgs.tsx      <- Base model loading and geometry definition
    /shared                <- Shared utilities
      /createModelInstances.tsx
      /types.tsx

  /models                  <- Model-specific instancing implementations
    /SmallBldgsInstances.tsx <- Instancing implementation for small buildings
    /TreesInstances.tsx
    /VehiclesInstances.tsx

  /data                    <- JSON data files (Blender exports)
    /smallBldgs.json
    /trees.json
    /vehicles.json
```

## Key Concept: Base Model Defines Materials

The most important principle is that **your base model file (e.g., SmallBldgs.tsx) defines all materials once**. The instancing system respects these material assignments by default when you set `useSharedMaterial={false}`.

This means:

- Custom materials/textures defined in your base model are preserved
- You never need to redefine materials in the instancing implementation
- The workflow is clean and intuitive

## How to Use

To create a new instanced model group, follow these steps:

### 1. Prepare Your 3D Model in Blender

- Create or collect related 3D models
- Give each model a descriptive name (e.g., "building-restaurant-1")
- Export as a single GLB file (e.g., "small-buildings.glb")
- Place the GLB file in `/public/models/`

### 2. Create a Base Model File

Create a base model file in the `/experience/baseModels/your-category/` directory that defines all materials:

```tsx
import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';

// Define GLTFResult type
type GLTFResult = MeshGLTFModel & {
  materials: {
    blinn1SG: THREE.MeshStandardMaterial;
    // Other materials...
  };
};

export function SmallBldgs(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/small-buildings.glb') as unknown as GLTFResult;
  const sharedMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        {/* Some meshes might use custom materials */}
        <mesh
          name="building-cannabis"
          castShadow
          receiveShadow
          geometry={nodes['building-cannabis'].geometry}
          material={materials.blinn1SG} // Custom material
          position={[-23.011, 0.384, -0.171]}
          scale={0.619}
        />

        {/* Others use the shared atlas material */}
        <mesh
          name="building-burger-joint"
          castShadow
          receiveShadow
          geometry={nodes['building-burger-joint'].geometry}
          material={sharedMaterial}
          position={[53.708, 2, -0.173]}
        />
        {/* More meshes... */}
      </group>
    </group>
  );
}

useGLTF.preload('/models/small-buildings.glb');
```

### 3. Create an Instances File

Create a file for your model group in the `/experience/models/` directory (e.g., `SmallBldgsInstances.tsx`):

```tsx
import * as THREE from 'three';
import React from 'react';
import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstances, ModelInstanceComponent } from '@/experience/baseModels/shared/types';

// Define the building types using a string union
type SmallBldgType =
  | 'BurgerJoint'
  | 'Restaurant1'
  | 'Restaurant2'
  | 'CornerStore'
  | 'Shop'
  | 'Cannabis';

// Define the types for building instances using a mapped type from the union
type SmallBldgsInstances = ModelInstances & {
  [K in SmallBldgType]: ModelInstanceComponent;
};

// Define the model path
const MODEL_PATH = '/models/small-buildings.glb';

// Define the mapping function for building nodes
const mapSmallBldgsNodes = (nodes: Record<string, THREE.Mesh>) => {
  // Simply map the nodes directly - materials are already set up in the base model
  return {
    BurgerJoint: nodes['building-burger-joint'],
    Restaurant1: nodes['building-restaurant-1'],
    Restaurant2: nodes['building-restaurant-2'],
    CornerStore: nodes['building-corner-store'],
    Shop: nodes['build-shop-1'],
    Cannabis: nodes['building-cannabis'],
  };
};

// Define the name mapping function for Blender exports
const mapBlenderNamesToTypes = (name: string): SmallBldgType | null => {
  // Handle numbered variations like building-restaurant-2.004
  const baseName = name.replace(/\.\d+$/, '');

  const nameMap: Record<string, SmallBldgType> = {
    'building-burger-joint': 'BurgerJoint',
    'building-restaurant-1': 'Restaurant1',
    'building-restaurant-2': 'Restaurant2',
    'building-corner-store': 'CornerStore',
    'build-shop-1': 'Shop',
    'building-cannabis': 'Cannabis',
  };

  return nameMap[baseName] || null;
};

// Create the building instancing system
const SmallBldgsInstancing = createModelInstancing<SmallBldgsInstances>(
  MODEL_PATH,
  mapSmallBldgsNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook with simplified naming
export const {
  ModelInstances: SmallBldgsInstances,
  useInstances: useSmallBldgsInstances,
  InstancesFromBlenderExport: SmallBldgsInstances_Blender,
  InstancesFromJSON: SmallBldgsInstancesFromJSON,
} = SmallBldgsInstancing;
```

## Type Safety with Mapped Types

The system uses TypeScript's mapped types for enhanced type safety and development experience:

1. **String Union Types**: Define all your model types in a string union

   ```tsx
   type SmallBldgType = 'BurgerJoint' | 'Restaurant1' | 'Restaurant2' /* etc */;
   ```

2. **Mapped Type Interface**: Automatically generate a type-safe interface

   ```tsx
   type SmallBldgsInstances = ModelInstances & {
     [K in SmallBldgType]: ModelInstanceComponent;
   };
   ```

3. **Type-Safe Exports**: Your hook returns fully typed components
   ```tsx
   // This is fully typed - TypeScript knows BurgerJoint exists
   const { BurgerJoint } = useSmallBldgsInstances();
   ```

Benefits of this approach:

- Single source of truth for your model types
- Automatic type completion in your IDE
- Type errors if you try to use a non-existent model
- Easy to add new models (just add to the union type)
- DRY (Don't Repeat Yourself) code

### 4. Export Your Scene from Blender

Export positions, rotations, and scales from Blender into a JSON file in the `/experience/data/` directory (e.g., `smallBldgs.json`):

```json
[
  {
    "name": "building-restaurant-1",
    "position": [92.45, 2.76, 26.26],
    "rotation": [0, -3.14, 0],
    "scale": [1, 1, 1]
  },
  {
    "name": "building-corner-store",
    "position": [105.04, 2.66, 2.6],
    "rotation": [0, -1.57, 0],
    "scale": [1, 1, 1]
  },
  {
    "name": "building-cannabis",
    "position": [92.19, 2.66, 2.99],
    "rotation": [0, 0, 0],
    "scale": [1, 1, 1]
  }
]
```

## Usage Patterns

There are three main ways to use the instancing system:

### 1. Blender Export Data (Recommended)

```tsx
// Import the components and data
import {
  SmallBldgsInstances,
  SmallBldgsInstances_Blender,
} from '@/experience/models/SmallBldgsInstances';
import smallBldgsData from '@/experience/data/smallBldgs.json';
import { BlenderExportData } from '@/experience/baseModels/shared/types';

function Scene() {
  return (
    <SmallBldgsInstances useSharedMaterial={false}>
      <SmallBldgsInstances_Blender instancesData={smallBldgsData as BlenderExportData[]} />
    </SmallBldgsInstances>
  );
}
```

### 2. Manual Instancing (For precise control)

```tsx
import { Instance } from '@react-three/drei';
import {
  SmallBldgsInstances,
  useSmallBldgsInstances,
} from '@/experience/models/SmallBldgsInstances';

function BuildingsContent() {
  const { BurgerJoint, Restaurant1 } = useSmallBldgsInstances();

  return (
    <>
      <BurgerJoint>
        <Instance position={[10, 0, 10]} rotation={[0, Math.PI / 4, 0]} />
        <Instance position={[-10, 0, 10]} rotation={[0, -Math.PI / 4, 0]} />
      </BurgerJoint>

      <Restaurant1>
        <Instance position={[0, 0, -20]} scale={1.2} />
      </Restaurant1>
    </>
  );
}

function Scene() {
  return (
    <SmallBldgsInstances useSharedMaterial={false}>
      <BuildingsContent />
    </SmallBldgsInstances>
  );
}
```

### 3. Programmatic Instances (For generated patterns)

```tsx
import { Instance } from '@react-three/drei';
import {
  SmallBldgsInstances,
  useSmallBldgsInstances,
} from '@/experience/models/SmallBldgsInstances';

function BuildingsGrid() {
  const { BurgerJoint } = useSmallBldgsInstances();

  // Generate a 5x5 grid of buildings
  return (
    <BurgerJoint>
      {Array.from({ length: 5 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => (
          <Instance
            key={`building-${i}-${j}`}
            position={[i * 30 - 60, 0, j * 30 - 60]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
            scale={0.8 + Math.random() * 0.4}
          />
        ))
      )}
    </BurgerJoint>
  );
}

function Scene() {
  return (
    <SmallBldgsInstances useSharedMaterial={false}>
      <BuildingsGrid />
    </SmallBldgsInstances>
  );
}
```

## Material Handling

The `useSharedMaterial` prop controls whether instances use a shared atlas material:

### When to use `useSharedMaterial={true}`:

- High performance is critical (reduces draw calls)
- All models have compatible UVs and can use the same texture atlas
- Visual consistency is desired across all instances
- Rendering hundreds or thousands of objects where material differences aren't important

### When to use `useSharedMaterial={false}`:

- Custom textures/materials need to be preserved (like the cannabis building example)
- Models have incompatible UVs or unique materials
- Material fidelity is more important than absolute performance
- The base model already sets up all materials correctly

For mixed scenarios, you can use separate instancing components:

```tsx
// Get building data for different material requirements
const regularBuildings = smallBldgsData.filter(item => !item.name.includes('cannabis'));

const specialBuildings = smallBldgsData.filter(item => item.name.includes('cannabis'));

// In your component:
<>
  {/* Buildings that can use shared materials */}
  <SmallBldgsInstances useSharedMaterial={true}>
    <SmallBldgsInstances_Blender instancesData={regularBuildings as BlenderExportData[]} />
  </SmallBldgsInstances>

  {/* Buildings that need custom materials */}
  <SmallBldgsInstances useSharedMaterial={false}>
    <SmallBldgsInstances_Blender instancesData={specialBuildings as BlenderExportData[]} />
  </SmallBldgsInstances>
</>;
```

## Performance Tips

For optimal performance:

1. **Group by material usage**: Use separate instances for shared-material objects vs custom-material objects
2. **Use batching**: The system automatically batches instances for better performance
3. **Set appropriate limits**: Don't render more instances than necessary at once
4. **Minimize updates**: Avoid frequently changing instance properties
5. **Handle numbered variations**: The system handles Blender's numbered objects (e.g., building-restaurant-2.004)

## Advanced Features

### Multi-Part Models

The system handles models with multiple meshes:

```tsx
// In your mapping function
const mapVehicleNodes = (nodes: Record<string, THREE.Mesh>) => {
  // For complex models with multiple parts
  const createCarGroup = () => {
    const group = new THREE.Group();
    group.add(nodes['car-body'].clone());
    group.add(nodes['car-wheels'].clone());
    group.add(nodes['car-windows'].clone());
    return group;
  };

  return {
    SportsCar: createCarGroup(),
    // Other models...
  };
};
```

### Custom Properties

You can add custom properties to your instances:

```tsx
// Extended data interface
interface BuildingWithCustomProps extends BlenderExportData {
  lightColor?: string;
  occupancy?: number;
}

// In your component
function LitBuildings() {
  const buildingsWithLights = smallBldgsData.map(bldg => ({
    ...bldg,
    lightColor: ['#ff9900', '#ffffff', '#ccffcc'][Math.floor(Math.random() * 3)],
  }));

  return (
    <SmallBldgsInstances_Blender
      instancesData={buildingsWithLights as BuildingWithCustomProps[]}
      onInstanceCreated={(instance, data) => {
        // Access custom props
        if ((data as BuildingWithCustomProps).lightColor) {
          // Add point light to instance
          const light = new THREE.PointLight((data as BuildingWithCustomProps).lightColor, 0.8, 10);
          light.position.set(0, 5, 0);
          instance.add(light);
        }
      }}
    />
  );
}
```
