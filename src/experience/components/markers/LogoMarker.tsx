import { useGSAP } from '@gsap/react';
import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import gsap from 'gsap';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Mesh006: THREE.Mesh;
    Mesh006_1: THREE.Mesh;
    Mesh006_2: THREE.Mesh;
  };
  materials: {
    ['Logo.001']: THREE.MeshStandardMaterial;
    ['Material.002']: THREE.MeshStandardMaterial;
    ['Material.004']: THREE.MeshStandardMaterial;
  };
};

type LogoMarkerProps = ThreeElements['group'] & {
  isHovered?: boolean;
  scale?: number | [number, number, number];
  opacity?: number;
};

gsap.registerPlugin(useGSAP);

export function LogoMarker(props: LogoMarkerProps) {
  const { nodes, materials } = useGLTF('/models/logoMarker.glb') as unknown as GLTFResult;
  const { isHovered = false, scale = 1, opacity = 1, ...groupProps } = props;

  const groupRef = useRef<THREE.Group>(null);
  const prevOpacity = useRef(0);
  const isFirst = useRef(true);
  const animationStarted = useRef(false);

  const baseScale = useMemo(() => (typeof scale === 'number' ? scale : scale[0]), [scale]);
  const targetScale = useMemo(
    () => (isHovered ? baseScale * 1.2 : baseScale),
    [baseScale, isHovered]
  );

  // ensure transparent flag and depthWrite stay in sync
  const syncMaterialProps = useCallback((mats: THREE.Material[]) => {
    mats.forEach(mat => {
      mat.transparent = mat.opacity < 1;
      mat.depthWrite = mat.opacity >= 1;
      mat.blending = mat.opacity < 1 ? THREE.NormalBlending : THREE.NoBlending;
    });
  }, []);

  // Initialize materials with opacity 0 on first mount
  useEffect(() => {
    if (isFirst.current) {
      const mats = Object.values(materials);
      mats.forEach(mat => {
        mat.opacity = 0;
        mat.transparent = true;
      });
      syncMaterialProps(mats);
    }
  }, [materials, syncMaterialProps]);

  useGSAP(
    () => {
      if (!groupRef.current) return;
      const mats = Object.values(materials);

      // Only start animations when opacity changes from 0 to a positive value
      // or when hover state changes while visible
      const shouldAnimate =
        (isFirst.current && opacity > 0) ||
        (!isFirst.current && prevOpacity.current !== opacity) ||
        (opacity > 0 && !animationStarted.current);

      if (shouldAnimate) {
        const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.inOut' } });

        // fade tween on mount or whenever opacity changes
        tl.to(
          mats,
          {
            opacity,
            onUpdate: () => syncMaterialProps(mats),
          },
          0
        );
        prevOpacity.current = opacity;

        // hover transforms
        if (opacity > 0) {
          tl.to(groupRef.current.rotation, { y: isHovered ? Math.PI * 2 : 0 }, 0);
          tl.to(groupRef.current.position, { y: isHovered ? 0.5 : 0 }, 0);
          tl.to(groupRef.current.scale, { x: targetScale, y: targetScale, z: targetScale }, 0);
          animationStarted.current = true;
        }

        isFirst.current = false;
      }
    },
    {
      scope: groupRef,
      dependencies: [materials, opacity, isHovered, targetScale],
      revertOnUpdate: false, // we manage our own reset logic
    }
  );

  // reset transforms on unmount or scale change
  useEffect(() => {
    return () => {
      if (groupRef.current) {
        groupRef.current.rotation.y = 0;
        groupRef.current.position.y = 0;
        groupRef.current.scale.set(baseScale, baseScale, baseScale);
      }
    };
  }, [baseScale]);

  return (
    <group ref={groupRef} {...groupProps} dispose={null}>
      <group position={[0, 5.185, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.279, 0.088, 0.279]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006.geometry}
          material={materials['Logo.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006_1.geometry}
          material={materials['Material.002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006_2.geometry}
          material={materials['Material.004']}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/logoMarker.glb');
