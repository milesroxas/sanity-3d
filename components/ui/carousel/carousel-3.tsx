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
    <Carousel className="">
      <CarouselContent>
        {pointsOfInterest.map((poi) => (
          <CarouselItem key={poi._key}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{poi.title}</h3>
                    {poi.body && <PortableTextRenderer value={poi.body} />}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
