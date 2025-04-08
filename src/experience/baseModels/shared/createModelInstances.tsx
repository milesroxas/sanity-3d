import { MeshGLTFModel } from '@/experience/types/modelTypes';
import {
  configureMaterialForInstancing,
  createSharedAtlasMaterial,
} from '@/experience/utils/materialUtils';
import { Instance, Instances, useGLTF } from '@react-three/drei';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  AnimatedInstanceProps,
  BlenderExportData,
  ModelInstanceData,
  ModelInstanceProps,
  ModelInstances,
} from './types';

// Utility to create and cache path data
const pathCache = new Map<
  string,
  { points: [number, number, number][]; curve: THREE.CatmullRomCurve3 }
>();

function createPathData(points: [number, number, number][], pathOffset = 0) {
  const cacheKey = JSON.stringify(points) + pathOffset;

  if (pathCache.has(cacheKey)) {
    return pathCache.get(cacheKey)!;
  }

  // Apply path offset if specified
  let offsetPoints = points;
  if (pathOffset > 0) {
    const offsetIndex = Math.floor(pathOffset * points.length);
    offsetPoints = [...points.slice(offsetIndex), ...points.slice(0, offsetIndex)];
  }

  const curvePoints = offsetPoints.map(p => new THREE.Vector3(...p));
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal', 0.1);

  const result = { points: offsetPoints, curve };
  pathCache.set(cacheKey, result);
  return result;
}

// Type for storing mesh parts with their respective geometries and materials
interface MeshPart {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  index: number;
}

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
        // Handle both single meshes and multi-part models (groups)
        if (object instanceof THREE.Mesh) {
          // Single mesh handling (same as before)
          const geometry = object.geometry as THREE.BufferGeometry;
          const material =
            useSharedMaterial && sharedMaterial
              ? (configureMaterialForInstancing(sharedMaterial) as THREE.Material)
              : (configureMaterialForInstancing(object.material) as THREE.Material);

          // Create standard component for single-mesh objects
          components[key] = createInstanceComponent([{ geometry, material, index: 0 }]);
        } else if (object instanceof THREE.Group) {
          // Enhanced multi-part group handling
          const meshParts: MeshPart[] = [];

          // Find all meshes in the group
          object.traverse(child => {
            if (child instanceof THREE.Mesh) {
              const geometry = child.geometry as THREE.BufferGeometry;

              // Determine which material to use based on useSharedMaterial flag
              // But preserve special materials if they exist (like LogoWrap)
              let material: THREE.Material;

              // If the material name contains special keywords like "logo" or "wrap", preserve it
              const isSpecialMaterial =
                child.material instanceof THREE.Material &&
                (child.material.name.toLowerCase().includes('logo') ||
                  child.material.name.toLowerCase().includes('wrap') ||
                  child.material.name === 'LogoWrap');

              if (useSharedMaterial && sharedMaterial && !isSpecialMaterial) {
                material = configureMaterialForInstancing(sharedMaterial) as THREE.Material;
              } else {
                material = configureMaterialForInstancing(child.material) as THREE.Material;
              }

              meshParts.push({
                geometry,
                material,
                index: meshParts.length,
              });
            }
          });

          if (meshParts.length > 0) {
            // Create enhanced component for multi-mesh objects
            components[key] = createInstanceComponent(meshParts);
          } else {
            console.warn(`No meshes found in group for key: ${key}`);
          }
        } else {
          console.warn(`Object for key ${key} is neither a Mesh nor a Group`);
        }
      });

      return components as T;
    }, [instanceObjects, sharedMaterial, useSharedMaterial]);

    return (
      <ModelContext.Provider value={createInstanceComponents}>{children}</ModelContext.Provider>
    );
  }

  // Factory function to create instance components based on mesh parts
  function createInstanceComponent(meshParts: MeshPart[]) {
    return ({
      count = 0,
      children,
      animation,
      ...props
    }: ModelInstanceProps & { animation?: AnimatedInstanceProps['animation'] }) => {
      // If we have animation, create an animated instance with all mesh parts
      if (animation) {
        return <AnimatedMultiInstance meshParts={meshParts} animation={animation} {...props} />;
      }

      // If we have a single mesh part, use standard instancing
      if (meshParts.length === 1) {
        const { geometry, material } = meshParts[0];

        // If we have children or no count, use the Instances component
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
      }

      // For multi-mesh objects, handle each part separately
      return (
        <group {...props}>
          {meshParts.map(({ geometry, material, index }) => (
            <Instances
              key={`part-${index}`}
              limit={Math.max(count, 100)}
              range={Math.max(count, 100)}
              geometry={geometry}
              material={material}
              castShadow
              receiveShadow
            >
              {children
                ? React.Children.map(children, child =>
                    React.isValidElement(child) ? React.cloneElement(child as any) : null
                  )
                : null}
            </Instances>
          ))}
        </group>
      );
    };
  }

  // Create the hook to access instances
  function useInstances() {
    const instances = useContext(ModelContext);
    if (!instances) {
      throw new Error('useInstances must be used within a ModelInstances component');
    }
    return instances;
  }

  // Enhanced animated instance component that supports multiple mesh parts
  function AnimatedMultiInstance({
    meshParts,
    animation,
    onUpdate,
    ...props
  }: {
    meshParts: MeshPart[];
    animation: NonNullable<AnimatedInstanceProps['animation']>;
    onUpdate?: (position: [number, number, number], rotation: [number, number, number]) => void;
  } & Omit<AnimatedInstanceProps, 'animation' | 'onUpdate'>) {
    const ref = useRef<THREE.Group>(null);
    const distanceRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);
    const speed = animation.speed || 1;
    const loop = animation.loop !== false;

    // Get or create path data
    const { curve, points } = useMemo(() => {
      if (!animation.path) return { curve: null, points: [] };
      return createPathData(animation.path, animation.pathOffset);
    }, [animation.path, animation.pathOffset]);

    // Create reusable vector objects
    const positionVec = useMemo(() => new THREE.Vector3(), []);
    const tangentVec = useMemo(() => new THREE.Vector3(), []);
    const referenceVec = useMemo(() => new THREE.Vector3(0, 0, 1), []);

    // Memoize the animation callback to prevent unnecessary re-renders
    const updateCallback = useMemo(() => {
      if (!onUpdate) return undefined;
      return (position: THREE.Vector3, angle: number) => {
        onUpdate([position.x, position.y, position.z], [0, angle, 0]);
      };
    }, [onUpdate]);

    // Animation frame
    useEffect(() => {
      if (!ref.current || !curve) return;

      const animate = (time: number) => {
        if (!ref.current || !curve) return;

        // Update distance
        distanceRef.current = (distanceRef.current + speed * 0.016) % curve.getLength();

        // Get position at current distance
        const progress = distanceRef.current / curve.getLength();

        // Update position and rotation
        curve.getPointAt(progress, positionVec);
        curve.getTangentAt(progress, tangentVec);

        // Calculate rotation
        const angle = Math.atan2(tangentVec.x, tangentVec.z);
        ref.current.position.copy(positionVec);
        ref.current.rotation.y = angle;

        // Call update callback if provided
        if (updateCallback) {
          updateCallback(positionVec, angle);
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Start the animation
      animationFrameRef.current = requestAnimationFrame(animate);

      // Cleanup
      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }, [curve, speed, loop, updateCallback]);

    return (
      <group ref={ref} {...props}>
        {meshParts.map(({ geometry, material, index }) => (
          <mesh
            key={`part-${index}`}
            geometry={geometry}
            material={material}
            castShadow
            receiveShadow
          />
        ))}
      </group>
    );
  }

  // Legacy AnimatedInstance for backward compatibility
  function AnimatedInstance({
    geometry,
    material,
    animation,
    onUpdate,
    ...props
  }: {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    animation: NonNullable<AnimatedInstanceProps['animation']>;
    onUpdate?: (position: [number, number, number], rotation: [number, number, number]) => void;
  } & Omit<AnimatedInstanceProps, 'animation' | 'onUpdate'>) {
    return (
      <AnimatedMultiInstance
        meshParts={[{ geometry, material, index: 0 }]}
        animation={animation}
        onUpdate={onUpdate}
        {...props}
      />
    );
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
