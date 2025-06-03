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
      <DialogOverlay className="bg-black" />
      <DialogContent
        size="full"
        className="overflow-hidden bg-black p-0 text-white"
        ref={modalRef}
        onWheel={handleWheel}
      >
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {/* ── IMAGE COLUMN ── */}
          <div className="flex flex-col justify-end pr-8">
            {image && image.asset?._id && (
              <div className="relative mx-auto aspect-square max-h-[80vh] w-11/12 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                <Image
                  ref={imageRef}
                  src={urlFor(image.asset).url()}
                  alt={image.alt || title}
                  placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                  blurDataURL={image?.asset?.metadata?.lqip || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={100}
                />
              </div>
            )}
          </div>

          {/* ── CONTENT COLUMN ── */}
          <div ref={contentRef} className="flex flex-col justify-center p-8">
            <ScrollArea
              ref={scrollAreaRef}
              className="max-h-[80vh] overflow-y-auto pb-8"
              // We still stopPropagation here so the ScrollArea's own wheel logic takes precedence.
              onWheel={e => e.stopPropagation()}
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl md:text-3xl">{title}</DialogTitle>
                {role && <p className="text-md mt-2 text-gray-500">{role}</p>}
                {email && (
                  <p className="mt-2 text-sm text-primary">
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                )}
              </DialogHeader>

              {bio && (
                <div className="prose prose-sm max-w-none">
                  {typeof bio === 'string' ? <p>{bio}</p> : <PortableTextRenderer value={bio} />}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
