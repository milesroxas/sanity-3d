'use client';
import { createBlurUp } from '@mux/blurup';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

// Dynamic import with SSR disabled to prevent hydration errors
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
      <div className="text-gray-500">Loading video...</div>
    </div>
  ),
});

export interface SplitVideoProps {
  video?: {
    asset: {
      _id: string;
      playbackId: string;
      assetId: string;
      filename: string;
    };
  };
  blurDataURL?: string;
  aspectRatio?: number;
  previewDuration?: number; // Duration of preview loop in seconds (default: 4)
}

type PlaybackMode = 'preview' | 'full';

export default function SplitVideo({
  video,
  blurDataURL: preGeneratedBlur,
  aspectRatio: preGeneratedRatio,
  previewDuration = 4,
}: SplitVideoProps) {
  const [placeholder, setPlaceholder] = useState<{
    blurDataURL: string | null;
  }>({
    blurDataURL: preGeneratedBlur || null,
  });

  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('preview');
  const [isHovered, setIsHovered] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const playerRef = useRef<any>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only generate client-side if not pre-generated
    if (!preGeneratedBlur && video?.asset?.playbackId && isClient) {
      createBlurUp(video.asset.playbackId, {})
        .then(({ blurDataURL }) => {
          setPlaceholder({ blurDataURL });
        })
        .catch(error => {
          console.error('Error generating video placeholder:', error);
        });
    }
  }, [video?.asset?.playbackId, preGeneratedBlur, isClient]);

  const handleTimeUpdate = useCallback(() => {
    if (playbackMode === 'preview' && playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      // Loop back to start if we've reached the preview duration
      if (currentTime >= previewDuration) {
        playerRef.current.currentTime = 0;
      }
    }
  }, [playbackMode, previewDuration]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (playbackMode === 'preview') {
      // Show play button after a brief delay to avoid flickering
      const timer = setTimeout(() => setShowPlayButton(true), 200);
      return () => clearTimeout(timer);
    }
  }, [playbackMode]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowPlayButton(false);
  }, []);

  const handlePlayClick = useCallback(() => {
    if (playerRef.current) {
      // Switch to full playback mode and start from beginning
      setPlaybackMode('full');
      setShowPlayButton(false);
      playerRef.current.currentTime = 0;
      playerRef.current.play();
    }
  }, []);

  const handleLoadedData = useCallback(() => {
    // Ensure preview mode starts at beginning
    if (playbackMode === 'preview' && playerRef.current) {
      playerRef.current.currentTime = 0;
    }
  }, [playbackMode]);

  if (!video?.asset?.playbackId) {
    return null;
  }

  // Show loading state until client-side rendering is ready
  if (!isClient) {
    return (
      <div
        className="relative flex h-[25rem] items-center justify-center overflow-hidden rounded-md bg-primary sm:h-[30rem] md:h-[25rem] lg:h-full"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="text-gray-500">Loading video...</div>
      </div>
    );
  }

  // Determine if overlay should be visible
  const shouldShowOverlay = showPlayButton && playbackMode === 'preview';

  return (
    <div
      className="group relative h-[25rem] overflow-hidden rounded-md sm:h-[30rem] md:h-[25rem] lg:h-full"
      style={{ aspectRatio: '16/9' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MuxPlayer
        ref={playerRef}
        playbackId={video.asset.playbackId}
        streamType="on-demand"
        accentColor="#16A34A"
        muted={playbackMode === 'preview'}
        loop={playbackMode === 'preview'}
        autoPlay={playbackMode === 'preview'}
        paused={playbackMode === 'full' ? false : undefined}
        placeholder={placeholder.blurDataURL || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        playerInitTime={0} // Set consistent value to prevent hydration errors
        style={
          {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // Hide controls in preview mode
            ...(playbackMode === 'preview' && {
              '--controls': 'none',
              '--media-control-bar': 'none',
            }),
          } as React.CSSProperties
        }
        nohotkeys={playbackMode === 'preview'}
      />

      {/* Overlay components - Background and Play Button completely separated */}
      {playbackMode === 'preview' && (
        <>
          {/* Background overlay - separate layer */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
              shouldShowOverlay ? 'opacity-50' : 'opacity-0'
            } ${shouldShowOverlay ? 'pointer-events-auto' : 'pointer-events-none'}`}
            onClick={handlePlayClick}
          />

          {/* Play button - completely separate from background */}
          <div
            className={`absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out ${
              shouldShowOverlay ? 'pointer-events-auto opacity-80' : 'pointer-events-none opacity-0'
            }`}
            style={{ zIndex: 10 }}
          >
            <button
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-200 ease-in-out ${
                shouldShowOverlay
                  ? 'scale-100 bg-opacity-80 hover:scale-110 hover:bg-opacity-100 hover:shadow-xl'
                  : 'scale-75 bg-opacity-0'
              }`}
              style={{
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backdropFilter = 'blur(8px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backdropFilter = 'blur(4px)';
              }}
              onClick={handlePlayClick}
              aria-label="Play video"
            >
              <svg
                className={`ml-1 h-6 w-6 text-gray-800 transition-opacity duration-300 ease-in-out ${
                  shouldShowOverlay ? 'opacity-100' : 'opacity-0'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
