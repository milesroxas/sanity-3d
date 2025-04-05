import { folder, useControls } from "leva";

export interface CarControls {
  x: number;
  y: number;
  z: number;
  showPath: boolean;
  visible: boolean;
}

export function useCarControls() {
  return useControls(
    "Car One",
    {
      position: folder(
        {
          x: { value: -70.3, min: -100, max: 100, step: 0.1 },
          y: { value: 2.5, min: -100, max: 100, step: 0.1 },
          z: { value: 79.6, min: -100, max: 100, step: 0.1 },
          showPath: { value: false, label: "Show Path" },
          visible: { value: true, label: "Show Car" },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  ) as CarControls;
} 