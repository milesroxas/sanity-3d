'use client';

import { SplitText } from '@/components/split-text';
import { useBlockScrollTrigger } from '@/hooks/useBlockScrollTrigger';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import type { PortableTextBlock } from 'next-sanity';
import { useEffect, useRef } from 'react';

interface LargeCalloutProps {
  body: PortableTextBlock[];
  textAlign?: 'left' | 'center' | 'right';
  _key?: string;
  renderContext?: string;
}

// Style classes for different block styles - page context (large)
const blockStyleClasses: Record<string, string> = {
  normal: 'mb-8 max-w-4xl text-2xl text-muted-foreground lg:text-5xl/snug',
  lead: 'mb-12 max-w-4xl text-3xl font-medium text-muted-foreground lg:text-6xl/snug',
  supporting: 'mb-6 max-w-3xl text-xl text-muted-foreground lg:text-3xl/snug',
  h1: 'mb-8 max-w-4xl text-4xl font-bold lg:text-7xl/tight',
  h2: 'mb-8 max-w-4xl text-3xl font-bold lg:text-6xl/tight',
  h3: 'mb-6 max-w-4xl text-2xl font-semibold lg:text-5xl/snug',
  h4: 'mb-6 max-w-4xl text-xl font-semibold lg:text-4xl/snug',
  blockquote:
    'mb-8 max-w-3xl text-2xl italic text-muted-foreground lg:text-4xl/snug border-l-4 border-primary pl-6',
};

// Style classes for overlay context (smaller)
const overlayStyleClasses: Record<string, string> = {
  normal: 'mb-4 text-lg text-muted-foreground lg:text-2xl/relaxed',
  lead: 'mb-6 text-xl font-medium text-muted-foreground lg:text-3xl/snug',
  supporting: 'mb-4 text-base text-muted-foreground lg:text-xl/relaxed',
  h1: 'mb-4 text-2xl font-bold lg:text-4xl/tight',
  h2: 'mb-4 text-xl font-bold lg:text-3xl/tight',
  h3: 'mb-3 text-lg font-semibold lg:text-2xl/snug',
  h4: 'mb-3 text-base font-semibold lg:text-xl/snug',
  blockquote:
    'mb-4 text-lg italic text-muted-foreground lg:text-xl/relaxed border-l-4 border-primary pl-4',
};

// Alignment classes
const alignmentClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
};

// Helper to extract plain text from block children (SplitText requires string)
function extractTextFromChildren(children: any[]): string {
  if (!children || children.length === 0) return '';
  return children.map((child: any) => child.text || '').join('');
}

export default function LargeCallout({
  body,
  textAlign = 'left',
  _key,
  renderContext,
}: LargeCalloutProps) {
  const splitRefs = useRef<Array<any>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { blockRef, createScrollTrigger, runAnimations } = useBlockScrollTrigger(_key);

  const isOverlay = renderContext === 'overlay';
  const styleClasses = isOverlay ? overlayStyleClasses : blockStyleClasses;

  // Animation effect - different behavior for overlay vs page context
  useEffect(() => {
    // Ensure refs are ready
    const effectiveRef = isOverlay ? containerRef : blockRef;
    if (!effectiveRef.current || splitRefs.current.length === 0) return;

    const timeout = setTimeout(() => {
      if (isOverlay) {
        // Overlay: Simple fade-in animation without scroll trigger
        splitRefs.current.forEach(splitInstance => {
          if (!splitInstance?.words) return;

          gsap.fromTo(
            splitInstance.words,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.03,
            }
          );
        });
      } else {
        // Page context: Scroll-triggered animation
        runAnimations(() => {
          splitRefs.current.forEach((splitInstance, index) => {
            if (!splitInstance?.words || !splitInstance.elements?.[0]) return;

            gsap.from(splitInstance.words, {
              opacity: 0,
              duration: 1,
              ease: 'power1.out',
              stagger: 0.08,
              scrollTrigger: createScrollTrigger(
                blockRef.current!,
                {
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                  once: true,
                  markers: false,
                },
                index
              ),
            });
          });
        });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [body, _key, runAnimations, createScrollTrigger, blockRef, isOverlay]);

  const alignClass = alignmentClasses[textAlign] || alignmentClasses.left;

  // Overlay: no container class, simpler padding
  if (isOverlay) {
    return (
      <div ref={containerRef} data-block-id={_key} className="large-callout-overlay">
        {body && Array.isArray(body) && body.length > 0 ? (
          <div className="py-2">
            {body.map((block, index) => {
              if (block._type !== 'block') return null;

              const style = (block.style as string) || 'normal';
              const styleClass = styleClasses[style] || styleClasses.normal;

              return (
                <SplitText
                  key={block._key || index}
                  type="words"
                  className={cn(styleClass, alignClass)}
                  ref={splitInstance => {
                    if (splitRefs.current) {
                      splitRefs.current[index] = splitInstance;
                    }
                  }}
                >
                  {extractTextFromChildren(block.children as any[])}
                </SplitText>
              );
            })}
          </div>
        ) : (
          <p className={cn(styleClasses.normal, alignClass)}>No content available</p>
        )}
      </div>
    );
  }

  // Page context: with container
  return (
    <div className="container">
      <div ref={blockRef} data-block-id={_key} className="large-callout-container">
        {body && Array.isArray(body) && body.length > 0 ? (
          <div className="py-16 lg:pb-12 lg:pt-32">
            {body.map((block, index) => {
              if (block._type !== 'block') return null;

              const style = (block.style as string) || 'normal';
              const styleClass = styleClasses[style] || styleClasses.normal;

              return (
                <SplitText
                  key={block._key || index}
                  type="words"
                  className={cn(styleClass, alignClass)}
                  ref={splitInstance => {
                    if (splitRefs.current) {
                      splitRefs.current[index] = splitInstance;
                    }
                  }}
                >
                  {extractTextFromChildren(block.children as any[])}
                </SplitText>
              );
            })}
          </div>
        ) : (
          <p className={cn(styleClasses.normal, alignClass)}>No content available</p>
        )}
      </div>
    </div>
  );
}
