import { useR3F } from '@/experience/providers/R3FContext';
import { selectBeginIntroTransition, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import { createBlurUp } from '@mux/blurup';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, SplitText);

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

interface IntroOverlayProps {
  experienceMediaVideo?: Sanity.Media;
  logo?: Sanity.Image;
}

export default function IntroOverlay({ experienceMediaVideo, logo }: IntroOverlayProps) {
  const beginIntroTransition = useCameraStore(selectBeginIntroTransition);
  const [isDismissing, setIsDismissing] = useState(false);
  const { sceneContainerRef } = useR3F();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const sceneInitialOpacityRef = useRef(1);

  // Video state
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
    if (experienceMediaVideo?.video?.asset?.playbackId && isClient) {
      createBlurUp(experienceMediaVideo.video.asset.playbackId, {})
        .then(({ blurDataURL }) => setBlurDataURL(blurDataURL))
        .catch(error => console.error('Error generating video placeholder:', error));
    }
  }, [experienceMediaVideo?.video?.asset?.playbackId, isClient]);

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

  // Cleanup: Ensure container is completely removed if component unmounts during animation
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        // Force remove all visual effects on unmount
        const container = containerRef.current;
        gsap.set(container, {
          display: 'none',
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        });
      }
    };
  }, []);

  // Cache user motion preference. No state update to avoid re-renders.
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const resolveSceneContainer = useCallback(() => sceneContainerRef.current, [sceneContainerRef]);

  /**
   * ENTRY
   * Use revertOnUpdate so any dependency change safely kills and rebuilds timelines.
   * Everything created inside is bound to the scope and auto-cleaned.
   */
  useGSAP(
    context => {
      const container = containerRef.current;
      const logo = logoRef.current;
      const heading = headingRef.current;
      const buttons = buttonsRef.current;
      const video = videoRef.current;
      const marquee = marqueeRef.current;
      const scene = resolveSceneContainer();
      if (!container || !scene) return;

      // Read current scene opacity and normalize
      const computedOpacity =
        typeof window !== 'undefined'
          ? parseFloat(window.getComputedStyle(scene).opacity || '1')
          : 1;
      const targetSceneOpacity =
        Number.isFinite(computedOpacity) && computedOpacity > 0.01 ? computedOpacity : 1;

      sceneInitialOpacityRef.current = targetSceneOpacity;

      // Initial states
      gsap.set(container, { autoAlpha: 0 });
      if (logo) gsap.set(logo, { autoAlpha: 0, y: -30 });
      if (marquee) gsap.set(marquee, { autoAlpha: 0, y: 30 });
      if (video) gsap.set(video, { autoAlpha: 0 });
      if (heading) gsap.set(heading, { autoAlpha: 0 });
      if (buttons) gsap.set(buttons, { autoAlpha: 0 });

      // Start scene at target opacity so it's immediately visible
      gsap.set(scene, {
        opacity: prefersReducedMotion
          ? targetSceneOpacity
          : Math.min(targetSceneOpacity * 0.8, 0.8),
      });

      if (prefersReducedMotion) {
        // Snap in without animation
        gsap.set(container, { autoAlpha: 1 });
        if (logo) gsap.set(logo, { autoAlpha: 1 });
        if (heading) gsap.set(heading, { autoAlpha: 1 });
        if (buttons) gsap.set(buttons, { autoAlpha: 1 });
        if (video) gsap.set(video, { autoAlpha: 1 });
        if (marquee) gsap.set(marquee, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline();

      // 1. Container fades in (scene is already visible)
      tl.to(container, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 0);

      // 2. Content (heading with SplitText line reveal + buttons) fades in after container
      tl.addLabel('contentFadeIn', 1.25);

      if (heading) {
        // Split text into lines
        const split = new SplitText(heading, { type: 'lines' });
        const lines = split.lines;

        // Wrap lines for overflow hidden (clip effect)
        gsap.set(heading, { perspective: 400 });

        // Create parent wrapper for each line to clip
        lines.forEach(line => {
          const wrapper = document.createElement('div');
          wrapper.style.overflow = 'hidden';
          wrapper.style.paddingBottom = '0.15em'; // Prevent descenders from being cut off
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        // Initial state - lines translated down and invisible
        gsap.set(lines, {
          yPercent: 100,
          opacity: 0,
        });

        gsap.set(heading, { autoAlpha: 1 });

        // Animate lines up with stagger using elegant expo easing
        tl.to(
          lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.08,
          },
          'contentFadeIn'
        );
      }

      if (buttons) {
        tl.to(
          buttons,
          {
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out',
          },
          'contentFadeIn+=1.5'
        );
      }

      // 3. Logo and Marquee first, then video after they complete
      tl.addLabel('finalElements', 'contentFadeIn+=1.75');

      if (logo) {
        tl.to(
          logo,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.5,
            ease: 'expo.out',
          },
          'finalElements'
        );
      }

      if (marquee) {
        tl.to(
          marquee,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.5,
            ease: 'expo.out',
          },
          'finalElements'
        );
      }

      if (video) {
        tl.to(
          video,
          {
            autoAlpha: 1,
            duration: 1.5,
            ease: 'expo.out',
          },
          'finalElements'
        );
      }

      // No manual kill needed. Context revert handles it.
    },
    {
      scope: containerRef,
      // If these change, the hook safely reverts and re-runs
      dependencies: [resolveSceneContainer, prefersReducedMotion],
      revertOnUpdate: true,
    }
  );

  /**
   * EXIT
   * Triggered when dismissing. Rebuilds a scoped timeline and reverts on change.
   */
  useGSAP(
    () => {
      if (!isDismissing) return;
      const container = containerRef.current;
      const logo = logoRef.current;
      const heading = headingRef.current;
      const buttons = buttonsRef.current;
      const video = videoRef.current;
      const marquee = marqueeRef.current;
      const scene = resolveSceneContainer();
      if (!container || !scene) return;

      // Disable pointer events quickly to prevent double clicks
      gsap.set(container, {
        pointerEvents: 'none',
      });

      if (prefersReducedMotion) {
        // Snap out - completely remove from DOM
        gsap.set(container, {
          autoAlpha: 0,
          display: 'none',
          visibility: 'hidden',
          pointerEvents: 'none',
          // Remove background and backdrop effects completely
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        });
        if (logo) gsap.set(logo, { autoAlpha: 0 });
        if (heading) gsap.set(heading, { autoAlpha: 0 });
        if (buttons) gsap.set(buttons, { autoAlpha: 0 });
        if (video) gsap.set(video, { autoAlpha: 0 });
        if (marquee) gsap.set(marquee, { autoAlpha: 0 });
        gsap.set(scene, { opacity: sceneInitialOpacityRef.current });
        return;
      }

      const tl = gsap.timeline();

      // All elements slide down and fade out in a staggered way
      // Key: opacity finishes BEFORE y animation completes
      const slideDistance = 80; // Total slide down distance
      const slideDuration = 1.2; // Duration of y animation
      const fadeDuration = 0.6; // Fade completes much earlier

      if (logo) {
        tl.to(
          logo,
          {
            y: slideDistance,
            duration: slideDuration,
            ease: 'power2.in',
          },
          0
        ).to(
          logo,
          {
            opacity: 0,
            duration: fadeDuration,
            ease: 'power2.in',
          },
          0
        );
      }

      if (heading) {
        tl.to(
          heading,
          {
            y: slideDistance,
            duration: slideDuration,
            ease: 'power2.in',
          },
          0.05
        ).to(
          heading,
          {
            opacity: 0,
            duration: fadeDuration,
            ease: 'power2.in',
          },
          0.05
        );
      }

      if (buttons) {
        tl.to(
          buttons,
          {
            y: slideDistance,
            duration: slideDuration,
            ease: 'power2.in',
          },
          0.08
        ).to(
          buttons,
          {
            opacity: 0,
            duration: fadeDuration,
            ease: 'power2.in',
          },
          0.1
        );
      }

      if (video) {
        tl.to(
          video,
          {
            y: slideDistance,
            scale: 0.92,
            duration: slideDuration,
            ease: 'power2.in',
          },
          0.1
        ).to(
          video,
          {
            opacity: 0,
            duration: fadeDuration,
            ease: 'power2.in',
          },
          0.1
        );
      }

      if (marquee) {
        tl.to(
          marquee,
          {
            y: slideDistance,
            duration: slideDuration,
            ease: 'power2.in',
          },
          0.13
        ).to(
          marquee,
          {
            opacity: 0,
            duration: fadeDuration,
            ease: 'power2.in',
          },
          0.13
        );
      }

      // Container fades out simultaneously with content animations
      // Use autoAlpha to set both opacity and visibility
      // The background and backdrop will fade naturally with opacity
      tl.to(
        container,
        {
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.in',
        },
        0
      );

      // Scene fades up simultaneously - ensure it reaches full opacity and stays there
      tl.to(
        scene,
        {
          opacity: sceneInitialOpacityRef.current,
          duration: 1,
          ease: 'power3.inOut',
        },
        0
      );

      // Completely remove container from DOM flow at the END of all animations
      // This ensures nothing can reappear or interfere with the main scene
      // Calculate the latest end time: marquee starts at 0.13 and animates for slideDuration (1.2s)
      // Scene fade is 1s, so total should be max(1.33, 1) = 1.33s
      const latestAnimationEnd = 0.13 + slideDuration; // 1.33 seconds
      const sceneFadeEnd = 1; // Scene fade duration
      const totalDuration = Math.max(latestAnimationEnd, sceneFadeEnd);

      // Lock the scene opacity at the end to prevent any reverts
      tl.set(
        scene,
        {
          opacity: sceneInitialOpacityRef.current,
        },
        totalDuration
      );

      // Remove CSS transition classes from scene container at the end to prevent unwanted fade-ins
      // And lock the scene opacity to prevent any reverts
      tl.call(
        () => {
          if (scene) {
            scene.classList.remove('transition-opacity', 'duration-1000', 'ease-in-out');
            // Lock opacity to prevent any CSS transitions from reverting it
            scene.style.opacity = String(sceneInitialOpacityRef.current);
          }
        },
        [],
        totalDuration
      );

      tl.set(
        container,
        {
          display: 'none',
          visibility: 'hidden',
          pointerEvents: 'none',
          // Remove background and backdrop effects completely
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        },
        totalDuration
      );
    },
    {
      scope: containerRef,
      dependencies: [isDismissing, resolveSceneContainer, prefersReducedMotion],
      revertOnUpdate: true,
    }
  );

  // Ensure the click handler is bound to GSAP context for safety
  const { contextSafe } = useGSAP({ scope: containerRef });
  const handleBegin = contextSafe(() => {
    if (isDismissing) return;
    setIsDismissing(true);
    // Start camera transition immediately
    beginIntroTransition();
  });

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      aria-describedby="intro-desc"
      className={[
        'fixed inset-0 z-50 flex h-full w-full flex-col',
        isDismissing ? 'pointer-events-none' : 'pointer-events-auto',
        'backdrop-blur-sm',
      ].join(' ')}
      style={{
        background:
          'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0.6) 78%, rgba(255,255,255,0.75) 100%)',
      }}
    >
      {/* Logo at top center */}
      {logo?.asset && (
        <div ref={logoRef} className="flex justify-center py-8">
          <Image
            src={urlFor(logo.asset).url()}
            alt={logo.alt || 'Logo'}
            width={80}
            height={80}
            priority
            className="h-auto w-[80px]"
          />
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 items-center justify-center px-6 lg:px-12">
        <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div className="flex flex-col space-y-8">
            <h1
              ref={headingRef}
              className="text-2xl font-semibold leading-tight text-foreground lg:text-4xl"
            >
              Over 40 years of experience offering comprehensive security solutions
            </h1>
            <div ref={buttonsRef} className="flex gap-4">
              <button
                type="button"
                className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleBegin}
                disabled={isDismissing}
              >
                Enter Experience
              </button>
              <button
                type="button"
                className="rounded-md border border-foreground/20 bg-transparent px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                Get a free quote
              </button>
            </div>
          </div>

          {/* Video */}
          {experienceMediaVideo?.video?.asset?.playbackId && (
            <div
              ref={videoRef}
              className="group relative aspect-video w-full overflow-hidden rounded-lg"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isClient ? (
                <>
                  <MuxPlayer
                    ref={playerRef}
                    playbackId={experienceMediaVideo.video.asset.playbackId}
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
                        ['--media-object-fit' as any]: 'cover',
                        ['--media-object-position' as any]: 'center',
                        ...(playbackMode === 'preview' && {
                          '--controls': 'none',
                          '--media-control-bar': 'none',
                        }),
                      } as React.CSSProperties & Record<`--${string}`, string>
                    }
                    nohotkeys={playbackMode === 'preview'}
                  />

                  {playbackMode === 'preview' && (
                    <>
                      <div
                        className={`absolute inset-0 bg-foreground transition-opacity duration-300 ease-in-out ${
                          showPlayButton
                            ? 'pointer-events-auto opacity-50'
                            : 'pointer-events-none opacity-0'
                        }`}
                        onClick={handlePlayClick}
                      />

                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                          showPlayButton
                            ? 'pointer-events-auto opacity-80'
                            : 'pointer-events-none opacity-0'
                        }`}
                        style={{ zIndex: 10 }}
                      >
                        <button
                          className={`flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg transition-all duration-200 ease-in-out ${
                            showPlayButton
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
                            className={`ml-1 h-6 w-6 text-foreground transition-opacity duration-300 ease-in-out ${
                              showPlayButton ? 'opacity-100' : 'opacity-0'
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
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <div className="text-muted-foreground">Loading video...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Marquee at bottom */}
      <div ref={marqueeRef} className="flex justify-center py-6">
        <div className="relative w-full max-w-4xl overflow-hidden">
          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />

          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

          {/* Marquee content */}
          <div className="flex gap-8 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee flex gap-8">
              <span className="text-sm text-foreground/60">Residential & HOA</span>
              <span className="text-sm text-foreground/60">Commercial & Retail</span>
              <span className="text-sm text-foreground/60">Events</span>
              <span className="text-sm text-foreground/60">Construction</span>
              <span className="text-sm text-foreground/60">Residential & HOA</span>
              <span className="text-sm text-foreground/60">Commercial & Retail</span>
              <span className="text-sm text-foreground/60">Events</span>
              <span className="text-sm text-foreground/60">Construction</span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="animate-marquee flex gap-8" aria-hidden="true">
              <span className="text-sm text-foreground/60">Residential & HOA</span>
              <span className="text-sm text-foreground/60">Commercial & Retail</span>
              <span className="text-sm text-foreground/60">Events</span>
              <span className="text-sm text-foreground/60">Construction</span>
              <span className="text-sm text-foreground/60">Residential & HOA</span>
              <span className="text-sm text-foreground/60">Commercial & Retail</span>
              <span className="text-sm text-foreground/60">Events</span>
              <span className="text-sm text-foreground/60">Construction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
