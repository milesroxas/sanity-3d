import { BlenderExportData } from '@/experience/baseModels/shared/types';
import {
  SmallBldgsInstances,
  SmallBldgsInstances_Blender,
  useSmallBldgsInstances,
} from '@/experience/models/SmallBldgsInstances';
import { useVehiclesInstances, VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { Environment, Instance, OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { Vector3Tuple } from 'three';

// Example JSON data - this is typically loaded from an external file
// but included here for demonstration purposes
const blenderExportData: BlenderExportData[] = [
  {
    name: 'building-restaurant-1',
    position: [10, 0, 10],
    rotation: [0, 0.7853, 0], // Math.PI/4
    scale: [1, 1, 1],
  },
  {
    name: 'building-restaurant-1.001',
    position: [-10, 0, 10],
    rotation: [0, -0.7853, 0], // -Math.PI/4
    scale: [0.9, 0.9, 0.9],
  },
  {
    name: 'building-restaurant-2',
    position: [20, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    name: 'building-corner-store',
    position: [0, 0, 20],
    rotation: [0, 1.5707, 0], // Math.PI/2
    scale: [1, 1, 1],
  },
  {
    name: 'build-shop-1',
    position: [0, 0, -20],
    rotation: [0, -1.5707, 0], // -Math.PI/2
    scale: [1, 1, 1],
  },
  {
    name: 'building-cannabis',
    position: [-20, 0, 0],
    rotation: [0, 3.1415, 0], // Math.PI
    scale: [1, 1, 1],
  },
];

/**
 * Component that demonstrates how to create programmatic instances
 * with the improved type system
 */
function ProgrammaticGrid() {
  // useSmallBldgsInstances() will return a type-safe object with all building components
  const { BurgerJoint } = useSmallBldgsInstances();

  // Create a grid of burger joints
  return (
    <BurgerJoint>
      {Array.from({ length: 3 }).map((_, i) =>
        Array.from({ length: 3 }).map((_, j) => (
          <Instance
            key={`burger-${i}-${j}`}
            position={[-40 + i * 10, 0, -40 + j * 10]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
            scale={0.8 + Math.random() * 0.2}
          />
        ))
      )}
    </BurgerJoint>
  );
}

/**
 * Component that demonstrates animated instances
 */
function AnimatedVehicles() {
  const { Car } = useVehiclesInstances();

  // Define a circular path
  const pathPoints = useMemo(() => {
    const points: [number, number, number][] = [];
    const radius = 20;
    const segments = 32;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }

    return points;
  }, []);

  return (
    <Car
      animation={{
        path: pathPoints,
        speed: 8,
        loop: true,
        onUpdate: (position: Vector3Tuple, rotation: Vector3Tuple) => {
          // Optional: Log position updates
          console.log('Car position:', position);
        },
      }}
    />
  );
}

/**
 * Main example that demonstrates all three approaches
 */
export default function BuildingBlenderExportExample() {
  const [showDemoSelector, setShowDemoSelector] = useState(true);
  const [activeDemo, setActiveDemo] = useState<'split' | 'unified' | 'programmatic' | 'animated'>(
    'split'
  );

  const styles = {
    container: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    controls: {
      position: 'absolute' as const,
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      zIndex: 1000,
    },
    button: {
      margin: 5,
      padding: '5px 10px',
      background: '#555',
      color: 'white',
      border: 'none',
      borderRadius: 3,
      cursor: 'pointer',
    },
    activeButton: {
      background: '#007bff',
    },
  };

  // Separate buildings based on material needs
  const regularBuildings = blenderExportData.filter(item => !item.name.includes('cannabis'));

  const specialBuildings = blenderExportData.filter(item => item.name.includes('cannabis'));

  return (
    <div style={styles.container}>
      {showDemoSelector && (
        <div style={styles.controls}>
          <h3>Material Handling Examples</h3>
          <div>
            <button
              style={{ ...styles.button, ...(activeDemo === 'split' ? styles.activeButton : {}) }}
              onClick={() => setActiveDemo('split')}
            >
              Split by Material
            </button>
            <button
              style={{ ...styles.button, ...(activeDemo === 'unified' ? styles.activeButton : {}) }}
              onClick={() => setActiveDemo('unified')}
            >
              Unified (No Shared Material)
            </button>
            <button
              style={{
                ...styles.button,
                ...(activeDemo === 'programmatic' ? styles.activeButton : {}),
              }}
              onClick={() => setActiveDemo('programmatic')}
            >
              Programmatic
            </button>
            <button
              style={{
                ...styles.button,
                ...(activeDemo === 'animated' ? styles.activeButton : {}),
              }}
              onClick={() => setActiveDemo('animated')}
            >
              Animated
            </button>
          </div>
          <button style={styles.button} onClick={() => setShowDemoSelector(false)}>
            Hide Controls
          </button>
        </div>
      )}

      <Canvas shadows>
        <Stats />
        <color attach="background" args={['#87CEEB']} />
        <PerspectiveCamera makeDefault position={[0, 40, 80]} />
        <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2} />

        {/* Add light */}
        <directionalLight
          position={[10, 20, 15]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
          shadow-camera-left={-50}
          shadow-camera-right={50}
        />
        <ambientLight intensity={0.5} />

        {/* Add ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
          <planeGeometry args={[500, 500]} />
          <meshStandardMaterial color="#228B22" roughness={1} />
        </mesh>

        {/* Demo 1: Split buildings by material needs */}
        {activeDemo === 'split' && (
          <>
            {/* Buildings that can use shared materials */}
            <SmallBldgsInstances useSharedMaterial={true}>
              <SmallBldgsInstances_Blender instancesData={regularBuildings} />
            </SmallBldgsInstances>

            {/* Buildings that need custom materials */}
            <SmallBldgsInstances useSharedMaterial={false}>
              <SmallBldgsInstances_Blender instancesData={specialBuildings} />
            </SmallBldgsInstances>
          </>
        )}

        {/* Demo 2: Unified approach (no shared material) */}
        {activeDemo === 'unified' && (
          <SmallBldgsInstances useSharedMaterial={false}>
            <SmallBldgsInstances_Blender instancesData={blenderExportData} />
          </SmallBldgsInstances>
        )}

        {/* Demo 3: Programmatic instancing */}
        {activeDemo === 'programmatic' && (
          <SmallBldgsInstances useSharedMaterial={true}>
            <ProgrammaticGrid />
          </SmallBldgsInstances>
        )}

        {/* Demo 4: Animated instances */}
        {activeDemo === 'animated' && (
          <VehiclesInstances useSharedMaterial={false}>
            <AnimatedVehicles />
          </VehiclesInstances>
        )}

        {/* Environment */}
        <Environment preset="sunset" background blur={0.8} />
      </Canvas>
    </div>
  );
}
