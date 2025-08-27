import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  };
  billboard: {
    position: Vec3;
    scale: number;
  };
}

// Responsive configurations
export const RESPONSIVE_CONFIGS: Record<'mobile' | 'tablet' | 'desktop', ResponsiveConfig> = {
  mobile: {
    camera: {
      position: { x: 0, y: 2, z: 29 },
      target: { x: 2, y: 7, z: 0 },
    },
    mainContent: {
      position: { x: 0, y: 20, z: -60 },
    },
    billboard: {
      position: { x: 2.4, y: 0, z: -77.6 },
      scale: 0.8,
    },
  },
  tablet: {
    camera: {
      position: { x: 20, y: 12, z: 70 },
      target: { x: 0, y: 18.1, z: 0 },
    },
    mainContent: {
      position: { x: -6.5, y: 35, z: -30 },
    },
    billboard: {
      position: { x: -12.3, y: 0, z: -30 },
      scale: 1.0,
    },
  },
  desktop: {
    camera: {
      position: { x: 15.0, y: 8.4, z: 78 },
      target: { x: -6, y: 22, z: 2 },
    },
    mainContent: {
      position: { x: -22.3, y: 32, z: -20 },
    },
    billboard: {
      position: { x: -4, y: 1.3, z: -20 },
      scale: 1.1,
    },
  },
};

// Custom hook for responsive configuration with hysteresis
export function useResponsiveConfig(): ResponsiveConfig {
  const { size, viewport } = useThree();

  // Use refs to store stable values with hysteresis
  const stableBreakpointRef = useRef<'mobile' | 'tablet' | 'desktop'>('desktop');
  const stableViewportWidthRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  return useMemo(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    // Apply hysteresis to breakpoint detection (add buffer zones)
    const currentBreakpoint = stableBreakpointRef.current;
    let newBreakpoint: 'mobile' | 'tablet' | 'desktop';

    // Add 32px buffer zones to prevent oscillation
    if (currentBreakpoint === 'mobile') {
      newBreakpoint = size.width < 800 ? 'mobile' : size.width < 1056 ? 'tablet' : 'desktop';
    } else if (currentBreakpoint === 'tablet') {
      newBreakpoint = size.width < 736 ? 'mobile' : size.width < 1056 ? 'tablet' : 'desktop';
    } else {
      newBreakpoint = size.width < 736 ? 'mobile' : size.width < 992 ? 'tablet' : 'desktop';
    }

    // Only update breakpoint if it actually changed
    if (newBreakpoint !== currentBreakpoint) {
      stableBreakpointRef.current = newBreakpoint;
      lastUpdateTimeRef.current = now;
    }

    // Apply hysteresis to viewport width changes (for mobile billboard positioning)
    const viewportWidthChange = Math.abs(viewport.width - stableViewportWidthRef.current);
    const isLargeViewportChange = viewportWidthChange > 0.5; // Significant change
    const isStableViewportUpdate = !document.hidden && timeSinceLastUpdate > 50;
    const shouldUpdateViewport = isLargeViewportChange || isStableViewportUpdate;

    if (shouldUpdateViewport && viewportWidthChange > 0.02) {
      stableViewportWidthRef.current = viewport.width;
      lastUpdateTimeRef.current = now;
    }

    let config: ResponsiveConfig;
    const currentViewportWidth = stableViewportWidthRef.current || viewport.width;

    if (stableBreakpointRef.current === 'mobile') {
      config = structuredClone(RESPONSIVE_CONFIGS.mobile);
      config.billboard.position.x = currentViewportWidth * -0.2;
    } else if (stableBreakpointRef.current === 'tablet') {
      config = structuredClone(RESPONSIVE_CONFIGS.tablet);
    } else {
      config = structuredClone(RESPONSIVE_CONFIGS.desktop);
    }

    return config;
  }, [size.width, viewport.width]);
}

// Helper hook for text styles based on screen size with hysteresis
export function useResponsiveTextStyles() {
  const { size } = useThree();

  // Use ref to store stable breakpoint and last update time
  const stableBreakpointRef = useRef<'mobile' | 'tablet' | 'desktop'>('desktop');
  const lastUpdateTimeRef = useRef<number>(0);
  const [, forceUpdate] = useState({});

  // Stable styles that only change when breakpoint changes
  const stableStyles = useMemo(() => {
    const breakpoint = stableBreakpointRef.current;
    return {
      textSize: breakpoint === 'mobile' ? 'text-lg' : 'text-2xl',
      containerWidth:
        breakpoint === 'mobile' ? 'w-[280px]' : breakpoint === 'tablet' ? 'w-[400px]' : 'w-[500px]',
    };
  }, [stableBreakpointRef.current]);

  // Monitor size changes with intelligent hysteresis
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    // Apply hysteresis logic
    const currentBreakpoint = stableBreakpointRef.current;
    let newBreakpoint: 'mobile' | 'tablet' | 'desktop';

    if (currentBreakpoint === 'mobile') {
      newBreakpoint = size.width < 800 ? 'mobile' : size.width < 1056 ? 'tablet' : 'desktop';
    } else if (currentBreakpoint === 'tablet') {
      newBreakpoint = size.width < 736 ? 'mobile' : size.width < 1056 ? 'tablet' : 'desktop';
    } else {
      newBreakpoint = size.width < 736 ? 'mobile' : size.width < 992 ? 'tablet' : 'desktop';
    }

    const isBreakpointChange = newBreakpoint !== currentBreakpoint;

    if (isBreakpointChange) {
      // For legitimate breakpoint changes, check if this might be a focus/blur glitch
      const isLikelyFocusGlitch = document.hidden || timeSinceLastUpdate < 50;

      // Always allow updates for:
      // 1. Large changes (likely intentional resize)
      // 2. When page is visible and enough time has passed
      // 3. When breakpoint crosses major boundaries (mobile<->desktop)
      const sizeChange = Math.abs(size.width - (lastUpdateTimeRef.current || size.width));
      const isLargeChange = sizeChange > 100; // Increased threshold for major changes
      const isMajorBreakpointChange =
        (currentBreakpoint === 'mobile' && newBreakpoint === 'desktop') ||
        (currentBreakpoint === 'desktop' && newBreakpoint === 'mobile');
      const isStableUpdate = !document.hidden && timeSinceLastUpdate > 100;

      if (isLargeChange || isMajorBreakpointChange || (isStableUpdate && !isLikelyFocusGlitch)) {
        stableBreakpointRef.current = newBreakpoint;
        lastUpdateTimeRef.current = now;

        // Force a re-render to update the styles
        forceUpdate({});
      }
    }
  }, [size.width]);

  return stableStyles;
}
