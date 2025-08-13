import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type RenderProfile = {
  includeEnvironment: boolean;
  includeProps: boolean;
  includeLogoMarkers: boolean;
  includeAnimatedVehicles: boolean;
};

const RENDER_PROFILES: Record<DeviceType, RenderProfile> = {
  mobile: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: false,
  },
  tablet: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: true,
  },
  desktop: {
    includeEnvironment: true,
    includeProps: true,
    includeLogoMarkers: true,
    includeAnimatedVehicles: true,
  },
} as const;

export function useDeviceType(): DeviceType {
  const { size } = useThree();
  return useMemo(() => {
    if (size.width < 768) return 'mobile';
    if (size.width < 1024) return 'tablet';
    return 'desktop';
  }, [size.width]);
}

export function useRenderProfile(): RenderProfile {
  const device = useDeviceType();
  return useMemo(() => RENDER_PROFILES[device], [device]);
}
