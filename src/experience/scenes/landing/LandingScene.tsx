'use client';

import { Button } from '@/components/ui/button';
import {
  Billboard as DreiBillboard,
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
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';
import { Billboard } from './components/Billboard';
import { Effects } from './components/Effects';
import { SceneEnvironment } from './components/SceneEnvironment';
import { DesertModels } from './compositions/DesertModels';

import {
  useBillboardControls,
  useCameraControls,
  useDebugControls,
  useMainContentControls,
  useSceneInfoControls,
} from './config/controls';
import { MOUSE_CONFIG } from './config/mouseConfig';
import { useResponsiveConfig, useResponsiveTextStyles } from './hooks/useResponsiveConfig';
import { useLandingCameraStore } from './store/landingCameraStore';

interface LandingSceneProps {
  modalVideo: Sanity.Video | undefined;
  textureVideo: Sanity.Video | undefined;
  portalRef: React.MutableRefObject<HTMLElement | null>;
}

const LandingScene = memo(({ modalVideo, textureVideo, portalRef }: LandingSceneProps) => {
  const router = useRouter();
  const { size } = useThree();
  const { contextSafe } = useGSAP();

  // Store state
  const { isAnimating, setAnimating, hasAnimated, setHasAnimated } = useLandingCameraStore();

  // Refs
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const animationStartedRef = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isHoveringUI = useRef(false);

  // Progress tracking
  const { progress, active } = useProgress();
  const isLoaded = !active || progress >= 99.5;

  // Responsive configuration
  const responsiveConfig = useResponsiveConfig();
  const textStyles = useResponsiveTextStyles();

  // Debug controls
  const { enabled: debugEnabled } = useDebugControls();
  useSceneInfoControls(size.width, size.height, hasAnimated && !isAnimating);

  // Camera controls
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

  // Main content controls
  const {
    positionX: mainContentPositionX,
    positionY: mainContentPositionY,
    positionZ: mainContentPositionZ,
  } = useMainContentControls(responsiveConfig.mainContent.position);

  // Billboard controls
  const {
    positionX: billboardPositionX,
    positionY: billboardPositionY,
    positionZ: billboardPositionZ,
    scale: billboardScale,
  } = useBillboardControls(responsiveConfig.billboard.position, responsiveConfig.billboard.scale);

  // Stable configuration - only update when debug mode changes or responsive config changes
  const currentConfig = useMemo(() => {
    if (debugEnabled) {
      return {
        camera: {
          position: { x: cameraPositionX, y: cameraPositionY, z: cameraPositionZ },
          target: { x: cameraTargetX, y: cameraTargetY, z: cameraTargetZ },
        },
        mainContent: {
          position: { x: mainContentPositionX, y: mainContentPositionY, z: mainContentPositionZ },
        },
        billboard: {
          position: { x: billboardPositionX, y: billboardPositionY, z: billboardPositionZ },
          scale: billboardScale,
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
    responsiveConfig,
    // Only include debug controls when debug is enabled
    ...(debugEnabled
      ? [
          cameraPositionX,
          cameraPositionY,
          cameraPositionZ,
          cameraTargetX,
          cameraTargetY,
          cameraTargetZ,
          mainContentPositionX,
          mainContentPositionY,
          mainContentPositionZ,
          billboardPositionX,
          billboardPositionY,
          billboardPositionZ,
          billboardScale,
          mouseInfluence,
          mouseDamping,
        ]
      : []),
  ]);

  // Stable position objects - prevent recreation on every frame
  const positions = useMemo(() => {
    const cameraPos = new Vector3(
      currentConfig.camera.position.x,
      currentConfig.camera.position.y,
      currentConfig.camera.position.z
    );
    const targetPos = new Vector3(
      currentConfig.camera.target.x,
      currentConfig.camera.target.y,
      currentConfig.camera.target.z
    );
    const mainContentPos = new Vector3(
      currentConfig.mainContent.position.x,
      currentConfig.mainContent.position.y,
      currentConfig.mainContent.position.z
    );
    const billboardPos = new Vector3(
      currentConfig.billboard.position.x,
      currentConfig.billboard.position.y,
      currentConfig.billboard.position.z
    );

    return {
      camera: cameraPos,
      target: targetPos,
      mainContent: mainContentPos,
      billboard: {
        position: billboardPos,
        scale: currentConfig.billboard.scale,
      },
    };
  }, [currentConfig]);

  // Fixed main content position that doesn't change after initialization
  const [mainContentPosition] = useState(
    () =>
      new Vector3(
        responsiveConfig.mainContent.position.x,
        responsiveConfig.mainContent.position.y,
        responsiveConfig.mainContent.position.z
      )
  );

  // Mouse event handlers
  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);

  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

  // Clean up GSAP timeline function
  const cleanupTimeline = useCallback(() => {
    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }
  }, []);

  // Entrance animation
  const handleEnter = contextSafe(() => {
    if (!cameraRef.current || animationStartedRef.current || isAnimating) return;

    animationStartedRef.current = true;
    setAnimating(true);
    cleanupTimeline();

    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true);
        setAnimating(false);
        entranceTimelineRef.current = null;
      },
    });

    entranceTimelineRef.current = tl;

    // Set initial camera position
    const startPosition = positions.camera.clone();
    startPosition.z += 200;
    startPosition.y += 50;
    cameraRef.current.position.copy(startPosition);

    // Camera animation
    tl.to(cameraRef.current.position, {
      ...positions.camera,
      duration: 4.5,
      ease: 'power2.out',
      onUpdate: () => cameraRef.current?.lookAt(positions.target),
    });

    // Content animation - simplified and more reliable
    if (contentRef.current) {
      // Set initial state
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 20,
        visibility: 'visible', // Ensure visibility is set
      });

      // Animate in
      tl.to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out',
        },
        '-=1' // Start 1 second before camera animation ends
      );
    }

    // Portal interactivity handled centrally in wrapper
  });

  // Exit animation
  const handleExit = contextSafe(() => {
    if (isAnimating) return;

    setAnimating(true);
    cleanupTimeline();

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

    entranceTimelineRef.current = tl;

    // Animate content out
    if (contentRef.current) {
      tl.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power2.in',
      });
    }

    // Camera exit animation
    if (cameraRef.current) {
      const exitTarget = positions.target.clone();

      tl.to(
        cameraRef.current.position,
        {
          y: '+=200',
          duration: 2.5,
          ease: 'power2.in',
        },
        0.3
      );

      tl.to(
        exitTarget,
        {
          y: exitTarget.y + 300,
          duration: 2.5,
          ease: 'power2.in',
          onUpdate: () => cameraRef.current?.lookAt(exitTarget),
        },
        0.3
      );
    }
  });

  // Initialize content visibility based on store state
  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const alreadyAnimated = useLandingCameraStore.getState().hasAnimated;

    if (alreadyAnimated) {
      // If already animated, show content immediately
      gsap.set(contentRef.current, {
        opacity: 1,
        y: 0,
        visibility: 'visible',
      });
      // Portal interactivity handled centrally in wrapper
      animationStartedRef.current = true;
      setHasAnimated(true);
    } else {
      // Hide content initially for animation
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 20,
        visibility: 'hidden',
      });
    }
  }, [portalRef, setHasAnimated]);

  // Trigger entrance animation when ready
  useEffect(() => {
    // Skip if already animated or currently animating
    if (animationStartedRef.current || hasAnimated) return;

    // Wait for camera to be ready and scene to be loaded
    if (cameraRef.current && isLoaded) {
      // Small delay to ensure everything is properly mounted
      const timer = setTimeout(() => {
        handleEnter();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasAnimated, handleEnter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimeline();
    };
  }, [cleanupTimeline]);

  // Camera mouse follow animation
  useFrame((state, delta) => {
    if (!cameraRef.current || isAnimating || !hasAnimated) return;

    // Update mouse position
    mousePosition.current.x = state.mouse.x;
    mousePosition.current.y = state.mouse.y;

    // Calculate damping
    const dampingMultiplier = isHoveringUI.current ? MOUSE_CONFIG.uiDampingFactor : 1;
    const effectiveDamping = currentConfig.mouseDamping * dampingMultiplier;
    const lerpFactor = 1 - Math.exp(-effectiveDamping * 60 * delta);

    // Apply camera offset with damping
    cameraOffset.current.x +=
      (mousePosition.current.x * currentConfig.mouseInfluence - cameraOffset.current.x) *
      lerpFactor;
    cameraOffset.current.y +=
      (mousePosition.current.y * currentConfig.mouseInfluence * 0.5 - cameraOffset.current.y) *
      lerpFactor;

    // Update camera position
    cameraRef.current.position.set(
      positions.camera.x + cameraOffset.current.x,
      positions.camera.y + cameraOffset.current.y,
      positions.camera.z
    );
    cameraRef.current.lookAt(positions.target);
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
        position={hasAnimated ? positions.camera : undefined}
      />

      <ambientLight intensity={0.05} />

      <DreiBillboard follow={true}>
        <Html
          center
          position={mainContentPosition}
          transform
          prepend
          style={{
            pointerEvents: 'auto',
            zIndex: 30,
            transform: 'scale(2.5)',
          }}
        >
          <div
            ref={contentRef}
            className={`${textStyles.containerWidth} text-white`}
            onMouseEnter={handleMouseEnterUI}
            onMouseLeave={handleMouseLeaveUI}
            style={{
              zIndex: 30,
              // Initial styles will be overridden by GSAP
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
});

LandingScene.displayName = 'LandingScene';

export default LandingScene;
