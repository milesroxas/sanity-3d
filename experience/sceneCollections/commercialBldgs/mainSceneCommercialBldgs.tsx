import React, { useEffect, useState } from 'react'
import { BuildingInstanceData, useCommercialBuildingsGLTF } from '@/experience/baseModels/buildings/CommercialBldgs'
import { ThreeElements } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'
import CommercialBuildingInstances from './CommercialBuildingInstances'

/**
 * Commercial Buildings Main Scene
 * 
 * This component renders commercial buildings using a simplified approach similar to HouseInstances.
 */
export function MainSceneCommercialBldgs(props: ThreeElements['group']) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  
  // Load the model to check if it exists
  const { nodes, materials } = useCommercialBuildingsGLTF();

  // Check if the model loaded successfully
  useEffect(() => {
    console.log('Commercial buildings component mounted');
    
    if (nodes && Object.keys(nodes).length > 0) {
      console.log('Commercial buildings model loaded successfully');
      setModelLoaded(true);
    } else {
      console.error('Failed to load commercial buildings model');
      setModelError('Failed to load model nodes');
    }
  }, [nodes]);

  // Add controls for positioning and debugging
  const controls = useControls('Commercial Buildings', {
    positionX: { value: 0, min: -200, max: 200, step: 1 },
    positionY: { value: 4, min: -50, max: 50, step: 1 },
    positionZ: { value: 0, min: -200, max: 200, step: 1 },
    rotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 10, step: 0.1 },
    showDebugInfo: { value: true },
    modelStatus: { value: modelLoaded ? 'Loaded ✅' : modelError ? 'Error ❌' : 'Loading...', editable: false },
  });

  // Define building instances
  const buildingInstances: BuildingInstanceData[] = [
    { type: 'shops', position: [-71.134048, 2.666655, 57.897820], rotation: [0.000000, -1.570796, -0.000000], scale: 1 },
    { type: 'shops', position: [-68.010910, 2.666655, 44.582481], rotation: [0.000000, 0.000000, -0.000000], scale: 1 },
    { type: 'shops', position: [-68.010910, 2.666655, 34.480766], rotation: [0.000000, 0.000000, -0.000000], scale: 1 },
    { type: 'shops', position:[-68.010910, 2.666655, 24.410721], rotation: [0.000000, 0.000000, -0.000000], scale: 1 },
    { type: 'shops', position: [-5, 0, -5], rotation: [0, 0, 0], scale: 1 },
    { type: 'apartments', position: [-86.077484, -1, 50.358116], rotation: [0.000000, 0.000000, -0.000000], scale: 1 },
  ];

  // Get position from props or default to [0,0,0]
  const propsPosition = Array.isArray(props.position) 
    ? props.position 
    : (props.position instanceof THREE.Vector3 
      ? [props.position.x, props.position.y, props.position.z] 
      : [0, 0, 0]);

  // Combine props position with Leva controls
  const combinedPosition: [number, number, number] = [
    propsPosition[0] + controls.positionX,
    propsPosition[1] + controls.positionY,
    propsPosition[2] + controls.positionZ,
  ];

  return (
    <group 
      position={new THREE.Vector3(...combinedPosition)} 
      rotation={[0, controls.rotationY, 0]}
      scale={controls.scale}
    >
      
      {/* Render buildings if model loaded successfully */}
      {modelLoaded && (
        <CommercialBuildingInstances buildingInstances={buildingInstances} />
      )}
    </group>
  )
}