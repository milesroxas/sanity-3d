import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { addShadowsToModel } from './shadows';

/**
 * Higher-order component that adds shadow properties to all meshes in a component
 * @param Component The component to wrap
 * @param castShadow Whether meshes should cast shadows
 * @param receiveShadow Whether meshes should receive shadows
 */
export function withShadows<P extends object>(
  Component: React.ComponentType<P>,
  castShadow = true,
  receiveShadow = true
): React.FC<P> {
  return (props: P) => {
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
      if (groupRef.current) {
        addShadowsToModel(groupRef.current, castShadow, receiveShadow);
      }
    }, []);

    return (
      <group ref={groupRef}>
        <Component {...(props as P)} />
      </group>
    );
  };
} 