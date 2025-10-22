'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { TransitionProvider } from '@/providers/TransitionProvider';
import { useLenis } from 'lenis/react';
import { Leva } from 'leva';
import { ReactNode, useEffect } from 'react';

export default function ExperienceWrapper({ children }: { children: ReactNode }) {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

  // Prevent scrolling on experience pages (prefer Lenis stop to body locking)
  const lenis = useLenis();
  useEffect(() => {
    const html = document.documentElement;

    // Remove scrollbar gutter since scrolling is disabled
    html.style.scrollbarGutter = '';
    html.style.overflowY = '';

    // If Lenis is available, stop it to freeze scroll; fallback to body lock otherwise
    if (lenis) {
      lenis.stop();
      return () => {
        lenis.start();
        // Restore gutter when returning to scrollable context
        html.style.scrollbarGutter = 'stable';
        html.style.overflowY = 'scroll';
      };
    }

    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
      // Restore gutter when leaving experience
      html.style.scrollbarGutter = 'stable';
      html.style.overflowY = 'scroll';
    };
  }, [lenis]);

  return (
    <TransitionProvider overlayClassName="bg-white">
      <R3FProvider>
        {/* Non-R3F components render here */}

        <main>{children}</main>

        {/* Hide Leva in production, show in development */}
        <Leva hidden={isProduction} />
      </R3FProvider>
    </TransitionProvider>
  );
}
