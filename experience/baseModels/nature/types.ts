import { ReactElement } from "react";
import { ThreeElements } from "@react-three/fiber";

export interface NatureInstances {
  RockLarge: (props?: ThreeElements["mesh"]) => ReactElement;
  CactusBig: (props?: ThreeElements["mesh"]) => ReactElement;
  CactusBigGreen: (props?: ThreeElements["mesh"]) => ReactElement;
  CactusBasic: (props?: ThreeElements["mesh"]) => ReactElement;
  RockTerrasse1: (props?: ThreeElements["mesh"]) => ReactElement;
  RockTerrasse2: (props?: ThreeElements["mesh"]) => ReactElement;
  RockTerrasse3: (props?: ThreeElements["mesh"]) => ReactElement;
  StoneBigTall: (props?: ThreeElements["mesh"]) => ReactElement;
  StoneFlat: (props?: ThreeElements["mesh"]) => ReactElement;
  RocksSmall: (props?: ThreeElements["mesh"]) => ReactElement;
  CactusMedium1: (props?: ThreeElements["mesh"]) => ReactElement;
  CactusMedium2: (props?: ThreeElements["mesh"]) => ReactElement;
}
