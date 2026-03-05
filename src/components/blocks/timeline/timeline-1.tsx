'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { ExpandableText } from '@/components/ui/expandable-text';
import { cn, extractPlainText } from '@/lib/utils';
import { PortableTextBlock } from '@portabletext/react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export interface Timeline1Props {
  color: 'primary' | 'secondary' | 'card' | 'accent' | 'destructive' | 'background' | 'transparent';
  title: string;
  tagLine: string | null;
  body: PortableTextBlock[];
  image: Sanity.Image;
}

export default function Timeline1({ color, title, tagLine, body }: Partial<Timeline1Props>) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className="flex w-full">
      {/* Date Column (Desktop) */}
      <div className="hidden w-32 flex-col items-end pr-8 pt-8 lg:flex">
        <motion.div
          className="flex h-8 items-center justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={
            isInView && {
              opacity: 1,
              x: 0,
            }
          }
          transition={{
            duration: 0.8,
            ease: [0.21, 0.45, 0.27, 0.9],
            delay: 0.6,
          }}
        >
          <span className="whitespace-nowrap text-lg font-bold text-muted-foreground">
            {tagLine}
          </span>
        </motion.div>
      </div>

      {/* Timeline Content Column */}
      <div className="relative flex-1 border-l-2 border-primary/20 py-8 pl-12 lg:pl-16">
        <motion.div
          className="absolute left-[-0.55rem] top-[2.375rem] h-4 w-4 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] ring-8 ring-primary/20 backdrop-blur-[2px]"
          initial={{
            scale: 0,
            opacity: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
          animate={
            isInView && {
              scale: 1,
              opacity: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }
          }
          transition={{
            duration: 0.5,
            ease: 'backOut',
            delay: 0.6,
          }}
        />
        <div className={cn(color === 'primary' ? 'text-background' : undefined)}>
          <h3 className="mb-2 flex flex-col justify-start text-xl font-bold">
            <motion.span
              className="mb-1 text-sm text-muted-foreground lg:hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={
                isInView && {
                  opacity: 1,
                  y: 0,
                }
              }
              transition={{
                duration: 0.8,
                ease: [0.21, 0.45, 0.27, 0.9],
                delay: 0.6,
              }}
            >
              {tagLine}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={
                isInView && {
                  opacity: 1,
                  y: 0,
                }
              }
              transition={{
                duration: 0.8,
                ease: [0.21, 0.45, 0.27, 0.9],
                delay: 0.6,
              }}
            >
              {title}
            </motion.span>
          </h3>
          {body && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView && {
                  opacity: 1,
                  y: 0,
                }
              }
              transition={{
                duration: 0.8,
                ease: [0.21, 0.45, 0.27, 0.9],
                delay: 0.7,
              }}
            >
              <ExpandableText
                isEmpty={
                  !body?.length ||
                  !extractPlainText(
                    body as { _type: string; children?: { text: string }[] }[]
                  )?.trim()
                }
              >
                <PortableTextRenderer value={body} />
              </ExpandableText>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
