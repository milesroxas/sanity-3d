import { vehicles } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import parkedCarsData from '@/experience/data/parked-cars.json';
import { useRenderProfile } from '@/experience/scenes/mainScene/hooks/useDeviceProfile';

import {
  VehiclesInstances,
  VehiclesInstances_Blender,
} from '@/experience/models/VehiclesInstances';

export function Vehicles() {
  const { includeAnimatedVehicles } = useRenderProfile();
  return (
    <VehiclesInstances useSharedMaterial={false}>
      {/* Static vehicles from JSON data */}
      <VehiclesInstances_Blender instancesData={parkedCarsData as BlenderExportData[]} />

      {/* Animated vehicles */}
      {includeAnimatedVehicles && (
        <>
          <vehicles.AnimatedCar pathOffset={0} />
          <vehicles.AnimatedPlane pathOffset={0.3} scale={0.8} />
        </>
      )}
    </VehiclesInstances>
  );
}
