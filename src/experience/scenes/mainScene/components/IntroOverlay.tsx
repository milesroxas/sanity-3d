import { selectBeginIntroTransition, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

export default function IntroOverlay() {
  // Use selector for optimal performance (actions don't cause re-renders but good practice)
  const beginIntroTransition = useCameraStore(selectBeginIntroTransition);
  const [isDismissing, setIsDismissing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Entry animation on mount
  useGSAP(
    () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      gsap.set(container, { autoAlpha: 0 });
      gsap.set(content, { autoAlpha: 0, y: 24 });

      gsap
        .timeline()
        .to(container, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' })
        .to(content, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35');
    },
    { scope: containerRef }
  );

  // Exit animation when dismissing
  useGSAP(
    () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content || !isDismissing) return;

      container.style.pointerEvents = 'none';

      gsap
        .timeline()
        .to(content, {
          autoAlpha: 0,
          y: -24,
          duration: 0.35,
          ease: 'power2.inOut',
        })
        .to(
          container,
          {
            autoAlpha: 0,
            duration: 0.45,
            ease: 'power2.inOut',
          },
          '-=0.2'
        );
    },
    { dependencies: [isDismissing], scope: containerRef }
  );

  const { contextSafe } = useGSAP({ scope: containerRef });
  const handleBegin = contextSafe(() => {
    if (isDismissing) return;
    setIsDismissing(true);
    // Start camera transition immediately so it's not interrupted by component unmount
    beginIntroTransition();
  });

  return (
    <div
      ref={containerRef}
      style={{ pointerEvents: isDismissing ? 'none' : 'auto' }}
      className="fixed inset-0 flex h-full w-full items-center justify-center bg-black/70 px-6 text-white"
    >
      <div ref={contentRef} className="max-w-2xl text-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight">Experience Overlay Test</h1>
          <p className="text-base text-white/80">
            Take a quick look around from above, then drop into the main experience when you&apos;re
            ready.
          </p>
          <button
            type="button"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
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
