import { PatrolCar } from './PatrolCar';
import { Instances, Instance, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function ParkedPatrolCars() {
  const { nodes, materials } = useGLTF('/models/patrol-car.glb');

  return (
    <group>
      <PatrolCar position={[-33.461273, 2.69049, 52.514156]} rotation={[0.0, 0.0, -0.0]} />
      <PatrolCar position={[2.291103, 2.69049, 48.959854]} rotation={[0.0, 0.0, -0.0]} />
      <PatrolCar position={[17.601034, 2.69049, 25.854675]} rotation={[0.0, 1.570796, 0.0]} />
    </group>
  );
}

useGLTF.preload('/models/patrol-car.glb');
