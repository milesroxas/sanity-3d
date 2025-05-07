import { cn } from '@/lib/utils';

export const DEFAULT_PADDING = {
  top: true,
  bottom: true,
};

export interface ISectionPadding {
  top: boolean;
  bottom: boolean;
}

export interface ISectionContainer {
  color?:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  theme?: 'light' | 'dark' | 'accent';
  style?: 'default' | 'offset';
  children: React.ReactNode;
  className?: string;
  padding?: ISectionPadding | null | undefined;
  ref?: React.RefObject<HTMLDivElement>;
}

export default function SectionContainer({
  color = 'background',
  theme,
  style,
  padding,
  children,
  className,
  ref,
}: ISectionContainer) {
  return (
    <div
      className={cn(
        color !== 'transparent' && `bg-${color}`,
        theme === 'light'
          ? 'bg-background text-foreground'
          : theme === 'dark'
            ? 'bg-slate-950 text-white'
            : theme === 'accent'
              ? 'bg-primary text-primary-foreground'
              : undefined,
        padding?.top ? 'pt-16 xl:pt-32' : undefined,
        padding?.bottom ? 'pb-16 xl:pb-32' : undefined,
        className
      )}
    >
      <div className="container">{children}</div>
    </div>
  );
}
