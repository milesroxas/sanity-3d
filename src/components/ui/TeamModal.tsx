'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
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
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isOpen || !modalRef.current) return;

      const tl = gsap.timeline();

      // Initial state
      gsap.set(imageRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(contentRef.current, { opacity: 0, y: 20 });

      // Animation sequence
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

      // Cleanup function
      return () => {
        tl.kill();
      };
    },
    { scope: modalRef, dependencies: [isOpen] }
  );

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent size="xl" className="overflow-hidden p-0" ref={modalRef}>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          <div className="relative aspect-square">
            {image && image.asset?._id && (
              <div className="relative h-full w-full">
                <Image
                  ref={imageRef}
                  src={urlFor(image.asset).url()}
                  alt={image.alt || title}
                  placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                  blurDataURL={image?.asset?.metadata?.lqip || ''}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  quality={100}
                />
              </div>
            )}
          </div>
          <div ref={contentRef} className="flex flex-col justify-center p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl md:text-3xl">{title}</DialogTitle>
              {role && <p className="text-md mt-2 text-muted-foreground">{role}</p>}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
