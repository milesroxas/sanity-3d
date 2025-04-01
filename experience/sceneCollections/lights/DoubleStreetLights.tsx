import React from 'react';
import { DoubleStreetLight } from '../../baseModels/objects/StreetLights';

type DoubleStreetLightInstance = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

type DoubleStreetLightsProps = {
  instances?: DoubleStreetLightInstance[];
};

const defaultInstances: DoubleStreetLightInstance[] = [
  // Outter Section Column
  {
    position: [5.913621, 2.66666, 124.929024],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [5.913621, 2.66666, 112.610374],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [5.913621, 2.66666, 98.943977],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  // Front Street
  {
    position: [-10.725014, 2.66666, 75.170929],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-38.183609, 2.66666, 75.170929],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },

  // Shops Parking lot
  {
    position: [67.586693, 2.66666, 21.685555],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [67.586693, 2.66666, 10.496887],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [52.446037, 2.66666, 21.685555],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [52.446037, 2.66666, 10.496887],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },

  // Corporate Parking lot 1
  {
    position: [6.685577, 2.66666, -37.446083],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [6.685577, 2.66666, -52.586739],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-4.50309, 2.66666, -37.446083],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-4.50309, 2.66666, -52.586739],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },

  // Corporate Parking lot 2
  {
    position: [-23.31443, 2.66666, -37.446083],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-23.31443, 2.66666, -52.586739],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-34.503098, 2.66666, -37.446083],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-34.503098, 2.66666, -52.586739],
    rotation: [0.0, 1.570796, -0.0],
    scale: [1, 1, 1],
  },

  // Resort Parking lot
  {
    position: [-82.352112, 2.66666, -8.147957],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-82.352112, 2.66666, -19.336632],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-97.492752, 2.66666, -8.147957],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },
  {
    position: [-97.492752, 2.66666, -19.336632],
    rotation: [0.0, 0.0, -0.0],
    scale: [1, 1, 1],
  },
];

export function DoubleStreetLights({ instances = defaultInstances }: DoubleStreetLightsProps) {
  return (
    <>
      {instances.map((instance, index) => (
        <DoubleStreetLight
          key={index}
          position={instance.position}
          rotation={instance.rotation}
          scale={instance.scale}
        />
      ))}
    </>
  );
}
