import { vehicles } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import parkedCarsData from '@/experience/data/parked-cars.json';
import {
  VehiclesInstances,
  VehiclesInstances_Blender,
} from '@/experience/models/VehiclesInstances';

export function Vehicles() {
  return (
    <VehiclesInstances useSharedMaterial={false}>
      {/* Static vehicles from JSON data */}
      <VehiclesInstances_Blender instancesData={parkedCarsData as BlenderExportData[]} />

      {/* Animated vehicles */}
      <vehicles.AnimatedCar pathOffset={0} />
      <vehicles.AnimatedPlane pathOffset={0.3} scale={0.8} />
    </VehiclesInstances>
  );
}
