import { vehicles } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import vehiclesData from '@/experience/data/vehicles.json';
import {
  VehiclesInstances,
  VehiclesInstances_Blender,
} from '@/experience/models/VehiclesInstances';

export function Vehicles() {
  return (
    <VehiclesInstances>
      {/* Static vehicles from JSON data */}
      <VehiclesInstances_Blender instancesData={vehiclesData as BlenderExportData[]} />

      {/* Animated vehicles */}
      <vehicles.AnimatedCar pathOffset={0} />
      <vehicles.AnimatedCar pathOffset={0.66} />
      <vehicles.AnimatedPatrolOne pathOffset={0.33} />
    </VehiclesInstances>
  );
}
