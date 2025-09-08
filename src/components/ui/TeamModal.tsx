'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
 
import { useStore } from '@/lib/store';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
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
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
 
  const setIsNavOpened = useStore(state => state.setIsNavOpened);

  // Lock/unlock scroll: coordinate with global Lenis controller and body styles
  useEffect(() => {
    if (isOpen) {
      // Inform global Lenis controller to stop (mirrors MobileNav behavior)
      setIsNavOpened(true);
      // Lock body scroll and overscroll bounce on iOS
      const prev = {
        overflow: document.body.style.overflow,
        overscroll: (document.body.style as any).overscrollBehaviorY,
      };
      document.body.style.overflow = 'hidden';
      (document.body.style as any).overscrollBehaviorY = 'none';

      return () => {
        (document.body.style as any).overscrollBehaviorY = prev.overscroll || '';
        document.body.style.overflow = prev.overflow;
        setIsNavOpened(false);
      };
    } else {
      // Ensure Lenis resumes when modal closes
      setIsNavOpened(false);
      document.body.style.overflow = '';
    }
  }, [isOpen, setIsNavOpened]);

  // Removed legacy wheel handlers in favor of native scroll with Lenis prevention flags

  // GSAP fade‐in animation when modal opens
  useGSAP(
    () => {
      if (!isOpen || !modalRef.current) return;
      const tl = gsap.timeline();

      gsap.set(imageRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(contentRef.current, { opacity: 0, y: 20 });

      tl.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      }).to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.2'
      );

      return () => {
        tl.kill();
      };
    },
    { scope: modalRef, dependencies: [isOpen] }
  );

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        size="full"
        className="max-h-[80vh] bg-black p-0 text-white lg:h-full overflow-hidden"
        ref={modalRef}
      >
        <ScrollArea
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="relative h-full w-full min-h-0 px-8 pb-12 touch-pan-y overscroll-y-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onWheel={e => e.stopPropagation()}
        >
          {image && image.asset?._id && (
            <div className="lg:max-w-1/3 pointer-events-none relative order-first aspect-square max-w-40 md:absolute md:bottom-0 md:right-[-2rem] md:-z-10 md:w-1/2 md:max-w-full lg:w-1/3">
              <Image
                ref={imageRef}
                src={urlFor(image.asset).url()}
                alt={image.alt || title}
                placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                blurDataURL={image?.asset?.metadata?.lqip || ''}
                fill
                style={{ objectFit: 'cover' }}
                quality={100}
                className="rounded-sm md:rounded-lg"
              />
            </div>
          )}
          <div ref={contentRef} className="relative z-10 flex-1 md:w-1/2 lg:pl-12">
            <DialogHeader className="sticky top-0 bg-black/50 pb-4 pt-8 text-left backdrop-blur-sm">
              <DialogTitle className="text-2xl md:text-3xl">{title}</DialogTitle>
              {role && <p className="text-md mt-2 text-gray-500">{role}</p>}
              {email && (
                <p className="mt-2 text-sm text-primary">
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              )}
            </DialogHeader>

            {bio && (
              <div className="prose prose-sm prose-p:text-white prose-headings:text-white text-white">
                {typeof bio === 'string' ? (
                  <p className="pb-2">{bio}</p>
                ) : (
                  <PortableTextRenderer value={bio} />
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
