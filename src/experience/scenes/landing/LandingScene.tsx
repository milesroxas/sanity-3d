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

const LandingScene = ({
  modalVideo,
  textureVideo,
  portalRef,
}: {
  modalVideo: any;
  textureVideo: any;
  portalRef: any;
}) => {
  const { isAnimating, setAnimating, hasAnimated, setHasAnimated } = useLandingCameraStore();
  const router = useRouter();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const { size } = useThree();

  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasInitializedRef = useRef(false);
  const visibilityChangeRef = useRef(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const { progress, active } = useProgress();
  // Consider loaded when loaders are inactive or progress is effectively complete
  const isLoaded = !active || progress >= 99.5;

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
  } = useMainContentControls(responsiveConfig.mainContent.position);
  const {
    positionX: billboardPositionX,
    positionY: billboardPositionY,
    positionZ: billboardPositionZ,
    scale: billboardScale,
  } = useBillboardControls(responsiveConfig.billboard.position, responsiveConfig.billboard.scale);

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
      billboard: {
        position: new Vector3(
          currentConfig.billboard.position.x,
          currentConfig.billboard.position.y,
          currentConfig.billboard.position.z
        ),
        scale: currentConfig.billboard.scale,
      },
    }),
    [currentConfig]
  );

  const [mainContentPosition] = useState(() => positions.mainContent.clone());

  // Immediately set hasAnimated to true if it was already true in the store
  // This ensures content is visible when navigating back
  useEffect(() => {
    if (useLandingCameraStore.getState().hasAnimated && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasAnimated, setHasAnimated]);

  // Add cleanup for GSAP timeline and handle visibility changes
  useEffect(() => {
    // Handle visibility change to prevent re-animations when switching tabs
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is now hidden
        visibilityChangeRef.current = true;
      } else if (visibilityChangeRef.current && hasAnimated) {
        // Page is now visible again and we've already animated
        // Don't trigger animations again
        visibilityChangeRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Kill GSAP timeline to prevent memory leaks
      if (entranceTimelineRef.current) {
        entranceTimelineRef.current.kill();
        entranceTimelineRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasAnimated]);

  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);
  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

  const { contextSafe } = useGSAP();

  // Track if intro animation has been started to avoid duplicate triggers
  const hasStartedRef = useRef(false);

  // Add a ref to track if we've initialized visibility
  const hasInitializedVisibilityRef = useRef(false);

  // Update the setContentVisibility function
  const setContentVisibility = useCallback((visible: boolean) => {
    const portalEl = portalRef.current as HTMLElement | null;
    const contentEl = contentRef.current as HTMLElement | null;

    if (portalEl) {
      gsap.set(portalEl, { opacity: visible ? 1 : 0 });
      if (visible) {
        hasInitializedVisibilityRef.current = true;
      }
    }

    if (contentEl) {
      gsap.set(contentEl, { opacity: visible ? 1 : 0, y: visible ? 0 : 20 });
    }
  }, []);

  // Removed effect that force-set visibility on hasAnimated to avoid interrupting GSAP reveal

  // 2. Modify handleEnter to use the helper function for initial setup
  const handleEnter = contextSafe(() => {
    if (!cameraRef.current || isAnimating) return;
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true);
        setAnimating(false);
        hasInitializedRef.current = true;
      },
    });

    entranceTimelineRef.current = tl;
    setAnimating(true);

    // Prepare content for animation (hide it first)
    setContentVisibility(false);

    // Animate camera (stabilize DPR during first seconds via store flag)
    const startPosition = positions.camera.clone();
    startPosition.z += 200;
    startPosition.y += 50;
    cameraRef.current.position.copy(startPosition);
    tl.to(cameraRef.current.position, {
      ...positions.camera,
      duration: 4.5,
      ease: 'power2.out',
      onUpdate: () => cameraRef.current?.lookAt(positions.target),
    });

    // Animate content immediately after camera reaches its final position
    const portalEl = portalRef.current as HTMLElement | null;
    const contentEl = contentRef.current as HTMLElement | null;
    if (portalEl || contentEl) gsap.killTweensOf([portalEl, contentEl]);
    if (portalEl) {
      tl.fromTo(portalEl, { opacity: 0 }, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    }
    if (contentEl) {
      tl.fromTo(
        contentEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', overwrite: 'auto' }
      );
    }

    tl.play();
  });

  // 3. Modify handleExit to use consistent animation approach
  const handleExit = contextSafe(() => {
    if (isAnimating) return;
    setAnimating(true);

    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }

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
    }

    if (portalRef.current) {
      tl.to(
        portalRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
        },
        0.6
      );
    }

    // Camera animations (unchanged)
    if (cameraRef.current) {
      const startTarget = positions.target.clone();
      const endTarget = startTarget.clone().add(new Vector3(0, 300, 0));

      tl.to(
        cameraRef.current.position,
        {
          y: '+=200',
          duration: 2.5,
          ease: 'power2.in',
        },
        0.8
      );

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

  // 1. Add an initialization effect that runs once on mount (before paint to avoid flash)
  useLayoutEffect(() => {
    // Ensure initial visibility is correctly set to prevent flashes and style conflicts
    const alreadyAnimated = useLandingCameraStore.getState().hasAnimated;
    setContentVisibility(alreadyAnimated);
  }, [setContentVisibility]);

  // 2. Update your existing useEffect to avoid race conditions
  useEffect(() => {
    // Initial animation trigger when assets and camera are ready
    if (hasStartedRef.current || hasAnimated || isAnimating) return;
    let rafId: number;
    const tick = () => {
      if (!hasStartedRef.current && isLoaded && cameraRef.current && !document.hidden) {
        handleEnter();
      } else if (!hasStartedRef.current && !hasAnimated) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isLoaded, hasAnimated, isAnimating, handleEnter]);

  // Fallback: start intro after a short delay if loaders don't fire expected events
  useEffect(() => {
    if (hasAnimated || isAnimating || hasStartedRef.current) return;
    const fallback = setTimeout(() => {
      if (!document.hidden && !hasStartedRef.current && !hasAnimated && !isAnimating) {
        requestAnimationFrame(handleEnter);
      }
    }, 1200);
    return () => clearTimeout(fallback);
  }, [hasAnimated, isAnimating, handleEnter]);

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

  // Remove legacy visibility side-effects that could interfere with GSAP sequencing

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
          portal={portalRef}
          prepend
          style={{
            pointerEvents: 'auto',
            zIndex: 30,
            scale: 2.5,
          }}
        >
          <div
            ref={contentRef}
            className={`${textStyles.containerWidth} text-white`}
            onMouseEnter={handleMouseEnterUI}
            onMouseLeave={handleMouseLeaveUI}
            style={{ zIndex: 30, opacity: 0, transform: 'translateY(20px)' }}
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

// Memoize the component to prevent unnecessary re-renders
export default memo(LandingScene);
