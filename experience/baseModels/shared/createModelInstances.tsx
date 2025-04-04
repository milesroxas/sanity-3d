import * as THREE from 'three';
import React, { createContext, useMemo, useContext, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { ModelInstances, ModelInstanceData, BlenderExportData } from './types';

/**
 * Creates a reusable instancing system for any model group
 *
 * @param modelPath - Path to the GLB file
 * @param nodeMapping - Function that maps node names to instance keys
 * @param nameTypeMapping - Optional function that maps Blender object names to type names
 * @returns An object with Instances component and useInstances hook
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
  function Instances({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
    const gltf = useGLTF(modelPath) as any;
    const { nodes, materials } = gltf;

    // Add shadow properties to all meshes
    Object.values(nodes).forEach((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        // Ensure materials are updated for shadows
        if (node.material) {
          node.material.needsUpdate = true;
        }
      }
    });

    // Map nodes to instance meshes or groups
    const instanceObjects = useMemo(() => nodeMapping(nodes), [nodes]);

    // Create the instanced components
    const createInstanceComponents = useMemo(() => {
      const components: Record<string, any> = {};

      // Process each object from the mapping
      Object.entries(instanceObjects).forEach(([key, object]) => {
        // For all objects, use primitive
        components[key] = (props: any) => {
          // Clone to avoid modifying the original
          const clonedObject = object.clone();

          // Apply shadow settings to all child meshes
          clonedObject.traverse(child => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Create a wrapper to apply transforms from props
          return <primitive object={clonedObject} {...props} />;
        };
      });

      return components as T;
    }, [instanceObjects]);

    return (
      <ModelContext.Provider value={createInstanceComponents}>{children}</ModelContext.Provider>
    );
  }

  // Create the hook to access instances
  function useInstances() {
    const instances = useContext(ModelContext);
    if (!instances) {
      throw new Error('useInstances must be used within an Instances component');
    }
    return instances;
  }

  // Create a component to render instances from JSON data
  function InstancesFromJSON({ instancesData }: { instancesData: ModelInstanceData[] }) {
    const instances = useInstances();

    return (
      <>
        {instancesData.map((item, index) => {
          // Ensure the type exists in our instances
          if (!instances[item.type]) {
            console.warn(`Instance type "${item.type}" not found in model instances`);
            return null;
          }

          const InstanceComponent = instances[item.type];
          return (
            <InstanceComponent
              key={`${item.type}-${index}`}
              position={item.position}
              rotation={item.rotation}
              scale={item.scale}
              castShadow
              receiveShadow
            />
          );
        })}
      </>
    );
  }

  // Create a component to render instances from Blender-exported JSON data
  function InstancesFromBlenderExport({ instancesData }: { instancesData: BlenderExportData[] }) {
    const instances = useInstances();
    const [processedData, setProcessedData] = useState<{ type: string; item: BlenderExportData }[]>(
      []
    );

    // Process the data once on mount or when instancesData changes
    React.useEffect(() => {
      if (!nameTypeMapping) {
        console.warn('No nameTypeMapping function provided for Blender export data');
        return;
      }

      const processed: { type: string; item: BlenderExportData }[] = [];

      // Process all items at once
      instancesData.forEach(item => {
        const type = nameTypeMapping(item.name);

        if (type && instances[type]) {
          processed.push({ type, item });
        }
      });

      setProcessedData(processed);
    }, [instancesData, instances, nameTypeMapping]);

    return (
      <>
        {processedData.map(({ type, item }, index) => {
          const InstanceComponent = instances[type];
          return (
            <InstanceComponent
              key={`${type}-${index}`}
              position={item.position}
              rotation={item.rotation}
              scale={item.scale}
              castShadow
              receiveShadow
            />
          );
        })}
      </>
    );
  }

  return {
    Instances,
    useInstances,
    InstancesFromJSON,
    InstancesFromBlenderExport,
  };
}
