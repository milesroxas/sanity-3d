import { Car, Instances, type CarPosition } from "../../components/vehicles/CarComponents";

// You can customize these positions for your events area
const EVENTS_CAR_POSITIONS: CarPosition[] = [
  { position: [2.612076, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'red' },
  { position: [-2.997391, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'blue' },
  { position: [-5.920624, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'green' },
  { position: [-8.685852, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'white' },
  { position: [-21.879948, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'red' },
  { position: [-24.674026, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'white' },
  { position: [-27.595123, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'black' },
  { position: [-33.088028, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'red' },
  { position: [-21.970444, 2.648799, -40.337269], rotation: [0.0, 0.0, 0.0], color: 'white' },
  { position: [-27.468109, 2.648799, -40.337269], rotation: [0.0, 0.0, 0.0], color: 'black' },
  { position: [-30.293945, 2.648799, -40.337269], rotation: [0.0, 0.0, 0.0], color: 'red' },
  { position: [-33.119781, 2.648799, -40.337269], rotation: [0.0, 0.0, 0.0], color: 'blue' },
  { position: [-38.612686, 2.648799, -40.337269], rotation: [0.0, 0.0, 0.0], color: 'green' },
  { position: [-8.685852, 2.648799, -34.653851], rotation: [0.0, 0.0, 0.0], color: 'white' },
  { position: [5.219284, 2.648799, -49.665089], rotation: [0.0, 0.0, 0.0], color: 'black' },
  
];

function EventsParkedCars() {
  return (
    <Instances>
      {EVENTS_CAR_POSITIONS.map((props, i) => (
        <Car key={i} {...props} />
      ))}
    </Instances>
  );
}

export default EventsParkedCars; 