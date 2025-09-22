'use client';

import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useRef } from 'react';

gsap.registerPlugin(useGSAP);

interface TransitionContextValue {
  triggerTransition: (href: string, onBeforeNavigate?: () => void) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition() must be used inside <TransitionProvider>');
  return ctx;
}

export function TransitionProvider({
  children,
  overlayClassName,
  disableEntry,
}: {
  children: React.ReactNode;
  overlayClassName?: string;
  disableEntry?: boolean;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isTransitioningRef = useRef(false);

  //
  // ENTRY ANIMATION (on mount):
  //   • Automatically cleaned up by useGSAP().
  //   • Runs once whenever this provider mounts.
  //
  useGSAP(
    () => {
      if (disableEntry) return;
      const overlayEl = overlayRef.current;
      const contentEl = contentRef.current;
      if (!overlayEl || !contentEl) return;

      gsap.set(overlayEl, {
        opacity: 1,
      });
      gsap.set(contentEl, {
        opacity: 0,
      });

      const tl = gsap.timeline();
      tl.to(overlayEl, {
        opacity: 0,
        duration: 0.6,
        ease: 'power1.inOut',
      });
      tl.to(
        contentEl,
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.inOut',
        },
        '<'
      );
    },
    {
      scope: overlayRef,
      dependencies: [pathname, disableEntry],
    }
  );

  //
  // EXIT ANIMATION (on link click):
  //
  const triggerTransition = (href: string, onBeforeNavigate?: () => void) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    const overlayEl = overlayRef.current;
    const contentEl = contentRef.current;
    if (!overlayEl || !contentEl) {
      const isExternal =
        /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
      if (isExternal) {
        window.location.href = href;
      } else {
        router.push(href);
      }
      return;
    }

    const isExternal =
      /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    const exitTl = gsap.timeline({
      onComplete() {
        try {
          onBeforeNavigate?.();
        } finally {
          if (isExternal) {
            window.location.href = href;
          } else {
            router.push(href);
          }
        }
      },
    });

    // A) Fade out current content (1 → 0)
    exitTl.to(contentEl, {
      opacity: 0,
      duration: 0.4,
      ease: 'power1.inOut',
    });

    // B) Slight overlap: cover with overlay via fade (0 → 1)
    exitTl.to(
      overlayEl,
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power1.inOut',
      },
      '>-0.1'
    );
  };

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {/* Full‐screen overlay (black) */}
      <div
        ref={overlayRef}
        className={cn('pointer-events-none fixed inset-0 z-50', overlayClassName ?? 'bg-black')}
        style={{ opacity: 1 }}
      />
      {/* Wrap page content so we can fade it in/out */}
      <div ref={contentRef}>{children}</div>
    </TransitionContext.Provider>
  );
}

export function useOptionalTransition() {
  return useContext(TransitionContext);
}
