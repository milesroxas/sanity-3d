'use client';

import { SplitText } from '@/components/split-text';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { PortableTextBlock } from 'next-sanity';
import { useRef } from 'react';

export default function LargeCalloutClient({
  body,
  _key,
}: {
  body: PortableTextBlock[];
  _key?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<Array<any | undefined>>([]);

  useGSAP(
    () => {
      splitRefs.current.forEach((splitInstance, index) => {
        if (!splitInstance || !splitInstance.words) return;

        const elementId = `large-callout-${_key}-${index}`;
        const element = splitInstance.elements[0];

        gsap.from(splitInstance.words, {
          opacity: 0,
          duration: 1,
          ease: 'power1.out',
          stagger: 0.08,
          scrollTrigger: {
            id: elementId,
            trigger: element,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
            markers: process.env.NODE_ENV === 'development',
          },
        });
      });
    },
    { scope: containerRef, dependencies: [body, _key] }
  );

  const paragraphClass = 'mb-8 max-w-4xl text-2xl text-muted-foreground lg:text-5xl/snug';

  return (
    <div ref={containerRef} data-block-id={_key} className="large-callout-container">
      {body && Array.isArray(body) && body.length > 0 ? (
        <div className="py-16 lg:py-32">
          {/* Custom renderer that uses SplitText for each paragraph */}
          {body.map((block, index) => {
            if (block._type === 'block' && block.style === 'normal') {
              return (
                <SplitText
                  key={index}
                  type="words"
                  className={paragraphClass}
                  ref={splitInstance => {
                    // Store the split text instance
                    if (splitRefs.current) {
                      splitRefs.current[index] = splitInstance;
                    }
                  }}
                >
                  {block.children?.map((child: any) => child.text).join(' ') || ''}
                </SplitText>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <p className={paragraphClass}>No content available</p>
      )}
    </div>
  );
}
