'use client';

import { Button } from '@/components/ui/button';
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
  Euler,
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

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface ResponsiveConfig {
  camera: {
    position: Vec3;
    target: Vec3;
  };
  mainContent: {
    position: Vec3;
    rotation: Vec3;
  };
  billboard: {
    position: Vec3;
    scale: number;
  };
  logo: {
    position: Vec3;
    rotation: Vec3;
  };
  links: {
    position: Vec3;
  };
}

// Mouse interaction configuration
const MOUSE_CONFIG = {
  influence: 1.5,
  dampingFactor: 0.05,
  uiDampingFactor: 0.8,
} as const;

// Responsive configurations
const RESPONSIVE_CONFIGS: Record<'mobile' | 'tablet' | 'desktop', ResponsiveConfig> = {
  mobile: {
    camera: {
      position: { x: 0, y: 5.8, z: 77.4 },
      target: { x: 0, y: 19.6, z: -5 },
    },
    mainContent: {
      position: { x: -0.8, y: 14.2, z: 40.7 },
      rotation: { x: 0.1, y: 0.0, z: 0 },
    },
    billboard: {
      position: { x: 2.4, y: 0, z: -77.6 },
      scale: 0.8,
    },
    logo: {
      position: { x: 27.4, y: 21.9, z: -31.5 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    links: {
      position: { x: -16.8, y: 33.4, z: 0 },
    },
  },
  tablet: {
    camera: {
      position: { x: 20, y: 12, z: 90 },
      target: { x: -3, y: 18.1, z: 0 },
    },
    mainContent: {
      position: { x: 0.1, y: 18.2, z: 38.9 },
      rotation: { x: 0, y: 0.25, z: 0 },
    },
    billboard: {
      position: { x: -12.3, y: 0, z: -70.9 },
      scale: 1.0,
    },
    logo: {
      position: { x: 5.5, y: 5.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    links: {
      position: { x: -24.7, y: 36.7, z: 0 },
    },
  },
  desktop: {
    camera: {
      position: { x: 15, y: 10, z: 100 },
      target: { x: -7, y: 20, z: 0 },
    },
    mainContent: {
      position: { x: -6.2, y: 17.9, z: 50.0 },
      rotation: { x: 0.03, y: 0.3, z: 0.01 },
    },
    billboard: {
      position: { x: -4, y: 0, z: -20 },
      scale: 1.1,
    },
    logo: {
      position: { x: -14.5, y: 12.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    links: {
      position: { x: -43.0, y: 42.8, z: 0 },
    },
  },
};

// Custom hook for responsive configuration
function useResponsiveConfig(): ResponsiveConfig {
  const { size, viewport } = useThree();

  return useMemo(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    let config: ResponsiveConfig;

    if (isMobile) {
      config = structuredClone(RESPONSIVE_CONFIGS.mobile);
      // Adjust billboard position based on viewport
      config.billboard.position.x = viewport.width * -0.2;
    } else if (isTablet) {
      config = structuredClone(RESPONSIVE_CONFIGS.tablet);
    } else {
      config = structuredClone(RESPONSIVE_CONFIGS.desktop);
    }

    return config;
  }, [size.width, viewport.width]);
}

const LandingScene = forwardRef<
  any,
  {
    modalVideo?: Sanity.Video;
    portalRef: React.RefObject<HTMLDivElement>;
    nav: SanityNav;
    settings: SanitySettings;
  }
>(({ modalVideo, portalRef, nav, settings: landingSettings }, ref) => {
  const [isReady, setIsReady] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { resetToInitial } = useCameraStore();
  const { isAnimating, setAnimating } = useLandingCameraStore();
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const { size } = useThree();

  // Get responsive configuration
  const responsiveConfig = useResponsiveConfig();

  // Mouse interaction state
  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isHoveringUI = useRef(false);

  // Debug controls for all scene elements
  const { enabled: debugEnabled } = useControls('Debug Controls', {
    enabled: false,
  });

  const {
    positionX: cameraPositionX,
    positionY: cameraPositionY,
    positionZ: cameraPositionZ,
    targetX: cameraTargetX,
    targetY: cameraTargetY,
    targetZ: cameraTargetZ,
    mouseInfluence,
    mouseDamping,
  } = useControls(
    'Camera Settings',
    {
      positionX: { value: responsiveConfig.camera.position.x, step: 0.1 },
      positionY: { value: responsiveConfig.camera.position.y, step: 0.1 },
      positionZ: { value: responsiveConfig.camera.position.z, step: 0.1 },
      targetX: { value: responsiveConfig.camera.target.x, step: 0.1 },
      targetY: { value: responsiveConfig.camera.target.y, step: 0.1 },
      targetZ: { value: responsiveConfig.camera.target.z, step: 0.1 },
      mouseInfluence: {
        value: MOUSE_CONFIG.influence,
        min: 0,
        max: 5,
        step: 0.1,
      },
      mouseDamping: {
        value: MOUSE_CONFIG.dampingFactor,
        min: 0.01,
        max: 0.2,
        step: 0.005,
      },
    },
    { collapsed: true }
  );

  const {
    positionX: mainContentPositionX,
    positionY: mainContentPositionY,
    positionZ: mainContentPositionZ,
    rotationX: mainContentRotationX,
    rotationY: mainContentRotationY,
    rotationZ: mainContentRotationZ,
  } = useControls(
    'Main Content Settings',
    {
      positionX: { value: responsiveConfig.mainContent.position.x, step: 0.1 },
      positionY: { value: responsiveConfig.mainContent.position.y, step: 0.1 },
      positionZ: { value: responsiveConfig.mainContent.position.z, step: 0.1 },
      rotationX: {
        value: responsiveConfig.mainContent.rotation.x,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
      rotationY: {
        value: responsiveConfig.mainContent.rotation.y,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
      rotationZ: {
        value: responsiveConfig.mainContent.rotation.z,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
    },
    { collapsed: true }
  );

  const {
    positionX: billboardPositionX,
    positionY: billboardPositionY,
    positionZ: billboardPositionZ,
    scale: billboardScale,
  } = useControls(
    'Billboard Settings',
    {
      positionX: { value: responsiveConfig.billboard.position.x, step: 0.1 },
      positionY: { value: responsiveConfig.billboard.position.y, step: 0.1 },
      positionZ: { value: responsiveConfig.billboard.position.z, step: 0.1 },
      scale: {
        value: responsiveConfig.billboard.scale,
        min: 0.1,
        max: 2,
        step: 0.1,
      },
    },
    { collapsed: true }
  );

  const {
    positionX: logoPositionX,
    positionY: logoPositionY,
    positionZ: logoPositionZ,
    rotationX: logoRotationX,
    rotationY: logoRotationY,
    rotationZ: logoRotationZ,
  } = useControls(
    'Logo Settings',
    {
      positionX: { value: responsiveConfig.logo.position.x, step: 0.1 },
      positionY: { value: responsiveConfig.logo.position.y, step: 0.1 },
      positionZ: { value: responsiveConfig.logo.position.z, step: 0.1 },
      rotationX: {
        value: responsiveConfig.logo.rotation.x,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
      rotationY: {
        value: responsiveConfig.logo.rotation.y,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
      rotationZ: {
        value: responsiveConfig.logo.rotation.z,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
    },
    { collapsed: true }
  );

  const {
    positionX: linksPositionX,
    positionY: linksPositionY,
    positionZ: linksPositionZ,
  } = useControls(
    'Links Settings',
    {
      positionX: { value: responsiveConfig.links.position.x, step: 0.1 },
      positionY: { value: responsiveConfig.links.position.y, step: 0.1 },
      positionZ: { value: responsiveConfig.links.position.z, step: 0.1 },
    },
    { collapsed: true }
  );

  useControls('Scene Info', {
    deviceInfo: {
      value: `${size.width}x${size.height} | ${
        size.width < 768 ? 'Mobile' : size.width < 1024 ? 'Tablet' : 'Desktop'
      }`,
      editable: false,
    },
    mouseInteractionActive: {
      value: hasAnimated && !isAnimating,
      editable: false,
    },
  });

  // Use debug controls only when enabled, otherwise use responsive config
  const currentConfig = useMemo(() => {
    if (debugEnabled) {
      return {
        camera: {
          position: {
            x: cameraPositionX,
            y: cameraPositionY,
            z: cameraPositionZ,
          },
          target: {
            x: cameraTargetX,
            y: cameraTargetY,
            z: cameraTargetZ,
          },
        },
        mainContent: {
          position: {
            x: mainContentPositionX,
            y: mainContentPositionY,
            z: mainContentPositionZ,
          },
          rotation: {
            x: mainContentRotationX,
            y: mainContentRotationY,
            z: mainContentRotationZ,
          },
        },
        billboard: {
          position: {
            x: billboardPositionX,
            y: billboardPositionY,
            z: billboardPositionZ,
          },
          scale: billboardScale,
        },
        logo: {
          position: {
            x: logoPositionX,
            y: logoPositionY,
            z: logoPositionZ,
          },
          rotation: {
            x: logoRotationX,
            y: logoRotationY,
            z: logoRotationZ,
          },
        },
        links: {
          position: {
            x: linksPositionX,
            y: linksPositionY,
            z: linksPositionZ,
          },
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
    linksPositionX,
    linksPositionY,
    linksPositionZ,
    mouseInfluence,
    mouseDamping,
    responsiveConfig,
  ]);

  // Convert to Vector3 objects
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
      links: {
        position: new Vector3(
          currentConfig.links.position.x,
          currentConfig.links.position.y,
          currentConfig.links.position.z
        ),
      },
    }),
    [currentConfig]
  );

  // Animated values for smooth transitions
  const animatedCamera = useRef(positions.camera.clone());
  const animatedTarget = useRef(positions.target.clone());
  const animatedMainContent = useRef(positions.mainContent.clone());

  // State for main content position to trigger re-renders
  const [mainContentPosition, setMainContentPosition] = useState(() =>
    positions.mainContent.clone()
  );
  const [mainContentRotation, setMainContentRotation] = useState(() =>
    positions.mainContentRotation.clone()
  );

  // Simplified component lifecycle
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      setHasAnimated(true);
      setAnimating(false);
    }, 100);

    return () => {
      clearTimeout(timer);
      resetToInitial();
    };
  }, [resetToInitial, setAnimating]);

  // Simplified frame update
  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    // Apply mouse interaction
    if (hasAnimated && !isAnimating) {
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
    } else {
      cameraOffset.current.x = 0;
      cameraOffset.current.y = 0;
    }

    // Update camera positions
    const positionLerp = 1 - Math.exp(-0.1 * 60 * delta);
    animatedCamera.current.lerp(positions.camera, positionLerp);
    animatedTarget.current.lerp(positions.target, positionLerp);
    animatedMainContent.current.lerp(positions.mainContent, positionLerp);

    // Update main content position state if it has changed significantly
    if (animatedMainContent.current.distanceTo(mainContentPosition) > 0.01) {
      setMainContentPosition(animatedMainContent.current.clone());
    }

    // Update main content rotation if it has changed
    if (
      Math.abs(mainContentRotation.x - positions.mainContentRotation.x) > 0.01 ||
      Math.abs(mainContentRotation.y - positions.mainContentRotation.y) > 0.01 ||
      Math.abs(mainContentRotation.z - positions.mainContentRotation.z) > 0.01
    ) {
      setMainContentRotation(positions.mainContentRotation.clone());
    }

    // Apply final camera position with smooth mouse offset
    cameraRef.current.position.set(
      animatedCamera.current.x + cameraOffset.current.x,
      animatedCamera.current.y + cameraOffset.current.y,
      animatedCamera.current.z
    );

    cameraRef.current.lookAt(animatedTarget.current);
  });

  // Mouse interaction handlers
  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);

  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

  // Calculate responsive text size and container width
  const textStyles = useMemo(
    () => ({
      textSize: size.width < 768 ? 'text-lg' : 'text-2xl',
      containerWidth:
        size.width < 768 ? 'w-[280px]' : size.width < 1024 ? 'w-[400px]' : 'w-[500px]',
    }),
    [size.width]
  );

  // Handle entrance animation
  const handleEnter = () => {
    setAnimating(true);

    const overlayMaterial = new MeshBasicMaterial({
      color: 'white',
      transparent: true,
      opacity: 1,
    });

    const cameraStore = useCameraStore.getState();

    const tl = gsap.timeline({});

    tl.to([buttonRef.current, textRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: 0.1,
    });
  };

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

  useEffect(() => {
    if (isReady && !isAnimating) {
      handleEnter();
    }
  }, [isReady, isAnimating]);

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

      <Float speed={0.8} floatIntensity={0.2} rotationIntensity={0.1} floatingRange={[-0.4, 0.4]}>
        <group position={[8, 0, 0]} rotation={positions.logo.rotation}>
          <Logo position={positions.logo.position} />
          <Html position={positions.links.position}>
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
                    className="text-md font-semibold transition-colors duration-300 hover:text-green-100"
                  >
                    {linkData.label}
                  </Link>
                );
              })}
            </div>
          </Html>
        </group>
      </Float>

      <Html center position={mainContentPosition} transform rotation={mainContentRotation}>
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

      <Billboard
        position={positions.billboard.position}
        scale={positions.billboard.scale}
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
