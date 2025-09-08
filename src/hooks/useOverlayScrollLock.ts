import { useEffect, useMemo } from 'react';
import type { CSSProperties, WheelEvent } from 'react';
import { useScrollLockStore } from '@/lib/store';

type Overscroll = 'none' | 'contain' | 'auto';

export type OverlayScrollLockOptions = {
  // Whether to apply body overflow/overscroll locking while open
  lockBody?: boolean;
  // Which overscroll behavior to apply to body while open
  overscrollBehaviorY?: Overscroll;
  // Add Lenis prevent flags to scrollable element
  preventLenis?: boolean;
  // Stop wheel propagation to avoid background scroll bleed
  stopWheelPropagation?: boolean;
  // Enable iOS momentum scrolling on the scrollable element
  webkitMomentumScroll?: boolean;
  // Extra classes to add to scrollable element
  className?: string;
};

type ScrollAreaProps = {
  className?: string;
  style?: CSSProperties;
  onWheel?: (e: WheelEvent) => void;
  // Lenis prevention flags
  'data-lenis-prevent'?: true;
  'data-lenis-prevent-wheel'?: true;
  'data-lenis-prevent-touch'?: true;
};

/**
 * Centralizes overlay scroll locking and touch-friendly scroll props.
 * - Ref-counted Lenis stop/start via useScrollLockStore
 * - Optional body overflow + overscrollBehaviorY lock for iOS
 * - Returns props to spread onto scrollable content
 */
export function useOverlayScrollLock(isOpen: boolean, options: OverlayScrollLockOptions = {}) {
  const {
    lockBody = true,
    overscrollBehaviorY = 'none',
    preventLenis = true,
    stopWheelPropagation = true,
    webkitMomentumScroll = true,
    className = '',
  } = options;

  const { acquireScrollLock, releaseScrollLock } = useScrollLockStore();

  // Manage global scroll lock + body styles
  useEffect(() => {
    if (!isOpen) return;

    acquireScrollLock();

    let prevOverflow = '';
    let prevOverscroll = '';
    if (typeof document !== 'undefined' && lockBody) {
      prevOverflow = document.body.style.overflow;
      prevOverscroll = (document.body.style as any).overscrollBehaviorY;
      document.body.style.overflow = 'hidden';
      (document.body.style as any).overscrollBehaviorY = overscrollBehaviorY;
    }

    return () => {
      if (typeof document !== 'undefined' && lockBody) {
        (document.body.style as any).overscrollBehaviorY = prevOverscroll || '';
        document.body.style.overflow = prevOverflow;
      }
      releaseScrollLock();
    };
  }, [isOpen, lockBody, overscrollBehaviorY, acquireScrollLock, releaseScrollLock]);

  const scrollAreaProps: ScrollAreaProps = useMemo(() => {
    const props: ScrollAreaProps = {
      className: [
        'touch-pan-y overscroll-y-contain',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    };

    if (preventLenis) {
      props['data-lenis-prevent'] = true;
      props['data-lenis-prevent-wheel'] = true;
      props['data-lenis-prevent-touch'] = true;
    }

    if (webkitMomentumScroll) {
      props.style = { WebkitOverflowScrolling: 'touch' };
    }

    if (stopWheelPropagation) {
      props.onWheel = e => e.stopPropagation();
    }

    return props;
  }, [preventLenis, stopWheelPropagation, webkitMomentumScroll, className]);

  return { scrollAreaProps } as const;
}

