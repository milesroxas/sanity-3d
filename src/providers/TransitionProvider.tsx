'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useRef } from 'react';

gsap.registerPlugin(useGSAP);

interface TransitionContextValue {
  triggerTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition() must be used inside <TransitionProvider>');
  return ctx;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  //
  // ENTRY ANIMATION (on mount):
  //   • Automatically cleaned up by useGSAP().
  //   • Runs once whenever this provider mounts.
  //
  useGSAP(
    () => {
      const overlayEl = overlayRef.current;
      const contentEl = contentRef.current;
      if (!overlayEl || !contentEl) return;

      // 1) Set "hidden" initial states:
      gsap.set(overlayEl, {
        scaleY: 1,
        transformOrigin: 'top center',
      });
      gsap.set(contentEl, {
        opacity: 0,
      });

      // 2) Timeline: overlay → uncover (1 → 0), then content → fade in (0 → 1)
      const tl = gsap.timeline();
      tl.to(overlayEl, {
        scaleY: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      });
      tl.to(
        contentEl,
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.inOut',
        },
        '<' // start at the same time overlay finishes
      );
    },
    {
      // Use the parent element as scope
      scope: overlayRef,
      dependencies: [pathname],
    }
  );

  //
  // EXIT ANIMATION (on link click):
  //   • Imperatively fade-out old content, cover with overlay, then navigate.
  //
  const triggerTransition = (href: string) => {
    const overlayEl = overlayRef.current;
    const contentEl = contentRef.current;
    if (!overlayEl || !contentEl) {
      router.push(href);
      return;
    }

    const exitTl = gsap.timeline({
      onComplete() {
        router.push(href);
      },
    });

    // A) Fade out current content (1 → 0)
    exitTl.to(contentEl, {
      opacity: 0,
      duration: 0.4,
      ease: 'power1.inOut',
    });

    // B) Slight overlap: cover with overlay (0 → 1)
    exitTl.to(
      overlayEl,
      {
        scaleY: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '>-0.1'
    );
  };

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {/* Full‐screen overlay (black) */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-50 origin-top transform bg-black"
        style={{ transform: 'scaleY(1)' }}
      />
      {/* Wrap page content so we can fade it in/out */}
      <div ref={contentRef}>{children}</div>
    </TransitionContext.Provider>
  );
}
