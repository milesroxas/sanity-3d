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
import { PointOfInterest } from "@/experience/scenes/subScene/components/SubSceneMarkers";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";

interface Carousel3Props {
  scene: Sanity.Scene;
  selectedPoi: PointOfInterest | null;
}

export function Carousel3({ scene, selectedPoi }: Carousel3Props) {
  const [api, setApi] = React.useState<any>();
  const currentPoiIndex = useCameraStore((state) => state.currentPoiIndex);
  const { navigateToNextPoi, navigateToPreviousPoi } = useCameraStore();

  // Filter the points that have a markerPosition (only valid markers)
  const validPointsOfInterest = React.useMemo(
    () =>
      (scene.pointsOfInterest ?? []).filter(
        (poi): poi is PointOfInterest =>
          (poi as PointOfInterest).markerPosition !== undefined
      ),
    [scene.pointsOfInterest]
  );

  const handleCarouselChange = React.useCallback(
    (selectedIndex: number) => {
      const currentIndex = useCameraStore.getState().currentPoiIndex;
      console.log("Carousel change:", { selectedIndex, currentIndex });

      if (selectedIndex > currentIndex) {
        console.log("Navigating to next POI");
        navigateToNextPoi(validPointsOfInterest);
      } else if (selectedIndex < currentIndex) {
        console.log("Navigating to previous POI");
        navigateToPreviousPoi(validPointsOfInterest);
      }
    },
    [navigateToNextPoi, navigateToPreviousPoi, validPointsOfInterest]
  );

  // When the carousel api is ready, sync with current index and set up event listeners
  React.useEffect(() => {
    if (!api) return;

    console.log("Setting up carousel event listeners");
    api.scrollTo(currentPoiIndex);

    // Add select event listener
    api.on("select", () => {
      console.log("Carousel select event fired");
      const selectedIndex = api.selectedScrollSnap();
      console.log("Selected index from event:", selectedIndex);
      handleCarouselChange(selectedIndex);
    });

    return () => {
      api.off("select", () => {});
    };
  }, [api, currentPoiIndex, handleCarouselChange]);

  if (!selectedPoi) return null;

  return (
    <Carousel
      className="max-w-md"
      opts={{
        align: "start",
        startIndex: currentPoiIndex,
      }}
      setApi={setApi}
    >
      <CarouselContent className="-ml-0">
        {validPointsOfInterest.map((poi) => (
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
