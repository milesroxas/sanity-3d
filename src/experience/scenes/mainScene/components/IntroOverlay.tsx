import { useR3F } from '@/experience/providers/R3FContext';
import { selectBeginIntroTransition, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCallback, useMemo, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

export default function IntroOverlay() {
  const beginIntroTransition = useCameraStore(selectBeginIntroTransition);
  const [isDismissing, setIsDismissing] = useState(false);
  const { sceneContainerRef } = useR3F();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sceneInitialOpacityRef = useRef(1);

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
      const content = contentRef.current;
      const scene = resolveSceneContainer();
      if (!container || !content || !scene) return;

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
      gsap.set(content, { autoAlpha: 0, y: 24 });
      gsap.set(scene, {
        opacity: prefersReducedMotion ? targetSceneOpacity : Math.min(targetSceneOpacity, 0.05),
      });

      if (prefersReducedMotion) {
        // Snap in without animation
        gsap.set([container, content], { autoAlpha: 1, clearProps: 'all' });
        gsap.set(content, { y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.addLabel('reveal')
        .to(scene, { opacity: targetSceneOpacity, duration: 0.2 }, 'reveal')
        .to(container, { autoAlpha: 1, duration: 0.2 }, 'reveal')
        .addLabel('content', 'reveal+=0.9')
        .to(content, { autoAlpha: 1, y: 0, duration: 0.55 }, 'content');

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
      const content = contentRef.current;
      const scene = resolveSceneContainer();
      if (!container || !content || !scene) return;

      // Disable pointer events quickly to prevent double clicks
      gsap.set(container, { pointerEvents: 'none' });

      if (prefersReducedMotion) {
        // Snap out
        gsap.set([content, container], { autoAlpha: 0 });
        gsap.set(scene, { opacity: sceneInitialOpacityRef.current });
        return;
      }

      gsap
        .timeline()
        .to(
          scene,
          {
            opacity: sceneInitialOpacityRef.current,
            duration: 0.45,
            ease: 'power2.inOut',
          },
          0
        )
        .to(content, { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.inOut' })
        .to(container, { autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, '-=0.2');
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
        'fixed inset-0 z-50 flex h-full w-full items-center justify-center px-6',
        isDismissing ? 'pointer-events-none' : 'pointer-events-auto',
        // Use utilities instead of large inline styles where possible
        'backdrop-blur-sm',
      ].join(' ')}
      style={{
        background:
          'radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.9) 78%, rgba(255,255,255,1) 100%)',
      }}
    >
      <div ref={contentRef} className="max-w-2xl text-center">
        <div className="space-y-6">
          <h1 id="intro-title" className="text-3xl font-semibold tracking-tight">
            Experience Overlay Test
          </h1>
          <p id="intro-desc" className="text-base">
            Take a quick look around from above, then drop into the main experience when you are
            ready.
          </p>
          <button
            type="button"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleBegin}
            disabled={isDismissing}
          >
            Enter Experience
          </button>
        </div>
      </div>
    </div>
  );
}
