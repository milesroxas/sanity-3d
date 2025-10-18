import {
  TrafficEastBoundLeft,
  TrafficEastBoundRight,
} from '@/experience/scenes/landing/animations';
import { PatrolCar } from '@/experience/scenes/landing/animations/components/PatrolCar';
import { useRenderProfile } from '@/experience/scenes/mainScene/hooks/useDeviceProfile';

export function Vehicles() {
  const { includeAnimatedVehicles } = useRenderProfile();

  if (!includeAnimatedVehicles) return null;

  return (
    <>
      <TrafficEastBoundRight pathOffset={0} />
      <TrafficEastBoundLeft pathOffset={0} />
      <PatrolCar pathOffset={0} />
    </>
  );
}
