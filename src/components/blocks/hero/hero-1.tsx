'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { useBlockScrollTrigger } from '@/hooks/useBlockScrollTrigger';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import { createBlurUp } from '@mux/blurup';
import gsap from 'gsap';
import { PortableTextBlock } from 'next-sanity';
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

const HOVER_DELAY = 200;
const DEFAULT_PREVIEW_DURATION = 4;

interface Hero1Props {
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  image?: Sanity.Image;
  video?: {
    asset: {
      _id: string;
      playbackId: string;
      assetId: string;
      filename: string;
    };
  };
  mediaType?: 'image' | 'video';
  links: Sanity.Link[];
  _key: string;
}

export default function Hero1({
  tagLine,
  title,
  body,
  image,
  video,
  mediaType = 'image',
  links,
  _key,
}: Hero1Props) {
  const { blockRef, createScrollTrigger, runAnimations } = useBlockScrollTrigger(_key);

  // Video-specific state
  const [blurDataURL, setBlurDataURL] = useState<string | null>(null);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('preview');
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const playerRef = useRef<MuxPlayerElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsClient(true);
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
    if (mediaType === 'video' && playbackMode === 'preview') {
      hoverTimeoutRef.current = setTimeout(() => setShowPlayButton(true), HOVER_DELAY);
    }
  }, [mediaType, playbackMode]);

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

  useGSAP(
    () => {
      gsap.set(['.links'], { opacity: 0 });
      gsap.set('.media-container', { opacity: 0 });
      gsap.set('.media-content', {
        scale: 1.1,
        transformOrigin: 'center center',
        opacity: 0,
      });

      const tl = gsap.timeline({
        ease: 'power2.inOut',
        duration: 0.25,
      });

      tl.fromTo(
        '.links',
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        '-=0.3'
      );

      // Fade in the media container
      tl.to(
        '.media-container',
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        '-=0.3'
      );

      // Scale the media content
      tl.to(
        '.media-content',
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '-=0.8'
      );
    },
    {
      scope: blockRef,
    }
  );

  useEffect(() => {
    const container = blockRef.current;
    if (!container || !blockRef.current) return;

    const mediaContent = container.querySelector('.media-content');
    if (!mediaContent) return;

    runAnimations(() => {
      gsap.fromTo(
        mediaContent,
        {
          yPercent: -15,
        },
        {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: createScrollTrigger(
            container as HTMLElement,
            {
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
            0
          ),
        }
      );
    });
  }, [blockRef, createScrollTrigger, runAnimations]);

  const renderMedia = () => {
    if (mediaType === 'video' && video?.asset?.playbackId) {
      if (!isClient) {
        return (
          <div className="media-content flex max-h-96 w-full items-center justify-center bg-gray-100 md:h-full md:max-h-screen">
            <div className="text-gray-500">Loading video...</div>
          </div>
        );
      }

      const shouldShowOverlay = showPlayButton && playbackMode === 'preview';

      return (
        <div
          className="media-content relative h-96 w-full md:absolute md:inset-0 md:h-full"
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
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              ...(playbackMode === 'preview' && {
                '--controls': 'none',
                '--media-control-bar': 'none',
                '--media-object-fit': 'cover',
                '--media-object-position': 'center',
              }),
            }}
            nohotkeys={playbackMode === 'preview'}
          />

          {playbackMode === 'preview' && (
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

    // Default to image
    if (image && image.asset?._id) {
      return (
        <Image
          className="media-content max-h-96 w-full object-cover md:h-full md:max-h-screen"
          src={urlFor(image.asset).url()}
          alt={image.alt || ''}
          width={image.asset?.metadata?.dimensions?.width || 800}
          height={image.asset?.metadata?.dimensions?.height || 800}
          placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
          blurDataURL={image?.asset?.metadata?.lqip || ''}
          quality={100}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex w-full flex-col bg-accent md:min-h-[100vh] md:flex-row" ref={blockRef}>
      <div className="flex w-full flex-col justify-center px-12 py-24 md:w-1/2 md:p-16 lg:p-24">
        <div className="mx-auto max-w-xl">
          {tagLine && (
            <h1 className="tagline mb-2 text-muted-foreground md:text-base">{tagLine}</h1>
          )}

          {title && (
            <h2 className="title mb-6 text-3xl font-bold text-card-foreground md:text-4xl">
              {title}
            </h2>
          )}

          {body && (
            <PortableTextRenderer value={body} className="body mb-8 text-muted-foreground" />
          )}

          <LinkButtons links={links || []} containerClassName="mt-10 links" direction="row" />
        </div>
      </div>

      <div className="media-container relative w-full overflow-hidden md:w-1/2">
        {renderMedia()}
      </div>
    </div>
  );
}
