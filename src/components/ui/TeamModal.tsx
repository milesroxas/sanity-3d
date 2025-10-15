'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { useOverlayScrollLock } from '@/hooks/useOverlayScrollLock';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

interface TeamModalProps {
  title: string;
  role: string;
  image: any;
  bio: any;
  email?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamModal({
  title,
  role,
  image,
  bio,
  email,
  isOpen,
  onClose,
}: TeamModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open. Let DialogContent handle vertical scroll on mobile,
  // and the right column handle scroll on large screens.
  const { scrollAreaProps } = useOverlayScrollLock(isOpen, {
    lockBody: true,
    overscrollBehaviorY: 'none',
    preventLenis: true,
    stopWheelPropagation: true,
    webkitMomentumScroll: true,
  });
  const { className: overlayClassName, ...overlayProps } = scrollAreaProps;

  useGSAP(
    () => {
      if (!isOpen || !modalRef.current) return;
      gsap.set([leftColRef.current, rightColRef.current], { opacity: 0, y: 12 });
      const tl = gsap.timeline();
      tl.to(leftColRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }).to(
        rightColRef.current,
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        '-=0.15'
      );
      return () => tl.kill();
    },
    { scope: modalRef, dependencies: [isOpen] }
  );

  const imageUrl = image?.asset?._id ? urlFor(image.asset).url() : null;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        ref={modalRef}
        size="full"
        className="max-h-[80vh] overflow-y-auto bg-background p-0 text-foreground md:max-w-3xl lg:max-h-[80vh] lg:overflow-hidden"
      >
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        <div className="grid max-h-[inherit] min-h-0 grid-cols-1 grid-rows-[auto_1fr] lg:h-[80vh] lg:max-h-[80vh] lg:grid-cols-[380px_1fr] lg:grid-rows-1">
          {/* Left: image and meta */}
          <div
            ref={leftColRef}
            className="flex min-h-0 items-center gap-6 border-b border-border p-6 lg:flex-col lg:items-start lg:border-b-0 lg:border-r lg:p-8"
          >
            {imageUrl && (
              <div className="relative aspect-[1/1] w-[25%] overflow-hidden rounded-xl bg-muted lg:w-full">
                <Image
                  src={imageUrl}
                  alt={image?.alt || title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                  priority
                  placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                  blurDataURL={image?.asset?.metadata?.lqip || ''}
                  quality={90}
                />
              </div>
            )}

            <div className="space-y-1">
              <h2 className="text-lg font-semibold leading-tight lg:text-2xl">{title}</h2>
              {role ? <p className="text-sm text-muted-foreground">{role}</p> : null}
              {email ? (
                <p className="text-sm">
                  <a
                    href={`mailto:${email}`}
                    className="underline underline-offset-4 hover:no-underline"
                  >
                    {email}
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          <div ref={rightColRef} className="min-h-0">
            <ScrollArea
              className={`h-full w-full lg:h-full ${overlayClassName || ''}`}
              {...overlayProps}
            >
              <div className="p-6 md:p-8">
                {bio ? (
                  <div className="prose prose-sm prose-headings:mb-2 prose-p:mb-3 dark:prose-invert max-w-none">
                    {typeof bio === 'string' ? <p>{bio}</p> : <PortableTextRenderer value={bio} />}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Bio coming soon.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
