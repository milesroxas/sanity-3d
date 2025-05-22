import PortableTextRenderer from '@/components/portable-text-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import SectionContainer from '@/components/ui/section-container';
import { StarRating } from '@/components/ui/star-rating';
import { urlFor } from '@/sanity/lib/image';
import { stegaClean } from 'next-sanity';

interface Carousel2Props {
  padding: {
    padding: 'large';
    direction: 'both';
  };
  colorVariant:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  testimonial: {
    _id: string;
    name: string;
    title: string;
    image: Sanity.Image;
    body: any;
    rating: number;
  }[];
}

export default function Carousel2({ padding, colorVariant, testimonial }: Partial<Carousel2Props>) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      {testimonial && testimonial.length > 0 && (
        <Carousel>
          <CarouselContent>
            {testimonial.map(item => (
              <CarouselItem key={item._id} className="pl-2 md:basis-1/3 md:pl-4">
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col justify-between p-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Avatar className="mr-3 h-10 w-10">
                          {item.image && (
                            <AvatarImage src={urlFor(item.image.asset).url()} alt={item.name} />
                          )}
                          <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.title}</p>
                        </div>
                      </div>
                      <StarRating rating={item.rating} />
                      {item.body && (
                        <div className="mt-2 line-clamp-4 text-sm">
                          <PortableTextRenderer value={item.body} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant="secondary" className="-left-3 md:-left-8 xl:-left-12" />
          <CarouselNext variant="secondary" className="-right-3 md:-right-8 xl:-right-12" />
          <div className="flex w-full justify-center">
            <CarouselDots />
          </div>
        </Carousel>
      )}
    </SectionContainer>
  );
}
