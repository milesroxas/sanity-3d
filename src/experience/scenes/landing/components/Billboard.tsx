import { Html, useCursor, useGLTF, useVideoTexture } from '@react-three/drei';
import { useControls } from 'leva';
import { Maximize2, PlayCircle, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useVideoModalStore } from '../store/videoModalStore';

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

interface BillboardProps {
  position?: THREE.Vector3;
  scale?: number;
  modalVideo?: Sanity.Video;
  textureVideo?: Sanity.Video;
}

export function Billboard({ position, scale = 1, modalVideo, textureVideo }: BillboardProps) {
  // Leva controls for Mux player positioning (relative to billboard)
  const playerControls = useControls(
    'Mux Player Position',
    {
      position: {
        value: [-2.43, 3.0, 0.02],
        step: 0.01,
        label: 'Position [x, y, z]',
      },
      rotation: {
        value: [-1.5708, 0, 0],
        step: 0.01,
        label: 'Rotation [x, y, z]',
      },
      scale: {
        value: 0.89,
        min: 0.1,
        max: 2,
        step: 0.01,
        label: 'Scale',
      },
      dimensions: {
        value: [1600, 900],
        step: 10,
        label: 'Dimensions [w, h]',
      },
    },
    { collapsed: true }
  );

  const MuxPlayer = useMemo(
    () =>
      dynamic(() => import('@mux/mux-player-react'), {
        ssr: false,
        loading: () => (
          <div className="flex h-full w-full items-center justify-center bg-black/90 text-white/80">
            Loading video...
          </div>
        ),
      }),
    []
  );

  // Use the video URL from Sanity if available, otherwise fallback to the default
  const videoUrl = textureVideo?.asset?.playbackId
    ? `https://stream.mux.com/${textureVideo.asset.playbackId}.m3u8`
    : '/videos/intro-video-loop.mp4';

  const texture = useVideoTexture(videoUrl, {
    muted: true,
    loop: true,
    start: true,
  });

  texture.flipY = false;

  const [hovered, setHovered] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const { openModal } = useVideoModalStore();

  useCursor(hovered);

  const billboardMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      toneMapped: false,
    });
  }, [texture]);

  useEffect(() => {
    const videoElement = texture.image as HTMLVideoElement;
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

    if (videoElement.readyState >= 2) {
      playVideo();
    } else {
      videoElement.addEventListener('loadeddata', playVideo);
    }

    return () => {
      videoElement.removeEventListener('loadeddata', playVideo);
    };
  }, [texture]);

  const { nodes, materials } = useGLTF('/models/landing/billboard.glb') as unknown as GLTFResult;

  const handleOpenInlinePlayer = () => {
    if (!modalVideo) {
      console.warn('❌ No modalVideo provided to Billboard');
      return;
    }
    setShowPlayer(true);
  };

  // Pause background texture video when inline player is shown
  useEffect(() => {
    const videoElement = texture.image as HTMLVideoElement | undefined;
    if (!videoElement) return;
    if (showPlayer) {
      try {
        videoElement.pause();
      } catch {}
    } else {
      try {
        // Resume background loop when player closes
        videoElement.play();
      } catch {}
    }
  }, [showPlayer, texture.image]);

  return (
    <group dispose={null} position={position} scale={[scale, scale, scale]}>
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
          {/* Play icon when hovering and player not shown */}
          {hovered && !showPlayer && (
            <Html position={[-3, 0, 0]} center>
              <div className="flex items-center justify-center">
                <PlayCircle size={48} className="animate-pulse text-white" />
              </div>
            </Html>
          )}

          <mesh
            name="billboard_1"
            castShadow
            receiveShadow
            geometry={nodes.billboard_1.geometry}
            material={materials.black}
          />
          <mesh
            name="billboard_2"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={handleOpenInlinePlayer}
            castShadow
            receiveShadow
            geometry={nodes.billboard_2.geometry}
            material={billboardMaterial}
          />

          {/* Inline Mux Player overlay positioned relative to billboard screen */}
          {showPlayer && modalVideo?.asset?.playbackId && (
            <Html
              position={playerControls.position}
              rotation={playerControls.rotation}
              transform
              sprite={false}
              prepend
              scale={playerControls.scale}
            >
              <div
                className="relative"
                style={{
                  width: playerControls.dimensions[0],
                  height: playerControls.dimensions[1],
                  pointerEvents: 'auto',
                }}
              >
                {/* Controls overlay */}
                <div className="pointer-events-none absolute left-0 top-0 z-10 w-full p-2">
                  <div className="pointer-events-auto ml-auto flex w-fit items-center gap-2">
                    <button
                      aria-label="Open fullscreen"
                      className="rounded bg-black/60 p-2 text-white transition hover:bg-black/80"
                      onClick={e => {
                        e.stopPropagation();
                        openModal(modalVideo);
                      }}
                    >
                      <Maximize2 size={16} />
                    </button>
                    <button
                      aria-label="Close player"
                      className="rounded bg-black/60 p-2 text-white transition hover:bg-black/80"
                      onClick={e => {
                        e.stopPropagation();
                        setShowPlayer(false);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="h-full w-full overflow-hidden rounded-md bg-black shadow-2xl">
                  <MuxPlayer
                    playbackId={modalVideo.asset.playbackId}
                    metadata={{ videoTitle: modalVideo?.asset?.filename || 'Video' }}
                    autoPlay
                    muted={false}
                    preload="auto"
                    streamType="on-demand"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </Html>
          )}
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
  );
}

useGLTF.preload('/models/landing/billboard.glb');
