'use client';
import { createBlurUp } from '@mux/blurup';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
      <div className="text-gray-500">Loading video...</div>
    </div>
  ),
});

// Use any for the player element type until we can import the proper type
type MuxPlayerElement = any;

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
  previewDuration?: number;
}

type PlaybackMode = 'preview' | 'full';

const HOVER_DELAY = 200;
const DEFAULT_PREVIEW_DURATION = 4;

export default function SplitVideo({
  video,
  blurDataURL: preGeneratedBlur,
  aspectRatio: preGeneratedRatio,
  previewDuration = DEFAULT_PREVIEW_DURATION,
}: SplitVideoProps) {
  const [blurDataURL, setBlurDataURL] = useState<string | null>(preGeneratedBlur || null);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('preview');
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const playerRef = useRef<MuxPlayerElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!preGeneratedBlur && video?.asset?.playbackId && isClient) {
      createBlurUp(video.asset.playbackId, {})
        .then(({ blurDataURL }) => setBlurDataURL(blurDataURL))
        .catch(error => console.error('Error generating video placeholder:', error));
    }
  }, [video?.asset?.playbackId, preGeneratedBlur, isClient]);

  const handleTimeUpdate = useCallback(() => {
    if (playbackMode === 'preview' && playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      if (currentTime >= previewDuration) {
        playerRef.current.currentTime = 0;
      }
    }
  }, [playbackMode, previewDuration]);

  const handleMouseEnter = useCallback(() => {
    if (playbackMode === 'preview') {
      hoverTimeoutRef.current = setTimeout(() => setShowPlayButton(true), HOVER_DELAY);
    }
  }, [playbackMode]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowPlayButton(false);
  }, []);

  const handlePlayClick = useCallback(() => {
    if (playerRef.current) {
      setPlaybackMode('full');
      setShowPlayButton(false);
      playerRef.current.currentTime = 0;
      playerRef.current.play();
    }
  }, []);

  const handleLoadedData = useCallback(() => {
    if (playbackMode === 'preview' && playerRef.current) {
      playerRef.current.currentTime = 0;
    }
  }, [playbackMode]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (!video?.asset?.playbackId) {
    return null;
  }

  if (!isClient) {
    return (
      <div
        className="relative flex max-h-[25rem] w-full items-center justify-center overflow-hidden rounded-md bg-primary sm:max-h-[30rem] md:max-h-[25rem] lg:h-full"
        style={{ aspectRatio: preGeneratedRatio || '16/9' }}
      >
        <div className="text-gray-500">Loading video...</div>
      </div>
    );
  }

  const shouldShowOverlay = showPlayButton && playbackMode === 'preview';

  return (
    <div
      className="group relative max-h-[25rem] w-full overflow-hidden rounded-md sm:max-h-[30rem] md:max-h-[25rem] lg:h-full"
      style={{ aspectRatio: preGeneratedRatio || '16/9' }}
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
        placeholder={blurDataURL || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        playerInitTime={0}
        style={
          {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            ...(playbackMode === 'preview' && {
              '--controls': 'none',
              '--media-control-bar': 'none',
            }),
          } as React.CSSProperties
        }
        nohotkeys={playbackMode === 'preview'}
      />

      {playbackMode === 'preview' && (
        <>
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
              shouldShowOverlay ? 'pointer-events-auto opacity-50' : 'pointer-events-none opacity-0'
            }`}
            onClick={handlePlayClick}
          />

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
              shouldShowOverlay ? 'pointer-events-auto opacity-80' : 'pointer-events-none opacity-0'
            }`}
            style={{ zIndex: 10 }}
          >
            <button
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 ease-in-out ${
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
