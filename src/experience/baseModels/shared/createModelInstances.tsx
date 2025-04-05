import * as THREE from 'three';
import React, { createContext, useMemo, useContext, useState, useRef } from 'react';
import { useGLTF, Instances, Instance } from '@react-three/drei';
import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { ModelInstances, ModelInstanceData, BlenderExportData } from './types';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';

/**
 * Creates a performant instancing system for any model group
 *
 * @param modelPath - Path to the GLB file
 * @param nodeMapping - Function that maps node names to instance keys
 * @param nameTypeMapping - Optional function that maps Blender object names to type names
 * @returns An object with components and hooks for instancing
 */
export function createModelInstancing<T extends ModelInstances>(
  modelPath: string,
  nodeMapping: (nodes: Record<string, THREE.Object3D>) => Record<string, THREE.Object3D>,
  nameTypeMapping?: (name: string) => string | null
) {
  // Create a context for this specific model group
  const ModelContext = createContext<T | null>(null);

  // Preload the model
  useGLTF.preload(modelPath);

  // Create the Instances component
  function ModelInstances({
    children,
    useSharedMaterial = true,
    ...props
  }: {
    children: React.ReactNode;
    useSharedMaterial?: boolean;
    [key: string]: any;
  }) {
    const { nodes, materials } = useGLTF(modelPath) as unknown as MeshGLTFModel;

    // Get shared material if requested
    const sharedMaterial = useSharedMaterial ? createSharedAtlasMaterial(materials) : null;

    // Map nodes to instance meshes
    const instanceObjects = useMemo(() => nodeMapping(nodes), [nodes]);

    // Create the instanced components
    const createInstanceComponents = useMemo(() => {
      const components: Record<string, any> = {};

      // Process each object from the mapping
      Object.entries(instanceObjects).forEach(([key, object]) => {
        let geometry;
        let material;

        if (object instanceof THREE.Mesh) {
          // Handle mesh directly
          geometry = object.geometry;
          material = useSharedMaterial && sharedMaterial ? sharedMaterial : object.material;
        } else if (object instanceof THREE.Group) {
          // For groups, find the first mesh and use its geometry and material
          const firstMesh = object.children.find(child => child instanceof THREE.Mesh);
          if (firstMesh instanceof THREE.Mesh) {
            geometry = firstMesh.geometry;
            material = useSharedMaterial && sharedMaterial ? sharedMaterial : firstMesh.material;
          } else {
            console.warn(`No mesh found in group for key: ${key}`);
            return; // Skip this entry
          }
        } else {
          console.warn(`Object for key ${key} is neither a Mesh nor a Group`);
          return; // Skip this entry
        }

        // Create a component factory for this specific mesh
        components[key] = ({ count = 0, children, ...props }: any) => {
          // If we have children (predefined instances), use the Instances component
          if ((children && React.Children.count(children) > 0) || count === 0) {
            return (
              <Instances
                limit={Math.max(count, 100)} // Set reasonable default limit
                range={Math.max(count, 100)} // Set reasonable default range
                geometry={geometry}
                material={material}
                castShadow
                receiveShadow
                {...props}
              >
                {children}
              </Instances>
            );
          } else {
            // If we're just setting a count, create empty instances (for when data comes later)
            return (
              <Instances
                limit={count}
                range={count}
                geometry={geometry}
                material={material}
                castShadow
                receiveShadow
                {...props}
              />
            );
          }
        };
      });

      return components as T;
    }, [instanceObjects, sharedMaterial, useSharedMaterial]);

    return (
      <ModelContext.Provider value={createInstanceComponents}>{children}</ModelContext.Provider>
    );
  }

  // Create the hook to access instances
  function useInstances() {
    const instances = useContext(ModelContext);
    if (!instances) {
      throw new Error('useInstances must be used within a ModelInstances component');
    }
    return instances;
  }

  // Create a component to render instances from JSON data
  function InstancesFromJSON({
    instancesData,
    batchSize = 1000, // Process in batches for performance
  }: {
    instancesData: ModelInstanceData[];
    batchSize?: number;
  }) {
    // Group the instances by type
    const groupedInstances = useMemo(() => {
      const grouped: Record<string, ModelInstanceData[]> = {};

      instancesData.forEach(item => {
        if (!grouped[item.type]) {
          grouped[item.type] = [];
        }
        grouped[item.type].push(item);
      });

      return grouped;
    }, [instancesData]);

    const instances = useInstances();

    return (
      <>
        {Object.entries(groupedInstances).map(([type, items]) => {
          // Skip if type doesn't exist
          if (!instances[type]) {
            console.warn(`Instance type "${type}" not found in model instances`);
            return null;
          }

          const InstanceComponent = instances[type];

          // Create batches for large datasets
          const batches = [];
          for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
          }

          return batches.map((batch, batchIndex) => (
            <InstanceComponent key={`${type}-batch-${batchIndex}`}>
              {batch.map((item, index) => (
                <Instance
                  key={`${type}-${batchIndex}-${index}`}
                  position={item.position}
                  rotation={item.rotation}
                  scale={
                    typeof item.scale === 'number'
                      ? [item.scale, item.scale, item.scale]
                      : item.scale
                  }
                />
              ))}
            </InstanceComponent>
          ));
        })}
      </>
    );
  }

  // Create a component to render instances from Blender-exported JSON data
  function InstancesFromBlenderExport({
    instancesData,
    batchSize = 1000, // Process in batches for performance
  }: {
    instancesData: BlenderExportData[];
    batchSize?: number;
  }) {
    const instances = useInstances();
    const [processedData, setProcessedData] = useState<Record<string, BlenderExportData[]>>({});

    // Process the data once on mount or when instancesData changes
    React.useEffect(() => {
      if (!nameTypeMapping) {
        console.warn('No nameTypeMapping function provided for Blender export data');
        return;
      }

      const grouped: Record<string, BlenderExportData[]> = {};

      // Process and group all items
      instancesData.forEach(item => {
        const type = nameTypeMapping(item.name);

        if (type && instances[type]) {
          if (!grouped[type]) {
            grouped[type] = [];
          }
          grouped[type].push(item);
        }
      });

      setProcessedData(grouped);
    }, [instancesData, instances, nameTypeMapping]);

    return (
      <>
        {Object.entries(processedData).map(([type, items]) => {
          const InstanceComponent = instances[type];

          // Create batches for large datasets
          const batches = [];
          for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
          }

          return batches.map((batch, batchIndex) => (
            <InstanceComponent key={`${type}-batch-${batchIndex}`}>
              {batch.map((item, index) => (
                <Instance
                  key={`${type}-${batchIndex}-${index}`}
                  position={item.position}
                  rotation={item.rotation}
                  scale={item.scale}
                />
              ))}
            </InstanceComponent>
          ));
        })}
      </>
    );
  }

  return {
    ModelInstances,
    useInstances,
    InstancesFromJSON,
    InstancesFromBlenderExport,
  };
}
