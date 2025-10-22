// app/experience/layout.tsx
'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { TransitionProvider } from '@/providers/TransitionProvider';
import { useLenis } from 'lenis/react';
import { Leva } from 'leva';
import { ReactNode, useEffect } from 'react';

export default function ExperienceLayout({ children }: { children: ReactNode }) {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

  // Prevent scrolling on experience pages (prefer Lenis stop to body locking)
  const lenis = useLenis();
  useEffect(() => {
    // If Lenis is available, stop it to freeze scroll; fallback to body lock otherwise
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }

    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
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
