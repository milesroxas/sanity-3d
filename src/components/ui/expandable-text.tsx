'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';

const COLLAPSED_HEIGHT = '10em'; // Generous so line-clamp handles truncation, not clipping

interface ExpandableTextProps {
  children: React.ReactNode;
  className?: string;
  lineClamp?: number;
  isEmpty?: boolean;
}

function hasMeaningfulContent(el: HTMLElement): boolean {
  return (el.textContent?.trim() ?? '').length > 0;
}

function checkOverflow(el: HTMLElement): boolean {
  return el.scrollHeight > el.clientHeight;
}

export function ExpandableText({
  children,
  className,
  isEmpty = false,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || expanded || isEmpty) return;

    const update = () => {
      if (!hasMeaningfulContent(el)) return;
      setShowButton((prev) => prev || checkOverflow(el));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, expanded, isEmpty]);

  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      <div
        ref={contentRef}
        className={cn(
          'min-w-0 overflow-hidden text-left transition-[max-height] duration-500 ease-smooth-out',
          !expanded &&
            'line-clamp-4 text-ellipsis [&>*]:inline [&>*]:after:content-["\x20"] [&>*]:after:whitespace-pre'
        )}
        style={{
          maxHeight: expanded ? '2000px' : COLLAPSED_HEIGHT,
        }}
      >
        {children}
      </div>

      {showButton && (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-muted-foreground hover:text-foreground"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? (
            <>
              Show less
              <ChevronUpIcon className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show more
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
