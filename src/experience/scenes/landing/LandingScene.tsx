'use client';

import { useGSAP } from '@gsap/react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';
import { useCameraStore } from '../store/cameraStore';
import { Billboard } from './components/Billboard';
import { Effects } from './components/Effects';
import { Ground } from './components/Ground';
import { SceneEnvironment } from './components/SceneEnvironment';
import { LANDING_CAMERA_POSITIONS, useLandingCameraStore } from './store/landingCameraStore';

const LandingScene = forwardRef<any>((_, ref) => {
  const [isReady, setIsReady] = useState(false);
  const { resetToInitial } = useCameraStore();
  const { position, target, isAnimating, setAnimating, setCamera } = useLandingCameraStore();

  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Animate camera to follow store values
  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.copy(position);
      cameraRef.current.lookAt(target);
    }
  });

  // GSAP camera animation
  useGSAP(
    () => {
      if (!isReady) return;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Define start and end positions as plain objects
      const startPos = { x: 20, y: 10, z: 140 };
      const endPos = {
        x: LANDING_CAMERA_POSITIONS.main.position.x,
        y: LANDING_CAMERA_POSITIONS.main.position.y,
        z: LANDING_CAMERA_POSITIONS.main.position.z,
      };

      const startTarget = { x: -9, y: 16, z: -0.0 };
      const endTarget = {
        x: LANDING_CAMERA_POSITIONS.main.target.x,
        y: LANDING_CAMERA_POSITIONS.main.target.y,
        z: LANDING_CAMERA_POSITIONS.main.target.z,
      };

      // Set initial position
      setCamera(
        new Vector3(startPos.x, startPos.y, startPos.z),
        new Vector3(startTarget.x, startTarget.y, startTarget.z)
      );
      setAnimating(true);

      // Animate position
      tl.to(startPos, {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration: 3,
        ease: 'power2.out',
        onUpdate: () => {
          setCamera(
            new Vector3(startPos.x, startPos.y, startPos.z),
            new Vector3(startTarget.x, startTarget.y, startTarget.z)
          );
        },
      })
        // Animate target
        .to(
          startTarget,
          {
            x: endTarget.x,
            y: endTarget.y,
            z: endTarget.z,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              setCamera(
                new Vector3(startPos.x, startPos.y, startPos.z),
                new Vector3(startTarget.x, startTarget.y, startTarget.z)
              );
            },
          },
          '<'
        ) // Start at the same time
        .call(() => {
          console.log('Animation complete');
          setAnimating(false);
        });

      return () => {
        timelineRef.current?.kill();
      };
    },
    { dependencies: [isReady] }
  );

  // Initialize animation after the component mounts
  useEffect(() => {
    // Small delay to ensure everything is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      resetToInitial();
      timelineRef.current?.kill();
    };
  }, [resetToInitial]);

  return (
    <>
      <Effects />
      <SceneEnvironment />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        filmGauge={36}
        fov={30}
        near={0.1}
        far={1000}
        position={[position.x, position.y, position.z]}
      />
      {/* <Effects /> */}

      <OrbitControls
        enabled={!isAnimating}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 16}
        maxAzimuthAngle={Math.PI / 16}
        autoRotate={true}
        autoRotateSpeed={0.2}
      />

      <ambientLight intensity={0.05} />
      <Billboard />

      <Ground />
      <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color={'#DCBF9A'} transparent opacity={1} />
      </mesh>
    </>
  );
});

LandingScene.displayName = 'LandingScene';

export default LandingScene;
