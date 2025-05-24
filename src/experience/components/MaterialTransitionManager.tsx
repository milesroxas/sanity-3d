import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSceneStore } from '../scenes/store/sceneStore';

export function MaterialTransitionManager({ group }: { group: THREE.Group | null }) {
  const opacity = useSceneStore(state => state.opacity);
  const materialRefs = useRef<THREE.Material[]>([]);
  const isInitialized = useRef(false);

  // Store material references when group is available
  useEffect(() => {
    if (!group || isInitialized.current) return;

    const materials: THREE.Material[] = [];
    group.traverse(child => {
      if ((child as THREE.Mesh).material) {
        const material = (child as THREE.Mesh).material as THREE.Material;
        if (material && !materials.includes(material)) {
          material.transparent = true;
          material.opacity = opacity;
          materials.push(material);
        }
      }
    });

    materialRefs.current = materials;
    isInitialized.current = true;
  }, [group, opacity]);

  // Handle opacity changes in a separate effect
  useEffect(() => {
    if (materialRefs.current.length === 0) return;
    materialRefs.current.forEach(material => {
      material.opacity = opacity;
      material.needsUpdate = true;
    });
  }, [opacity]);

  return null;
}
