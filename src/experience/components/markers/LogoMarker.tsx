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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const baseScale = useMemo(() => (typeof scale === 'number' ? scale : scale[0]), [scale]);
  const targetScale = useMemo(
    () => (isHovered ? baseScale * 1.2 : baseScale),
    [baseScale, isHovered]
  );

  // ensure transparent flag and depthWrite stay in sync
  const syncMaterialProps = useCallback((mats: THREE.Material[]) => {
    mats.forEach(rawMat => {
      const mat = rawMat as THREE.Material & {
        depthTest?: boolean;
        side?: THREE.Side;
      };
      mat.transparent = mat.opacity < 1;
      const isOpaque = mat.opacity >= 1;
      mat.depthWrite = isOpaque;
      // During fade, draw over the scene to avoid sorting/self-occlusion artifacts
      mat.depthTest = isOpaque;
      // Avoid backface popping for thin geometry
      mat.side = THREE.DoubleSide;
      mat.blending = THREE.NormalBlending;
    });
  }, []);

  // Clone materials per instance to avoid cross-instance interference
  const localMaterials = useMemo(() => {
    return {
      ['Logo.001']: materials['Logo.001'].clone(),
      ['Material.002']: materials['Material.002'].clone(),
      ['Material.004']: materials['Material.004'].clone(),
    } as GLTFResult['materials'];
  }, [materials]);

  const materialsArray = useMemo(() => Object.values(localMaterials), [localMaterials]);

  const setChildrenRenderOrder = useCallback((order: number) => {
    if (!groupRef.current) return;
    groupRef.current.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).isMesh) {
        mesh.renderOrder = order;
      }
    });
  }, []);

  // Initialize materials with opacity 0 on first mount
  useEffect(() => {
    if (isFirst.current) {
      const mats = materialsArray;
      mats.forEach(mat => {
        mat.opacity = 0;
        mat.transparent = true;
      });
      syncMaterialProps(mats);
    }
  }, [materialsArray, syncMaterialProps]);

  useGSAP(
    () => {
      if (!groupRef.current) return;

      // Kill any prior timeline/tweens to prevent competing animations
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      gsap.killTweensOf([
        groupRef.current.rotation,
        groupRef.current.position,
        groupRef.current.scale,
      ]);
      gsap.killTweensOf(materialsArray);

      // Only start animations when opacity changes from 0 to a positive value
      // or when hover state changes while visible
      const shouldAnimate =
        (isFirst.current && opacity > 0) ||
        (!isFirst.current && prevOpacity.current !== opacity) ||
        (opacity > 0 && !animationStarted.current) ||
        opacity > 0; // allow hover transforms to respond while visible

      if (!shouldAnimate) return;

      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' },
      });

      // Fade materials
      tl.to(
        materialsArray,
        {
          opacity,
          onUpdate: () => syncMaterialProps(materialsArray),
          onComplete: () => syncMaterialProps(materialsArray),
        },
        0
      );
      prevOpacity.current = opacity;

      // Adjust render order so the marker draws on top while fading
      if (groupRef.current) {
        const fading = opacity > 0 && opacity < 1;
        setChildrenRenderOrder(fading ? 999 : 0);
        // Ensure the group is visible before fading in
        if (opacity > 0) {
          groupRef.current.visible = true;
        }
      }

      // Hover transforms only when visible
      if (opacity > 0) {
        tl.to(
          groupRef.current.rotation,
          {
            y: isHovered ? Math.PI * 2 : 0,
            duration: isHovered ? 0.8 : 0.6,
            ease: 'power2.inOut',
            overwrite: 'auto',
            onComplete: () => {
              // normalize rotation after full spin to avoid large values accumulation
              if (groupRef.current) {
                groupRef.current.rotation.y = isHovered ? 0 : 0;
              }
            },
          },
          0
        );
        tl.to(
          groupRef.current.position,
          { y: isHovered ? 0.5 : 0, ease: 'power2.inOut', overwrite: 'auto' },
          0
        );
        tl.to(
          groupRef.current.scale,
          {
            x: targetScale,
            y: targetScale,
            z: targetScale,
            ease: 'power2.inOut',
            overwrite: 'auto',
          },
          0
        );
        animationStarted.current = true;
      }

      // Hide group after full fade out
      tl.eventCallback('onComplete', () => {
        if (groupRef.current) {
          setChildrenRenderOrder(0);
          if (opacity === 0) {
            groupRef.current.visible = false;
          }
        }
      });

      timelineRef.current = tl;
      isFirst.current = false;
    },
    {
      scope: groupRef,
      dependencies: [materialsArray, opacity, isHovered, targetScale],
      revertOnUpdate: true,
    }
  );

  // Ensure all tweens are cleaned on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (groupRef.current) {
        gsap.killTweensOf([
          groupRef.current.rotation,
          groupRef.current.position,
          groupRef.current.scale,
        ]);
      }
      gsap.killTweensOf(materialsArray);
    };
  }, [materialsArray]);

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
          material={localMaterials['Logo.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006_1.geometry}
          material={localMaterials['Material.002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh006_2.geometry}
          material={localMaterials['Material.004']}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/logoMarker.glb');
