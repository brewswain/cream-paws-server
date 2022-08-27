import {
   Publisher,
   CustomerUpdatedEvent,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class CustomerUpdatedPublisher extends Publisher<CustomerUpdatedEvent> {
   subject: SubjectsEnum.CustomerUpdated = SubjectsEnum.CustomerUpdated;
}
