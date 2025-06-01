'use client';
import { useTransition } from '@/providers/TransitionProvider';
import Link from 'next/link';
import { useRef } from 'react';

export default function AnimatedLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { triggerTransition } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    triggerTransition(href); // fade‐out → cover → navigate
  };

  return (
    <Link ref={linkRef} href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
