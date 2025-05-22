import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PricingCardProps {
  color: 'primary' | 'secondary' | 'card' | 'accent' | 'destructive' | 'background' | 'transparent';
  title: string;
  tagLine: string;
  excerpt: string;
  price: {
    value: number;
    period: string;
  };
  list: string[];
  image: Sanity.Image;
  link: {
    title: string;
    href: string;
    target?: boolean;
    buttonVariant:
      | 'default'
      | 'secondary'
      | 'link'
      | 'destructive'
      | 'outline'
      | 'ghost'
      | null
      | undefined;
  };
}

export default function PricingCard({
  color,
  title,
  tagLine,
  excerpt,
  price,
  list,
  link,
}: PricingCardProps) {
  const hasLink = Boolean(link?.href);
  const containerProps = hasLink
    ? { href: link!.href, target: link!.target ? '_blank' : undefined }
    : {};

  // Styles for the outer wrapper
  const outerClasses = cn(
    'group flex w-full rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    !hasLink && 'cursor-default opacity-90'
  );
  return (
    <div
      key={title}
      className="group flex w-full rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex w-full flex-col justify-between rounded-md border p-8">
        <div className={cn(color === 'primary' ? 'text-background' : undefined)}>
          {title && (
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold leading-[1.2]">{title}</h3>
              {tagLine && <Badge>{tagLine}</Badge>}
            </div>
          )}
          {price && price.value && (
            <div className="my-8 flex items-end gap-1">
              <div className="text-3xl font-bold leading-none">${price.value}</div>
              {price.period && <div className="text-sm">{price.period}</div>}
            </div>
          )}
          {list && list.length > 0 && (
            <ul className="my-8 flex flex-col gap-2">
              {list.map(item => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {excerpt && <p>{excerpt}</p>}
        </div>
        {hasLink && (
          <Button className={'mt-6'} size={'lg'} variant={'default'} asChild>
            <div>{link!.title}</div>
          </Button>
        )}
      </div>
    </div>
  );
}
