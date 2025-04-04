import {
  EventInstances,
  EventInstancesFromBlenderExport,
} from '../baseModels/event/EventInstances';
import eventsInstancesData from '../baseModels/event/eventsInstances.json';
import { BlenderExportData } from '../baseModels/shared/types';

export default function EventScene() {
  return (
    <EventInstances>
      <EventInstancesFromBlenderExport instancesData={eventsInstancesData as BlenderExportData[]} />
    </EventInstances>
  );
}
