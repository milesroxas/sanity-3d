'use client';

import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'; // Global GSAP instance synced with Tempus via <GSAP> component
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stegaClean } from 'next-sanity';
import { Fragment, useMemo, useRef } from 'react';
import SplitCardsList from './split-cards-list';
import SplitContent from './split-content';
import SplitImage from './split-image';
import SplitInfoList from './split-info-list';
import SplitVideo from './split-video';

const componentMap = {
  'split-content': SplitContent,
  'split-cards-list': SplitCardsList,
  'split-image': SplitImage,
  'split-info-list': SplitInfoList,
  'split-video': SplitVideo,
} as const;

export default function SplitRow({
  padding,
  colorVariant,
  themeVariant,
  styleVariant,
  noGap,
  splitColumns,
}: Partial<{
  padding: ISectionPadding;
  colorVariant: ISectionContainerProps['color'];
  themeVariant: ISectionContainerProps['theme'];
  styleVariant: ISectionContainerProps['style'];
  noGap: boolean;
  splitColumns: Array<{
    _type: 'split-content' | 'split-cards-list' | 'split-image' | 'split-info-list' | 'split-video';
    _key: string;
  }>;
}>) {
  const color = stegaClean(colorVariant);
  const theme = stegaClean(themeVariant);
  const style = stegaClean(styleVariant);
  const isOffset = style === 'offset';
  const isDarkTheme = theme === 'dark';

  // Create refs for the containers
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Find image index and content index
  const imageIndex = splitColumns?.findIndex(col => col._type === 'split-image') ?? -1;
  const contentIndex = splitColumns?.findIndex(col => col._type === 'split-content') ?? -1;

  // Only apply parallax if we have exactly one image and one content in offset mode
  const hasExactlyImageAndContent = useMemo(() => {
    if (!splitColumns) return false;

    // Check if there's exactly one split-image and one split-content
    const imageCount = splitColumns.filter(col => col._type === 'split-image').length;
    const contentCount = splitColumns.filter(col => col._type === 'split-content').length;

    return imageCount === 1 && contentCount === 1;
  }, [splitColumns]);

  // Should apply parallax only when in offset mode with exactly one image and one content
  const shouldApplyParallax = isOffset && hasExactlyImageAndContent;

  // Generate a stable key for the section based on component types and keys
  const sectionKey = useMemo(() => {
    if (!splitColumns) return 'split-row-empty';
    return `split-row-${splitColumns.map(col => `${col._type}-${col._key}`).join('-')}`;
  }, [splitColumns]);

  // Initialize GSAP ScrollTrigger
  useGSAP(
    () => {
      // Skip if we don't have section ref
      if (!sectionRef.current) return;

      // Clear any existing animations first
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([imageRef.current, contentRef.current, sectionRef.current]);

      // Only apply background animation for dark theme
      if (isDarkTheme) {
        // Find the parent section element - direct parent of our content div
        const sectionElement = sectionRef.current.closest('.bg-slate-950');

        if (sectionElement) {
          // Create animation for the background color transition
          gsap.fromTo(
            sectionElement,
            {
              backgroundColor: 'rgba(17, 24, 39, 0)', // dark transparent
            },
            {
              backgroundColor: 'rgba(17, 24, 39, 1)', // dark solid
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'top 30%',
                scrub: true,
              },
            }
          );
        }
      }

      // Skip the rest if not in parallax mode
      if (!shouldApplyParallax || !imageRef.current || !contentRef.current) return;

      // Create parallax effect for image
      const imageTween = gsap.fromTo(
        imageRef.current,
        { y: -50 },
        {
          y: 50,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Add subtle rotation to image for enhanced depth
      const rotationTween = gsap.fromTo(
        imageRef.current,
        { rotationZ: -1, scale: 1.05 },
        {
          rotationZ: 1,
          scale: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Create reverse parallax effect for content with increased movement
      const contentTween = gsap.fromTo(
        contentRef.current,
        { y: 80 },
        {
          y: -80,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Add subtle scale effect to content
      const scaleTween = gsap.fromTo(
        contentRef.current,
        { scale: 0.98 },
        {
          scale: 1.02,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Return a cleanup function to kill all ScrollTrigger instances when component unmounts
      return () => {
        ScrollTrigger.getAll().forEach(trigger => {
          trigger.kill();
        });
        if (shouldApplyParallax) {
          imageTween.scrollTrigger?.kill();
          rotationTween.scrollTrigger?.kill();
          contentTween.scrollTrigger?.kill();
          scaleTween.scrollTrigger?.kill();
        }
      };
    },
    { scope: sectionRef, dependencies: [shouldApplyParallax, sectionKey, isDarkTheme] }
  );

  if (!splitColumns || splitColumns.length === 0) {
    return null;
  }

  return (
    <Fragment key={`section-${sectionKey}`}>
      <SectionContainer
        color={color}
        padding={padding}
        theme={theme}
        style={style}
        className="transition-colors duration-700"
      >
        <div
          ref={sectionRef}
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2',
            noGap ? 'gap-0' : shouldApplyParallax ? 'gap-12' : 'gap-12 lg:gap-20',
            shouldApplyParallax
              ? 'lg:relative lg:min-h-[38rem] lg:items-center lg:justify-items-center lg:overflow-hidden'
              : '',
            !isOffset ? 'lg:items-center' : ''
          )}
        >
          {splitColumns.map((block, index) => {
            const Component = componentMap[block._type as keyof typeof componentMap];
            if (!Component) {
              return <div data-type={block._type} key={block._key} />;
            }

            const isImage = block._type === 'split-image';
            const isContent = block._type === 'split-content';

            // Calculate position classes based on component order
            const positionClasses = (() => {
              if (!shouldApplyParallax) return '';

              if (isContent) {
                if (contentIndex < imageIndex) {
                  // Content first, image second - overlap right
                  return 'lg:ml-0 lg:mr-[-30%] lg:self-center lg:justify-self-end';
                } else {
                  // Image first, content second - overlap left
                  return 'lg:ml-[-30%] lg:mr-0 lg:self-center lg:justify-self-start';
                }
              }

              if (isImage) {
                if (imageIndex < contentIndex) {
                  // Image first, content second
                  return 'lg:ml-0 lg:mr-0 lg:justify-self-start';
                } else {
                  // Content first, image second
                  return 'lg:ml-0 lg:mr-0 lg:justify-self-end';
                }
              }

              return '';
            })();

            return (
              <div
                key={`${block._type}-${block._key}-${index}`}
                ref={
                  shouldApplyParallax && isImage
                    ? imageRef
                    : shouldApplyParallax && isContent
                      ? contentRef
                      : null
                }
                className={cn(
                  isOffset && isImage ? 'lg:relative lg:h-full lg:w-full lg:overflow-hidden' : '',
                  isOffset && isContent ? 'lg:relative lg:z-10' : '',
                  isOffset && isImage ? 'lg:z-0' : '',
                  !isOffset ? 'flex h-full w-full items-center justify-center' : '',
                  positionClasses
                )}
              >
                <Component
                  {...block}
                  color={color}
                  noGap={noGap}
                  styleVariant={style}
                  themeVariant={theme}
                />
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </Fragment>
  );
}
