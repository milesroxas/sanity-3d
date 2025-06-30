'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from './dialog';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const lenis = useLenis();

  // 1) Lock/unlock Lenis + body overflow based on isOpen
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }

    return () => {
      // In case the component unmounts while still open
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen, lenis]);

  // 2) Add a global "wheel" listener on document whenever the modal is open.
  //    If the wheel event does NOT occur inside our <ScrollArea>, preventDefault().
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalWheel = (e: WheelEvent) => {
      // If the event target is somewhere inside the scroll area, do nothing.
      if (scrollAreaRef.current?.contains(e.target as Node)) {
        return;
      }
      // Otherwise, prevent any scrolling on the background
      e.preventDefault();
    };

    document.addEventListener('wheel', handleGlobalWheel, { passive: false, capture: true });
    return () => {
      document.removeEventListener('wheel', handleGlobalWheel, { capture: true });
    };
  }, [isOpen]);

  // 3) Custom wheel handler for our scroll area to manage scrollPosition state
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollAreaRef.current) return;
    const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const newPosition = scrollPosition + e.deltaY;
    (viewport as HTMLElement).scrollTop = newPosition;
    setScrollPosition(newPosition);
    e.preventDefault();
  };

  // 4) GSAP fade‐in animation when modal opens
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
      <DialogOverlay className="bg-black/50" />
      <DialogContent
        size="full"
        className="max-h-[80vh] bg-black p-0 text-white lg:h-full"
        ref={modalRef}
        onWheel={handleWheel}
      >
        <ScrollArea
          ref={scrollAreaRef}
          className="relative h-full w-full overflow-y-auto px-8 pb-12"
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
