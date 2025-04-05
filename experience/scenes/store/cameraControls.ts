import { useControls, folder } from 'leva';
import { INITIAL_POSITIONS } from './cameraStore';

export function useMainCameraControls() {
  return useControls(
    'Main Camera',
    {
      'Main Scene': folder(
        {
          position: folder({
            positionX: {
              value: INITIAL_POSITIONS.main.position.x,
              min: -400,
              max: 400,
              step: 0.1,
              label: 'Position X',
            },
            positionY: {
              value: INITIAL_POSITIONS.main.position.y,
              min: -400,
              max: 400,
              step: 0.1,
              label: 'Position Y',
            },
            positionZ: {
              value: INITIAL_POSITIONS.main.position.z,
              min: -400,
              max: 400,
              step: 0.1,
              label: 'Position Z',
            },
          }),
          target: folder({
            targetX: {
              value: INITIAL_POSITIONS.main.target.x,
              min: -400,
              max: 400,
              step: 0.1,
              label: 'Target X',
            },
            targetY: {
              value: INITIAL_POSITIONS.main.target.y,
              min: -400,
              max: 400,
              step: 0.1,
              label: 'Target Y',
            },
            targetZ: {
              value: INITIAL_POSITIONS.main.target.z,
              min: -400,
              max: 400,
              step: 0.1,
              label: 'Target Z',
            },
          }),
          constraints: folder({
            minDistance: {
              value: 10,
              min: 1,
              max: 100,
              step: 0.1,
              label: 'Min Distance',
            },
            maxDistance: {
              value: 250,
              min: 50,
              max: 500,
              step: 1,
              label: 'Max Distance',
            },
            minPolarAngle: {
              value: 0,
              min: 0,
              max: Math.PI,
              step: 0.1,
              label: 'Min Polar Angle',
            },
            maxPolarAngle: {
              value: Math.PI / 2,
              min: 0,
              max: Math.PI,
              step: 0.1,
              label: 'Max Polar Angle',
            },
            minAzimuthAngle: {
              value: -Math.PI / 4,
              min: -Math.PI,
              max: Math.PI,
              step: 0.1,
              label: 'Min Azimuth Angle',
            },
            maxAzimuthAngle: {
              value: Math.PI / 4,
              min: -Math.PI,
              max: Math.PI,
              step: 0.1,
              label: 'Max Azimuth Angle',
            },
          }),
          animation: folder({
            duration: {
              value: 3000,
              min: 1000,
              max: 5000,
              step: 100,
              label: 'Transition Duration',
            },
            dampingFactor: {
              value: 0.08,
              min: 0.01,
              max: 0.2,
              step: 0.01,
              label: 'Damping Factor',
            },
            rotateSpeed: {
              value: 0.5,
              min: 0.1,
              max: 2,
              step: 0.1,
              label: 'Rotate Speed',
            },
          }),
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );
}
