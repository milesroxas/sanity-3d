import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';
import { createModelInstancing } from '../shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '../shared/types';

// Define the event model types using a string union
type EventType =
  | 'PartyTent'
  | 'IceCreamStand'
  | 'LightString'
  | 'BoardWirePapers'
  | 'GardenBench'
  | 'SouvenirStall'
  | 'CottonCandy';

// Define the types for event instances using a mapped type
type EventInstances = ModelInstances & {
  [K in EventType]: ModelInstanceComponent;
};

// Define the model path
const MODEL_PATH = '/models/event-parts.glb';

// Create a single source of truth for model names and their node mappings
const EVENT_MODELS: Record<EventType, string[]> = {
  PartyTent: ['tent-party_'],
  IceCreamStand: ['stand-ice-cream_'],
  LightString: ['lights-string_'],
  BoardWirePapers: ['board-wire-papers_'],
  GardenBench: ['bench-garden'],
  SouvenirStall: ['souvenir-stall_'],
  CottonCandy: ['stand-cotton-big', 'cotton-candy'],
};

// Define model transforms
const MODEL_TRANSFORMS: Record<
  EventType,
  {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number | [number, number, number];
  }
> = {
  PartyTent: {
    rotation: [Math.PI, 0, Math.PI],
    scale: 1.282,
  },
  IceCreamStand: {
    position: [0, 0, 4.092],
    scale: 1.31,
  },
  LightString: {
    position: [0, 2.635, -4.003],
    rotation: [0, Math.PI / 2, 0],
    scale: 2.816,
  },
  BoardWirePapers: {
    position: [0, 1.121, -13.024],
    rotation: [0, 1.571, 0],
    scale: 2.989,
  },
  GardenBench: {
    position: [0, 0, 6.968],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.371,
  },
  SouvenirStall: {
    position: [0, 0, -17.66],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.0,
  },
  CottonCandy: {
    position: [0, 0, 0],
    scale: 1.217,
  },
};

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

  // Create result object using our EVENT_MODELS mapping and MODEL_TRANSFORMS
  const result: Record<string, THREE.Object3D> = {};

  Object.entries(EVENT_MODELS).forEach(([modelType, prefixes]) => {
    const type = modelType as EventType;
    result[type] = createGroupWithMeshes(type, prefixes, MODEL_TRANSFORMS[type]);
  });

  return result as Record<EventType, THREE.Object3D>;
};

// Create a mapping function for Blender object names to instance types
const mapBlenderNamesToTypes = (name: string): EventType | null => {
  // Normalize the name using the utility function
  const baseName = normalizeBlenderName(name);

  // Check each model type's prefixes
  for (const [type, prefixes] of Object.entries(EVENT_MODELS)) {
    if (prefixes.some(prefix => baseName.startsWith(prefix))) {
      return type as EventType;
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
