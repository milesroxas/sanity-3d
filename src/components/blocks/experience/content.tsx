'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { useExpandedContentStore } from '@/experience/scenes/store/expandedContentStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { PortableTextBlock } from 'next-sanity';
import { useRef, useState } from 'react';

export interface ContentProps {
  heading: string;
  sectionBody: PortableTextBlock[];
  links: Sanity.Link[];
  blocks?: Sanity.Block[];
}

export default function ExpandedContent({ heading, sectionBody, links, blocks }: ContentProps) {
  const { title, setExpandedContent, closeExpandedContent } = useExpandedContentStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const isActive = title === heading;

  // Handle close with proper timing
  const handleClose = () => {
    setIsClosing(true);
  };

  const handleClick = () => {
    if (isActive) {
      handleClose();
    } else if (blocks && blocks.length > 0) {
      setExpandedContent(heading, blocks);
    }
  };

  // GSAP animations using useGSAP hook
  useGSAP(
    () => {
      if (!buttonRef.current) return;

      if (isClosing) {
        // Button close animation
        const tl = gsap.timeline({
          onComplete: () => {
            // Give MarkerContentOverlay time to start its animation
            setTimeout(() => {
              setIsClosing(false);
              closeExpandedContent();
            }, 100); // Delay to ensure overlay animation starts
          },
        });

        // Animate button during close
        tl.to(buttonRef.current, {
          scale: 0.98,
          opacity: 0.7,
          duration: 0.15,
          ease: 'power2.in',
        }).to(buttonRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    },
    { dependencies: [isClosing] }
  );

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={isClosing} // Prevent clicks during animation
      className={`flex flex-col items-center space-y-2 rounded-md border px-4 py-4 text-left align-middle transition-all duration-300 ease-out ${
        isActive
          ? 'border-primary bg-green-100 text-slate-900'
          : 'border-gray-200 bg-white/80 hover:border-primary hover:bg-green-50 hover:text-slate-800'
      } ${isClosing ? 'pointer-events-none' : ''}`}
    >
      <div className="flex flex-col gap-1 text-sm">
        {heading && (
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-xl font-medium">{heading}</h3>
            {isActive ? <CircleMinus className="h-4 w-4" /> : <CirclePlus className="h-4 w-4" />}
          </div>
        )}
        {sectionBody && <PortableTextRenderer value={sectionBody} />}
        {links && <LinkButtons links={links} />}
      </div>
    </button>
  );
}
