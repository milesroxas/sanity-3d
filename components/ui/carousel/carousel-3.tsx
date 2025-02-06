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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

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

    api.scrollTo(currentPoiIndex);

    // Add select event listener
    api.on("select", () => {
      const selectedIndex = api.selectedScrollSnap();
      handleCarouselChange(selectedIndex);
    });

    return () => {
      api.off("select", () => {});
    };
  }, [api, currentPoiIndex, handleCarouselChange]);

  if (!selectedPoi) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.21, 0.45, 0.27, 0.9],
        delay: 1.75,
      }}
      className="ml-auto w-full max-w-[350px] mr-0 relative"
    >
      <Button
        className="absolute -top-[21px] left-[-21px] z-50"
        variant="icon"
        size="icon"
        onClick={() => {
          useCameraStore.getState().resetToInitial();
          useCameraStore.getState().setSelectedPoi(null);
        }}
      >
        <X className="w-6 h-6" />
      </Button>
      <Carousel
        className="z-10"
        opts={{
          align: "start",
          startIndex: currentPoiIndex,
        }}
        setApi={setApi}
      >
        <CarouselContent className="h-[300px]">
          {validPointsOfInterest.map((poi) => (
            <CarouselItem key={poi._key} className="basis-full">
              <Card className="overflow-hidden bg-card/80">
                <CardContent className="flex flex-col gap-4 p-4">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">{poi.title}</h3>
                    {poi.body && <PortableTextRenderer value={poi.body} />}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static transform-none" />
          <CarouselNext className="static transform-none" />
        </div>
      </Carousel>
    </motion.div>
  );
}
