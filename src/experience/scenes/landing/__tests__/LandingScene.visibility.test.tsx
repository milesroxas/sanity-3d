import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock next/navigation router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock drei/fiber heavy deps
vi.mock('@react-three/fiber', () => ({
  Canvas: () => null,
  useFrame: () => void 0,
  useThree: () => ({ size: { width: 800, height: 600 } }),
}));
vi.mock('@react-three/drei', () => {
  const useGLTF = () => ({
    nodes: {},
    materials: {},
  });
  (useGLTF as any).preload = () => void 0;
  const useVideoTexture = () => ({ image: document.createElement('video'), flipY: false });
  const useCursor = () => void 0;
  return {
    Html: ({ children }: any) => <div data-testid="html">{children}</div>,
    PerspectiveCamera: ({ children }: any) => <>{children}</>,
    Billboard: ({ children }: any) => <>{children}</>,
    useProgress: () => ({ progress: 100, active: false }),
    useGLTF,
    useVideoTexture,
    useCursor,
  };
});

// Mock gsap set/to to no-op
vi.mock('gsap', () => ({
  default: {
    set: () => void 0,
    timeline: () => ({ to: () => ({ to: () => ({ play: () => void 0 }) }) }),
    killTweensOf: () => void 0,
  },
}));

// Mock nested modules referenced by LandingScene
vi.mock('@/experience/animations', () => ({ vehicles: { AnimatedPlane: () => null } }));
vi.mock('@/experience/effects/components/Clouds', () => ({ AnimatedClouds: () => null }));
vi.mock('@/experience/models/VehiclesInstances', () => ({
  VehiclesInstances: ({ children }: any) => <>{children}</>,
}));
vi.mock('@/experience/scenes/landing/components/Effects', () => ({ Effects: () => null }));
vi.mock('@/experience/scenes/landing/components/SceneEnvironment', () => ({
  SceneEnvironment: () => null,
}));
vi.mock('@/experience/scenes/landing/components/Billboard', () => ({ Billboard: () => null }));
vi.mock('@/experience/scenes/landing/compositions/DesertModels', () => ({
  DesertModels: () => null,
}));
vi.mock('@/experience/scenes/landing/config/controls', () => ({
  useBillboardControls: () => ({ positionX: 0, positionY: 0, positionZ: 0, scale: 1 }),
  useCameraControls: () => ({
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    mouseInfluence: 0,
    mouseDamping: 0,
  }),
  useDebugControls: () => ({ enabled: false }),
  useMainContentControls: () => ({ positionX: 0, positionY: 0, positionZ: 0 }),
  useSceneInfoControls: () => void 0,
}));
vi.mock('@/experience/scenes/landing/hooks/useResponsiveConfig', () => ({
  useResponsiveConfig: () => ({
    camera: { position: { x: 0, y: 0, z: 0 }, target: { x: 0, y: 0, z: 0 } },
    mainContent: { position: { x: 0, y: 0, z: 0 } },
    billboard: { position: { x: 0, y: 0, z: 0 }, scale: 1 },
  }),
  useResponsiveTextStyles: () => ({ containerWidth: 'w-full', textSize: 'text-base' }),
}));

// Prevent importing server-side actions via store chain
vi.mock('@/experience/scenes/store/logoMarkerStore', () => ({
  useLogoMarkerStore: () => ({
    fetchAndSetScene: () => Promise.resolve(),
    setOtherMarkersVisible: () => void 0,
    setShouldAnimateBack: () => void 0,
  }),
}));

import LandingScene from '../LandingScene';

function Wrapper() {
  return <LandingScene textureVideo={undefined} />;
}

describe('LandingScene content visibility', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('renders HTML content and fallback ensures visibility lifecycle runs', async () => {
    render(<Wrapper />);
    const html = await screen.findByTestId('html');
    expect(html).toBeDefined();
  });
});
