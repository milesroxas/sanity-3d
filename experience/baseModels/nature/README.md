# Creating a New Set of Instanced 3D Models

This guide walks you through the process of creating a new group of 3D models from a single GLB file using the instancing pattern. Follow these steps to create your own implementation similar to the nature models.

## Step 1: Prepare Your 3D Models

1. Create or collect related 3D models in Blender (e.g., furniture, vehicles, buildings)
2. Give each model a unique, descriptive name (e.g., "chair-office", "table-round")
3. Ensure materials are properly assigned
4. Export as a single GLB file (e.g., "furniture_group.glb")
5. Place the GLB file in `/public/models/`

## Step 2: Create the Base Files

Create a new directory for your model group, similar to this structure:

```
experience/baseModels/furniture/
  ├── FurnitureGroup.tsx
  ├── useFurnitureInstances.tsx
  ├── types.ts
  ├── furnitureInstances.json
  └── README.md
```

## Step 3: Define TypeScript Types

Create a `types.ts` file with interfaces for your models only if number of items is too long:

```tsx
// experience/baseModels/furniture/types.ts
import { ReactElement } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { Vector3Tuple } from 'three';

export interface FurnitureInstances {
  Chair: (props?: ThreeElements['mesh']) => ReactElement;
  Table: (props?: ThreeElements['mesh']) => ReactElement;
  Desk: (props?: ThreeElements['mesh']) => ReactElement;
  // Add all your model types here
}

export interface FurnitureInstanceData {
  type: keyof FurnitureInstances;
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number;
}
```

## Step 4: Create the Group Component

Create a component to load the GLB and set up instancing:

```tsx
// experience/baseModels/furniture/FurnitureGroup.tsx
import * as THREE from 'three';
import React, { createContext, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { Merged } from '@react-three/drei';
import { FurnitureInstances } from './types';

type GLTFResult = GLTF & {
  nodes: {
    ['chair-office']: THREE.Mesh;
    ['table-round']: THREE.Mesh;
    ['desk-modern']: THREE.Mesh;
    // Add all your model nodes here
  };
  materials: {
    // List all your materials here
  };
};

interface InstancesProps {
  children: React.ReactNode;
}

export const context = createContext<FurnitureInstances | null>(null);

export function Instances({ children, ...props }: InstancesProps) {
  const { nodes } = useGLTF('/models/furniture_group.glb') as GLTFResult;

  // Add castShadow and receiveShadow to all meshes
  Object.values(nodes).forEach((node: any) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  const instanceMeshes = useMemo(
    () => ({
      Chair: nodes['chair-office'],
      Table: nodes['table-round'],
      Desk: nodes['desk-modern'],
      // Map all your nodes here
    }),
    [nodes]
  );

  return (
    <Merged meshes={instanceMeshes} {...props}>
      {(instances: FurnitureInstances) => (
        <context.Provider value={instances}>{children}</context.Provider>
      )}
    </Merged>
  );
}

useGLTF.preload('/models/furniture_group.glb');
```

## Step 5: Create a Custom Hook

Create a hook to access the instances:

```tsx
// experience/baseModels/furniture/useFurnitureInstances.tsx
import { useContext } from 'react';
import { context } from './FurnitureGroup';

export function useFurnitureInstances() {
  const instances = useContext(context);
  if (!instances)
    throw new Error('useFurnitureInstances must be used within an Instances component');
  return instances;
}
```

## Step 6: Create the JSON Data

Create a JSON file for positioning your models:

```json
// experience/baseModels/furniture/furnitureInstances.json
[
  {
    "type": "Chair",
    "position": [10.5, 0, 15.2],
    "rotation": [0, 1.57, 0]
  },
  {
    "type": "Table",
    "position": [12.5, 0, 15.2],
    "scale": 1.2
  }
  // Add all your instances
]
```

## Step 7: Create a Scene Component

Create a scene component to render your instances:

```tsx
// experience/sceneCollections/FurnitureInstances.tsx
import { Instances } from '../baseModels/furniture/FurnitureGroup';
import { useFurnitureInstances } from '../baseModels/furniture/useFurnitureInstances';
import furnitureInstancesData from '../baseModels/furniture/furnitureInstances.json';
import { Vector3Tuple } from 'three';
import { FurnitureInstanceData } from '../baseModels/furniture/types';

export default function FurnitureScene() {
  return (
    <Instances>
      <FurnitureContent />
    </Instances>
  );
}

function FurnitureContent() {
  const instances = useFurnitureInstances();

  return (
    <>
      {(furnitureInstancesData as FurnitureInstanceData[]).map((item, index) => {
        const InstanceComponent = instances[item.type];
        return (
          <InstanceComponent
            key={`${item.type}-${index}`}
            position={item.position as Vector3Tuple}
            rotation={item.rotation as Vector3Tuple}
            scale={item.scale}
            castShadow
            receiveShadow
          />
        );
      })}
    </>
  );
}
```

## Step 8: Use Your New Component

Add your new furniture scene to your main scene:

```tsx
// In your main scene file
import FurnitureScene from '../sceneCollections/FurnitureInstances';

export default function MainScene() {
  return (
    <>
      {/* Other scene elements */}
      <FurnitureScene />
    </>
  );
}
```

## Step 9: Generate or Update JSON Data

1. Position your furniture models in Blender
2. Export the transforms using GLB Tools addon
3. Update your `furnitureInstances.json` file with the exported data

## Tips for Success

- **Naming Convention**: Maintain a consistent naming pattern between Blender objects and your code
- **Model Optimization**: Keep your models optimized (low poly when possible)
- **Instance Type Property**: The "type" property in JSON must match a key in your instances object
- **Material Reuse**: Share materials between models where appropriate for better performance
- **Shadow Properties**: Set castShadow and receiveShadow in the React component, not in the JSON
- **Preloading**: Use the preload function to start loading the model early

## Common Issues and Solutions

- **Models Not Appearing**: Check that model names in the GLB match the names in your code
- **Type Errors**: Ensure your TypeScript types match the actual structure of your models
- **Scaling Issues**: For non-uniform scaling, add individual scale properties (scaleX, scaleY, scaleZ) to your types and component
- **Material Problems**: If materials look wrong, check that they're properly assigned in Blender

By following these steps, you can create multiple sets of models using the same efficient instancing pattern.
