import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { usePatrolCarStore } from '@/experience/scenes/landing/store/patrolCarStore';
import { PATROL_CAR_PATH_POINTS } from '../lib/PatrolCar';

interface PatrolCarProps {
  pathOffset?: number;
}

export function PatrolCar({ pathOffset = 0 }: PatrolCarProps) {
  const vehicles = useVehiclesInstances();
  const PatrolCarComponent = vehicles['patrol-car'];
  const speedMultiplier = usePatrolCarStore(state => state.speedMultiplier);

  return (
    <PatrolCarComponent
      animation={{
        path: PATROL_CAR_PATH_POINTS,
        speed: 5.33 * speedMultiplier,
        loop: true,
        pathOffset,
      }}
    />
  );
}
