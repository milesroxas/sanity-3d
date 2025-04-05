import { Car, Instances, type CarPosition } from "../../components/vehicles/CarComponents";

const SHOPS_CAR_POSITIONS: CarPosition[] = [
  { position: [64.85141, 2.687342, 23.099749], rotation: [0.0, 1.570796, 0.0], color: 'red' },
  { position: [55.614433, 2.687342, 20.36821], rotation: [0.0, 1.570796, 0.0], color: 'blue' },
  { position: [55.614433, 2.687342, 14.881134], rotation: [0.0, 1.570796, 0.0], color: 'green' },
  { position: [55.614433, 2.687342, 11.823608], rotation: [0.0, 1.570796, 0.0], color: 'white' },
  { position: [55.614433, 2.687342, 6.425247], rotation: [0.0, 1.570796, 0.0], color: 'black' },
  { position: [64.85141, 2.687342, 17.612673], rotation: [0.0, 1.570796, 0.0], color: 'beige' },
  { position: [64.85141, 2.687342, 14.555147], rotation: [0.0, 4.712389, 0.0], color: 'red' },
  { position: [64.85141, 2.687342, 9.156786], rotation: [0.0, 1.570796, 0.0], color: 'blue' }
];

function ShopsParkedCars() {
  return (
    <Instances>
      {SHOPS_CAR_POSITIONS.map((props, i) => (
        <Car key={i} {...props} />
      ))}
    </Instances>
  );
}

export default ShopsParkedCars;
