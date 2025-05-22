'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { ISectionContainerProps } from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface SplitCardsItemProps {
  color: ISectionContainerProps['color'];
  tagLine: string;
  title: string;
  body: any;
}

export default function SplitCardsItem({
  color,
  tagLine,
  title,
  body,
}: Partial<SplitCardsItemProps>) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 1,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        'flex flex-col items-start rounded-md border border-primary px-6 py-6 transition-colors duration-1000 ease-in-out lg:px-8 lg:py-8',
        isInView ? 'bg-foreground/85' : 'bg-background',
        color === 'primary' ? 'text-background' : undefined
      )}
    >
      {tagLine && (
        <div
          className={cn(
            'text-2xl font-bold transition-colors duration-1000 ease-in-out lg:text-3xl',
            isInView ? 'text-background' : 'text-foreground',
            color === 'primary' ? 'text-background' : undefined
          )}
        >
          {tagLine}
        </div>
      )}
      {title && (
        <div
          className={cn(
            'my-2 text-xl font-semibold transition-colors duration-1000 ease-in-out',
            isInView ? 'text-background' : 'text-foreground',
            color === 'primary' ? 'text-background' : undefined
          )}
        >
          {title}
        </div>
      )}
      {body && (
        <div
          className={cn(
            'transition-colors duration-1000 ease-in-out',
            isInView ? 'text-background' : 'text-foreground'
          )}
        >
          <PortableTextRenderer value={body} />
        </div>
      )}
    </motion.div>
  );
}
