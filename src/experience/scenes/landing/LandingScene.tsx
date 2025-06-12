'use client';

import { Button } from '@/components/ui/button';
import { useGSAP } from '@gsap/react';
import { Float, Html, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import { vehicles } from '@/experience/animations';
import { AnimatedClouds } from '@/experience/effects/components/Clouds';
import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { INITIAL_POSITIONS } from '@/experience/scenes/store/cameraStore';
import { getLinkData, SanityNav, SanitySettings } from '@/store/navStore';
import gsap from 'gsap';
import { useControls } from 'leva';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
} from 'three';
import { useCameraStore } from '../store/cameraStore';
import { Billboard } from './components/Billboard';
import { Effects } from './components/Effects';
import { SceneEnvironment } from './components/SceneEnvironment';
import { DesertModels } from './compositions/DesertModels';
import { Ground } from './compositions/Ground';
import { Logo } from './compositions/Logo';
import { useLandingCameraStore } from './store/landingCameraStore';

interface ResponsivePositions {
  camera: {
    start: Vector3;
    end: Vector3;
  };
  target: {
    start: Vector3;
    end: Vector3;
  };
  html: {
    start: Vector3;
    end: Vector3;
  };
  billboard: {
    position: Vector3;
    scale: number;
  };
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

// Mouse interaction configuration
const MOUSE_CONFIG = {
  influence: 1.5, // Subtle influence strength
  dampingFactor: 0.05, // Smooth damping for natural feel
  uiDampingFactor: 0.8, // Reduce movement when hovering UI (subtle)
} as const;

const LandingScene = forwardRef<
  any,
  {
    modalVideo?: Sanity.Video;
    portalRef: React.RefObject<HTMLDivElement>;
    nav: SanityNav;
    settings: SanitySettings;
  }
>(({ modalVideo, portalRef, nav, settings: landingSettings }, ref) => {
  const navServices = nav.services;
  const navCompanyLinks = nav.companyLinks;
  const [isReady, setIsReady] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { resetToInitial } = useCameraStore();
  const { isAnimating, setAnimating } = useLandingCameraStore();
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Get viewport information for responsive calculations
  const { viewport, size } = useThree();

  // Mouse interaction state
  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isHoveringUI = useRef(false);

  // Calculate responsive positions based on viewport
  const responsivePositions = useMemo((): ResponsivePositions => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;
    const aspectRatio = size.width / size.height;
    const isWideScreen = aspectRatio > 2;

    const textOffset = isMobile ? -viewport.width * 0.2 : -viewport.width * 0.35;
    const billboardOffset = isMobile ? viewport.width * -0.2 : viewport.width * 0.5;

    if (isMobile) {
      return {
        camera: {
          start: new Vector3(0, 12, 120),
          end: new Vector3(0, 4, 80),
        },
        target: {
          start: new Vector3(0, 10, 0),
          end: new Vector3(0, 12, 0),
        },
        html: {
          start: new Vector3(0, 8, 0),
          end: new Vector3(-3, 25, 0),
        },
        billboard: {
          position: new Vector3(billboardOffset, 0, -40),
          scale: 0.8,
        },
      };
    }

    if (isTablet) {
      return {
        camera: {
          start: new Vector3(15, 10, 110),
          end: new Vector3(20, 12, 90),
        },
        target: {
          start: new Vector3(-5, 10, 0),
          end: new Vector3(-3, 15, 0),
        },
        html: {
          start: new Vector3(textOffset, 10, 0),
          end: new Vector3(-12, 30, 0),
        },
        billboard: {
          position: new Vector3(-7, 0, -20),
          scale: 1,
        },
      };
    }

    // Desktop and wide screen
    const cameraZ = isWideScreen ? 120 : 100;
    const endCameraZ = isWideScreen ? 100 : 100;

    return {
      camera: {
        start: new Vector3(20, 7, cameraZ),
        end: new Vector3(25, 10, endCameraZ),
      },
      target: {
        start: new Vector3(-9, 12, 0),
        end: new Vector3(-7, 20, 0),
      },
      html: {
        start: new Vector3(textOffset, 12, 0),
        end: new Vector3(textOffset, 25, 0),
      },
      billboard: {
        position: new Vector3(-4, 0, -20),
        scale: 1.2,
      },
    };
  }, [viewport.width, size.width, size.height]);

  // Leva controls with proper typing
  const settings = useControls('Settings', {
    useResponsive: {
      value: true,
      label: 'Use Responsive Positioning',
    },
    mouseInfluence: {
      value: MOUSE_CONFIG.influence,
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Mouse Influence Strength',
    },
    mouseDamping: {
      value: MOUSE_CONFIG.dampingFactor,
      min: 0.01,
      max: 0.2,
      step: 0.005,
      label: 'Mouse Damping',
    },
  });

  const manualCameraControls = useControls('Manual Camera', {
    position: {
      value: { x: 25, y: 10, z: 80 },
      render: get => !get('Settings.useResponsive'),
    },
    target: {
      value: { x: -7, y: 20, z: 0 },
      render: get => !get('Settings.useResponsive'),
    },
  });

  const manualHtmlControls = useControls('Manual HTML', {
    position: {
      value: { x: -15, y: 25, z: 0 },
      render: get => !get('Settings.useResponsive'),
    },
  });

  const manualBillboardControls = useControls('Manual Billboard', {
    position: {
      value: { x: -7, y: 0, z: -20 },
      render: get => !get('Settings.useResponsive'),
    },
    scale: {
      value: 1,
      min: 0.1,
      max: 2,
      step: 0.1,
      render: get => !get('Settings.useResponsive'),
    },
  });

  useControls('Debug', {
    deviceInfo: {
      value: `${size.width}x${size.height} | ${
        size.width < 768 ? 'Mobile' : size.width < 1024 ? 'Tablet' : 'Desktop'
      }`,
      editable: false,
    },
    introComplete: {
      value: hasAnimated && !isAnimating,
      editable: false,
      label: 'Mouse Interaction Active',
    },
  });

  // Extract values with proper typing
  const useResponsive = settings.useResponsive as boolean;
  const mouseInfluence = settings.mouseInfluence as number;
  const mouseDamping = settings.mouseDamping as number;
  const manualCameraPosition = manualCameraControls.position as Vec3;
  const manualCameraTarget = manualCameraControls.target as Vec3;
  const manualHtmlPosition = manualHtmlControls.position as Vec3;
  const manualBillboardPosition = manualBillboardControls.position as Vec3;
  const manualBillboardScale = manualBillboardControls.scale as number;

  // Determine current positions based on mode and animation state
  const currentPositions = useMemo(() => {
    if (useResponsive) {
      const phase = !isReady || isAnimating ? 'start' : 'end';
      return {
        camera: responsivePositions.camera[phase],
        target: responsivePositions.target[phase],
        html: responsivePositions.html[phase],
        billboard: responsivePositions.billboard,
      };
    } else {
      return {
        camera: new Vector3(manualCameraPosition.x, manualCameraPosition.y, manualCameraPosition.z),
        target: new Vector3(manualCameraTarget.x, manualCameraTarget.y, manualCameraTarget.z),
        html: new Vector3(manualHtmlPosition.x, manualHtmlPosition.y, manualHtmlPosition.z),
        billboard: {
          position: new Vector3(
            manualBillboardPosition.x,
            manualBillboardPosition.y,
            manualBillboardPosition.z
          ),
          scale: manualBillboardScale,
        },
      };
    }
  }, [
    useResponsive,
    responsivePositions,
    isReady,
    isAnimating,
    manualCameraPosition,
    manualCameraTarget,
    manualHtmlPosition,
    manualBillboardPosition,
    manualBillboardScale,
  ]);

  // Animated values for smooth transitions
  const animatedCamera = useRef(currentPositions.camera.clone());
  const animatedTarget = useRef(currentPositions.target.clone());
  const animatedHtml = useRef(currentPositions.html.clone());

  // State for HTML position to trigger re-renders
  const [htmlPos, setHtmlPos] = useState(() => currentPositions.html.clone());

  // Simplified mouse interaction handlers
  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);

  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

  // Smooth mouse interaction with consistent damping
  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    const introComplete = hasAnimated && !isAnimating;

    // Only apply mouse interaction when intro is complete
    if (introComplete) {
      // Update target mouse position from normalized coordinates (-1 to 1)
      mousePosition.current.x = state.mouse.x;
      mousePosition.current.y = state.mouse.y;

      // Apply UI damping when hovering over UI elements
      const dampingMultiplier = isHoveringUI.current ? MOUSE_CONFIG.uiDampingFactor : 1;
      const effectiveDamping = mouseDamping * dampingMultiplier;

      // Smooth lerp towards target position with consistent damping
      // Convert to frame-rate independent lerping
      const lerpFactor = 1 - Math.exp(-effectiveDamping * 60 * delta);

      cameraOffset.current.x +=
        (mousePosition.current.x * mouseInfluence - cameraOffset.current.x) * lerpFactor;
      cameraOffset.current.y +=
        (mousePosition.current.y * mouseInfluence * 0.5 - cameraOffset.current.y) * lerpFactor; // Reduced Y influence
    } else {
      // Smoothly return to center when intro is not complete
      const returnLerpFactor = 1 - Math.exp(-mouseDamping * 2 * 60 * delta);
      cameraOffset.current.x += (0 - cameraOffset.current.x) * returnLerpFactor;
      cameraOffset.current.y += (0 - cameraOffset.current.y) * returnLerpFactor;
    }

    // Update camera positions when not animating with GSAP
    if (!isAnimating) {
      const positionLerp = 1 - Math.exp(-0.1 * 60 * delta);
      animatedCamera.current.lerp(currentPositions.camera, positionLerp);
      animatedTarget.current.lerp(currentPositions.target, positionLerp);
      animatedHtml.current.lerp(currentPositions.html, positionLerp);

      // Update HTML position state when needed
      if (animatedHtml.current.distanceTo(htmlPos) > 0.01) {
        setHtmlPos(animatedHtml.current.clone());
      }
    }

    // Apply final camera position with smooth mouse offset
    cameraRef.current.position.set(
      animatedCamera.current.x + cameraOffset.current.x,
      animatedCamera.current.y + cameraOffset.current.y,
      animatedCamera.current.z
    );

    cameraRef.current.lookAt(animatedTarget.current);
  });

  // Handle exit animation
  const handleClick = () => {
    setAnimating(true);

    const overlayMaterial = new MeshBasicMaterial({
      color: 'white',
      transparent: true,
      opacity: 0,
    });

    const cameraStore = useCameraStore.getState();

    const tl = gsap.timeline({
      onComplete: () => {
        cameraStore.setCamera(
          INITIAL_POSITIONS.mainIntro.position.clone(),
          INITIAL_POSITIONS.mainIntro.target.clone(),
          'main'
        );
        cameraStore.setIsLoading(true);
        router.push('/experience');
      },
    });

    tl.to([buttonRef.current, textRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: 0.1,
    })
      .to(
        [animatedCamera.current, animatedTarget.current],
        {
          y: '+=50',
          duration: 2,
          ease: 'power1.inOut',
        },
        '-=0.4'
      )
      .to(
        overlayMaterial,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        '-=1.5'
      );

    const overlayPlane = new Mesh(new PlaneGeometry(100, 100), overlayMaterial);
    overlayPlane.position.z = -10;
    overlayPlane.renderOrder = 999;
    cameraRef.current?.add(overlayPlane);
  };

  // GSAP entrance animation
  useGSAP(
    () => {
      if (!isReady || !useResponsive || hasAnimated) return;

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      gsap.set([textRef.current, buttonRef.current], { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        onComplete: () => {
          setAnimating(false);
          setHasAnimated(true);
          setHtmlPos(animatedHtml.current.clone());
        },
      });

      timelineRef.current = tl;

      const { camera, target, html } = responsivePositions;

      // Set initial positions
      animatedCamera.current.copy(camera.start);
      animatedTarget.current.copy(target.start);
      animatedHtml.current.copy(html.start);
      setHtmlPos(html.start.clone());
      setAnimating(true);

      // Animate positions
      tl.to(animatedCamera.current, {
        x: camera.end.x,
        y: camera.end.y,
        z: camera.end.z,
        duration: 3,
        ease: 'power2.out',
      })
        .to(
          animatedTarget.current,
          {
            x: target.end.x,
            y: target.end.y,
            z: target.end.z,
            duration: 2,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          animatedHtml.current,
          {
            x: html.end.x,
            y: html.end.y,
            z: html.end.z,
            duration: 3,
            ease: 'power2.out',
            onUpdate: () => {
              setHtmlPos(animatedHtml.current.clone());
            },
          },
          '<'
        )
        .to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        })
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        );

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }
      };
    },
    { dependencies: [isReady, useResponsive, hasAnimated] }
  );

  // Component lifecycle
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      resetToInitial();
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [resetToInitial]);

  // Calculate responsive text size and container width
  const textStyles = useMemo(
    () => ({
      textSize: size.width < 768 ? 'text-lg' : 'text-2xl',
      containerWidth:
        size.width < 768 ? 'w-[280px]' : size.width < 1024 ? 'w-[400px]' : 'w-[500px]',
    }),
    [size.width]
  );

  return (
    <>
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
        position={animatedCamera.current}
      />

      <ambientLight intensity={0.05} />

      <group position={htmlPos}>
        <Float speed={0.8} floatIntensity={0.2} rotationIntensity={0.1} floatingRange={[-0.4, 0.4]}>
          <group position={[8, 0, 0]}>
            <Logo position={[10, -10, 0]} />
            <Html position={[-15, 20, 0]}>
              <div
                className="flex w-screen flex-row gap-6"
                onMouseEnter={handleMouseEnterUI}
                onMouseLeave={handleMouseLeaveUI}
              >
                {nav.companyLinks?.map((link, index) => {
                  const linkData = getLinkData(link);
                  return (
                    <Link
                      key={`company-${index}`}
                      href={linkData.href}
                      target={linkData.target ? '_blank' : undefined}
                      rel={linkData.target ? 'noopener noreferrer' : undefined}
                      className="text-md font-medium transition-colors duration-300 hover:text-green-100"
                    >
                      {linkData.label}
                    </Link>
                  );
                })}
              </div>
            </Html>
          </group>
        </Float>

        <Html center>
          <div ref={textRef} className={`${textStyles.containerWidth} text-white`}>
            <p className={`mb-8 ${textStyles.textSize} leading-relaxed`}>
              With over 38 years of experience, O'Linn Security Inc. offers comprehensive security
              solutions tailored to your needs.
            </p>
            <div
              ref={buttonRef}
              onMouseEnter={handleMouseEnterUI}
              onMouseLeave={handleMouseLeaveUI}
              className="relative z-10"
            >
              <Button
                size="sm"
                variant="button21"
                onClick={handleClick}
                className="relative text-white"
              >
                ENTER EXPERIENCE
              </Button>
            </div>
          </div>
        </Html>
      </group>

      <Billboard
        position={currentPositions.billboard.position}
        scale={currentPositions.billboard.scale}
        modalVideo={modalVideo}
        portalRef={portalRef}
      />

      <Ground />
      <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#DCBF9A" transparent opacity={1} />
      </mesh>
    </>
  );
});

LandingScene.displayName = 'LandingScene';

export default LandingScene;
