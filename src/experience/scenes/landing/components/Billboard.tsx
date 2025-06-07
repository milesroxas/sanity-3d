import { Html, useCursor, useGLTF, useVideoTexture } from '@react-three/drei';
import { PlayCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import VideoModal from './VideoModal';

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
  portalRef?: React.RefObject<HTMLDivElement>;
}

export function Billboard({ position, scale = 1, modalVideo, portalRef }: BillboardProps) {
  const portalRefInternal = useRef<HTMLDivElement>(null);

  const texture = useVideoTexture('/videos/intro-video-loop.mp4', {
    muted: true,
    loop: true,
    start: true,
  });

  texture.flipY = false;

  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <>
      {showModal && portalRef?.current && (
        <Html portal={portalRef}>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <VideoModal video={modalVideo} onClose={() => setShowModal(false)} />
          </div>
        </Html>
      )}

      <group dispose={null} position={position} scale={[scale, scale, scale]}>
        {hovered && (
          <Html position={[10, 23.171, -9.868]} rotation={[Math.PI / 2, 0, 0.131]} center>
            <div className="flex items-center justify-center">
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
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              onClick={() => setShowModal(true)}
              castShadow
              receiveShadow
              geometry={nodes.billboard_2.geometry}
              material={billboardMaterial}
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
