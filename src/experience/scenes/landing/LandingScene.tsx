'use client';

import { Button } from '@/components/ui/button';
import {
  Billboard as DreiBillboard,
  Float,
  Html,
  PerspectiveCamera,
  useProgress,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import { vehicles } from '@/experience/animations';
import { AnimatedClouds } from '@/experience/effects/components/Clouds';
import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { INITIAL_POSITIONS, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Euler, Group, PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';
import { Billboard } from './components/Billboard';
import { Effects } from './components/Effects';
import { SceneEnvironment } from './components/SceneEnvironment';
import { DesertModels } from './compositions/DesertModels';
import { Logo } from './compositions/Logo';
import {
  useBillboardControls,
  useCameraControls,
  useDebugControls,
  useLogoControls,
  useMainContentControls,
  useSceneInfoControls,
} from './config/controls';
import { MOUSE_CONFIG } from './config/mouseConfig';
import { useResponsiveConfig, useResponsiveTextStyles } from './hooks/useResponsiveConfig';
import { useLandingCameraStore } from './store/landingCameraStore';

const LandingScene = ({
  modalVideo,
  textureVideo,
  portalRef,
}: {
  modalVideo: any;
  textureVideo: any;
  portalRef: any;
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const { isAnimating, setAnimating } = useLandingCameraStore();
  const router = useRouter();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const { size } = useThree();

  const logoGroupRef = useRef<Group>(null);
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const { progress } = useProgress();
  const isLoaded = progress === 100;

  const responsiveConfig = useResponsiveConfig();
  const textStyles = useResponsiveTextStyles();

  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isHoveringUI = useRef(false);

  const { enabled: debugEnabled } = useDebugControls();
  useSceneInfoControls(size.width, size.height, hasAnimated && !isAnimating);

  const {
    positionX: cameraPositionX,
    positionY: cameraPositionY,
    positionZ: cameraPositionZ,
    targetX: cameraTargetX,
    targetY: cameraTargetY,
    targetZ: cameraTargetZ,
    mouseInfluence,
    mouseDamping,
  } = useCameraControls(
    responsiveConfig.camera.position,
    responsiveConfig.camera.target,
    MOUSE_CONFIG.influence,
    MOUSE_CONFIG.dampingFactor
  );
  const {
    positionX: mainContentPositionX,
    positionY: mainContentPositionY,
    positionZ: mainContentPositionZ,
    rotationX: mainContentRotationX,
    rotationY: mainContentRotationY,
    rotationZ: mainContentRotationZ,
  } = useMainContentControls(
    responsiveConfig.mainContent.position,
    responsiveConfig.mainContent.rotation
  );
  const {
    positionX: billboardPositionX,
    positionY: billboardPositionY,
    positionZ: billboardPositionZ,
    scale: billboardScale,
  } = useBillboardControls(responsiveConfig.billboard.position, responsiveConfig.billboard.scale);
  const {
    positionX: logoPositionX,
    positionY: logoPositionY,
    positionZ: logoPositionZ,
    rotationX: logoRotationX,
    rotationY: logoRotationY,
    rotationZ: logoRotationZ,
  } = useLogoControls(responsiveConfig.logo.position, responsiveConfig.logo.rotation);

  const currentConfig = useMemo(() => {
    if (debugEnabled) {
      return {
        camera: {
          position: { x: cameraPositionX, y: cameraPositionY, z: cameraPositionZ },
          target: { x: cameraTargetX, y: cameraTargetY, z: cameraTargetZ },
        },
        mainContent: {
          position: { x: mainContentPositionX, y: mainContentPositionY, z: mainContentPositionZ },
          rotation: { x: mainContentRotationX, y: mainContentRotationY, z: mainContentRotationZ },
        },
        billboard: {
          position: { x: billboardPositionX, y: billboardPositionY, z: billboardPositionZ },
          scale: billboardScale,
        },
        logo: {
          position: { x: logoPositionX, y: logoPositionY, z: logoPositionZ },
          rotation: { x: logoRotationX, y: logoRotationY, z: logoRotationZ },
        },
        mouseInfluence,
        mouseDamping,
      };
    }
    return {
      ...responsiveConfig,
      mouseInfluence: MOUSE_CONFIG.influence,
      mouseDamping: MOUSE_CONFIG.dampingFactor,
    };
  }, [
    debugEnabled,
    cameraPositionX,
    cameraPositionY,
    cameraPositionZ,
    cameraTargetX,
    cameraTargetY,
    cameraTargetZ,
    mainContentPositionX,
    mainContentPositionY,
    mainContentPositionZ,
    mainContentRotationX,
    mainContentRotationY,
    mainContentRotationZ,
    billboardPositionX,
    billboardPositionY,
    billboardPositionZ,
    billboardScale,
    logoPositionX,
    logoPositionY,
    logoPositionZ,
    logoRotationX,
    logoRotationY,
    logoRotationZ,
    mouseInfluence,
    mouseDamping,
    responsiveConfig,
  ]);
  const positions = useMemo(
    () => ({
      camera: new Vector3(
        currentConfig.camera.position.x,
        currentConfig.camera.position.y,
        currentConfig.camera.position.z
      ),
      target: new Vector3(
        currentConfig.camera.target.x,
        currentConfig.camera.target.y,
        currentConfig.camera.target.z
      ),
      mainContent: new Vector3(
        currentConfig.mainContent.position.x,
        currentConfig.mainContent.position.y,
        currentConfig.mainContent.position.z
      ),
      mainContentRotation: new Euler(
        currentConfig.mainContent.rotation.x,
        currentConfig.mainContent.rotation.y,
        currentConfig.mainContent.rotation.z
      ),
      billboard: {
        position: new Vector3(
          currentConfig.billboard.position.x,
          currentConfig.billboard.position.y,
          currentConfig.billboard.position.z
        ),
        scale: currentConfig.billboard.scale,
      },
      logo: {
        position: new Vector3(
          currentConfig.logo.position.x,
          currentConfig.logo.position.y,
          currentConfig.logo.position.z
        ),
        rotation: new Euler(
          currentConfig.logo.rotation.x,
          currentConfig.logo.rotation.y,
          currentConfig.logo.rotation.z
        ),
      },
    }),
    [currentConfig]
  );

  const [mainContentPosition, setMainContentPosition] = useState(() =>
    positions.mainContent.clone()
  );
  const [mainContentRotation, setMainContentRotation] = useState(() =>
    positions.mainContentRotation.clone()
  );

  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);
  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

  const { contextSafe } = useGSAP();

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.opacity = '0';
      contentRef.current.style.transform = 'translateY(20px)';
    }
  }, []);

  const handleEnter = contextSafe(() => {
    if (!cameraRef.current || isAnimating || hasAnimated) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true);
        setAnimating(false);
      },
    });

    entranceTimelineRef.current = tl;

    setAnimating(true);

    // Animate camera
    const startPosition = positions.camera.clone();
    startPosition.z += 200;
    startPosition.y += 50;
    cameraRef.current.position.copy(startPosition);
    tl.to(cameraRef.current.position, {
      ...positions.camera,
      duration: 5,
      ease: 'power2.out',
      onUpdate: () => cameraRef.current?.lookAt(positions.target),
    });

    tl.add(() => {
      if (contentRef.current) {
        const htmlParent = contentRef.current.parentElement;
        if (htmlParent) {
          gsap.to(htmlParent, {
            opacity: 1,
            duration: 0.1,
          });
        }

        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0, //
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.3,
        });
      }
    });

    tl.play();
  });

  const handleExit = contextSafe(() => {
    if (isAnimating) return;
    setAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        const cameraStore = useCameraStore.getState();
        cameraStore.setCamera(
          INITIAL_POSITIONS.mainIntro.position.clone(),
          INITIAL_POSITIONS.mainIntro.target.clone(),
          'main'
        );
        cameraStore.setIsLoading(true);

        router.push('/experience');
      },
    });

    if (contentRef.current) {
      const htmlParent = contentRef.current.parentElement;
      tl.to(
        contentRef.current,
        {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'power2.in',
        },
        0
      );

      if (htmlParent) {
        tl.to(
          htmlParent,
          {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in',
          },
          0.6
        );
      }
    }

    if (cameraRef.current) {
      const startTarget = positions.target.clone();
      const endTarget = startTarget.clone().add(new Vector3(0, 300, 0));

      // Animate camera position
      tl.to(
        cameraRef.current.position,
        {
          y: '+=200',
          duration: 2.5,
          ease: 'power2.in',
        },
        0.8
      );

      // Animate camera target
      tl.to(
        startTarget,
        {
          y: endTarget.y,
          duration: 2.5,
          ease: 'power2.in',
          onUpdate: () => cameraRef.current?.lookAt(startTarget),
        },
        0.8
      );
    }

    tl.play();
  });

  useEffect(() => {
    if (isLoaded && !hasAnimated && !isAnimating) {
      requestAnimationFrame(() => {
        handleEnter();
      });
    }
  }, [isLoaded, hasAnimated, isAnimating, handleEnter]);

  useFrame((state, delta) => {
    if (!cameraRef.current || isAnimating || !hasAnimated) return;

    mousePosition.current.x = state.mouse.x;
    mousePosition.current.y = state.mouse.y;
    const dampingMultiplier = isHoveringUI.current ? MOUSE_CONFIG.uiDampingFactor : 1;
    const effectiveDamping = currentConfig.mouseDamping * dampingMultiplier;
    const lerpFactor = 1 - Math.exp(-effectiveDamping * 60 * delta);
    cameraOffset.current.x +=
      (mousePosition.current.x * currentConfig.mouseInfluence - cameraOffset.current.x) *
      lerpFactor;
    cameraOffset.current.y +=
      (mousePosition.current.y * currentConfig.mouseInfluence * 0.5 - cameraOffset.current.y) *
      lerpFactor;
    cameraRef.current.position.set(
      positions.camera.x + cameraOffset.current.x,
      positions.camera.y + cameraOffset.current.y,
      positions.camera.z
    );
    cameraRef.current.lookAt(positions.target);
  });

  useFrame(() => {
    if (!isAnimating) {
      if (positions.mainContent.distanceTo(mainContentPosition) > 0.01) {
        setMainContentPosition(positions.mainContent.clone());
      }
      if (
        Math.abs(mainContentRotation.x - positions.mainContentRotation.x) > 0.01 ||
        Math.abs(mainContentRotation.y - positions.mainContentRotation.y) > 0.01 ||
        Math.abs(mainContentRotation.z - positions.mainContentRotation.z) > 0.01
      ) {
        setMainContentRotation(positions.mainContentRotation.clone());
      }
    }
  });

  return (
    <group>
      <Effects />
      <SceneEnvironment />
      <DesertModels />
      <AnimatedClouds />
      <VehiclesInstances useSharedMaterial={false}>
        <vehicles.AnimatedPlane pathOffset={0.85} scale={0.3} />
      </VehiclesInstances>

      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        filmGauge={36}
        fov={30}
        near={0.1}
        far={10000}
        position={positions.camera}
      />

      <ambientLight intensity={0.05} />

      <Float speed={0.7} floatIntensity={0.2} rotationIntensity={0.1} floatingRange={[-0.4, 0.4]}>
        <group
          ref={logoGroupRef}
          position={[
            positions.logo.position.x,
            positions.logo.position.y,
            positions.logo.position.z,
          ]}
          rotation={[
            currentConfig.logo.rotation.x,
            currentConfig.logo.rotation.y,
            currentConfig.logo.rotation.z,
          ]}
        >
          <DreiBillboard follow={true}>
            <Logo />
          </DreiBillboard>
        </group>
      </Float>
      <DreiBillboard follow={true}>
        <Html
          center
          position={mainContentPosition}
          transform
          rotation={mainContentRotation}
          portal={portalRef}
          prepend
          style={{
            pointerEvents: 'auto',
            opacity: 0,
            zIndex: 30,
          }}
        >
          <div
            ref={contentRef}
            className={`${textStyles.containerWidth} text-white`}
            onMouseEnter={handleMouseEnterUI}
            onMouseLeave={handleMouseLeaveUI}
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              zIndex: 30,
            }}
          >
            <p className={`mb-8 ${textStyles.textSize} leading-relaxed`}>
              With over 38 years of experience, O'Linn Security Inc. offers comprehensive security
              solutions tailored to your needs.
            </p>
            <Button
              size="sm"
              variant="button21"
              onClick={handleExit}
              className="relative text-white"
            >
              ENTER EXPERIENCE
            </Button>
          </div>
        </Html>
      </DreiBillboard>

      <Billboard
        position={positions.billboard.position}
        scale={positions.billboard.scale}
        modalVideo={modalVideo}
        textureVideo={textureVideo}
        portalRef={portalRef}
      />
    </group>
  );
};

LandingScene.displayName = 'LandingScene';

export default LandingScene;
