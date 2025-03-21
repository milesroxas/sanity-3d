import { OrthographicCamera } from "@react-three/drei";
import { Hud } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function SceneTransition({
  transition,
  color,
}: {
  transition: boolean;
  color: string;
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [opacity, setOpacity] = useState(transition ? 1 : 0);
  const targetOpacity = useRef(transition ? 1 : 0);
  
  // Update target opacity when transition prop changes
  useEffect(() => {
    targetOpacity.current = transition ? 1 : 0;
  }, [transition]);
  
  // Animate opacity changes
  useFrame((_, delta) => {
    if (!materialRef.current) return;
    
    // Smoothly animate opacity toward target
    if (Math.abs(opacity - targetOpacity.current) > 0.01) {
      // Calculate new opacity, moving toward target
      const newOpacity = THREE.MathUtils.lerp(
        opacity,
        targetOpacity.current,
        delta * 3 // Adjust this value to control fade speed
      );
      
      setOpacity(newOpacity);
      materialRef.current.opacity = newOpacity;
    } else if (opacity !== targetOpacity.current) {
      // Snap to exact value when close enough
      setOpacity(targetOpacity.current);
      materialRef.current.opacity = targetOpacity.current;
    }
  });
  
  // If opacity is 0 and we're not transitioning, don't render anything
  if (opacity <= 0.001 && !transition) return null;

  return (
    <>
      <Hud renderPriority={2}>
        <OrthographicCamera
          makeDefault
          top={1}
          right={1}
          bottom={-1}
          left={-1}
          near={0}
          far={1}
        />
        <mesh visible={opacity > 0.01} renderOrder={1000}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial 
            ref={materialRef}
            color={color}
            transparent
            opacity={opacity}
            depthTest={false}
            // Ensure we're not blocking raycasting when faded out
            alphaTest={0.1} 
          />
        </mesh>
      </Hud>
    </>
  );
}

export default SceneTransition;
