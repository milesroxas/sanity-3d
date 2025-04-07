import { vehicles } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import festivalVehiclesData from '@/experience/data/festival-vehicles.json';
import parkedCarsData from '@/experience/data/parked-cars.json';
import {
  VehiclesInstances,
  VehiclesInstances_Blender,
} from '@/experience/models/VehiclesInstances';

export function Vehicles() {
  return (
    <VehiclesInstances>
      {/* Static vehicles from JSON data */}
      <VehiclesInstances_Blender instancesData={festivalVehiclesData as BlenderExportData[]} />
      <VehiclesInstances_Blender instancesData={parkedCarsData as BlenderExportData[]} />

      {/* Animated vehicles */}
      <vehicles.AnimatedCar pathOffset={0} />
      <vehicles.AnimatedCar pathOffset={0.66} />
      <vehicles.AnimatedPatrolOne pathOffset={0.33} />
      <vehicles.AnimatedPlane pathOffset={0.3} />
    </VehiclesInstances>
  );
}
