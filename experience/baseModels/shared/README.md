# Reusable 3D Model Instancing System

This system simplifies the process of creating and managing instanced 3D models in your project. Unlike the previous approach that required multiple files per model group, this reusable pattern centralizes the logic and supports complex multi-part models.

## How to Use

To create a new instanced model group, follow these steps:

### 1. Prepare Your 3D Model

- Create or collect related 3D models in Blender
- Give each model a descriptive name (e.g., "tent-party", "bench-garden")
- Group related meshes together in Blender under parent objects
- Export as a single GLB file (e.g., "event-parts.glb")
- Place the GLB file in `/public/models/`

### 2. Create an Instances File

Create a file for your model group (e.g., `EventInstances.tsx`):

```tsx
import * as THREE from 'three';
import { createModelInstancing } from '../shared/createModelInstances';
import { ModelInstances, ModelInstanceComponent } from '../shared/types';

// Define the types for your instances
interface EventInstances extends ModelInstances {
  PartyTent: ModelInstanceComponent;
  IceCreamStand: ModelInstanceComponent;
  // Add all your model types
}

// Define the model path
const MODEL_PATH = '/models/event-parts.glb';

// Create a mapping function for model nodes that handles multi-part models
const mapEventNodes = (nodes: Record<string, THREE.Object3D>) => {
  // Helper function to create a group containing specific meshes
  const createGroupWithMeshes = (
    groupName: string,
    meshPrefixes: string[],
    transform?: {
      position?: [number, number, number];
      rotation?: [number, number, number];
      scale?: number | [number, number, number];
    }
  ) => {
    // Create a new group
    const group = new THREE.Group();
    group.name = groupName;

    // Set transforms if provided
    if (transform) {
      if (transform.position) group.position.set(...transform.position);
      if (transform.rotation) {
        const [x, y, z] = transform.rotation;
        group.rotation.set(x, y, z);
      }
      if (transform.scale) {
        if (Array.isArray(transform.scale)) {
          group.scale.set(...transform.scale);
        } else {
          group.scale.set(transform.scale, transform.scale, transform.scale);
        }
      }
    }

    // Find and add all meshes that match the prefixes
    Object.entries(nodes).forEach(([name, node]) => {
      if (!(node instanceof THREE.Mesh)) return;

      const matchesPrefix = meshPrefixes.some(prefix => name.startsWith(prefix));
      if (matchesPrefix) {
        // Clone the mesh to avoid modifying the original
        const clonedMesh = node.clone();
        clonedMesh.name = name;
        group.add(clonedMesh);
      }
    });

    return group;
  };

  return {
    // Create complete models with all their parts based on the actual GLB nodes
    PartyTent: createGroupWithMeshes('PartyTent', ['tent-party_'], {
      rotation: [Math.PI, 0, Math.PI],
      scale: 1.282,
    }),
    IceCreamStand: createGroupWithMeshes('IceCreamStand', ['stand-ice-cream_'], {
      position: [0, 0, 4.092],
      scale: 1.31,
    }),
    // Map additional models
  };
};

// Create a mapping function for Blender object names to instance types
const mapBlenderNamesToTypes = (name: string): string | null => {
  // Normalize the name (remove numbers and get the base name)
  const baseName = name.replace(/\.\d+$/, ''); // Remove .001, .002 suffixes

  // Map specific Blender object names to component types
  const nameMap: Record<string, string> = {
    'tent-party': 'PartyTent',
    'stand-ice-cream': 'IceCreamStand',
    // Map additional types
  };

  // Find the first match in our name map
  for (const [prefix, type] of Object.entries(nameMap)) {
    if (baseName.startsWith(prefix)) {
      return type;
    }
  }

  return null;
};

// Create the instancing system
const EventInstancing = createModelInstancing<EventInstances>(
  MODEL_PATH,
  mapEventNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook
export const {
  Instances: EventInstances,
  useInstances: useEventInstances,
  InstancesFromJSON: EventInstancesFromJSON,
  InstancesFromBlenderExport: EventInstancesFromBlenderExport,
} = EventInstancing;
```

### 3. Create a JSON Data File (Manual Format)

If you're manually creating the JSON (not exporting from Blender), use this format:

```json
[
  {
    "type": "PartyTent",
    "position": [10.5, 0, 15.2],
    "rotation": [0, 1.57, 0]
  },
  {
    "type": "IceCreamStand",
    "position": [12.5, 0, 15.2],
    "scale": 1.2
  }
]
```

### 4. Using Blender-Exported JSON

For Blender-exported data (recommended for complex scenes), the JSON format will look like this:

```json
[
  {
    "name": "tent-party.001",
    "position": [10.5, 0, 15.2],
    "rotation": [0, 1.57, 0],
    "scale": [1, 1, 1]
  },
  {
    "name": "stand-ice-cream.002",
    "position": [12.5, 0, 15.2],
    "rotation": [0, 0, 0],
    "scale": [1.2, 1.2, 1.2]
  }
]
```

### 5. Create a Scene Component

Create a component to render your model instances:

```tsx
import {
  EventInstances,
  EventInstancesFromBlenderExport,
} from '../baseModels/event/EventInstances';
import eventsInstancesData from '../baseModels/event/eventsInstances.json';
import { BlenderExportData } from '../baseModels/shared/types';

export default function EventScene() {
  return (
    <EventInstances>
      <EventInstancesFromBlenderExport instancesData={eventsInstancesData as BlenderExportData[]} />
    </EventInstances>
  );
}
```

## Advanced Usage

### Using the Hook Directly

If you need more control, you can use the `useInstances` hook directly:

```tsx
import { EventInstances, useEventInstances } from '../baseModels/event/EventInstances';

function EventContent() {
  const instances = useEventInstances();

  return (
    <>
      <instances.PartyTent position={[10, 0, 15]} rotation={[0, 1.5, 0]} />
      <instances.IceCreamStand position={[12, 0, 15]} scale={1.2} />
    </>
  );
}

export default function EventScene() {
  return (
    <EventInstances>
      <EventContent />
    </EventInstances>
  );
}
```

### Working with Multi-Part Models

The system now properly handles models with multiple meshes and materials:

1. In your GLB file, organize related meshes under parent groups
2. Use the `createGroupWithMeshes` helper function to collect all parts of a model
3. Specify mesh prefixes to identify which meshes belong to each model

For example, if your GLB has meshes named:

- `tent-party_1` (blue fabric)
- `tent-party_2` (metal supports)

You can include both parts in your model with:

```tsx
PartyTent: createGroupWithMeshes('PartyTent', ['tent-party_'], {
  rotation: [Math.PI, 0, Math.PI],
  scale: 1.282,
});
```

### Adding Custom Properties

You can extend the `ModelInstanceData` interface to add custom properties:

```tsx
// In your custom type file
import { ModelInstanceData } from '../shared/types';

interface CustomEventData extends ModelInstanceData {
  variant?: string;
  color?: string;
}
```

Then use these properties in your component.

## Tips for Success

- **Group Prefixes**: Use consistent prefixes for related meshes in Blender (e.g., all parts of a tent should start with "tent-party\_")
- **Blender Export**: When exporting from Blender, maintain your object hierarchy and use descriptive names
- **Multi-Part Models**: Make sure to collect all parts of a model using the meshPrefixes parameter
- **Transform Consistency**: Keep transform values consistent between Blender and your code
- **Proper Cloning**: The system handles cloning objects internally, so you don't need to worry about it

## Benefits

- **Reduced Boilerplate**: Eliminate repetitive code across different model groups
- **Type Safety**: Maintain TypeScript type checking for your models
- **Multi-Part Models**: Properly handle complex models with multiple meshes and materials
- **Blender Integration**: Works directly with Blender-exported JSON data
- **Performance**: Uses efficient instancing for better rendering performance
- **Maintainability**: Centralize core instancing logic in one place
