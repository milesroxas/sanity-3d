import { Html } from "@react-three/drei";
import { Marker } from "../../sceneCollections/markers/Marker";
import { MarkerPosition, toPosition } from "../../types/types";
import { useState } from "react";

type PoiMarkerProps = {
  position: MarkerPosition;
  title: string;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  size?: "sm" | "lg";
};

export function PoiMarker({
  position,
  title,
  onClick,
  onHoverStart,
  onHoverEnd,
  size = "lg",
}: PoiMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
    onHoverStart();
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    onHoverEnd();
  };

  return (
    <group position={toPosition(position)}>
      <Html center transform>
        <div
          className="bg-primary backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer"
          onClick={onClick}
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
        >
          <h3
            className={
              size === "lg" ? "text-6xl font-bold" : "text-md font-bold"
            }
          >
            {title}
          </h3>
        </div>
      </Html>
      <group
        position={[0, -3, 0]}
        onClick={onClick}
        onPointerEnter={handleHoverStart}
        onPointerLeave={handleHoverEnd}
      >
        <Marker isHovered={isHovered} />
      </group>
    </group>
  );
}
