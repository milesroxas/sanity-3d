'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';
import LandingWrapper from './LandingWrapper';
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'development';

export default function LandingPage() {
  return (
    <R3FProvider>
      <LandingWrapper />

      {/* Hide Leva in production, show in development */}
      <Leva hidden={isProduction} />
    </R3FProvider>
  );
}
