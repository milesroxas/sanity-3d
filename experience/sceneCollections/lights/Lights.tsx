import React, { useRef, useEffect, useState } from "react";
import { DoubleStreetLights } from "./models/DoubleStreetLights";
import { SingleStreetLights } from "./models/SingleStreetLights";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";

function Lights() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const { scene, gl } = useThree();
  const [helpers, setHelpers] = useState<THREE.Object3D[]>([]);

  // Configure renderer for better shadows
  useEffect(() => {
    // Set shadow map type to PCFSoftShadowMap for smoother shadows
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Enable high quality shadows
    gl.shadowMap.enabled = true;
  }, [gl]);

  // Create Leva controls for shadow settings
  const shadowControls = useControls(
    "Directional Light & Shadows",
    {
      showHelpers: { value: true },
      position: {
        value: [32, 38, 49],
        step: 1,
      },
      intensity: { 
        value: 1.2, 
        min: 0, 
        max: 10, 
        step: 0.1 
      },
      shadowMapSize: { 
        value: 4096, 
        min: 512, 
        max: 4096, 
        step: 512 
      },
      shadowBias: { 
        value: -0.0002, 
        min: -0.00001, 
        max: 0.1, 
        step: 0.00001 
      },
      shadowNormalBias: { 
        value: 0.02, 
        min: 0, 
        max: 0.1, 
        step: 0.001 
      },
      shadowCameraFar: { 
        value: 450, 
        min: 100, 
        max: 1000, 
        step: 10 
      },
      shadowCameraLeft: { 
        value: -170, 
        min: -500, 
        max: 0, 
        step: 10 
      },
      shadowCameraRight: { 
        value: 100, 
        min: 0, 
        max: 500, 
        step: 10 
      },
      shadowCameraTop: { 
        value: 50, 
        min: 0, 
        max: 500, 
        step: 10 
      },
      shadowCameraBottom: { 
        value: -40, 
        min: -500, 
        max: 0, 
        step: 10 
      },
      ambientIntensity: { 
        value: 0.4, 
        min: 0, 
        max: 1, 
        step: 0.05 
      }
    },
    { collapsed: true }
  );

  // Add helpers when the component mounts
  useEffect(() => {
    if (directionalLightRef.current && shadowControls.showHelpers) {
      // Create directional light helper
      const lightHelper = new THREE.DirectionalLightHelper(
        directionalLightRef.current,
        10
      );
      
      // Create shadow camera helper
      const shadowHelper = new THREE.CameraHelper(
        directionalLightRef.current.shadow.camera
      );
      
      // Add helpers to the scene
      scene.add(lightHelper);
      scene.add(shadowHelper);
      
      // Store helpers for cleanup
      setHelpers([lightHelper, shadowHelper]);
      
      // Return cleanup function
      return () => {
        scene.remove(lightHelper);
        scene.remove(shadowHelper);
      };
    } else if (helpers.length > 0) {
      // Remove helpers if they exist and showHelpers is false
      helpers.forEach(helper => scene.remove(helper));
      setHelpers([]);
    }
  }, [scene, shadowControls.showHelpers]);

  // Update shadow camera when shadow camera settings change
  useEffect(() => {
    if (directionalLightRef.current) {
      const light = directionalLightRef.current;
      
      // Update shadow camera settings
      light.shadow.camera.far = shadowControls.shadowCameraFar;
      light.shadow.camera.left = shadowControls.shadowCameraLeft;
      light.shadow.camera.right = shadowControls.shadowCameraRight;
      light.shadow.camera.top = shadowControls.shadowCameraTop;
      light.shadow.camera.bottom = shadowControls.shadowCameraBottom;
      light.shadow.bias = shadowControls.shadowBias;
      light.shadow.normalBias = shadowControls.shadowNormalBias;
      
      // Update shadow map size
      light.shadow.mapSize.width = shadowControls.shadowMapSize;
      light.shadow.mapSize.height = shadowControls.shadowMapSize;
      
      // Update camera
      light.shadow.camera.updateProjectionMatrix();
      
      // Update helpers if they exist
      if (helpers.length > 1 && helpers[1] instanceof THREE.CameraHelper) {
        (helpers[1] as THREE.CameraHelper).update();
      }
    }
  }, [
    shadowControls.shadowCameraFar,
    shadowControls.shadowCameraLeft,
    shadowControls.shadowCameraRight,
    shadowControls.shadowCameraTop,
    shadowControls.shadowCameraBottom,
    shadowControls.shadowBias,
    shadowControls.shadowNormalBias,
    shadowControls.shadowMapSize
  ]);

  return (
    <>
      <directionalLight 
        ref={directionalLightRef}
        position={shadowControls.position}
        intensity={shadowControls.intensity} 
        castShadow 
      />
      <ambientLight intensity={shadowControls.ambientIntensity} />
      <DoubleStreetLights />
      <SingleStreetLights />
    </>
  );
}

export default Lights;
