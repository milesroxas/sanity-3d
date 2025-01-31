import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { PortableTextBlock } from "next-sanity";

type Poi = {
  _key: string;
  title: string;
  body?: PortableTextBlock[];
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
  cameraTarget?: {
    x: number;
    y: number;
    z: number;
  };
};

interface Carousel3Props {
  pointsOfInterest?: Poi[];
}

export function Carousel3({ pointsOfInterest }: Carousel3Props) {
  if (!pointsOfInterest?.length) return null;

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-0">
        {pointsOfInterest.map((poi) => (
          <CarouselItem key={poi._key} className="pl-0">
            <div className="p-0">
              <Card className="overflow-hidden">
                <CardContent className="flex flex-col gap-4 p-4">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">{poi.title}</h3>
                    {poi.body && <PortableTextRenderer value={poi.body} />}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 top-1/2" />
      <CarouselNext className="-right-4 top-1/2" />
    </Carousel>
  );
}
