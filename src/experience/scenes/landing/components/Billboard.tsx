import { Html, useCursor, useGLTF, useVideoTexture } from '@react-three/drei';
import { PlayCircle, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useDebugControls } from '../config/controls/debugControls';
import { usePlayerControls } from '../config/controls/playerControls';
import { useLandingCameraStore } from '../store/landingCameraStore';

// Dynamically import MuxPlayer to avoid SSR issues
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black/20">
      <div className="text-sm text-white/60">Loading player...</div>
    </div>
  ),
});

type GLTFResult = GLTF & {
  nodes: {
    platform_1: THREE.Mesh;
    platform_2: THREE.Mesh;
    billboard_1: THREE.Mesh;
    billboard_2: THREE.Mesh;
    post: THREE.Mesh;
  };
  materials: {
    black: THREE.MeshStandardMaterial;
    light: THREE.MeshStandardMaterial;
    TD_Checker: THREE.MeshStandardMaterial;
  };
};

type BillboardMode = 'texture' | 'player';

interface BillboardProps {
  position?: THREE.Vector3;
  scale?: number;
  textureVideo?: Sanity.Video | undefined;
}


export function Billboard({ position, scale = 1, textureVideo }: BillboardProps) {
  // State management
  const [mode, setMode] = useState<BillboardMode>('texture');
  const [hovered, setHovered] = useState(false);

  // Camera store for video state management
  const { setVideoPlaying, setMouseTracking } = useLandingCameraStore();

  // Refs
  const muxPlayerRef = useRef<any>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement | null>(null);

  // Video URL logic - stable reference
  const videoUrl = useMemo(() => {
    return textureVideo?.asset?.playbackId
      ? `https://stream.mux.com/${textureVideo.asset.playbackId}.m3u8`
      : '/videos/intro-video-loop.mp4';
  }, [textureVideo?.asset?.playbackId]);

  // Always create video texture - drei will manage it internally
  const texture = useVideoTexture(videoUrl, {
    muted: true,
    loop: true,
    start: true,
  });

  if (texture) {
    texture.flipY = false;
  }

  useCursor(hovered);

  // Event handlers
  const handlePlayClick = useCallback(
    (event: any) => {
      event?.stopPropagation?.(); // Prevent event bubbling
      if (mode === 'texture') {
        setMode('player');
        // Notify camera system that video is now playing
        setVideoPlaying(true);
        // Reduce mouse tracking influence for smoother experience
        setMouseTracking(false);
      }
    },
    [mode, setVideoPlaying, setMouseTracking]
  );

  const handleFullscreenRequest = useCallback(async () => {
    if (!muxPlayerRef.current) return;
    
    try {
      // First try Mux player's internal fullscreen method
      if (typeof muxPlayerRef.current.requestFullscreen === 'function') {
        await muxPlayerRef.current.requestFullscreen();
      } else {
        // Fallback: find the video element and request fullscreen on it
        const videoElement = muxPlayerRef.current.querySelector('video');
        if (videoElement) {
          if (videoElement.requestFullscreen) {
            await videoElement.requestFullscreen();
          } else if ((videoElement as any).webkitRequestFullscreen) {
            await (videoElement as any).webkitRequestFullscreen();
          } else if ((videoElement as any).mozRequestFullScreen) {
            await (videoElement as any).mozRequestFullScreen();
          } else if ((videoElement as any).msRequestFullscreen) {
            await (videoElement as any).msRequestFullscreen();
          }
        }
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    }
  }, []);

  const handleClosePlayer = useCallback(() => {
    setMode('texture');
    setVideoPlaying(false);
    setMouseTracking(true);
  }, [setVideoPlaying, setMouseTracking]);

  const handlePlayerTimeUpdate = useCallback((event: any) => {
    // Handle time updates if needed for future features
    // Currently no state tracking needed
  }, []);

  // Handle fullscreen events to hide/show R3F elements
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      // Hide R3F container when in fullscreen to prevent interference
      const r3fContainer = document.querySelector('[data-r3f-container]') as HTMLElement;
      
      if (r3fContainer) {
        r3fContainer.style.visibility = isFullscreen ? 'hidden' : 'visible';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Create stable material reference
  const billboardMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      toneMapped: false,
    });
    return material;
  }, []);

  // Update material properties when texture or mode changes
  useEffect(() => {
    if (!billboardMaterial) return;

    if (mode === 'texture' && texture) {
      billboardMaterial.map = texture;
      billboardMaterial.color.setHex(0xffffff);
    } else {
      billboardMaterial.map = null;
      billboardMaterial.color.setHex(0x000000);
    }
    billboardMaterial.needsUpdate = true;
  }, [billboardMaterial, texture, mode]);

  // Video texture effect - setup once and manage playback
  useEffect(() => {
    if (!texture) return;

    const videoElement = texture.image as HTMLVideoElement;
    if (!videoElement) return;

    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;

    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.log('Video autoplay prevented:', error);
      }
    };

    const pauseVideo = () => {
      try {
        videoElement.pause();
      } catch (error) {
        console.log('Video pause failed:', error);
      }
    };

    // Control video playback based on mode
    if (mode === 'texture') {
      if (videoElement.readyState >= 2) {
        playVideo();
      } else {
        videoElement.addEventListener('loadeddata', playVideo, { once: true });
      }
    } else {
      pauseVideo();
    }

    return () => {
      // Clean up event listeners but don't pause video on cleanup
      videoElement.removeEventListener('loadeddata', playVideo);
    };
  }, [texture, mode]);

  const { nodes, materials } = useGLTF('/models/landing/billboard.glb') as unknown as GLTFResult;

  // Debug controls
  const { enabled: debugEnabled } = useDebugControls();

  // Debug mode changes - only log when debug is enabled
  useEffect(() => {
    if (debugEnabled) {
      console.log('Billboard mode changed to:', mode);
    }
  }, [mode, debugEnabled]);

  // Billboard screen offset within the GLTF model (constant)
  const BILLBOARD_SCREEN_OFFSET = useMemo(
    () => ({
      x: 7.4, // Adjust left/right positioning
      y: 31.5, // Adjust up/down positioning
      z: -45.0, // Slightly closer to camera for better visibility
    }),
    []
  );

  // Helper to calculate screen position from billboard position
  const getScreenPosition = useCallback(
    (offset: number = 0) => {
      const billboardGroupPos = position || { x: 0, y: 0, z: 0 };
      return {
        x: billboardGroupPos.x + BILLBOARD_SCREEN_OFFSET.x,
        y: billboardGroupPos.y + BILLBOARD_SCREEN_OFFSET.y,
        z: billboardGroupPos.z + BILLBOARD_SCREEN_OFFSET.z + offset,
      };
    },
    [position, BILLBOARD_SCREEN_OFFSET]
  );

  // Helper to get screen position as tuple for Html components
  const getScreenPositionArray = useCallback(
    (offset: number = 0) => {
      const pos = getScreenPosition(offset);
      return [pos.x, pos.y, pos.z] as [number, number, number];
    },
    [getScreenPosition]
  );

  // Default player configuration - responsive to billboard position
  const defaultPlayerConfig = useMemo(
    () => {
      // Calculate absolute world position for consistent baseline
      const screenPos = getScreenPosition(0.1);

      return {
        // Position player at the exact billboard screen location
        position: screenPos,
        rotation: { x: 0, y: -0.12, z: 0 }, // Match billboard rotation
        scale: 2.4, // Appropriate scale for the screen
        distanceFactor: 10.5,
        dimensions: { width: 800, height: 450 },
      };
    },
    [getScreenPosition] // Re-calculate when billboard position changes
  );

  // Player controls (only active when debug is enabled)
  const playerControls = usePlayerControls(
    defaultPlayerConfig.position,
    defaultPlayerConfig.rotation,
    defaultPlayerConfig.scale,
    defaultPlayerConfig.distanceFactor,
    defaultPlayerConfig.dimensions
  );

  // Player positioning configuration - use Leva controls when debug is enabled
  const playerConfig = useMemo(() => {
    if (debugEnabled) {
      // In debug mode, use absolute positions from Leva controls
      return {
        position: [
          playerControls.positionX,
          playerControls.positionY,
          playerControls.positionZ,
        ] as [number, number, number],
        rotation: [
          playerControls.rotationX,
          playerControls.rotationY,
          playerControls.rotationZ,
        ] as [number, number, number],
        scale: playerControls.scale,
        distanceFactor: playerControls.distanceFactor,
        width: playerControls.width,
        height: playerControls.height,
      };
    }

    // In production mode, use responsive positioning
    return {
      position: [
        defaultPlayerConfig.position.x,
        defaultPlayerConfig.position.y,
        defaultPlayerConfig.position.z,
      ] as [number, number, number],
      rotation: [
        defaultPlayerConfig.rotation.x,
        defaultPlayerConfig.rotation.y,
        defaultPlayerConfig.rotation.z,
      ] as [number, number, number],
      scale: defaultPlayerConfig.scale,
      distanceFactor: defaultPlayerConfig.distanceFactor,
      width: defaultPlayerConfig.dimensions.width,
      height: defaultPlayerConfig.dimensions.height,
    };
  }, [debugEnabled, playerControls, defaultPlayerConfig]);

// Stable Mux player component to prevent remounting
interface InScenePlayerProps {
  playbackId: string;
  width: number;
  height: number;
  onTimeUpdate: (event: any) => void;
  onClosePlayer: () => void;
  playerRef: React.RefObject<any>;
}

const InScenePlayer = memo(({ 
  playbackId, 
  width, 
  height, 
  onTimeUpdate, 
  onClosePlayer, 
  playerRef 
}: InScenePlayerProps) => {
  return (
    <div
      className="relative bg-black"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '4px',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
      onPointerDown={e => e.stopPropagation()}
      onPointerUp={e => e.stopPropagation()}
      onPointerMove={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        accentColor="#16A34A"
        autoPlay={true}
        muted={false}
        onTimeUpdate={onTimeUpdate}
        disableTracking={true}
        nohotkeys={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div className="absolute left-2 top-2 z-10">
        <button
          onClick={onClosePlayer}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          aria-label="Close player"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
});


  // Stable playback ID to prevent recreations
  const playbackId = useMemo(
    () => textureVideo?.asset?.playbackId,
    [textureVideo?.asset?.playbackId]
  );

  return (
    <>
      {/* In-scene player */}
      {mode === 'player' && playbackId && (
        <Html
          position={playerConfig.position}
          rotation={playerConfig.rotation}
          center
          transform
          scale={playerConfig.scale}
          distanceFactor={playerConfig.distanceFactor}
        >
          <InScenePlayer
            playbackId={playbackId}
            width={playerConfig.width}
            height={playerConfig.height}
            onTimeUpdate={handlePlayerTimeUpdate}
            onClosePlayer={handleClosePlayer}
            playerRef={muxPlayerRef}
          />
        </Html>
      )}

      <group dispose={null} position={position} scale={[scale, scale, scale]}>
        {/* Play button overlay - only show when in texture mode and hovered */}
        {hovered && mode === 'texture' && (
          <Html position={getScreenPositionArray(0)} rotation={[Math.PI / 2, 0, 0.131]} center>
            <div className="pointer-events-none flex items-center justify-center">
              <PlayCircle size={48} className="animate-pulse text-white" />
            </div>
          </Html>
        )}

        <group name="Scene002">
          <group
            name="platform"
            position={[9.328, 18.499, -7.336]}
            rotation={[0, 1.44, 0]}
            scale={0.056}
          >
            <mesh
              name="platform_1"
              castShadow
              receiveShadow
              geometry={nodes.platform_1.geometry}
              material={materials.black}
            />
            <mesh
              name="platform_2"
              castShadow
              receiveShadow
              geometry={nodes.platform_2.geometry}
              material={materials.light}
            />
          </group>
          <group
            name="billboard"
            position={[12.201, 23.171, -9.868]}
            rotation={[Math.PI / 2, 0, 0.131]}
          >
            <mesh
              name="billboard_1"
              castShadow
              receiveShadow
              geometry={nodes.billboard_1.geometry}
              material={materials.black}
            />
            <mesh
              name="billboard_2"
              onPointerEnter={e => {
                e.stopPropagation();
                setHovered(true);
              }}
              onPointerLeave={e => {
                e.stopPropagation();
                setHovered(false);
              }}
              onClick={handlePlayClick}
              castShadow
              receiveShadow
              geometry={nodes.billboard_2.geometry}
              material={billboardMaterial}
              visible={mode === 'texture'}
            />
          </group>
          <mesh
            name="post"
            castShadow
            receiveShadow
            geometry={nodes.post.geometry}
            material={materials.black}
            position={[20.323, 9.98, -10.09]}
            rotation={[0, -0.131, 0]}
            scale={[1.292, 4.799, 1.022]}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('/models/landing/billboard.glb');
