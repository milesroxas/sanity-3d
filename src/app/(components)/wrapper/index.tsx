'use client';

import type { LenisOptions } from 'lenis';
import { usePathname } from 'next/navigation';
import { Lenis } from '../lenis';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lenis?: boolean | LenisOptions;
}
export function Wrapper({ children, className, lenis = true, ...props }: WrapperProps) {
  const pathname = usePathname();

  return (
    <>
      <main>{children}</main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </>
  );
}
