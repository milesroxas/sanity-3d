import { ReactElement } from "react";
import { ThreeElements } from "@react-three/fiber";

export interface CarInstances {
  Car: (props?: ThreeElements["group"]) => ReactElement;
}
