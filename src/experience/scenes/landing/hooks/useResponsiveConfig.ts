import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ResponsiveConfig {
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

// Responsive configurations
export const RESPONSIVE_CONFIGS: Record<'mobile' | 'tablet' | 'desktop', ResponsiveConfig> = {
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
      position: { x: -6.6, y: 12.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    links: {
      position: { x: -10.3, y: 26.9, z: 50 },
    },
  },
};

// Custom hook for responsive configuration
export function useResponsiveConfig(): ResponsiveConfig {
  const { size, viewport } = useThree();

  return useMemo(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    let config: ResponsiveConfig;

    if (isMobile) {
      config = structuredClone(RESPONSIVE_CONFIGS.mobile);
      config.billboard.position.x = viewport.width * -0.2;
    } else if (isTablet) {
      config = structuredClone(RESPONSIVE_CONFIGS.tablet);
    } else {
      config = structuredClone(RESPONSIVE_CONFIGS.desktop);
    }

    return config;
  }, [size.width, viewport.width]);
}

// Helper hook for text styles based on screen size
export function useResponsiveTextStyles() {
  const { size } = useThree();

  return useMemo(
    () => ({
      textSize: size.width < 768 ? 'text-lg' : 'text-2xl',
      containerWidth:
        size.width < 768 ? 'w-[280px]' : size.width < 1024 ? 'w-[400px]' : 'w-[500px]',
    }),
    [size.width]
  );
}
