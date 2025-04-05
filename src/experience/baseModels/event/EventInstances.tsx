import * as THREE from 'three';
import { createModelInstancing } from '../shared/createModelInstances';
import { ModelInstances, ModelInstanceComponent } from '../shared/types';

// Define the types for event instances
interface EventInstances extends ModelInstances {
  PartyTent: ModelInstanceComponent;
  IceCreamStand: ModelInstanceComponent;
  LightString: ModelInstanceComponent;
  BoardWirePapers: ModelInstanceComponent;
  GardenBench: ModelInstanceComponent;
  SouvenirStall: ModelInstanceComponent;
  CottonCandy: ModelInstanceComponent;
}

// Define the model path
const MODEL_PATH = '/models/event-parts.glb';

// Create a more detailed mapping function for event models that includes all parts
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

    LightString: createGroupWithMeshes('LightString', ['lights-string_'], {
      position: [0, 2.635, -4.003],
      rotation: [0, Math.PI / 2, 0],
      scale: 2.816,
    }),

    BoardWirePapers: createGroupWithMeshes('BoardWirePapers', ['board-wire-papers_'], {
      position: [0, 1.121, -13.024],
      rotation: [0, 1.571, 0],
      scale: 2.989,
    }),

    GardenBench: createGroupWithMeshes('GardenBench', ['bench-garden'], {
      position: [0, 0, 6.968],
      rotation: [0, Math.PI / 2, 0],
      scale: 1.371,
    }),

    SouvenirStall: createGroupWithMeshes('SouvenirStall', ['souvenir-stall_'], {
      position: [0, 0, -17.66],
      rotation: [0, Math.PI / 2, 0],
      scale: 1.0,
    }),

    CottonCandy: createGroupWithMeshes('CottonCandy', ['stand-cotton-big', 'cotton-candy'], {
      position: [0, 0, 0],
      scale: 1.217,
    }),
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
    'lights-string': 'LightString',
    'board-wire-papers': 'BoardWirePapers',
    'bench-garden': 'GardenBench',
    'souvenir-stall': 'SouvenirStall',
    'stand-cotton-big': 'CottonCandy',
    'cotton-candy': 'CottonCandy',
  };

  // Find the first match in our name map
  for (const [prefix, type] of Object.entries(nameMap)) {
    if (baseName.startsWith(prefix)) {
      return type;
    }
  }

  return null;
};

// Create the event instancing system
const EventInstancing = createModelInstancing<EventInstances>(
  MODEL_PATH,
  mapEventNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook
export const {
  ModelInstances: EventInstances,
  useInstances: useEventInstances,
  InstancesFromJSON: EventInstancesFromJSON,
  InstancesFromBlenderExport: EventInstancesFromBlenderExport,
} = EventInstancing;
