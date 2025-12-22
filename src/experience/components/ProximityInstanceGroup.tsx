'use client';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import { usePoiInstanceStore } from '@/experience/stores/poiInstanceStore';
import { useMemo } from 'react';
import * as THREE from 'three';

interface ProximityInstanceGroupProps {
  instancesData: BlenderExportData[];
  InstanceComponent: any; // Not used - kept for API compatibility
  children?: React.ReactNode;
}

/**
 * ProximityInstanceGroup
 *
 * SIMPLIFIED VERSION: Just renders children (all instances)
 * 
 * NOTE: This component currently does NOT implement proximity-based transitions.
 * The original design had architectural conflicts with the instancing system.
 * 
 * To implement proximity transitions properly, you would need to:
 * 1. Modify createModelInstancing to accept custom material overrides
 * 2. OR split instances at the composition level before passing to instancing
 * 3. OR use a post-processing shader effect instead of per-instance materials
 *
 * Current behavior: Renders all instances with default materials (no transitions)
 *
 * Usage:
 * <ProximityInstanceGroup
 *   instancesData={fencesData}
 *   InstanceComponent={FencesInstances}
 * >
 *   <FencesInstances_Blender instancesData={fencesData} />
 * </ProximityInstanceGroup>
 */
export function ProximityInstanceGroup({
  instancesData,
  InstanceComponent,
  children,
}: ProximityInstanceGroupProps) {
  // Get POI state from store (for future use)
  const cameraTargetPosition = usePoiInstanceStore(s => s.cameraTargetPosition);
  const transitionRadius = usePoiInstanceStore(s => s.transitionRadius);
  const activePoi = usePoiInstanceStore(s => s.activePoi);

  // Split instances into near/far groups based on proximity to camera target
  // This calculation is correct but we can't use it with the current instancing system
  const { nearInstances, farInstances } = useMemo(() => {
    if (!cameraTargetPosition || !activePoi) {
      // No active POI - all instances are "far" (use default material)
      return {
        nearInstances: [],
        farInstances: instancesData,
      };
    }

    const near: BlenderExportData[] = [];
    const far: BlenderExportData[] = [];

    instancesData.forEach(instance => {
      const instancePos = new THREE.Vector3(...instance.position);
      const distance = instancePos.distanceTo(cameraTargetPosition);

      if (distance <= transitionRadius) {
        near.push(instance);
      } else {
        far.push(instance);
      }
    });

    // Log for debugging
    console.log(
      `[ProximityInstanceGroup] Split: ${near.length} near, ${far.length} far (radius: ${transitionRadius})`
    );

    return { nearInstances: near, farInstances: far };
  }, [instancesData, cameraTargetPosition, transitionRadius, activePoi]);

  // For now, just render all instances via children
  // TODO: Implement proper proximity-based material transitions
  return <>{children}</>;
}
