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
import {
  useCameraStore,
  INITIAL_POSITIONS,
} from "@/experience/scenes/store/cameraStore";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Vector3 } from "three";

interface Carousel3Props {
  scene: Sanity.Scene;
  selectedPoi: PointOfInterest | null;
  onClose: () => void;
}

export function Carousel3({ scene, selectedPoi, onClose }: Carousel3Props) {
  const [api, setApi] = React.useState<any>();
  const currentPoiIndex = useCameraStore((state) => state.currentPoiIndex);
  const { navigateToNextPoi, navigateToPreviousPoi } = useCameraStore();

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

  const handleClose = async () => {
    const isAnimating = useCameraStore.getState().isAnimating;
    if (isAnimating) return;

    // 1. Start exit animation of carousel
    onClose();

    // 2. Wait for carousel exit animation to complete
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 3. Start camera transition back to initial position
    const initialPosition = INITIAL_POSITIONS.subscene;
    useCameraStore
      .getState()
      .startCameraTransition(
        useCameraStore.getState().position,
        new Vector3(
          initialPosition.position.x,
          initialPosition.position.y,
          initialPosition.position.z
        ),
        useCameraStore.getState().target,
        new Vector3(
          initialPosition.target.x,
          initialPosition.target.y,
          initialPosition.target.z
        )
      );

    // 4. After camera transition completes, reset camera and POI state
    setTimeout(() => {
      useCameraStore.getState().resetToInitial();
      useCameraStore.getState().setSelectedPoi(null);
    }, 2000);
  };

  if (!selectedPoi) return null;

  return (
    <motion.div
      key="carousel"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.8,
        ease: [0.21, 0.45, 0.27, 0.9],
      }}
      className="ml-auto w-full max-w-[350px] mr-0 relative"
    >
      <Button
        className="absolute -top-[21px] left-[-21px] z-50"
        variant="icon"
        size="icon"
        onClick={handleClose}
      >
        <X className="w-6 h-6 text-white" />
      </Button>
      <Carousel
        className="z-10"
        opts={{
          align: "start",
          startIndex: currentPoiIndex,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {validPointsOfInterest.map((poi) => (
            <CarouselItem key={poi._key} className="basis-full">
              <Card className="overflow-hidden bg-card/80 h-[50vh]">
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
        <div className="absolute bottom-[1rem] w-full">
          <div className="flex justify-center gap-6">
            <CarouselPrevious className="static transform-none" />
            <CarouselNext className="static transform-none" />
          </div>
        </div>
      </Carousel>
    </motion.div>
  );
}
