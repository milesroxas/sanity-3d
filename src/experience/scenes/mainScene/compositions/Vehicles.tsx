import { vehicles } from '@/experience/animations';
import { BlenderExportData } from '@/experience/baseModels/shared/types';
import parkedCarsData from '@/experience/data/parked-cars-2.json';
import { useRenderProfile } from '@/experience/scenes/mainScene/hooks/useDeviceProfile';

import {
  VehiclesInstances,
  VehiclesInstances_Blender,
} from '@/experience/models/VehiclesInstances';

export function Vehicles() {
  const { includeAnimatedVehicles } = useRenderProfile();
  return (
    <>
      {/* Static vehicles with shadows */}
      <VehiclesInstances
        useSharedMaterial={true}
        category="vehicles"
        castShadow={true}
        receiveShadow={true}
      >
        <VehiclesInstances_Blender instancesData={parkedCarsData as BlenderExportData[]} />
      </VehiclesInstances>

      {/* Animated vehicles without shadows for performance */}
      {includeAnimatedVehicles && (
        <VehiclesInstances
          useSharedMaterial={true}
          category="vehicles"
          castShadow={false}
          receiveShadow={false}
        >
          <vehicles.AnimatedCar pathOffset={0} />
          <vehicles.AnimatedPlane pathOffset={0.3} scale={0.8} />
        </VehiclesInstances>
      )}
    </>
  );
}
