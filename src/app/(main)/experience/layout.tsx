// app/experience/layout.tsx
'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';
import { ReactNode, useEffect } from 'react';

export default function ExperienceLayout({ children }: { children: ReactNode }) {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

  // Prevent scrolling on experience pages
  useEffect(() => {
    // Save original styles
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    // Apply no-scroll styles
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  return (
    <R3FProvider>
      {/* Non-R3F components render here */}

      <main className="mt-8">{children}</main>

      {/* Hide Leva in production, show in development */}
      <Leva hidden={isProduction} />
    </R3FProvider>
  );
}
