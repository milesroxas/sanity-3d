'use client';

import { urlFor } from '@/sanity/lib/image';
import { createBlurUp } from '@mux/blurup';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
      <div className="text-gray-500">Loading video...</div>
    </div>
  ),
});

type MuxPlayerElement = any;
type PlaybackMode = 'preview' | 'full';

const DEFAULT_PREVIEW_DURATION = 4;

interface MediaProps {
  title?: string;
  mediaType: 'image' | 'video';
  alt?: string;
  image?: Sanity.Image;
  video?: {
    asset: {
      _id: string;
      playbackId: string;
      assetId: string;
      filename: string;
    };
  };
  videoOptions?: {
    showControls: boolean;
  };
  _key: string;
  renderContext?: string;
}

export default function Media({
  mediaType = 'image',
  alt,
  image,
  video,
  videoOptions,
  renderContext,
}: MediaProps) {
  const [blurDataURL, setBlurDataURL] = useState<string | null>(null);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('preview');
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const playerRef = useRef<MuxPlayerElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Detect touch device for play button visibility
    const mobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobile);
  }, []);

  // Generate video blur placeholder
  useEffect(() => {
    if (mediaType === 'video' && video?.asset?.playbackId && isClient) {
      createBlurUp(video.asset.playbackId, {})
        .then(({ blurDataURL }) => setBlurDataURL(blurDataURL))
        .catch(error => console.error('Error generating video placeholder:', error));
    }
  }, [video?.asset?.playbackId, mediaType, isClient]);

  // Video event handlers
  const handleTimeUpdate = useCallback(() => {
    if (playbackMode === 'preview' && playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      if (currentTime >= DEFAULT_PREVIEW_DURATION) {
        playerRef.current.currentTime = 0;
      }
    }
  }, [playbackMode]);

  const handleMouseEnter = useCallback(() => {
    if (
      mediaType === 'video' &&
      playbackMode === 'preview' &&
      videoOptions?.showControls !== false &&
      !isMobile
    ) {
      hoverTimeoutRef.current = setTimeout(() => setShowPlayButton(true), 200);
    }
  }, [mediaType, playbackMode, videoOptions?.showControls, isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (!isMobile) {
      setShowPlayButton(false);
    }
  }, [isMobile]);

  const handleTap = useCallback(() => {
    if (isMobile && playbackMode === 'preview' && videoOptions?.showControls !== false) {
      // Toggle play button visibility on tap
      setShowPlayButton(prev => !prev);
    }
  }, [isMobile, playbackMode, videoOptions?.showControls]);

  const handlePlayClick = useCallback(() => {
    if (playerRef.current) {
      setPlaybackMode('full');
      setShowPlayButton(false);
      setAutoplayFailed(false);
      playerRef.current.currentTime = 0;
      playerRef.current.play();
    }
  }, []);

  const handleLoadedData = useCallback(() => {
    if (playbackMode === 'preview' && playerRef.current) {
      playerRef.current.currentTime = 0;
    }
  }, [playbackMode]);

  // Handle autoplay failure — show play button as fallback
  const handleAutoplayError = useCallback(() => {
    if (playbackMode === 'preview') {
      setAutoplayFailed(true);
      setShowPlayButton(true);
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

  const renderMedia = () => {
    if (mediaType === 'video' && video?.asset?.playbackId) {
      if (!isClient) {
        return (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <div className="text-gray-500">Loading video...</div>
          </div>
        );
      }

      const shouldShowOverlay =
        (showPlayButton || autoplayFailed) && playbackMode === 'preview';

      return (
        <div
          className="relative h-full w-full"
          onMouseEnter={videoOptions?.showControls === false ? undefined : handleMouseEnter}
          onMouseLeave={videoOptions?.showControls === false ? undefined : handleMouseLeave}
          onClick={videoOptions?.showControls === false ? undefined : handleTap}
        >
          <MuxPlayer
            ref={playerRef}
            className={
              renderContext === 'overlay'
                ? 'h-auto w-full'
                : 'absolute inset-0 h-full w-full'
            }
            playbackId={video.asset.playbackId}
            streamType="on-demand"
            playsInline
            preload="metadata"
            accentColor="#16A34A"
            muted={playbackMode === 'preview'}
            loop={playbackMode === 'preview'}
            autoPlay={playbackMode === 'preview'}
            paused={playbackMode === 'full' ? false : undefined}
            placeholder={blurDataURL || undefined}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
            onError={handleAutoplayError}
            playerInitTime={0}
            style={{
              '--media-object-fit': renderContext === 'overlay' ? 'contain' : 'cover',
              '--media-object-position': 'center',
              ...(playbackMode === 'preview' && {
                '--controls': 'none',
                '--media-control-bar': 'none',
              }),
            } as React.CSSProperties & Record<`--${string}`, string>}
            nohotkeys={playbackMode === 'preview'}
          />

          {playbackMode === 'preview' && videoOptions?.showControls !== false && (
            <>
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                  shouldShowOverlay
                    ? 'pointer-events-auto opacity-50'
                    : 'pointer-events-none opacity-0'
                }`}
                onClick={handlePlayClick}
              />

              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                  shouldShowOverlay
                    ? 'pointer-events-auto opacity-80'
                    : 'pointer-events-none opacity-0'
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

    // Default to image
    if (image && image.asset?._id) {
      return (
        <Image
          className="object-cover"
          src={urlFor(image.asset).url()}
          alt={alt || ''}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
          blurDataURL={image?.asset?.metadata?.lqip || ''}
          quality={100}
        />
      );
    }

    return null;
  };

  const isOverlay = renderContext === 'overlay';

  return (
    <div
      ref={containerRef}
      className={
        isOverlay
          ? 'relative w-full overflow-hidden rounded-md'
          : 'relative aspect-video w-full overflow-hidden rounded-md'
      }
    >
      {renderMedia()}
    </div>
  );
}
