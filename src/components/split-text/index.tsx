'use client';

import cn from 'clsx';
import { gsap } from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useResizeObserver } from 'hamo';
import {
  forwardRef,
  type Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import s from './split-text.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(GSAPSplitText);
}

function replaceFromNode(node: HTMLSpanElement, string: string, replacement = string) {
  node.innerHTML = node.innerHTML.replace(
    new RegExp(`(?!<[^>]+)${string}(?![^<]+>)`, 'g'),
    replacement
  );
}

type SplitTextProps = {
  children: string;
  className?: string;
  type: 'lines' | 'words' | 'chars';
};

export const SplitText = forwardRef<GSAPSplitText | undefined, SplitTextProps>(
  ({ children, className, type }, ref: Ref<GSAPSplitText | undefined>) => {
    const elementRef = useRef<HTMLSpanElement>(null!);
    const fallbackRef = useRef<HTMLSpanElement>(null!);
    const [setRectRef, entry] = useResizeObserver();
    const rect = entry?.contentRect;

    const [splitted, setSplitted] = useState<GSAPSplitText | undefined>();

    useImperativeHandle(ref, () => splitted, [splitted]);

    // Re‑run on resize or type change
    // biome-ignore lint/correctness/useExhaustiveDependencies: rect is intentional
    useEffect(() => {
      if (!elementRef.current) return;

      replaceFromNode(fallbackRef.current, '-', '‑');

      const ignored = Array.from(
        elementRef.current.querySelectorAll<HTMLElement>('[data-ignore-split-text]')
      );
      ignored.forEach(el => {
        el.innerText = el.innerText.replaceAll(' ', '\u00A0');
      });

      const split = new GSAPSplitText(elementRef.current, {
        tag: 'span',
        type,
        linesClass: 'line',
        wordsClass: 'word',
        charsClass: 'char',
      });
      setSplitted(split);

      return () => {
        split.revert();
        setSplitted(undefined);
      };
    }, [rect, type]);

    const render = useMemo(
      () => (
        <span className={cn(s.wrapper, className)}>
          <span ref={elementRef} className={s.splitText} aria-hidden>
            {children}
          </span>
          <span
            className={s.fallback}
            ref={node => {
              if (!node) return;
              setRectRef(node);
              fallbackRef.current = node;
            }}
          >
            {children}
          </span>
        </span>
      ),
      [children, className, setRectRef]
    );

    return render;
  }
);
SplitText.displayName = 'SplitText';
